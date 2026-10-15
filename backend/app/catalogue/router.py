from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    Query,
    Response,
    UploadFile,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import require_admin, require_staff
from app.catalogue.schemas import (
    CategoryCreate,
    CategoryRead,
    CategoryUpdate,
    ImageReorderPayload,
    InventoryAdjust,
    InventoryMovementRead,
    InventorySet,
    InventoryStatus,
    InventoryThreshold,
    ProductCreate,
    ProductImageCreate,
    ProductImageRead,
    ProductImageUpdate,
    ProductQuery,
    ProductRead,
    ProductUpdate,
    VariantCreate,
    VariantRead,
    VariantUpdate,
)
from app.catalogue.serializers import admin_variant, inventory_status
from app.catalogue.service import (
    CategoryService,
    InventoryService,
    ProductImageService,
    ProductService,
    VariantService,
)
from app.catalogue.uploads import store_image
from app.core.config import get_settings
from app.core.database import get_db
from app.core.pagination import PageParams
from app.core.responses import ApiResponse, ok, paginated
from app.users.models import User

router = APIRouter(prefix="/catalogue", tags=["Admin-Catalogue_management"])


@router.post(
    "/categories",
    response_model=ApiResponse[CategoryRead],
    status_code=status.HTTP_201_CREATED,
    summary="Create a category",
)
async def create_category(
    data: CategoryCreate,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[CategoryRead]:
    category = await CategoryService(session, user.tenant_id).create(data)
    return ok(CategoryRead.model_validate(category), message="Category created")


@router.get(
    "/categories",
    response_model=ApiResponse[list[CategoryRead]],
    summary="List categories",
)
async def list_categories(
    params: Annotated[PageParams, Query()],
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[list[CategoryRead]]:
    categories, total = await CategoryService(session, user.tenant_id).list(params)
    return paginated(
        [CategoryRead.model_validate(c) for c in categories],
        total_items=total,
        params=params,
        message="Categories retrieved",
    )


@router.get(
    "/categories/{category_id}",
    response_model=ApiResponse[CategoryRead],
    summary="Retrieve a category",
)
async def get_category(
    category_id: UUID,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[CategoryRead]:
    category = await CategoryService(session, user.tenant_id).get(category_id)
    return ok(CategoryRead.model_validate(category), message="Category retrieved")


@router.patch(
    "/categories/{category_id}",
    response_model=ApiResponse[CategoryRead],
    summary="Update a category",
)
async def update_category(
    category_id: UUID,
    data: CategoryUpdate,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[CategoryRead]:
    category = await CategoryService(session, user.tenant_id).update(category_id, data)
    return ok(CategoryRead.model_validate(category), message="Category updated")


@router.delete(
    "/categories/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Archive a category",
)
async def delete_category(
    category_id: UUID,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> Response:
    await CategoryService(session, user.tenant_id).delete(category_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/products",
    response_model=ApiResponse[ProductRead],
    status_code=status.HTTP_201_CREATED,
    summary="Create a product with at least one image",
)
async def create_product(
    data: ProductCreate,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[ProductRead]:
    product = await ProductService(session, user.tenant_id).create(data)
    return ok(ProductRead.model_validate(product), message="Product created")


@router.get(
    "/products",
    response_model=ApiResponse[list[ProductRead]],
    summary="List products",
)
async def list_products(
    params: Annotated[ProductQuery, Query()],
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[list[ProductRead]]:
    products, total = await ProductService(session, user.tenant_id).list(
        params,
        category_id=params.category_id,
        search=params.search,
        brand=params.brand,
        featured=params.featured,
        sort=params.sort,
    )
    return paginated(
        [ProductRead.model_validate(p) for p in products],
        total_items=total,
        params=params,
        message="Products retrieved",
    )


@router.get(
    "/products/{product_id}",
    response_model=ApiResponse[ProductRead],
    summary="Retrieve a product",
)
async def get_product(
    product_id: UUID,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[ProductRead]:
    product = await ProductService(session, user.tenant_id).get(product_id)
    return ok(ProductRead.model_validate(product), message="Product retrieved")


@router.patch(
    "/products/{product_id}",
    response_model=ApiResponse[ProductRead],
    summary="Update a product",
)
async def update_product(
    product_id: UUID,
    data: ProductUpdate,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[ProductRead]:
    product = await ProductService(session, user.tenant_id).update(product_id, data)
    return ok(ProductRead.model_validate(product), message="Product updated")


@router.delete(
    "/products/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Archive a product and its variants",
)
async def delete_product(
    product_id: UUID,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> Response:
    await ProductService(session, user.tenant_id).delete(product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/products/{product_id}/variants",
    response_model=ApiResponse[VariantRead],
    status_code=status.HTTP_201_CREATED,
    summary="Add a variant with structured options and opening stock",
)
async def create_variant(
    product_id: UUID,
    data: VariantCreate,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[VariantRead]:
    variant = await VariantService(session, user.tenant_id).create(product_id, data)
    return ok(admin_variant(variant), message="Variant created")


@router.get(
    "/products/{product_id}/variants",
    response_model=ApiResponse[list[VariantRead]],
    summary="List a product's variants",
)
async def list_variants(
    product_id: UUID,
    params: Annotated[PageParams, Query()],
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[list[VariantRead]]:
    variants, total = await VariantService(session, user.tenant_id).list_for_product(
        product_id, params
    )
    return paginated(
        [admin_variant(v) for v in variants],
        total_items=total,
        params=params,
        message="Variants retrieved",
    )


@router.get(
    "/variants/{variant_id}",
    response_model=ApiResponse[VariantRead],
    summary="Retrieve a variant",
)
async def get_variant(
    variant_id: UUID,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[VariantRead]:
    variant = await VariantService(session, user.tenant_id).get(variant_id)
    return ok(admin_variant(variant), message="Variant retrieved")


@router.patch(
    "/variants/{variant_id}",
    response_model=ApiResponse[VariantRead],
    summary="Update a variant",
)
async def update_variant(
    variant_id: UUID,
    data: VariantUpdate,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[VariantRead]:
    variant = await VariantService(session, user.tenant_id).update(variant_id, data)
    return ok(admin_variant(variant), message="Variant updated")


@router.delete(
    "/variants/{variant_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Archive a variant",
)
async def delete_variant(
    variant_id: UUID,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> Response:
    await VariantService(session, user.tenant_id).delete(variant_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/variants/{variant_id}/inventory",
    response_model=ApiResponse[InventoryStatus],
    summary="View stock for a variant",
)
async def get_inventory(
    variant_id: UUID,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[InventoryStatus]:
    item = await InventoryService(session, user.tenant_id).get(variant_id)
    return ok(inventory_status(item), message="Inventory retrieved")


@router.put(
    "/variants/{variant_id}/inventory",
    response_model=ApiResponse[InventoryStatus],
    summary="Set stock to an absolute quantity",
)
async def set_inventory(
    variant_id: UUID,
    data: InventorySet,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[InventoryStatus]:
    item = await InventoryService(session, user.tenant_id).set_available(
        variant_id, data.available_quantity, data.note
    )
    return ok(inventory_status(item), message="Inventory updated")


@router.post(
    "/variants/{variant_id}/inventory/adjust",
    response_model=ApiResponse[InventoryStatus],
    summary="Increase or decrease stock by a delta",
)
async def adjust_inventory(
    variant_id: UUID,
    data: InventoryAdjust,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[InventoryStatus]:
    item = await InventoryService(session, user.tenant_id).adjust(
        variant_id, data.delta, data.reason, data.reference, data.note
    )
    return ok(inventory_status(item), message="Inventory adjusted")


@router.put(
    "/variants/{variant_id}/inventory/threshold",
    response_model=ApiResponse[InventoryStatus],
    summary="Configure the low-stock threshold",
)
async def set_inventory_threshold(
    variant_id: UUID,
    data: InventoryThreshold,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[InventoryStatus]:
    item = await InventoryService(session, user.tenant_id).set_threshold(
        variant_id, data.low_stock_threshold
    )
    return ok(inventory_status(item), message="Threshold updated")


@router.get(
    "/variants/{variant_id}/inventory/movements",
    response_model=ApiResponse[list[InventoryMovementRead]],
    summary="Stock movement history for a variant",
)
async def list_inventory_movements(
    variant_id: UUID,
    params: Annotated[PageParams, Query()],
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[list[InventoryMovementRead]]:
    movements, total = await InventoryService(session, user.tenant_id).movements(
        variant_id, params
    )
    return paginated(
        [InventoryMovementRead.model_validate(m) for m in movements],
        total_items=total,
        params=params,
        message="Movements retrieved",
    )


@router.get(
    "/products/{product_id}/images",
    response_model=ApiResponse[list[ProductImageRead]],
    summary="List product images in sort order",
)
async def list_product_images(
    product_id: UUID,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[list[ProductImageRead]]:
    images = await ProductImageService(session, user.tenant_id).list_for_product(
        product_id
    )
    return ok(
        [ProductImageRead.model_validate(image) for image in images],
        message="Product images retrieved",
    )


@router.post(
    "/products/{product_id}/images",
    response_model=ApiResponse[ProductImageRead],
    status_code=status.HTTP_201_CREATED,
    summary="Add a product image",
)
async def add_product_image(
    product_id: UUID,
    data: ProductImageCreate,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[ProductImageRead]:
    image = await ProductImageService(session, user.tenant_id).add(product_id, data)
    return ok(ProductImageRead.model_validate(image), message="Product image added")


@router.post(
    "/products/{product_id}/images/upload",
    response_model=ApiResponse[ProductImageRead],
    status_code=status.HTTP_201_CREATED,
    summary="Upload a product image file",
)
async def upload_product_image(
    product_id: UUID,
    file: UploadFile = File(description="JPEG, PNG or WebP"),
    alt_text: str | None = Form(default=None),
    sort_order: int = Form(default=0, ge=0),
    is_primary: bool = Form(default=False),
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[ProductImageRead]:
    url = await store_image(
        user.tenant_id,
        file.content_type or "",
        await file.read(get_settings().max_upload_bytes + 1),
    )

    image = await ProductImageService(session, user.tenant_id).add_uploaded(
        product_id,
        url=url,
        alt_text=alt_text,
        sort_order=sort_order,
        is_primary=is_primary,
    )
    return ok(ProductImageRead.model_validate(image), message="Product image uploaded")


@router.put(
    "/products/{product_id}/images/order",
    response_model=ApiResponse[list[ProductImageRead]],
    summary="Reorder product images",
)
async def reorder_product_images(
    product_id: UUID,
    data: ImageReorderPayload,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[list[ProductImageRead]]:
    images = await ProductImageService(session, user.tenant_id).reorder(product_id, data)
    return ok(
        [ProductImageRead.model_validate(image) for image in images],
        message="Product images reordered",
    )


@router.patch(
    "/images/{image_id}",
    response_model=ApiResponse[ProductImageRead],
    summary="Update a product image",
)
async def update_product_image(
    image_id: UUID,
    data: ProductImageUpdate,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[ProductImageRead]:
    image = await ProductImageService(session, user.tenant_id).update(image_id, data)
    return ok(ProductImageRead.model_validate(image), message="Product image updated")


@router.post(
    "/images/{image_id}/primary",
    response_model=ApiResponse[ProductImageRead],
    summary="Make this the product's primary image",
)
async def set_primary_image(
    image_id: UUID,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[ProductImageRead]:
    image = await ProductImageService(session, user.tenant_id).set_primary(image_id)
    return ok(ProductImageRead.model_validate(image), message="Primary image set")


@router.delete(
    "/images/{image_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a product image (never the last one)",
)
async def delete_product_image(
    image_id: UUID,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> Response:
    await ProductImageService(session, user.tenant_id).delete(image_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
