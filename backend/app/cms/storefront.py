"""Public CMS content for the Zeen storefront. Only live content is served."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.catalogue.serializers import storefront_summary
from app.cms.constants import MenuLocation
from app.cms.schemas import (
    BannerItem,
    NavigationRead,
    StorefrontBlogPost,
    StorefrontBlogQuery,
    StorefrontBlogSummary,
    StorefrontFaq,
    StorefrontFaqCategory,
    StorefrontPage,
    StorefrontSection,
    StorefrontSite,
)
from app.cms.serializers import (
    navigation_tree,
    storefront_page,
    storefront_post,
    storefront_post_summary,
)
from app.cms.service import CmsService
from app.core.database import get_db
from app.core.responses import ApiResponse, ok, paginated
from app.tenants.resolver import CurrentTenant

router = APIRouter(prefix="/storefront/cms", tags=["Storefront-CMS"])


@router.get("/site", response_model=ApiResponse[StorefrontSite], summary="Logo, contact, socials")
async def site_settings(
    tenant: CurrentTenant, session: AsyncSession = Depends(get_db)
) -> ApiResponse[StorefrontSite]:
    site = await CmsService(session, tenant.id).get_site()
    if site is None:
        return ok(StorefrontSite(), message="Site settings")
    values = {field: getattr(site, field) for field in StorefrontSite.model_fields}
    values["social_links"] = site.social_links or {}
    return ok(StorefrontSite(**values), message="Site settings")


@router.get(
    "/home",
    response_model=ApiResponse[list[StorefrontSection]],
    summary="Live homepage sections in display order, with their products",
)
async def homepage(
    tenant: CurrentTenant, session: AsyncSession = Depends(get_db)
) -> ApiResponse[list[StorefrontSection]]:
    service = CmsService(session, tenant.id)
    sections = []
    for section in await service.live_sections():
        settings = section.settings or {}
        sections.append(
            StorefrontSection(
                id=section.id,
                section_type=section.section_type,
                title=section.title,
                subtitle=section.subtitle,
                position=section.position,
                ends_at=section.ends_at,
                countdown_ends_at=settings.get("countdown_ends_at"),
                items=[BannerItem(**item) for item in section.items or []],
                products=[storefront_summary(p) for p in await service.section_products(section)],
            )
        )
    return ok(sections, message="Homepage")


@router.get("/pages/{slug}", response_model=ApiResponse[StorefrontPage], summary="A published page")
async def page(
    slug: str, tenant: CurrentTenant, session: AsyncSession = Depends(get_db)
) -> ApiResponse[StorefrontPage]:
    return ok(storefront_page(await CmsService(session, tenant.id).live_page(slug)), message="Page")


@router.get(
    "/faqs",
    response_model=ApiResponse[list[StorefrontFaqCategory]],
    summary="Published FAQs grouped by category",
)
async def faqs(
    tenant: CurrentTenant, session: AsyncSession = Depends(get_db)
) -> ApiResponse[list[StorefrontFaqCategory]]:
    groups = await CmsService(session, tenant.id).live_faqs()
    return ok(
        [
            StorefrontFaqCategory(
                id=category.id,
                name=category.name,
                faqs=[StorefrontFaq(id=f.id, question=f.question, answer=f.answer) for f in items],
            )
            for category, items in groups
        ],
        message="FAQs",
    )


@router.get(
    "/navigation",
    response_model=ApiResponse[list[NavigationRead]],
    summary="A menu's active items as a tree",
)
async def navigation(
    tenant: CurrentTenant,
    menu: MenuLocation = Query(default=MenuLocation.HEADER),
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[list[NavigationRead]]:
    items = await CmsService(session, tenant.id).list_navigation(menu.value)
    return ok(navigation_tree(items, active_only=True), message="Navigation")


@router.get(
    "/blog", response_model=ApiResponse[list[StorefrontBlogSummary]], summary="Published articles"
)
async def blog(
    tenant: CurrentTenant,
    params: Annotated[StorefrontBlogQuery, Query()],
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[list[StorefrontBlogSummary]]:
    rows, total = await CmsService(session, tenant.id).live_posts(
        params, params.tag, params.category
    )
    return paginated(
        [storefront_post_summary(p) for p in rows],
        total_items=total,
        params=params,
        message="Articles",
    )


@router.get(
    "/blog/{slug}", response_model=ApiResponse[StorefrontBlogPost], summary="A published article"
)
async def blog_post(
    slug: str, tenant: CurrentTenant, session: AsyncSession = Depends(get_db)
) -> ApiResponse[StorefrontBlogPost]:
    post = await CmsService(session, tenant.id).live_post(slug)
    return ok(storefront_post(post), message="Article")
