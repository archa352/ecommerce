"""Fixtures for the payment tests."""

from __future__ import annotations

import pytest
import pytest_asyncio

from tests.catalogue.factories import PRODUCTS, make_category, make_product
from tests.conftest import headers_for
from tests.helpers import load_data, sample

DATA = load_data(__file__)

PAYMENTS = DATA["routes"]["payments"]
ADMIN_PAYMENTS = DATA["routes"]["admin_payments"]
ADMIN_ORDERS = DATA["routes"]["admin_orders"]
ADDRESSES = DATA["routes"]["addresses"]
CHECKOUT = DATA["routes"]["checkout"]
CART = DATA["routes"]["cart"]
ORDERS = DATA["routes"]["orders"]

CUSTOMERS = DATA["customers"]


@pytest_asyncio.fixture(loop_scope="session")
async def customer(make_user, tenant):
    return await make_user(tenant=tenant, phone=CUSTOMERS["payer"])


@pytest.fixture
def customer_auth(customer) -> dict[str, str]:
    return headers_for(customer)


@pytest_asyncio.fixture(loop_scope="session")
async def variant(client, admin_headers) -> dict:
    """An ACTIVE variant priced at 999.00 with 10 in stock."""
    category = await make_category(client, admin_headers, name="Payment Test Category")
    product = await make_product(
        client, admin_headers, category["id"], name="Kurta", status="ACTIVE"
    )

    payload = sample(DATA, "variant")
    response = await client.post(
        f"{PRODUCTS}/{product['id']}/variants", json=payload, headers=admin_headers
    )
    assert response.status_code == 201, response.text
    return response.json()["data"]


@pytest_asyncio.fixture(loop_scope="session")
async def make_order(client):
    """Factory: `await make_order(headers, variant_id, quantity=2)` -> order."""

    async def _make(
        headers,
        variant_id,
        quantity: int = 2,
        payment_method: str | None = None,
        idempotency_key: str | None = None,
    ) -> dict:
        added = await client.post(
            f"{CART}/items",
            json={"variant_id": variant_id, "quantity": quantity},
            headers=headers,
        )
        assert added.status_code == 201, added.text

        saved = await client.post(
            ADDRESSES, json=sample(DATA, "address"), headers=headers
        )
        assert saved.status_code == 201, saved.text

        payload = {"address_id": saved.json()["data"]["id"]}
        if payment_method is not None:
            payload["payment_method"] = payment_method
        request_headers = dict(headers)
        if idempotency_key is not None:
            request_headers["Idempotency-Key"] = idempotency_key
        placed = await client.post(CHECKOUT, json=payload, headers=request_headers)
        assert placed.status_code == 201, placed.text
        return placed.json()["data"]

    return _make


@pytest_asyncio.fixture(loop_scope="session")
async def order(make_order, customer_auth, variant) -> dict:
    """A placed order: 2 x 999.00 = 1998.00, PENDING and unpaid."""
    return await make_order(customer_auth, variant["id"], 2)


@pytest_asyncio.fixture(loop_scope="session")
async def payment(order) -> dict:
    """The COD payment checkout wrote for `order`: PENDING."""
    assert order["payment"] is not None, order
    return order["payment"]
