"""Customers editing their own profile."""

from __future__ import annotations

from tests.account.conftest import ME


async def test_a_customer_changes_name_and_email(client, shopper_auth):
    response = await client.patch(
        ME, json={"name": "New Name", "email": "New@Zeen.com"}, headers=shopper_auth
    )

    body = response.json()["data"]
    assert response.status_code == 200
    assert body["name"] == "New Name"
    assert body["email"] == "new@zeen.com"
    again = await client.get(ME, headers=shopper_auth)
    assert again.json()["data"]["name"] == "New Name"


async def test_an_email_in_use_by_someone_else_is_refused(client, shopper_auth, make_user, tenant):
    await make_user(tenant=tenant, phone="+919812340088", email="taken@zeen.com")

    response = await client.patch(ME, json={"email": "taken@zeen.com"}, headers=shopper_auth)

    assert response.status_code == 409


async def test_keeping_your_own_email_is_fine(client, shopper_auth):
    response = await client.patch(ME, json={"email": "erase@zeen.com"}, headers=shopper_auth)

    assert response.status_code == 200


async def test_the_phone_cannot_be_changed_here(client, shopper_auth):
    response = await client.patch(ME, json={"phone": "+919999999999"}, headers=shopper_auth)

    assert response.status_code == 422


async def test_an_empty_update_is_rejected(client, shopper_auth):
    response = await client.patch(ME, json={}, headers=shopper_auth)

    assert response.status_code == 422


async def test_an_invalid_email_is_rejected(client, shopper_auth):
    response = await client.patch(ME, json={"email": "not-an-email"}, headers=shopper_auth)

    assert response.status_code == 422


async def test_profile_editing_needs_authentication(client, tenant):
    response = await client.patch(ME, json={"name": "Nobody"})

    assert response.status_code == 401
