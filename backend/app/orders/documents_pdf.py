"""Packing slip and shipping label PDFs, laid out from the stored order.

Neither document shows prices or tax -- they go to the packing table and on
the parcel. A courier's own label (AWB barcode) needs a courier integration;
this label is the store's address label for the box.
"""

from __future__ import annotations

import io
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, A6
from reportlab.lib.units import mm
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from app.orders.invoice_pdf import (
    _BODY,
    _BOLD,
    _CELL,
    _CELL_BOLD,
    _CELL_RIGHT,
    _GRID,
    _SHADE,
    _TITLE,
)
from app.orders.models import Order
from app.pricing.models import GstSettings


def _address(order: Order) -> str:
    parts = [
        order.delivery_name,
        order.delivery_address_line_1,
        order.delivery_address_line_2,
        f"{order.delivery_city}, {order.delivery_state} {order.delivery_postal_code}",
        order.delivery_country,
        f"Phone: {order.delivery_phone}",
    ]
    return "<br/>".join(escape(p) for p in parts if p)


def _sender(store_name: str, seller: GstSettings | None) -> str:
    parts = [store_name]
    if seller is not None:
        parts += [seller.legal_name if seller.legal_name != store_name else None, seller.address]
    return "<br/>".join(escape(p) for p in parts if p)


def render_packing_slip(order: Order, *, store_name: str, seller: GstSettings | None) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=14 * mm,
        rightMargin=14 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title=f"Packing slip {order.order_number}",
        author=store_name,
    )
    width = doc.width
    story = [Paragraph("PACKING SLIP", _TITLE)]

    meta = Table(
        [
            [
                Paragraph("<b>From</b><br/>" + _sender(store_name, seller), _BODY),
                Paragraph("<b>Ship to</b><br/>" + _address(order), _BODY),
            ],
        ],
        colWidths=[width / 2, width / 2],
    )
    meta.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.5, _GRID),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, _GRID),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    story += [
        Paragraph(
            f"<b>Order</b> {escape(order.order_number)} &nbsp;&nbsp; "
            f"<b>Date</b> {order.created_at:%d %b %Y} &nbsp;&nbsp; "
            f"<b>Payment</b> {escape(order.payment_method)}"
            + (
                f" &nbsp;&nbsp; <b>Courier</b> {escape(order.courier_name)}"
                if order.courier_name
                else ""
            )
            + (
                f" &nbsp;&nbsp; <b>Tracking</b> {escape(order.tracking_number)}"
                if order.tracking_number
                else ""
            ),
            _BODY,
        ),
        Spacer(1, 3 * mm),
        meta,
        Spacer(1, 4 * mm),
    ]

    rows = [[Paragraph(h, _CELL_BOLD) for h in ("#", "Item", "SKU", "Qty", "Packed")]]
    for index, item in enumerate(order.items, start=1):
        rows.append(
            [
                Paragraph(str(index), _CELL),
                Paragraph(escape(f"{item.product_name} - {item.variant_name}"), _CELL),
                Paragraph(escape(item.sku), _CELL),
                Paragraph(str(item.quantity), _CELL_RIGHT),
                Paragraph("&#9744;", _CELL),
            ]
        )
    units = sum(item.quantity for item in order.items)
    rows.append(
        [
            "",
            Paragraph("<b>Total units</b>", _CELL),
            "",
            Paragraph(f"<b>{units}</b>", _CELL_RIGHT),
            "",
        ]
    )
    widths = [8 * mm, width - 78 * mm, 40 * mm, 15 * mm, 15 * mm]
    table = Table(rows, colWidths=widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), _SHADE),
                ("BOX", (0, 0), (-1, -1), 0.5, _GRID),
                ("INNERGRID", (0, 0), (-1, -1), 0.25, _GRID),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    story.append(table)
    doc.build(story)
    return buffer.getvalue()


def _label_box(order: Order, width: float, *, store_name: str, seller: GstSettings | None):
    """One parcel label: ship-to, order number, COD amount, courier, sender."""
    cod_due = sum(
        (p.amount for p in order.payments if p.provider == "COD" and p.status == "PENDING"), 0
    )
    lines = [
        Paragraph(f"<b>SHIP TO</b><br/>{_address(order)}", _BODY),
        Spacer(1, 3 * mm),
        Paragraph(f"<b>Order:</b> {escape(order.order_number)}", _BOLD),
        Paragraph(
            f"<b>{'COD - collect' if cod_due else 'PREPAID'}</b>"
            + (f" {cod_due:,.2f}" if cod_due else ""),
            _BOLD,
        ),
    ]
    if order.courier_name or order.tracking_number:
        lines.append(
            Paragraph(
                escape(" ".join(p for p in (order.courier_name, order.tracking_number) if p)),
                _BODY,
            )
        )
    lines += [Spacer(1, 3 * mm), Paragraph(f"<b>FROM</b><br/>{_sender(store_name, seller)}", _BODY)]
    box = Table([[lines]], colWidths=[width])
    box.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 1, colors.black)]))
    return box


def _label_doc(buffer: io.BytesIO, title: str, store_name: str) -> SimpleDocTemplate:
    return SimpleDocTemplate(
        buffer,
        pagesize=A6,
        leftMargin=6 * mm,
        rightMargin=6 * mm,
        topMargin=6 * mm,
        bottomMargin=6 * mm,
        title=title,
        author=store_name,
    )


def render_shipping_label(order: Order, *, store_name: str, seller: GstSettings | None) -> bytes:
    """An A6 address label for the parcel (order number, COD amount, addresses)."""
    buffer = io.BytesIO()
    doc = _label_doc(buffer, f"Shipping label {order.order_number}", store_name)
    doc.build([_label_box(order, doc.width, store_name=store_name, seller=seller)])
    return buffer.getvalue()


def render_shipping_labels(
    orders: list[Order], *, store_name: str, seller: GstSettings | None
) -> bytes:
    """Many orders' labels in one PDF, one A6 label per page, in the given order."""
    buffer = io.BytesIO()
    doc = _label_doc(buffer, f"Shipping labels ({len(orders)})", store_name)
    story = []
    for index, order in enumerate(orders):
        if index:
            story.append(PageBreak())
        story.append(_label_box(order, doc.width, store_name=store_name, seller=seller))
    doc.build(story)
    return buffer.getvalue()
