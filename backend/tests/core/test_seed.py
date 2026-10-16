"""Production bootstrap provisions only the tenant and its admin; demo data stays in dev."""

from __future__ import annotations

import pytest
from sqlalchemy import select

from app.auth.constants import UserRole
from app.commands import seed as seed_command
from app.commands.bootstrap import PRODUCTION_MIN_ADMIN_PASSWORD_LENGTH, bootstrap_tenant
from app.core.config import get_settings
from app.tenants.models import Tenant, TenantDomain
from app.users.models import User

BOOTSTRAP = {
    "seed_tenant_name": "Bootstrap Store",
    "seed_tenant_slug": "bootstrap-store",
    "seed_tenant_domain": "bootstrap.test",
    "seed_admin_phone": "+919800001111",
    "seed_admin_email": "Owner@Bootstrap.test",
    "seed_admin_password": "x" * PRODUCTION_MIN_ADMIN_PASSWORD_LENGTH,
}


def _settings(environment: str, **overrides):
    return get_settings().model_copy(
        update={"environment": environment, **BOOTSTRAP, **overrides}
    )


async def test_production_bootstrap_creates_the_admin_and_no_demo_accounts(session):
    tenant = await bootstrap_tenant(session, _settings("production"))

    users = (await session.scalars(select(User).where(User.tenant_id == tenant.id))).all()
    assert [(user.email, user.role) for user in users] == [
        ("owner@bootstrap.test", UserRole.ADMIN.value)
    ]
    domain = await session.scalar(select(TenantDomain.domain))
    assert domain == "bootstrap.test"


async def test_bootstrap_is_safe_to_run_twice(session):
    settings = _settings("production")

    first = await bootstrap_tenant(session, settings)
    second = await bootstrap_tenant(session, settings)

    assert first.id == second.id
    assert len((await session.scalars(select(Tenant))).all()) == 1
    assert len((await session.scalars(select(User))).all()) == 1


async def test_production_bootstrap_refuses_a_short_admin_password(session):
    weak = _settings(
        "production", seed_admin_password="x" * (PRODUCTION_MIN_ADMIN_PASSWORD_LENGTH - 1)
    )

    with pytest.raises(RuntimeError, match="at least"):
        await bootstrap_tenant(session, weak)

    assert (await session.scalars(select(Tenant))).all() == []


async def test_production_never_seeds_demo_data(session, monkeypatch):
    monkeypatch.setattr(get_settings(), "environment", "production")
    tenant = await bootstrap_tenant(session, _settings("production"))

    with pytest.raises(RuntimeError, match="never seeded in production"):
        await seed_command.seed_demo(session, tenant)
    with pytest.raises(RuntimeError, match="never seeded in production"):
        await seed_command.seed()

    staff = await session.scalars(select(User).where(User.role == UserRole.STAFF.value))
    assert staff.all() == []
