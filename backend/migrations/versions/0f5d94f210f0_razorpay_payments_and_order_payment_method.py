"""razorpay payments and order payment method

Orders record how the shopper chose to pay. Payments may now be RAZORPAY as
well as COD, and carry the Razorpay order id Checkout opens against and the
payment id Razorpay confirmed. Existing orders were all cash on delivery.

Revision ID: 0f5d94f210f0
Revises: 27f827e24c4a
Create Date: 2026-10-15 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '0f5d94f210f0'
down_revision: Union[str, Sequence[str], None] = '27f827e24c4a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'orders',
        sa.Column(
            'payment_method',
            sa.String(length=20),
            server_default='CASH_ON_DELIVERY',
            nullable=False,
        ),
    )
    op.create_check_constraint(
        'payment_method_valid',
        'orders',
        "payment_method IN ('UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', "
        "'CASH_ON_DELIVERY')",
    )

    op.add_column('payments', sa.Column('razorpay_order_id', sa.String(length=64), nullable=True))
    op.add_column('payments', sa.Column('razorpay_payment_id', sa.String(length=64), nullable=True))
    op.create_unique_constraint(
        op.f('uq_payments_razorpay_order_id'), 'payments', ['razorpay_order_id']
    )

    op.drop_constraint(op.f('ck_payments_provider_valid'), 'payments', type_='check')
    op.create_check_constraint('provider_valid', 'payments', "provider IN ('COD', 'RAZORPAY')")


def downgrade() -> None:
    """Downgrade schema; fails while any RAZORPAY payment or online order exists."""
    op.drop_constraint(op.f('ck_payments_provider_valid'), 'payments', type_='check')
    op.create_check_constraint('provider_valid', 'payments', "provider IN ('COD')")

    op.drop_constraint(op.f('uq_payments_razorpay_order_id'), 'payments', type_='unique')
    op.drop_column('payments', 'razorpay_payment_id')
    op.drop_column('payments', 'razorpay_order_id')

    op.create_check_constraint(
        'payment_method_is_cash', 'orders', "payment_method = 'CASH_ON_DELIVERY'"
    )
    op.drop_constraint(op.f('ck_orders_payment_method_is_cash'), 'orders', type_='check')
    op.drop_constraint(op.f('ck_orders_payment_method_valid'), 'orders', type_='check')
    op.drop_column('orders', 'payment_method')
