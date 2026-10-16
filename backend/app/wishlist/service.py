from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalogue.constants import CatalogueStatus
from app.catalogue.repository import ProductRepository, VariantRepository
from app.core.error_codes import InventoryErrorCode, ProductErrorCode
from app.core.exceptions import ConflictError, NotFoundError
from app.core.logging import get_logger
from app.wishlist.models import Wishlist
from app.wishlist.repository import WishlistItemRepository, WishlistRepository
from app.wishlist.schemas import (
    WishListItemCreate,
    WishlistItemImage,
    WishListItemRead,
    WishListRead,
)

logger = get_logger("wishlist")

VARIANT_NOT_FOUND = "Product variant not found"
VARIANT_UNAVAILABLE = "Product variant is not available"
PRODUCT_UNAVAILABLE = "Product is not available"
ITEM_NOT_FOUND = "Wishlist item not found"
WISHLIST_ITEM_EXISTS = "Item already in wishlist"


class WishListService:
    def __init__(self, session: AsyncSession, tenant_id: UUID, customer_id: UUID) -> None:
        self.session = session
        self.tenant_id = tenant_id
        self.customer_id = customer_id
        self.wishlists = WishlistRepository(session, tenant_id)
        self.items = WishlistItemRepository(session, tenant_id)
        self.variants = VariantRepository(session, tenant_id)
        self.products = ProductRepository(session, tenant_id)

    async def get_or_create_wishlist(self) -> Wishlist:
        wishlist = await self.wishlists.get_by_customer(customer_id=self.customer_id)
        if wishlist is not None:
            return wishlist
        try:
            wishlist = await self.wishlists.create(
                Wishlist(tenant_id=self.tenant_id, customer_id=self.customer_id)
            )
            await self.session.commit()
            return wishlist
        except IntegrityError:
            await self.session.rollback()
            existing = await self.wishlists.get_by_customer(self.customer_id)
            if existing is None:
                raise
            return existing

    async def render(self, wishlist: Wishlist) -> WishListRead:
        rows = await self.items.list_with_catalogue(wishlist.id)
        images = await self.items.primary_images([product.id for _item, _variant, product in rows])
        items: list[WishListItemRead] = []
        for item, variant, product in rows:
            items.append(
                WishListItemRead(
                    id=item.id,
                    variant_id=variant.id,
                    product_id=product.id,
                    product_name=product.name,
                    variant_name=variant.name,
                    sku=variant.sku,
                    unit_price=variant.price,
                    image=_image_of(images.get(product.id)),
                )
            )
        return WishListRead(id=wishlist.id, items=items, item_count=len(items))

    async def view(self) -> WishListRead:
        wishlist = await self.get_or_create_wishlist()
        return await self.render(wishlist)

    async def add_item(self, data: WishListItemCreate) -> WishListRead:
        wishlist = await self.get_or_create_wishlist()
        await self.check_available(data.variant_id)
        existing = await self.items.get_by_variant(wishlist.id, data.variant_id)
        if existing is not None:
            raise ConflictError(WISHLIST_ITEM_EXISTS)
        try:
            await self.items.add_item(wishlist.id, data.variant_id)
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError(WISHLIST_ITEM_EXISTS) from exc
        logger.info(
            "wishlist.item_added wishlist_id=%s tenant_id=%s variant_id=%s",
            wishlist.id,
            self.tenant_id,
            data.variant_id,
        )
        return await self.render(wishlist)

    async def remove_item(self, item_id: UUID) -> WishListRead:
        wishlist = await self.get_or_create_wishlist()
        item = await self.items.get_item(wishlist.id, item_id)
        if item is None:
            raise NotFoundError(ITEM_NOT_FOUND)
        await self.items.delete(item)
        await self.session.commit()
        logger.info(
            "wishlist.item_removed wishlist_id=%s tenant_id=%s item_id=%s",
            wishlist.id,
            self.tenant_id,
            item_id,
        )
        return await self.render(wishlist)

    async def clear(self) -> WishListRead:
        wishlist = await self.get_or_create_wishlist()
        removed = await self.items.clear(wishlist.id)
        await self.session.commit()
        logger.info(
            "wishlist.cleared wishlist_id=%s tenant_id=%s items=%s",
            wishlist.id,
            self.tenant_id,
            removed,
        )
        return await self.render(wishlist)

    async def check_available(self, variant_id: UUID) -> None:
        variant = await self.variants.get(variant_id)
        if variant is None:
            raise NotFoundError(VARIANT_NOT_FOUND, error_code=ProductErrorCode.VARIANT_NOT_FOUND)

        if variant.status != CatalogueStatus.ACTIVE.value:
            raise ConflictError(
                VARIANT_UNAVAILABLE,
                error_code=InventoryErrorCode.PRODUCT_UNAVAILABLE,
            )

        product = await self.products.get(variant.product_id)
        if product is None or product.status != CatalogueStatus.ACTIVE.value:
            raise ConflictError(
                PRODUCT_UNAVAILABLE,
                error_code=InventoryErrorCode.PRODUCT_UNAVAILABLE,
            )


def _image_of(image) -> WishlistItemImage | None:
    if image is None:
        return None
    return WishlistItemImage(url=image.url, alt_text=image.alt_text)
