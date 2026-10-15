from __future__ import annotations

from uuid import UUID

from sqlalchemy import Select

from app.core.repository import TenantScopedRepository
from app.orders.constants import OrderStatus, PaymentStatus
from app.orders.models import Order, OrderItem


def _escape_like(term: str) -> str:
    """Neutralise LIKE wildcards so a search term cannot widen its own match."""
    return term.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


class OrderRepository(TenantScopedRepository[Order]):
    model = Order

    async def get_by_idempotency_key(self, customer_id: UUID, key: str) -> Order | None:
        return await self.find_one(
            Order.customer_id == customer_id, Order.idempotency_key == key
        )

    def list_select(
        self,
        *,
        customer_id: UUID | None = None,
        order_number: str | None = None,
        status: OrderStatus | None = None,
        payment_status: PaymentStatus | None = None,
    ) -> Select[tuple[Order]]:
        stmt = self.base_select()

        if customer_id is not None:
            stmt = stmt.where(Order.customer_id == customer_id)

        if order_number:
            pattern = f"%{_escape_like(order_number.strip())}%"
            stmt = stmt.where(Order.order_number.ilike(pattern, escape="\\"))

        if status is not None:
            stmt = stmt.where(Order.status == status.value)

        if payment_status is not None:
            stmt = stmt.where(Order.payment_status == payment_status.value)

        return stmt.order_by(Order.created_at.desc())

    async def get_for_update(
        self, order_id: UUID, customer_id: UUID | None = None
    ) -> Order | None:
        """Lock the order row; every change to an order or its payment takes this lock first."""
        stmt = self.base_select().where(Order.id == order_id)
        if customer_id is not None:
            stmt = stmt.where(Order.customer_id == customer_id)
        return await self.session.scalar(
            stmt.with_for_update().execution_options(populate_existing=True)
        )

    async def get_for_customer(self, customer_id: UUID, order_id: UUID) -> Order | None:
        """Fetch an order scoped to the customer as well as the tenant."""
        return await self.find_one(
            Order.id == order_id, Order.customer_id == customer_id
        )


class OrderItemRepository(TenantScopedRepository[OrderItem]):
    model = OrderItem
