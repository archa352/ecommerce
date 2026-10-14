"""How a review request reaches the customer.

No email/SMS/WhatsApp provider is wired into this backend yet, so the default
notifier is a no-op placeholder. Plug a real channel in by implementing
`ReviewRequestNotifier` and passing it to `ReviewRequestService.dispatch_due`.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


@dataclass
class ReviewRequestMessage:
    tenant_id: str
    order_number: str
    customer_name: str | None
    email: str | None
    phone: str
    products: list[str]


class ReviewRequestNotifier(Protocol):
    async def send(self, message: ReviewRequestMessage) -> None: ...


class NullReviewNotifier:
    """Placeholder until a real delivery channel is configured."""

    async def send(self, message: ReviewRequestMessage) -> None:
        pass
