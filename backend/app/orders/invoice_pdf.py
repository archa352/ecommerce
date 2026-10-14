"""Render the GST invoice as a PDF.

This module only lays out data. Every figure comes from `InvoiceRead`, the
same model the JSON invoice endpoint returns (built by
`orders.serializers.invoice_read` from what the order froze at checkout), so
the PDF can never disagree with the JSON invoice or the order.
"""

from __future__ import annotations

import io
import re
from decimal import Decimal
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from app.orders.constants import GstType, OrderStatus
from app.orders.schemas import InvoiceRead

PDF_MEDIA_TYPE = "application/pdf"

_SAFE_FILENAME = re.compile(r"[^A-Za-z0-9._-]+")

_styles = getSampleStyleSheet()
_BODY = ParagraphStyle("body", parent=_styles["Normal"], fontSize=8, leading=10)
_SMALL = ParagraphStyle("small", parent=_BODY, fontSize=7, leading=9)
_BOLD = ParagraphStyle("bold", parent=_BODY, fontName="Helvetica-Bold")
_RIGHT = ParagraphStyle("right", parent=_BODY, alignment=TA_RIGHT)
# The line-item table is wide, so its cells use a smaller face.
_CELL = ParagraphStyle("cell", parent=_BODY, fontSize=7, leading=8.5)
_CELL_BOLD = ParagraphStyle("cell_bold", parent=_CELL, fontName="Helvetica-Bold")
_CELL_RIGHT = ParagraphStyle("cell_right", parent=_CELL, alignment=TA_RIGHT)
_TITLE = ParagraphStyle(
    "title", parent=_styles["Title"], fontSize=15, leading=18, spaceAfter=2 * mm
)

_GRID = colors.HexColor("#B8BCC4")
_SHADE = colors.HexColor("#EEF0F4")


def invoice_filename(invoice: InvoiceRead) -> str:
    """`INV-ORD-100001.pdf`; anything unsafe in a header (e.g. '/') becomes '-'."""
    stem = _SAFE_FILENAME.sub("-", invoice.invoice_number).strip("-.") or "invoice"
    return f"{stem}.pdf"


def _amount(value: Decimal | None) -> str:
    return f"{(value or Decimal('0')):,.2f}"


def _para(text: str | None, style: ParagraphStyle = _BODY) -> Paragraph:
    return Paragraph(escape(text or "-"), style)


def _lines_of(*parts: str | None) -> str:
    return "<br/>".join(escape(part) for part in parts if part)


def render_invoice_pdf(
    invoice: InvoiceRead,
    *,
    store_name: str,
    customer_phone: str | None = None,
    customer_email: str | None = None,
) -> bytes:
    """Build the invoice PDF and return its bytes."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=14 * mm,
        rightMargin=14 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title=f"Tax Invoice {invoice.invoice_number}",
        author=store_name,
    )
    width = doc.width
    story = [Paragraph("TAX INVOICE", _TITLE)]

    if invoice.order_status in {OrderStatus.CANCELLED, OrderStatus.RETURNED}:
        story.append(
            Paragraph(
                f"<b>Order status: {escape(invoice.order_status.value)}</b>",
                ParagraphStyle("warn", parent=_BODY, textColor=colors.HexColor("#B42318")),
            )
        )
        story.append(Spacer(1, 2 * mm))

    story.append(_header(invoice, store_name, width))
    story.append(Spacer(1, 4 * mm))
    story.append(_parties(invoice, customer_phone, customer_email, width))
    story.append(Spacer(1, 4 * mm))
    story.append(_items(invoice, width))
    story.append(Spacer(1, 3 * mm))
    story.append(_totals(invoice, width))
    story.append(Spacer(1, 6 * mm))
    story.append(
        _para(
            f"All amounts in {invoice.currency}. This is a computer-generated invoice "
            "and does not need a signature.",
            _SMALL,
        )
    )

    doc.build(story)
    return buffer.getvalue()


def _header(invoice: InvoiceRead, store_name: str, width: float) -> Table:
    seller = invoice.seller
    seller_block = Paragraph(
        f"<b>{escape(store_name)}</b><br/>"
        + _lines_of(
            seller.name if seller.name and seller.name != store_name else None,
            seller.address,
            f"State: {seller.state} ({seller.state_code})" if seller.state else None,
            f"GSTIN: {seller.gstin}" if seller.gstin else None,
        ),
        _BODY,
    )
    supply = {
        GstType.INTRA_STATE: "Intra-state (CGST + SGST)",
        GstType.INTER_STATE: "Inter-state (IGST)",
    }.get(invoice.gst_type, "Tax classification unavailable")
    meta = [
        ("Invoice number", invoice.invoice_number),
        ("Invoice date", invoice.invoice_date.strftime("%d %b %Y")),
        ("Order number", invoice.order_number),
        ("Place of supply", invoice.place_of_supply or "-"),
        ("Supply type", supply),
    ]
    meta_table = Table(
        [[_para(label, _BOLD), _para(value)] for label, value in meta],
        colWidths=[28 * mm, width / 2 - 30 * mm],
    )
    meta_table.setStyle(
        TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("BOTTOMPADDING", (0, 0), (-1, -1), 1)])
    )
    table = Table([[seller_block, meta_table]], colWidths=[width / 2, width / 2])
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
    return table


def _parties(
    invoice: InvoiceRead, phone: str | None, email: str | None, width: float
) -> Table:
    buyer = invoice.buyer
    address = _lines_of(
        buyer.name,
        buyer.address,
        f"State: {buyer.state}" + (f" ({buyer.state_code})" if buyer.state_code else "")
        if buyer.state
        else None,
    )
    contact = _lines_of(
        f"Phone: {phone}" if phone else None,
        f"Email: {email}" if email else None,
    )
    # The order stores one address, used for both billing and delivery.
    billing = address + ("<br/>" + contact if contact else "")
    bill_to = Paragraph("<b>Bill to</b><br/>" + billing, _BODY)
    ship_to = Paragraph("<b>Ship to</b><br/>" + address, _BODY)
    table = Table([[bill_to, ship_to]], colWidths=[width / 2, width / 2])
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.5, _GRID),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, _GRID),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return table


def _items(invoice: InvoiceRead, width: float) -> Table:
    intra = invoice.gst_type is GstType.INTRA_STATE
    tax_heads = (
        ["CGST", "SGST"]
        if intra
        else ["IGST"]
        if invoice.tax_split_known
        else ["Tax split unavailable"]
    )
    header = ["#", "Item", "HSN/SAC", "Qty", "Rate", "Disc.", "Taxable", "GST%"]
    header += tax_heads + ["Amount"]

    rows: list[list] = [[_para(h, _CELL_BOLD) for h in header]]
    for index, line in enumerate(invoice.lines, start=1):
        item = escape(line.description) + (
            f"<br/><font size=6>SKU: {escape(line.sku)}</font>" if line.sku else ""
        )
        taxes = (
            [line.cgst_amount, line.sgst_amount]
            if intra
            else [line.igst_amount]
            if invoice.tax_split_known
            else [None]
        )
        rows.append(
            [
                _para(str(index), _CELL),
                Paragraph(item, _CELL),
                _para(line.hsn_code, _CELL),
                _para(str(line.quantity), _CELL_RIGHT),
                _para(_amount(line.unit_price), _CELL_RIGHT),
                _para(_amount(line.discount), _CELL_RIGHT),
                _para(_amount(line.taxable_value), _CELL_RIGHT),
                _para(f"{line.gst_rate:.2f}", _CELL_RIGHT),
                *[
                    _para(_amount(tax), _CELL_RIGHT)
                    if tax is not None
                    else _para("—", _CELL_RIGHT)
                    for tax in taxes
                ],
                _para(_amount(line.total), _CELL_RIGHT),
            ]
        )

    fixed = [6 * mm, 0, 15 * mm, 8 * mm, 16 * mm, 14 * mm, 17 * mm, 10 * mm]
    fixed += [14 * mm] * len(tax_heads) + [17 * mm]
    fixed[1] = width - sum(fixed)
    table = Table(rows, colWidths=fixed, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), _SHADE),
                ("BOX", (0, 0), (-1, -1), 0.5, _GRID),
                ("INNERGRID", (0, 0), (-1, -1), 0.25, _GRID),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 2),
                ("RIGHTPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    return table


def _totals(invoice: InvoiceRead, width: float) -> Table:
    totals = invoice.totals
    rows = [
        ("Subtotal", totals.subtotal),
        ("Discount", -totals.discount if totals.discount else totals.discount),
        ("Shipping charges", totals.shipping),
        ("COD charges", totals.cod_fee),
        ("Taxable value", totals.taxable_value),
    ]
    if not invoice.tax_split_known:
        rows.append(("Tax (classification unavailable)", totals.tax_amount))
    elif invoice.gst_type is GstType.INTRA_STATE:
        rows += [("CGST", totals.cgst_amount), ("SGST", totals.sgst_amount)]
    else:
        rows += [("IGST", totals.igst_amount)]
    if invoice.tax_split_known:
        rows.append(("Total tax", totals.tax_amount))

    data = [[_para(label), _para(_amount(value), _RIGHT)] for label, value in rows]
    data.append(
        [
            _para(f"Grand total ({invoice.currency})", _BOLD),
            Paragraph(f"<b>{_amount(totals.total)}</b>", _RIGHT),
        ]
    )
    table = Table(data, colWidths=[40 * mm, 30 * mm], hAlign="RIGHT")
    table.setStyle(
        TableStyle(
            [
                ("LINEABOVE", (0, -1), (-1, -1), 0.75, colors.black),
                ("BACKGROUND", (0, -1), (-1, -1), _SHADE),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
            ]
        )
    )
    return table
