"""Automatic review requests after delivery."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import UUID

from sqlalchemy import Select, and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.repository import TenantScopedRepository
from app.orders.constants import OrderStatus
from app.orders.models import Order, OrderItem
from app.ratings.models import Review, ReviewRequest, ReviewRequestStatus
from app.ratings.notifier import NullReviewNotifier, ReviewRequestMessage, ReviewRequestNotifier
from app.users.repository import UserRepository


class ReviewRequestRepository(TenantScopedRepository[ReviewRequest]):
    model = ReviewRequest

    async def for_order(self, order_id: UUID) -> ReviewRequest | None:
        return await self.find_one(ReviewRequest.order_id == order_id)

    def list_select(self, *, status: ReviewRequestStatus | None = None) -> Select:
        stmt = self.base_select()
        if status is not None:
            stmt = stmt.where(ReviewRequest.status == status.value)
        return stmt.order_by(ReviewRequest.send_after.desc())


class ReviewRequestService:
    def __init__(self, session: AsyncSession, tenant_id: UUID) -> None:
        self.session = session
        self.tenant_id = tenant_id
        self.requests = ReviewRequestRepository(session, tenant_id)

    async def schedule_for(self, order: Order) -> None:
        """Queue a request when an order is delivered. Caller commits."""
        if await self.requests.for_order(order.id) is not None:
            return
        delay = timedelta(days=get_settings().review_request_delay_days)
        await self.requests.add(
            ReviewRequest(
                order_id=order.id,
                customer_id=order.customer_id,
                status=ReviewRequestStatus.PENDING.value,
                send_after=datetime.now(timezone.utc) + delay,
            )
        )

    async def list(self, params, *, status: ReviewRequestStatus | None = None):
        rows, total = await self.requests.paginate(self.requests.list_select(status=status), params)
        return list(rows), total

    async def _unreviewed(self, order_id: UUID, customer_id: UUID) -> list[OrderItem]:
        """Products on the order the customer has not reviewed yet."""
        reviewed = select(Review.product_id).where(
            Review.tenant_id == self.tenant_id, Review.user_id == customer_id
        )
        rows = await self.session.scalars(
            select(OrderItem).where(
                OrderItem.tenant_id == self.tenant_id,
                OrderItem.order_id == order_id,
                OrderItem.product_id.notin_(reviewed),
            )
        )
        seen, items = set(), []
        for item in rows.all():
            if item.product_id not in seen:
                seen.add(item.product_id)
                items.append(item)
        return items

    async def pending_for_customer(self, customer_id: UUID) -> list[tuple[Order, OrderItem]]:
        """(order, item) for every delivered product still waiting for a review."""
        orders = await self.session.scalars(
            select(Order)
            .where(
                Order.tenant_id == self.tenant_id,
                Order.customer_id == customer_id,
                Order.status == OrderStatus.DELIVERED.value,
            )
            .order_by(Order.created_at.desc())
        )
        pending, seen = [], set()
        for order in orders.all():
            for item in await self._unreviewed(order.id, customer_id):
                if item.product_id not in seen:
                    seen.add(item.product_id)
                    pending.append((order, item))
        return pending

    async def dispatch_due(
        self,
        notifier: ReviewRequestNotifier | None = None,
        now: datetime | None = None,
    ) -> dict[str, int]:
        """Send every due request; requests whose products are all reviewed just close."""
        notifier = notifier or NullReviewNotifier()
        moment = now or datetime.now(timezone.utc)
        users = UserRepository(self.session)
        sent = completed = 0

        due = await self.session.scalars(
            self.requests.base_select().where(
                ReviewRequest.status == ReviewRequestStatus.PENDING.value,
                ReviewRequest.send_after <= moment,
            )
        )
        for request in due.all():
            order = await self.session.scalar(
                select(Order).where(
                    and_(Order.tenant_id == self.tenant_id, Order.id == request.order_id)
                )
            )
            items = await self._unreviewed(request.order_id, request.customer_id)
            if order is None or not items:
                request.status = ReviewRequestStatus.COMPLETED.value
                completed += 1
                continue

            customer = await users.get_by_id(tenant_id=self.tenant_id, user_id=request.customer_id)
            await notifier.send(
                ReviewRequestMessage(
                    tenant_id=str(self.tenant_id),
                    order_number=order.order_number,
                    customer_name=customer.name if customer else order.delivery_name,
                    email=order.contact_email or (customer.email if customer else None),
                    phone=order.delivery_phone,
                    products=[item.product_name for item in items],
                )
            )
            request.status = ReviewRequestStatus.SENT.value
            request.sent_at = moment
            sent += 1

        await self.session.commit()
        return {"sent": sent, "completed": completed}

    async def complete_if_done(self, order_id: UUID | None, customer_id: UUID) -> None:
        """Close the order's request once all its products are reviewed. Caller commits."""
        if order_id is None:
            return
        request = await self.requests.for_order(order_id)
        if request is None or request.status in {
            ReviewRequestStatus.COMPLETED.value,
            ReviewRequestStatus.CANCELLED.value,
        }:
            return
        if not await self._unreviewed(order_id, customer_id):
            request.status = ReviewRequestStatus.COMPLETED.value
