from __future__ import annotations

from uuid import UUID

from fastapi import Request
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit.service import record_activity
from app.auth.constants import STAFF_ROLES, UserRole, UserStatus
from app.auth.phone import normalize_phone
from app.auth.repository import RefreshTokenRepository
from app.auth.schemas import ProfileUpdate
from app.auth.security import hash_password
from app.core.database import conflict_on_integrity_error
from app.core.error_codes import UserErrorCode
from app.core.exceptions import ConflictError, NotFoundError, ValidationError
from app.users.models import User
from app.users.repository import UserRepository
from app.users.schemas import StaffCreate, StaffPasswordReset, StaffQuery, StaffRead, StaffUpdate


class UserService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.users = UserRepository(session)

    async def create(
        self,
        *,
        role: UserRole,
        tenant_id: UUID,
        email: str,
        phone: str,
        password: str,
        name: str | None = None,
    ) -> tuple[User, bool]:
        """Create the tenant's user if absent; returns the user and whether it was created."""
        email = email.strip().lower()
        phone = normalize_phone(phone)

        existing = await self.users.get_by_email(tenant_id=tenant_id, email=email)
        if existing is not None:
            return existing, False

        existing = await self.users.get_by_phone(tenant_id=tenant_id, phone=phone)
        if existing is not None:
            return existing, False

        password_hash = (
            None if role is UserRole.CUSTOMER else await hash_password(password)
        )

        user = await self.users.create(
            tenant_id=tenant_id,
            phone=phone,
            email=email,
            name=name,
            role=role.value,
            password_hash=password_hash,
            is_verified=True,
        )
        await self.session.commit()
        return user, True

    async def update_profile(self, user: User, data: ProfileUpdate) -> User:
        """Change the user's own name and/or email; an email must stay unique per tenant."""
        changes = data.model_dump(exclude_unset=True)

        if "email" in changes and changes["email"] is not None:
            email = str(changes["email"]).strip().lower()
            owner = await self.users.get_by_email(tenant_id=user.tenant_id, email=email)
            if owner is not None and owner.id != user.id:
                raise ConflictError(
                    "That email is already in use", error_code=UserErrorCode.EMAIL_TAKEN
                )
            changes["email"] = email

        for field, value in changes.items():
            setattr(user, field, value)

        async with conflict_on_integrity_error(
            self.session,
            "That email is already in use",
            error_code=UserErrorCode.EMAIL_TAKEN,
        ):
            await self.session.commit()

        return user


class StaffService:
    """Staff and admin logins of the acting admin's store."""

    def __init__(self, session: AsyncSession, actor: User) -> None:
        self.session = session
        self.actor = actor
        self.users = UserRepository(session)

    async def get(self, staff_id: UUID) -> User:
        user = await self.users.get_by_id(tenant_id=self.actor.tenant_id, user_id=staff_id)
        if user is None or user.role not in STAFF_ROLES:
            raise NotFoundError("Staff member not found", error_code=UserErrorCode.NOT_FOUND)
        return user

    async def list(self, params: StaffQuery) -> tuple[list[User], int]:
        stmt = select(User).where(
            User.tenant_id == self.actor.tenant_id, User.role.in_(STAFF_ROLES)
        )
        if params.status:
            stmt = stmt.where(User.status == params.status)
        if params.search:
            term = f"%{params.search.strip()}%"
            stmt = stmt.where(
                User.name.ilike(term) | User.email.ilike(term) | User.phone.ilike(term)
            )
        total = await self.session.scalar(select(func.count()).select_from(stmt.subquery()))
        rows = await self.session.scalars(
            stmt.order_by(User.created_at).offset(params.offset).limit(params.limit)
        )
        return list(rows.all()), int(total or 0)

    async def create(self, data: StaffCreate, request: Request) -> User:
        email = str(data.email).lower()
        if await self.users.get_by_email(tenant_id=self.actor.tenant_id, email=email):
            raise ConflictError(
                "That email is already in use", error_code=UserErrorCode.EMAIL_TAKEN
            )
        if await self.users.get_by_phone(tenant_id=self.actor.tenant_id, phone=data.phone):
            raise ConflictError(
                "That phone number is already in use", error_code=UserErrorCode.PHONE_TAKEN
            )

        async with conflict_on_integrity_error(
            self.session, "That email or phone number is already in use"
        ):
            member = await self.users.create(
                tenant_id=self.actor.tenant_id,
                phone=data.phone,
                email=email,
                name=data.name.strip(),
                role=data.role,
                password_hash=await hash_password(data.password),
                is_verified=True,
            )
            member.permissions = data.permissions if data.role == "STAFF" else None
            await record_activity(
                self.session,
                self.actor,
                "staff.created",
                "staff",
                member.id,
                summary=f"Created {data.role.lower()} {email}",
                changes=data.model_dump(exclude={"password"}),
                request=request,
                commit=False,
            )
            await self.session.commit()
        return member

    async def update(self, staff_id: UUID, data: StaffUpdate, request: Request) -> User:
        member = await self.get(staff_id)
        changes = data.model_dump(exclude_unset=True)

        if member.id == self.actor.id and (
            changes.get("status") == UserStatus.INACTIVE.value
            or changes.get("role") == UserRole.STAFF.value
        ):
            raise ValidationError(
                "You cannot deactivate or demote your own account",
                error_code=UserErrorCode.CANNOT_CHANGE_SELF,
            )

        before = StaffRead.of(member).model_dump(include={"name", "role", "permissions", "status"})
        for field, value in changes.items():
            setattr(member, field, value.strip() if field == "name" and value else value)
        if member.role == UserRole.ADMIN.value:
            member.permissions = None

        if changes.get("status") == UserStatus.INACTIVE.value:
            await RefreshTokenRepository(self.session).revoke_all_for_user(member.id)

        await record_activity(
            self.session,
            self.actor,
            "staff.updated",
            "staff",
            member.id,
            summary=f"Updated {member.email or member.phone}",
            changes={"before": before, "after": changes},
            request=request,
            commit=False,
        )
        await self.session.commit()
        return member

    async def reset_password(
        self, staff_id: UUID, data: StaffPasswordReset, request: Request
    ) -> User:
        member = await self.get(staff_id)
        member.password_hash = await hash_password(data.password)
        await RefreshTokenRepository(self.session).revoke_all_for_user(member.id)
        await record_activity(
            self.session,
            self.actor,
            "staff.password_reset",
            "staff",
            member.id,
            summary=f"Reset password for {member.email or member.phone}",
            request=request,
            commit=False,
        )
        await self.session.commit()
        return member

