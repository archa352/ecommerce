from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalogue.constants import (
    DEFAULT_RELATED_LIMIT,
    MAX_RELATED_LIMIT,
    CatalogueStatus,
)
from app.catalogue.schemas import (
    CategoryQuery,
    CategoryStorefrontRead,
    FilterOptionsQuery,
    FilterOptionsRead,
    ProductStorefrontRead,
    ProductSummaryStorefrontRead,
    RelatedProductsStorefrontRead,
    StorefrontProductQuery,
    VariantStorefrontRead,
)
from app.catalogue.serializers import (
    filter_options_read,
    storefront_product,
    storefront_summary,
    storefront_variant,
)
from app.catalogue.service import CategoryService, ProductService, VariantService
from app.core.database import get_db
from app.core.error_codes import ProductErrorCode
from app.core.exceptions import NotFoundError
from app.core.pagination import PageParams
from app.core.responses import ApiResponse, ok, paginated
from app.tenants.resolver import CurrentTenant

router = APIRouter(prefix="/storefront", tags=["Storefront-Catalogue"])


@router.get(
    "/categories",
    response_model=ApiResponse[list[CategoryStorefrontRead]],
    summary="List public categories",
)
async def list_categories(
    tenant: CurrentTenant,
    params: Annotated[CategoryQuery, Query()],
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[list[CategoryStorefrontRead]]:
    categories, total = await CategoryService(session, tenant.id).list(
        params,
        active_only=True,
        parent_id=params.parent_id,
        top_level=params.top_level,
    )
    return paginated(
        [CategoryStorefrontRead.model_validate(c) for c in categories],
        total_items=total,
        params=params,
        message="Categories retrieved",
    )


@router.get(
    "/categories/{category_id}",
    response_model=ApiResponse[CategoryStorefrontRead],
    summary="Get public category",
)
async def get_category(
    category_id: UUID,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[CategoryStorefrontRead]:
    category = await CategoryService(session, tenant.id).get_public(category_id)
    return ok(
        CategoryStorefrontRead.model_validate(category), message="Category retrieved"
    )


@router.get(
    "/products",
    response_model=ApiResponse[list[ProductSummaryStorefrontRead]],
    summary="List, search, filter and sort public products",
)
async def list_products(
    tenant: CurrentTenant,
    params: Annotated[StorefrontProductQuery, Query()],
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[list[ProductSummaryStorefrontRead]]:
    products, total = await ProductService(session, tenant.id).list(
        params,
        category_id=params.category_id,
        search=params.search,
        brand=params.brand,
        fabric=params.fabric,
        occasion=params.occasion,
        sleeve=params.sleeve,
        neckline=params.neckline,
        featured=params.featured,
        min_price=params.min_price,
        max_price=params.max_price,
        sort=params.sort,
        active_only=True,
    )
    return paginated(
        [storefront_summary(product) for product in products],
        total_items=total,
        params=params,
        message="Products retrieved",
    )


@router.get(
    "/filter-options",
    response_model=ApiResponse[FilterOptionsRead],
    summary="Fabric, occasion, sleeve and neckline values for filter dropdowns",
)
async def filter_options(
    tenant: CurrentTenant,
    params: Annotated[FilterOptionsQuery, Query()],
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[FilterOptionsRead]:
    options = await ProductService(session, tenant.id).filter_options(
        active_only=True, category_id=params.category_id
    )
    return ok(filter_options_read(options), message="Filter options retrieved")


@router.get(
    "/products/{product_id}/related",
    response_model=ApiResponse[RelatedProductsStorefrontRead],
    summary="'You may also like' and 'customers also bought' for a product",
)
async def related_products(
    product_id: UUID,
    tenant: CurrentTenant,
    limit: int = Query(default=DEFAULT_RELATED_LIMIT, ge=1, le=MAX_RELATED_LIMIT),
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[RelatedProductsStorefrontRead]:
    liked, bought = await ProductService(session, tenant.id).related_for_storefront(
        product_id, limit=limit
    )
    return ok(
        RelatedProductsStorefrontRead(
            you_may_also_like=[storefront_summary(p) for p in liked],
            customers_also_bought=[storefront_summary(p) for p in bought],
        ),
        message="Related products retrieved",
    )


@router.get(
    "/products/by-slug/{slug}",
    response_model=ApiResponse[ProductStorefrontRead],
    summary="Get a public product by its URL slug",
)
async def get_product_by_slug(
    slug: str,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[ProductStorefrontRead]:
    products = ProductService(session, tenant.id)
    product = await products.get_public_by_slug(slug)
    category = await products.categories.get(product.category_id)
    return ok(storefront_product(product, category), message="Product retrieved")


@router.get(
    "/products/{product_id}",
    response_model=ApiResponse[ProductStorefrontRead],
    summary="Get public product with images, options and variants",
)
async def get_product(
    product_id: UUID,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[ProductStorefrontRead]:
    products = ProductService(session, tenant.id)
    product = await products.get_public(product_id)
    category = await products.categories.get(product.category_id)

    return ok(storefront_product(product, category), message="Product retrieved")


@router.get(
    "/products/{product_id}/variants",
    response_model=ApiResponse[list[VariantStorefrontRead]],
    summary="List public product variants",
)
async def list_variants(
    product_id: UUID,
    tenant: CurrentTenant,
    params: Annotated[PageParams, Query()],
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[list[VariantStorefrontRead]]:
    await ProductService(session, tenant.id).get_public(product_id)

    variants, total = await VariantService(session, tenant.id).list_for_product(
        product_id, params, active_only=True
    )
    return paginated(
        [storefront_variant(variant) for variant in variants],
        total_items=total,
        params=params,
        message="Variants retrieved",
    )


@router.get(
    "/variants/{variant_id}",
    response_model=ApiResponse[VariantStorefrontRead],
    summary="Get public variant",
)
async def get_variant(
    variant_id: UUID,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[VariantStorefrontRead]:
    variant = await VariantService(session, tenant.id).get(variant_id)

    if variant.status != CatalogueStatus.ACTIVE.value:
        raise NotFoundError("Variant not found", error_code=ProductErrorCode.VARIANT_NOT_FOUND)

    await ProductService(session, tenant.id).get_public(variant.product_id)

    return ok(storefront_variant(variant), message="Variant retrieved")
