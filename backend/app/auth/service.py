from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi import Request
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.constants import UserRole
from app.auth.phone import normalize_phone
from app.auth.repository import RefreshTokenRepository
from app.auth.schemas import TokenPair
from app.auth.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_refresh_token,
    spend_dummy_verification,
    verify_password,
)
from app.auth.widget import verify_access_token
from app.core.config import get_settings
from app.core.exceptions import AuthenticationError
from app.core.logging import get_logger
from app.tenants.models import Tenant
from app.users.models import User
from app.users.repository import UserRepository

logger = get_logger("auth")

INVALID_CREDENTIALS = "Invalid credentials"
INVALID_TOKEN = "Invalid authentication token"


class AuthService:
    def __init__(self, session: AsyncSession, tenant: Tenant) -> None:
        self.session = session
        self.tenant = tenant
        self.users = UserRepository(session)
        self.tokens = RefreshTokenRepository(session)

    async def login_with_widget(self, access_token: str) -> TokenPair:
        """
        Sign a customer in from a MSG91-verified widget token.

        This is registration as well as sign-in: a verified number with no
        account gets one created here, which is what lets the storefront offer
        a single "continue with mobile number" rather than asking someone
        whether they are new.

        The phone is whatever MSG91 attests to, never what the browser sent,
        so a forged or replayed token cannot name an account of its choosing.
        """
        phone = await verify_access_token(access_token)

        user = await self.users.get_by_phone(tenant_id=self.tenant.id, phone=phone)

        if user is None:
            user = await self._create_customer(phone)
            logger.info("auth.customer_created user_id=%s tenant_id=%s", user.id, self.tenant.id)
        elif not user.is_active or user.role != UserRole.CUSTOMER.value:
            # Staff and admins hold passwords and sign in through their own
            # routes; letting them in here would sidestep that.
            logger.info("auth.login_rejected user_id=%s tenant_id=%s", user.id, self.tenant.id)
            raise AuthenticationError(INVALID_CREDENTIALS)

        # MSG91 confirmed possession of the number, which is the whole of what
        # verification means for a customer.
        user.is_verified = True
        tokens = await self._issue_tokens(user)
        await self.session.commit()

        logger.info(
            "auth.login user_id=%s tenant_id=%s role=%s", user.id, self.tenant.id, user.role
        )
        return tokens

    async def admin_login(
        self, identifier: str, password: str, *, request: Request | None = None
    ) -> TokenPair:
        user = await self._audited_login(identifier, password, UserRole.ADMIN, request)

        user.is_verified = True
        tokens = await self._issue_tokens(user)
        await self.session.commit()

        logger.info(
            "auth.login user_id=%s tenant_id=%s role=%s",
            user.id,
            self.tenant.id,
            user.role,
        )
        return tokens

    async def staff_login(
        self, identifier: str, password: str, *, request: Request | None = None
    ) -> TokenPair:
        user = await self._audited_login(identifier, password, UserRole.STAFF, request)

        user.is_verified = True
        tokens = await self._issue_tokens(user)
        await self.session.commit()

        logger.info(
            "auth.login user_id=%s tenant_id=%s role=%s",
            user.id,
            self.tenant.id,
            user.role,
        )
        return tokens

    async def refresh_tokens(self, refresh_token: str) -> TokenPair:
        payload = decode_token(refresh_token, expected_type="refresh")
        if payload.tenant_id != str(self.tenant.id):
            raise AuthenticationError(INVALID_TOKEN)

        stored = await self.tokens.get_by_hash(
            tenant_id=self.tenant.id,
            token_hash=hash_refresh_token(refresh_token),
        )
        if stored is None or str(stored.user_id) != payload.user_id:
            raise AuthenticationError(INVALID_TOKEN)

        now = datetime.now(timezone.utc)
        grace = timedelta(seconds=get_settings().refresh_reuse_grace_seconds)
        rotated_moments_ago = (
            stored.replaced_at is not None and now - stored.replaced_at <= grace
        )

        if stored.revoked_at is not None and not rotated_moments_ago:
            revoked = await self.tokens.revoke_all_for_user(stored.user_id)
            await self.session.commit()
            logger.warning(
                "auth.refresh_reuse_detected user_id=%s tenant_id=%s sessions_revoked=%s",
                stored.user_id,
                self.tenant.id,
                revoked,
            )
            raise AuthenticationError(INVALID_TOKEN)

        if stored.expires_at <= now:
            raise AuthenticationError(INVALID_TOKEN)

        user = await self.users.get_by_id(tenant_id=self.tenant.id, user_id=stored.user_id)
        if user is None or not user.is_active:
            logger.info(
                "auth.refresh_rejected user_id=%s tenant_id=%s",
                stored.user_id,
                self.tenant.id,
            )
            raise AuthenticationError(INVALID_TOKEN)

        if stored.revoked_at is None:
            stored.replaced_at = now
            await self.tokens.revoke(stored)
        else:
            logger.info(
                "auth.refresh_grace_reuse user_id=%s tenant_id=%s", user.id, self.tenant.id
            )
        tokens = await self._issue_tokens(user)
        await self.session.commit()

        logger.info("auth.refreshed user_id=%s tenant_id=%s", user.id, self.tenant.id)
        return tokens

    async def logout(self, refresh_token: str) -> None:
        stored = await self.tokens.get_by_hash(
            tenant_id=self.tenant.id,
            token_hash=hash_refresh_token(refresh_token),
        )
        if stored is not None and stored.revoked_at is None:
            await self.tokens.revoke(stored)
            logger.info("auth.logout user_id=%s tenant_id=%s", stored.user_id, self.tenant.id)

        await self.session.commit()

    async def _audited_login(
        self, identifier: str, password: str, role: UserRole, request: Request | None
    ) -> User:
        """Record admin/staff login outcomes without persisting submitted credentials."""
        from app.audit.service import record_login

        roles = frozenset({role.value})
        try:
            user = await self._verify_password_user(identifier, password, roles=roles)
        except AuthenticationError:
            known = await self._find_user(identifier, roles=roles)
            await record_login(
                self.session,
                self.tenant.id,
                user=known,
                portal=role.value.lower(),
                success=False,
                request=request,
            )
            await self.session.commit()
            raise

        await record_login(
            self.session,
            self.tenant.id,
            user=user,
            portal=role.value.lower(),
            success=True,
            request=request,
        )
        return user

    async def _verify_password_user(
        self, identifier: str, password: str, *, roles: frozenset[str]
    ) -> User:
        user = await self._find_user(identifier, roles=roles)

        if user is None or user.password_hash is None or not user.is_active:
            await spend_dummy_verification()
            raise AuthenticationError(INVALID_CREDENTIALS)

        if not await verify_password(password, user.password_hash):
            logger.info("auth.login_failed user_id=%s tenant_id=%s", user.id, self.tenant.id)
            raise AuthenticationError(INVALID_CREDENTIALS)

        return user

    async def _find_user(self, identifier: str, *, roles: frozenset[str]) -> User | None:
        value = identifier.strip()

        if "@" in value:
            user = await self.users.get_by_email(tenant_id=self.tenant.id, email=value.lower())
        else:
            try:
                phone = normalize_phone(value)
            except ValueError:
                return None
            user = await self.users.get_by_phone(tenant_id=self.tenant.id, phone=phone)

        return user if user is not None and user.role in roles else None

    async def _create_customer(self, phone: str) -> User:
        try:
            return await self.users.create(
                tenant_id=self.tenant.id,
                phone=phone,
                role=UserRole.CUSTOMER.value,
                is_verified=True,
            )
        except IntegrityError as exc:
            await self.session.rollback()
            raise AuthenticationError(INVALID_CREDENTIALS) from exc

    async def _issue_tokens(self, user: User) -> TokenPair:
        settings = get_settings()

        access_token = create_access_token(
            user_id=user.id, tenant_id=user.tenant_id, role=user.role
        )
        refresh_token = create_refresh_token(user_id=user.id, tenant_id=user.tenant_id)

        await self.tokens.add(
            user_id=user.id,
            tenant_id=user.tenant_id,
            token_hash=hash_refresh_token(refresh_token),
            expires_at=datetime.now(timezone.utc)
            + timedelta(days=settings.refresh_token_expire_days),
        )

        return TokenPair(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.access_token_expire_minutes * 60,
        )
