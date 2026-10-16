from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.addresses.models import Address
from app.addresses.repository import AddressRepository
from app.addresses.schemas import AddressCreate
from app.auth.constants import UserRole, UserStatus
from app.cart.models import Cart, CartStatus
from app.cart.repository import CartItemRepository
from app.cart.service import CartService
from app.catalogue.constants import CatalogueStatus
from app.catalogue.models import Category
from app.catalogue.pricing import effective_price, is_on_sale
from app.catalogue.repository import CategoryRepository
from app.catalogue.serializers import sellable_quantity
from app.catalogue.service import InventoryService
from app.cod.schemas import CodAvailability
from app.cod.service import CodService
from app.core.error_codes import CartErrorCode, InventoryErrorCode, OrderErrorCode, UserErrorCode
from app.core.exceptions import (
    ConflictError,
    NotFoundError,
    PermissionDeniedError,
    ValidationError,
)
from app.core.money import ZERO, money
from app.core.pagination import PageParams
from app.coupons.service import CouponLine, CouponResult, CouponService
from app.orders.constants import (
    ALLOWED_TRANSITIONS,
    NEEDS_ADVANCE_PAID,
    ORDER_NUMBER_PREFIX,
    OrderStatus,
    PaymentMethod,
    PaymentStatus,
    TrackingSource,
)
from app.orders.models import ORDER_NUMBER_SEQUENCE, Order, OrderItem, OrderTrackingEvent
from app.orders.repository import OrderRepository
from app.orders.schemas import (
    CheckoutItem,
    CheckoutPreview,
    DeliveryEstimate,
    GstBreakdown,
    GuestContact,
)
from app.payments.constants import PaymentProvider, PaymentPurpose
from app.payments.constants import PaymentStatus as CashStatus
from app.payments.models import Payment
from app.payments.repository import PaymentRepository
from app.pricing.gst import (
    STATE_CODES,
    TaxableLine,
    TaxResult,
    compute_tax,
    state_code_for,
    supply_type,
)
from app.pricing.service import (
    DeliveryQuote,
    DeliveryService,
    GstService,
    ShippingService,
    TaxService,
)
from app.users.models import User
from app.users.repository import UserRepository

ORDER_NOT_FOUND = "Order not found"
ADDRESS_NOT_FOUND = "Address not found"
CART_EMPTY = "Your cart is empty"

CUSTOMER_CANCELLABLE_STATUSES = frozenset({OrderStatus.PENDING, OrderStatus.CONFIRMED})

def _require_may_order(customer: User | None) -> None:
    """A customer the store has blocked cannot place new orders, as account or guest."""
    if customer is not None and customer.order_blocked_at is not None:
        raise PermissionDeniedError(
            "This account cannot place orders. Please contact the store.",
            error_code=UserErrorCode.CUSTOMER_BLOCKED,
        )


# A parcel that is (about to be) on its way can get a shipping label.
LABEL_STATUSES = frozenset(
    {
        OrderStatus.CONFIRMED,
        OrderStatus.PROCESSING,
        OrderStatus.PACKED,
        OrderStatus.SHIPPED,
        OrderStatus.OUT_FOR_DELIVERY,
    }
)

# The parcel has not left yet, so the address can still be corrected.
ADDRESS_EDITABLE_STATUSES = frozenset(
    {OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.PACKED}
)

INDIA = {"india", "in", "ind"}

STATUS_DESCRIPTIONS = {
    OrderStatus.PENDING: "Order placed",
    OrderStatus.CONFIRMED: "Order confirmed",
    OrderStatus.PROCESSING: "Order is being prepared",
    OrderStatus.PACKED: "Order packed",
    OrderStatus.SHIPPED: "Order shipped",
    OrderStatus.OUT_FOR_DELIVERY: "Out for delivery",
    OrderStatus.DELIVERED: "Delivered",
    OrderStatus.CANCELLED: "Order cancelled",
    OrderStatus.RETURNED: "Returned to the seller undelivered",
}


@dataclass
class Destination:
    """Where an order goes -- from a saved address or typed in at guest checkout."""

    full_name: str
    phone: str
    address_line_1: str
    address_line_2: str | None
    city: str
    state: str
    postal_code: str
    country: str

    @classmethod
    def of(cls, address: Address | AddressCreate) -> Destination:
        return cls(
            full_name=address.full_name,
            phone=address.phone,
            address_line_1=address.address_line_1,
            address_line_2=address.address_line_2,
            city=address.city,
            state=address.state,
            postal_code=address.postal_code,
            country=address.country,
        )

    @property
    def indian_pincode(self) -> str | None:
        return self.postal_code if self.country.strip().lower() in INDIA else None


@dataclass
class PricedLine:
    item: CheckoutItem
    category_id: UUID


@dataclass
class Quote:
    preview: CheckoutPreview
    lines: list[PricedLine]
    coupon: CouponResult | None
    tax: TaxResult
    delivery: DeliveryQuote | None
    cod: CodAvailability | None
    seller_gstin: str | None
    place_of_supply: str | None


class CheckoutService:
    """Turning a cart into an order: preview prices it, place writes it.

    `customer_id` is the buyer. For a guest preview it may be None; guest
    orders resolve (or create) the customer by phone before placing.
    """

    def __init__(
        self, session: AsyncSession, tenant_id: UUID, customer_id: UUID | None
    ) -> None:
        self.session = session
        self.tenant_id = tenant_id
        self.customer_id = customer_id

        self.cart_items = CartItemRepository(session, tenant_id)
        self.addresses = AddressRepository(session, tenant_id)
        self.orders = OrderRepository(session, tenant_id)
        self.categories = CategoryRepository(session, tenant_id)
        self.inventory = InventoryService(session, tenant_id)
        self.payments = PaymentRepository(session, tenant_id)
        self.shipping = ShippingService(session, tenant_id)
        self.delivery = DeliveryService(session, tenant_id)
        self.tax = TaxService(session, tenant_id)
        self.gst = GstService(session, tenant_id)
        self.coupons = CouponService(session, tenant_id)
        self.cod = CodService(session, tenant_id)

    # ---------------------------------------------------------- customer flow

    async def preview(
        self,
        address_id: UUID | None = None,
        coupon_code: str | None = None,
        payment_method: PaymentMethod = PaymentMethod.CASH_ON_DELIVERY,
    ) -> CheckoutPreview:
        """Price the cart without touching stock or creating anything."""
        destination = None
        if address_id is not None:
            destination = Destination.of(await self._require_address(address_id))

        cart = await self._require_cart(CartService(self.session, self.tenant_id, self.customer_id))
        quote = await self._quote(
            cart,
            destination=destination,
            coupon_code=coupon_code,
            payment_method=payment_method,
            phones=await self._phones(destination),
            for_update=False,
        )
        return quote.preview

    async def place_order(
        self,
        address_id: UUID,
        coupon_code: str | None = None,
        *,
        idempotency_key: str | None = None,
        payment_method: PaymentMethod = PaymentMethod.CASH_ON_DELIVERY,
    ) -> Order:
        """Create the order, its payments and its stock reservations in one transaction."""
        if idempotency_key:
            replayed = await self._replayed_order(idempotency_key, payment_method)
            if replayed is not None:
                return replayed

        cart = await self._require_cart(CartService(self.session, self.tenant_id, self.customer_id))
        destination = Destination.of(await self._require_address(address_id))
        customer = await UserRepository(self.session).get_by_id(
            tenant_id=self.tenant_id, user_id=self.customer_id
        )
        _require_may_order(customer)
        return await self._place(
            cart,
            destination,
            coupon_code=coupon_code,
            payment_method=payment_method,
            idempotency_key=idempotency_key,
            contact_email=customer.email if customer else None,
            is_guest=False,
        )

    # ------------------------------------------------------------- guest flow

    async def preview_guest(
        self,
        cart: Cart,
        *,
        address: AddressCreate | None,
        pincode: str | None,
        phone: str | None,
        coupon_code: str | None,
        payment_method: PaymentMethod,
    ) -> CheckoutPreview:
        destination = Destination.of(address) if address else None
        phones = [p for p in {phone, destination.phone if destination else None} if p]
        quote = await self._quote(
            cart,
            destination=destination,
            pincode=pincode,
            coupon_code=coupon_code,
            payment_method=payment_method,
            phones=phones,
            for_update=False,
        )
        return quote.preview

    async def place_guest_order(
        self,
        guest_token: str,
        contact: GuestContact,
        address: AddressCreate,
        *,
        coupon_code: str | None,
        payment_method: PaymentMethod,
        idempotency_key: str | None,
    ) -> Order:
        if payment_method is not PaymentMethod.CASH_ON_DELIVERY:
            raise ValidationError(
                "Online payment is not available for guest checkout",
                error_code=OrderErrorCode.GUEST_ONLINE_PAYMENT_UNAVAILABLE,
            )

        customer = await self._guest_customer(contact)
        self.customer_id = customer.id

        if idempotency_key:
            replayed = await self._replayed_order(idempotency_key, payment_method)
            if replayed is not None:
                return replayed

        carts = CartService(self.session, self.tenant_id, guest_token=guest_token)
        cart = await carts.active_cart()
        return await self._place(
            cart,
            Destination.of(address),
            coupon_code=coupon_code,
            payment_method=payment_method,
            idempotency_key=idempotency_key,
            contact_email=str(contact.email).lower() if contact.email else customer.email,
            is_guest=True,
            extra_phones=[contact.phone],
        )

    async def _guest_customer(self, contact: GuestContact) -> User:
        """Find the customer by phone, or create one (no password, unverified).

        Signing in later with OTP on the same phone shows these orders.
        """
        users = UserRepository(self.session)
        user = await users.get_by_phone(tenant_id=self.tenant_id, phone=contact.phone)
        if user is not None:
            if user.role != UserRole.CUSTOMER.value:
                raise ConflictError(
                    "This phone number cannot be used for guest checkout",
                    error_code=UserErrorCode.PHONE_NOT_ALLOWED,
                )
            if user.status != UserStatus.ACTIVE.value:
                raise ConflictError(
                    "This phone number cannot place orders",
                    error_code=UserErrorCode.ACCOUNT_INACTIVE,
                )
            _require_may_order(user)
            return user

        email = str(contact.email).lower() if contact.email else None
        if email and await users.get_by_email(tenant_id=self.tenant_id, email=email):
            email = None  # stays on the order as contact_email, not on the account

        user = await users.create(
            tenant_id=self.tenant_id,
            phone=contact.phone,
            email=email,
            name=contact.name,
            role=UserRole.CUSTOMER.value,
            is_verified=False,
        )
        return user

    # ------------------------------------------------------------- the order

    async def _place(
        self,
        cart: Cart,
        destination: Destination,
        *,
        coupon_code: str | None,
        payment_method: PaymentMethod,
        idempotency_key: str | None,
        contact_email: str | None,
        is_guest: bool,
        extra_phones: list[str] | None = None,
    ) -> Order:
        phones = await self._phones(destination, extra_phones)

        try:
            order_number = await self._next_order_number()
            lines = await self._priced_lines(cart)

            for line in lines:
                await self.inventory.reserve(
                    line.item.variant_id,
                    line.item.quantity,
                    reference=order_number,
                    commit=False,
                )

            # Re-priced here, under lock, against the server-computed basket --
            # never the numbers an earlier preview showed. This is also the only
            # place a coupon gets spent.
            quote = await self._quote(
                cart,
                destination=destination,
                coupon_code=coupon_code,
                payment_method=payment_method,
                phones=phones,
                for_update=True,
                lines=lines,
            )
            self._require_orderable(quote, destination)
            summary = quote.preview

            order = Order(
                tenant_id=self.tenant_id,
                customer_id=self.customer_id,
                order_number=order_number,
                status=OrderStatus.PENDING.value,
                payment_status=PaymentStatus.PENDING.value,
                payment_method=payment_method.value,
                subtotal=summary.subtotal,
                coupon_id=quote.coupon.coupon.id if quote.coupon else None,
                coupon_code=quote.coupon.coupon.code if quote.coupon else None,
                discount_amount=summary.discount_amount,
                shipping_amount=summary.shipping_amount,
                cod_fee=summary.cod_fee,
                tax_amount=summary.tax_amount,
                cgst_amount=quote.tax.cgst,
                sgst_amount=quote.tax.sgst,
                igst_amount=quote.tax.igst,
                gst_type=quote.tax.gst_type.value if quote.tax.gst_type else None,
                place_of_supply=quote.place_of_supply,
                seller_gstin=quote.seller_gstin,
                total_amount=summary.total_amount,
                advance_amount=summary.advance_amount,
                delivery_name=destination.full_name,
                delivery_phone=destination.phone,
                delivery_address_line_1=destination.address_line_1,
                delivery_address_line_2=destination.address_line_2,
                delivery_city=destination.city,
                delivery_state=destination.state,
                delivery_postal_code=destination.postal_code,
                delivery_country=destination.country,
                contact_email=contact_email,
                is_guest=is_guest,
                estimated_delivery_date=quote.delivery.latest if quote.delivery else None,
                idempotency_key=idempotency_key,
            )
            self.session.add(order)
            await self.session.flush()

            for item in summary.items:
                self.session.add(
                    OrderItem(
                        tenant_id=self.tenant_id,
                        order_id=order.id,
                        variant_id=item.variant_id,
                        product_id=item.product_id,
                        product_name=item.product_name,
                        variant_name=item.variant_name,
                        sku=item.sku,
                        unit_price=item.unit_price,
                        quantity=item.quantity,
                        subtotal=item.subtotal,
                        hsn_code=item.hsn_code,
                        gst_rate=item.gst_rate,
                        discount_amount=item.discount_amount,
                        taxable_amount=item.taxable_amount,
                        tax_amount=item.tax_amount,
                    )
                )

            if quote.coupon is not None:
                # Shares this transaction: any failure rolls the redemption back too.
                await self.coupons.record_redemption(
                    quote.coupon.coupon, self.customer_id, order.id, quote.coupon.saving
                )

            self._add_payments(
                order, summary.total_amount, summary.advance_amount, payment_method
            )
            self.session.add(
                OrderTrackingEvent(
                    tenant_id=self.tenant_id,
                    order_id=order.id,
                    status=OrderStatus.PENDING.value,
                    description=STATUS_DESCRIPTIONS[OrderStatus.PENDING],
                    source=TrackingSource.SYSTEM.value,
                    occurred_at=datetime.now(timezone.utc),
                )
            )

            cart.status = CartStatus.CONVERTED.value
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()

            if idempotency_key:
                replayed = await self._replayed_order(idempotency_key, payment_method)
                if replayed is not None:
                    return replayed

            raise ConflictError("Unable to place the order, please try again") from exc
        except Exception:
            await self.session.rollback()
            raise

        return await OrderService(self.session, self.tenant_id).get(order.id)

    def _add_payments(
        self, order: Order, total: Decimal, advance: Decimal, method: PaymentMethod
    ) -> None:
        """What the order is paid with: one online (Razorpay) payment for the whole
        order, or for cash on delivery one COD payment, or an advance plus a COD
        balance. Every payment starts PENDING; online money is PAID only once
        Razorpay's signature is verified (PaymentService.verify_online_payment)."""

        def payment(amount: Decimal, provider: PaymentProvider, purpose: PaymentPurpose):
            self.session.add(
                Payment(
                    tenant_id=self.tenant_id,
                    order_id=order.id,
                    amount=amount,
                    status=CashStatus.PENDING.value,
                    provider=provider.value,
                    purpose=purpose.value,
                )
            )

        if method is not PaymentMethod.CASH_ON_DELIVERY:
            payment(total, PaymentProvider.RAZORPAY, PaymentPurpose.FULL)
            return

        if advance <= ZERO:
            payment(total, PaymentProvider.COD, PaymentPurpose.FULL)
            return

        payment(advance, PaymentProvider.PREPAID, PaymentPurpose.ADVANCE)
        if total - advance > ZERO:
            payment(total - advance, PaymentProvider.COD, PaymentPurpose.BALANCE)

    @staticmethod
    def _require_orderable(quote: Quote, destination: Destination) -> None:
        if quote.delivery is not None and not quote.delivery.serviceable:
            raise ConflictError(
                f"Sorry, we do not deliver to pincode {destination.postal_code} yet",
                error_code=OrderErrorCode.PINCODE_NOT_SERVICEABLE,
            )
        if quote.cod is not None and not quote.cod.available:
            raise ConflictError(
                quote.cod.message or "Cash on delivery is not available for this order",
                error_code=OrderErrorCode.COD_UNAVAILABLE,
            )

    # --------------------------------------------------------------- pricing

    async def _quote(
        self,
        cart: Cart,
        *,
        destination: Destination | None,
        coupon_code: str | None,
        payment_method: PaymentMethod,
        phones: list[str],
        for_update: bool,
        pincode: str | None = None,
        lines: list[PricedLine] | None = None,
    ) -> Quote:
        """Every number on the checkout page, computed in one place.

        Order: goods -> coupon -> delivery (less any free-shipping offer) ->
        COD fee -> GST on discounted goods + charges -> total. Preview and
        place_order both call this, so their numbers cannot disagree.
        """
        lines = lines or await self._priced_lines(cart)
        subtotal = money(sum((line.item.subtotal for line in lines), ZERO))

        pin = destination.indian_pincode if destination else pincode
        delivery = await self.delivery.quote(pin, subtotal) if pin else None
        if delivery is not None and delivery.serviceable:
            shipping = delivery.shipping_amount
        else:
            shipping = await self.shipping.calculate(subtotal)

        coupon = await self._resolve_coupon(coupon_code, subtotal, shipping, lines, for_update)
        discount = coupon.discount if coupon else ZERO
        shipping_discount = min(coupon.shipping_discount, shipping) if coupon else ZERO
        shipping_charged = shipping - shipping_discount

        tax_settings = await self.tax.get_settings()
        tax_active = bool(tax_settings and tax_settings.is_active)
        default_rate = tax_settings.tax_percentage if tax_settings else ZERO
        gst_settings = await self.gst.get_settings()
        seller_state = gst_settings.state_code if gst_settings else None
        gst_type = supply_type(seller_state, destination.state if destination else None)
        taxable_lines = [
            TaxableLine(
                key=line.item.variant_id,
                amount=line.item.subtotal,
                rate=line.item.gst_rate if line.item.gst_rate is not None else default_rate,
                hsn_code=line.item.hsn_code,
            )
            for line in lines
        ]

        def tax_for(charges: Decimal) -> TaxResult:
            return compute_tax(
                taxable_lines,
                discount=discount,
                charges=charges,
                default_rate=default_rate,
                active=tax_active,
                gst_type=gst_type,
            )

        cod: CodAvailability | None = None
        cod_fee = ZERO
        if payment_method is PaymentMethod.CASH_ON_DELIVERY:
            before_fee = tax_for(shipping_charged)
            order_value = subtotal - discount + shipping_charged + before_fee.tax_amount
            cod = await self.cod.availability(
                order_value,
                phones=phones,
                pincode_allows_cod=delivery.cod_allowed_here if delivery else True,
            )
            if cod.available:
                cod_fee = cod.fee

        tax = tax_for(shipping_charged + cod_fee)
        total = subtotal - discount + shipping_charged + cod_fee + tax.tax_amount
        advance = min(cod.advance_amount, total) if cod and cod.available else ZERO

        items = []
        for line in lines:
            share = tax.lines[line.item.variant_id]
            items.append(
                line.item.model_copy(
                    update={
                        "gst_rate": share.rate if tax_active else line.item.gst_rate,
                        "discount_amount": share.discount,
                        "taxable_amount": share.taxable,
                        "tax_amount": share.tax,
                    }
                )
            )

        place = None
        if destination is not None:
            code = state_code_for(destination.state)
            place = f"{STATE_CODES[code]} ({code})" if code else destination.state

        preview = CheckoutPreview(
            items=items,
            subtotal=subtotal,
            coupon_code=coupon.coupon.code if coupon else None,
            discount_amount=discount,
            is_automatic_discount=bool(coupon and coupon.automatic and not coupon_code),
            shipping_amount=shipping_charged,
            shipping_discount=shipping_discount,
            cod_fee=cod_fee,
            tax_amount=tax.tax_amount,
            total_amount=total,
            advance_amount=advance,
            payment_method=payment_method,
            gst=GstBreakdown(
                gst_type=tax.gst_type,
                place_of_supply=place,
                cgst_amount=tax.cgst,
                sgst_amount=tax.sgst,
                igst_amount=tax.igst,
            )
            if tax.gst_type is not None
            else None,
            delivery=DeliveryEstimate(
                pincode=delivery.pincode,
                serviceable=delivery.serviceable,
                min_delivery_days=delivery.min_days,
                max_delivery_days=delivery.max_days,
                earliest_delivery_date=delivery.earliest,
                estimated_delivery_date=delivery.latest,
            )
            if delivery
            else None,
            cod=cod,
        )
        return Quote(
            preview=preview,
            lines=lines,
            coupon=coupon,
            tax=tax,
            delivery=delivery,
            cod=cod,
            seller_gstin=gst_settings.gstin if gst_settings else None,
            place_of_supply=place,
        )

    async def _resolve_coupon(
        self,
        coupon_code: str | None,
        subtotal: Decimal,
        shipping: Decimal,
        lines: list[PricedLine],
        for_update: bool,
    ) -> CouponResult | None:
        """A code the shopper typed wins; otherwise the best automatic discount, if any."""
        coupon_lines = [
            CouponLine(
                product_id=line.item.product_id,
                category_id=line.category_id,
                unit_price=line.item.unit_price,
                quantity=line.item.quantity,
            )
            for line in lines
        ]
        if coupon_code:
            return await self.coupons.evaluate_code(
                coupon_code,
                subtotal,
                self.customer_id,
                lines=coupon_lines,
                shipping=shipping,
                for_update=for_update,
            )

        best = await self.coupons.best_automatic(
            subtotal, self.customer_id, lines=coupon_lines, shipping=shipping
        )
        if best is None or not for_update:
            return best

        # Re-check the winner under a row lock before it is spent.
        locked = await self.coupons.lock(best.coupon.id)
        try:
            return await self.coupons.evaluate(
                locked, subtotal, self.customer_id, lines=coupon_lines, shipping=shipping
            )
        except (NotFoundError, ValidationError):
            # Automatic offers are optional. If another checkout consumes the
            # last use while this request waits for the row lock, continue at
            # the regular price instead of failing the whole order.
            return None

    async def _priced_lines(self, cart: Cart) -> list[PricedLine]:
        """Validate every cart line and price it from the catalogue (sale prices included)."""
        rows = await self.cart_items.list_with_catalogue(cart.id)
        if not rows:
            raise ConflictError(CART_EMPTY, error_code=CartErrorCode.CART_EMPTY)

        categories: dict[UUID, Category | None] = {}
        lines: list[PricedLine] = []

        for cart_item, variant, product in rows:
            if (
                product.status != CatalogueStatus.ACTIVE.value
                or variant.status != CatalogueStatus.ACTIVE.value
            ):
                raise ConflictError(
                    f"{product.name} is no longer available",
                    error_code=InventoryErrorCode.PRODUCT_UNAVAILABLE,
                )

            available = sellable_quantity(await self.inventory.get(variant.id))
            if cart_item.quantity > available:
                raise ConflictError(
                    f"Only {available} left of {product.name}"
                    if available
                    else f"{product.name} is out of stock",
                    error_code=InventoryErrorCode.INSUFFICIENT_STOCK,
                )

            if product.category_id not in categories:
                categories[product.category_id] = await self.categories.get(product.category_id)
            category = categories[product.category_id]

            unit_price = effective_price(variant)
            lines.append(
                PricedLine(
                    item=CheckoutItem(
                        product_id=product.id,
                        variant_id=variant.id,
                        product_name=product.name,
                        variant_name=variant.name,
                        sku=variant.sku,
                        quantity=cart_item.quantity,
                        unit_price=unit_price,
                        subtotal=unit_price * cart_item.quantity,
                        compare_at_price=variant.price if is_on_sale(variant) else None,
                        hsn_code=product.hsn_code or (category.hsn_code if category else None),
                        gst_rate=product.gst_rate
                        if product.gst_rate is not None
                        else (category.gst_rate if category else None),
                    ),
                    category_id=product.category_id,
                )
            )

        return lines

    # ---------------------------------------------------------------- helpers

    async def _phones(
        self, destination: Destination | None, extra: list[str] | None = None
    ) -> list[str]:
        phones = set(extra or [])
        if destination is not None:
            phones.add(destination.phone)
        if self.customer_id is not None:
            user = await UserRepository(self.session).get_by_id(
                tenant_id=self.tenant_id, user_id=self.customer_id
            )
            if user is not None:
                phones.add(user.phone)
        return sorted(phones)

    async def _replayed_order(
        self, idempotency_key: str, payment_method: PaymentMethod
    ) -> Order | None:
        """The order this customer already placed under the same key, if any."""
        existing = await self.orders.get_by_idempotency_key(
            self.customer_id, idempotency_key
        )
        if existing is None:
            return None

        if existing.payment_method != payment_method.value:
            raise ConflictError(
                "This checkout key was already used for another payment method",
                error_code=OrderErrorCode.IDEMPOTENCY_KEY_REUSED,
            )

        return await OrderService(self.session, self.tenant_id).get(existing.id)

    @staticmethod
    async def _require_cart(carts: CartService) -> Cart:
        cart = await carts.active_cart()
        if cart is None:
            raise ConflictError(CART_EMPTY, error_code=CartErrorCode.CART_EMPTY)
        return cart

    async def _require_address(self, address_id: UUID) -> Address:
        address = await self.addresses.get_for_customer(self.customer_id, address_id)
        if address is None:
            raise NotFoundError(ADDRESS_NOT_FOUND)
        return address

    async def _next_order_number(self) -> str:
        """ORD-100001, ORD-100002, ... straight from a Postgres sequence."""
        number = await self.session.scalar(select(ORDER_NUMBER_SEQUENCE.next_value()))
        return f"{ORDER_NUMBER_PREFIX}{number}"


class OrderService:
    """Reading orders back and moving them through fulfilment, scoped to one tenant."""

    def __init__(self, session: AsyncSession, tenant_id: UUID) -> None:
        self.session = session
        self.tenant_id = tenant_id
        self.orders = OrderRepository(session, tenant_id)
        self.inventory = InventoryService(session, tenant_id)
        self.payments = PaymentRepository(session, tenant_id)

    async def get(self, order_id: UUID) -> Order:
        """Admin lookup: any order in this tenant."""
        order = await self.orders.get(order_id)
        if order is None:
            raise NotFoundError(ORDER_NOT_FOUND, error_code=OrderErrorCode.NOT_FOUND)
        return order

    async def get_for_customer(self, customer_id: UUID, order_id: UUID) -> Order:
        """Fetch one of the customer's own orders; anything else reads as not found."""
        order = await self.orders.get_for_customer(customer_id, order_id)
        if order is None:
            raise NotFoundError(ORDER_NOT_FOUND, error_code=OrderErrorCode.NOT_FOUND)
        return order

    async def get_for_tracking(self, order_number: str, phone: str) -> Order:
        """Public lookup: the order number plus the delivery or account phone."""
        order = await self.orders.get_by_number(order_number.strip().upper())
        if order is None:
            raise NotFoundError(ORDER_NOT_FOUND, error_code=OrderErrorCode.NOT_FOUND)

        customer = await UserRepository(self.session).get_by_id(
            tenant_id=self.tenant_id, user_id=order.customer_id
        )
        if phone not in {order.delivery_phone, customer.phone if customer else None}:
            raise NotFoundError(ORDER_NOT_FOUND, error_code=OrderErrorCode.NOT_FOUND)
        return order

    async def list(
        self,
        params: PageParams,
        *,
        customer_id: UUID | None = None,
        order_number: str | None = None,
        status: OrderStatus | None = None,
        payment_status: PaymentStatus | None = None,
        search: str | None = None,
        payment_method: str | None = None,
        start_date=None,
        end_date=None,
    ) -> tuple[list[Order], int]:
        stmt = self.orders.list_select(
            customer_id=customer_id,
            order_number=order_number,
            status=status,
            payment_status=payment_status,
            search=search,
            payment_method=payment_method,
            start_date=start_date,
            end_date=end_date,
        )
        rows, total = await self.orders.paginate(stmt, params)
        return list(rows), total

    async def update_status(
        self,
        order_id: UUID,
        new_status: OrderStatus,
        *,
        note: str | None = None,
        shipment: dict | None = None,
        source: TrackingSource = TrackingSource.ADMIN,
        return_reason_id: UUID | None = None,
        return_note: str | None = None,
        customer_id: UUID | None = None,
    ) -> Order:
        """Move an order to its next status, adjusting stock and payment to match."""
        # Locked: two status changes at once (a customer cancelling while the
        # store ships) would otherwise both pass the transition check.
        order = (
            await self.orders.get_for_customer_for_update(customer_id, order_id)
            if customer_id is not None
            else await self.orders.lock(order_id)
        )
        if order is None:
            raise NotFoundError(ORDER_NOT_FOUND, error_code=OrderErrorCode.NOT_FOUND)
        current = OrderStatus(order.status)

        # Match verification's lock order (order, then payment). Decisions use
        # the refreshed payment row, so verification and status changes serialize.
        razorpay_payment = await self.payments.get_razorpay_payment_for_update(order.id)

        if (return_reason_id or return_note) and new_status is not OrderStatus.RETURNED:
            raise ValidationError(
                "A return reason can only be given when marking an order RETURNED"
            )
        reason = None
        if return_reason_id is not None:
            from app.returns.service import ReturnReasonService

            reason = await ReturnReasonService(self.session, self.tenant_id).require_active(
                return_reason_id
            )

        if new_status == current:
            if shipment:
                return await self.update_shipment(order_id, shipment)
            return order

        if new_status not in ALLOWED_TRANSITIONS[current]:
            raise ConflictError(
                f"An order that is {current.value} cannot become {new_status.value}",
                error_code=OrderErrorCode.INVALID_STATUS,
            )

        if (
            order.payment_method != PaymentMethod.CASH_ON_DELIVERY.value
            and new_status in {
                OrderStatus.SHIPPED,
                OrderStatus.OUT_FOR_DELIVERY,
                OrderStatus.DELIVERED,
            }
            and (
                order.payment_status != PaymentStatus.PAID.value
                or razorpay_payment is None
                or razorpay_payment.status != CashStatus.PAID.value
            )
        ):
            raise ConflictError(
                "Online payment must be captured before dispatch",
                error_code=OrderErrorCode.ONLINE_PAYMENT_PENDING,
            )

        if new_status in NEEDS_ADVANCE_PAID and order.advance_amount > ZERO:
            advance = order.advance_payment
            if advance is None or advance.status != CashStatus.PAID.value:
                raise ConflictError(
                    "The COD advance has not been paid yet",
                    error_code=OrderErrorCode.ADVANCE_PENDING,
                )

        if new_status is OrderStatus.CANCELLED:
            if (
                order.payment_status == PaymentStatus.PAID.value
                or any(payment.status == CashStatus.PAID.value for payment in order.payments)
            ):
                raise ConflictError(
                    "A paid order cannot be cancelled without a refund",
                    error_code=OrderErrorCode.REFUND_REQUIRED,
                )
            if order.payment_method != PaymentMethod.CASH_ON_DELIVERY.value:
                raise ConflictError(
                    "A Razorpay order cannot be cancelled automatically because its "
                    "gateway payment outcome cannot be confirmed. Please contact the store."
                )

        if new_status is OrderStatus.RETURNED and any(
            payment.status == CashStatus.PAID.value for payment in order.payments
        ):
            raise ConflictError(
                "A paid order cannot be returned without a supported refund workflow",
                error_code=OrderErrorCode.REFUND_REQUIRED,
            )

        try:
            if new_status is OrderStatus.SHIPPED or (
                current is OrderStatus.PACKED
                and new_status in {OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED}
            ):
                await self._fulfil_stock(order)
            if new_status is OrderStatus.DELIVERED:
                await self._collect_cash(order)
            elif new_status is OrderStatus.CANCELLED:
                await self._release_stock(order)
                await self._abandon_payments(order)
            elif new_status is OrderStatus.RETURNED:
                await self._restock(order)
                await self._abandon_payments(order)
                order.return_reason = reason.label if reason else None
                order.return_note = return_note

            for field, value in (shipment or {}).items():
                setattr(order, field, value)

            order.status = new_status.value
            self.session.add(
                OrderTrackingEvent(
                    tenant_id=self.tenant_id,
                    order_id=order.id,
                    status=new_status.value,
                    description=note or STATUS_DESCRIPTIONS[new_status],
                    source=source.value,
                    occurred_at=datetime.now(timezone.utc),
                )
            )

            is_cod = order.payment_method == PaymentMethod.CASH_ON_DELIVERY.value
            if new_status is OrderStatus.RETURNED and is_cod:
                customer = await UserRepository(self.session).get_by_id(
                    tenant_id=self.tenant_id, user_id=order.customer_id
                )
                await CodService(self.session, self.tenant_id).auto_blacklist_after_return(
                    order, extra_phones=[customer.phone] if customer else []
                )
            if new_status is OrderStatus.DELIVERED:
                from app.ratings.requests import ReviewRequestService

                await ReviewRequestService(self.session, self.tenant_id).schedule_for(order)

            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise

        return await self.get(order.id)

    async def for_labels(self, order_ids: list[UUID]) -> list[Order]:
        """Orders to print labels for, in the order asked. Only parcels that are
        confirmed and not yet delivered, cancelled or returned qualify."""
        orders = [await self.get(order_id) for order_id in dict.fromkeys(order_ids)]
        refused = [o.order_number for o in orders if OrderStatus(o.status) not in LABEL_STATUSES]
        if refused:
            raise ConflictError(
                "No label for orders that are pending, delivered, cancelled or returned: "
                + ", ".join(refused[:10]),
                error_code=OrderErrorCode.LABEL_NOT_ALLOWED,
            )
        return orders

    async def update_address(self, order_id: UUID, data) -> tuple[Order, dict]:
        """Correct the delivery address before the parcel ships.

        The order's prices and GST were fixed at checkout, so a new address
        must keep the same GST supply type (same state relationship to the
        seller) and must be a pincode the store delivers to.
        """
        order = await self.get(order_id)
        if OrderStatus(order.status) not in ADDRESS_EDITABLE_STATUSES:
            raise ConflictError(
                f"The address of a {order.status} order can no longer be changed",
                error_code=OrderErrorCode.ADDRESS_LOCKED,
            )

        gst = await GstService(self.session, self.tenant_id).get_settings()
        new_type = supply_type(gst.state_code if gst else None, data.state)
        if order.gst_type and new_type and new_type.value != order.gst_type:
            raise ConflictError(
                "This address changes how GST applies to the order "
                "(intra-state vs inter-state). Cancel and place a new order instead.",
                error_code=OrderErrorCode.GST_TYPE_CHANGE,
            )

        destination = Destination.of(data)
        if destination.indian_pincode:
            quote = await DeliveryService(self.session, self.tenant_id).quote(
                destination.indian_pincode, order.subtotal
            )
            if not quote.serviceable:
                raise ConflictError(
                    f"Sorry, we do not deliver to pincode {data.postal_code} yet",
                    error_code=OrderErrorCode.PINCODE_NOT_SERVICEABLE,
                )

        before = {
            "full_name": order.delivery_name,
            "phone": order.delivery_phone,
            "address_line_1": order.delivery_address_line_1,
            "address_line_2": order.delivery_address_line_2,
            "city": order.delivery_city,
            "state": order.delivery_state,
            "postal_code": order.delivery_postal_code,
            "country": order.delivery_country,
        }
        order.delivery_name = data.full_name
        order.delivery_phone = data.phone
        order.delivery_address_line_1 = data.address_line_1
        order.delivery_address_line_2 = data.address_line_2
        order.delivery_city = data.city
        order.delivery_state = data.state
        order.delivery_postal_code = data.postal_code
        order.delivery_country = data.country
        code = state_code_for(data.state)
        if order.place_of_supply is not None:
            order.place_of_supply = f"{STATE_CODES[code]} ({code})" if code else data.state

        self.session.add(
            OrderTrackingEvent(
                tenant_id=self.tenant_id,
                order_id=order.id,
                status=None,
                description=data.reason or "Delivery address updated",
                source=TrackingSource.ADMIN.value,
                occurred_at=datetime.now(timezone.utc),
            )
        )
        await self.session.commit()
        return await self.get(order.id), before

    async def update_shipment(self, order_id: UUID, changes: dict) -> Order:
        """Set courier name, tracking number and/or tracking URL."""
        order = await self.get(order_id)
        for field, value in changes.items():
            setattr(order, field, value)
        await self.session.commit()

        return await self.get(order.id)

    async def add_tracking_event(
        self,
        order_id: UUID,
        *,
        description: str,
        location: str | None,
        occurred_at: datetime | None,
        source: TrackingSource = TrackingSource.ADMIN,
    ) -> Order:
        """Record a courier scan or note without changing the status."""
        order = await self.get(order_id)
        if OrderStatus(order.status) in {OrderStatus.CANCELLED}:
            raise ConflictError(
                "A cancelled order has no shipment to track",
                error_code=OrderErrorCode.INVALID_STATUS,
            )

        self.session.add(
            OrderTrackingEvent(
                tenant_id=self.tenant_id,
                order_id=order.id,
                status=None,
                description=description,
                location=location,
                source=source.value,
                occurred_at=occurred_at or datetime.now(timezone.utc),
            )
        )
        await self.session.commit()
        return await self.get(order.id)

    async def cancel_for_customer(self, customer_id: UUID, order_id: UUID) -> Order:
        """Cancel the customer's own order, allowed only before PROCESSING."""
        return await self.update_status(
            order_id, OrderStatus.CANCELLED, source=TrackingSource.SYSTEM,
            note="Cancelled by the customer", customer_id=customer_id,
        )

    async def _release_stock(self, order: Order) -> None:
        for item in order.items:
            await self.inventory.release(
                item.variant_id, item.quantity, reference=order.order_number, commit=False
            )

    async def _fulfil_stock(self, order: Order) -> None:
        for item in order.items:
            await self.inventory.fulfil(
                item.variant_id, item.quantity, reference=order.order_number, commit=False
            )

    async def _restock(self, order: Order) -> None:
        """An undelivered parcel's goods come back to the shelf."""
        for item in order.items:
            await self.inventory.restock(
                item.variant_id,
                item.quantity,
                reference=order.order_number,
                note="Returned undelivered",
                commit=False,
            )

    async def _collect_cash(self, order: Order) -> None:
        """Mark the COD payment PAID; `update_status` owns the transaction."""
        for payment in order.payments:
            if (
                payment.provider == PaymentProvider.COD.value
                and payment.status == CashStatus.PENDING.value
            ):
                payment.status = CashStatus.PAID.value

        if order.payments and all(p.status == CashStatus.PAID.value for p in order.payments):
            order.payment_status = PaymentStatus.PAID.value

    async def _abandon_payments(self, order: Order) -> None:
        """A cancelled or returned order's outstanding money never arrives."""
        for payment in order.payments:
            if payment.status == CashStatus.PENDING.value:
                payment.status = CashStatus.FAILED.value
