# ZEEN catalogue inventory — 2026-10-22

Source: development database `tws_ecommerce` (local Docker, `ENVIRONMENT=development`), read after the
six homepage products were created. Nothing in this report has been deleted, archived or edited; every
"suspected test" note below is a recommendation for review only.

## 1. Homepage image audit

| Asset | Where it is used | Assessment |
|---|---|---|
| `public/home/home1.jpg` … `home6.jpg` | Product tiles (via a campaign-photo fallback), category strip fallback; `home1`, `home5`, `home6` also in `CampaignSplit` | Six single-outfit product photographs (women's kurta sets). Used to create the six products below. |
| `public/home/3.jpg` | `CampaignSplit` panel | Editorial campaign panel — left as is, not a product. |
| `public/home/footer.png` | `CampaignBanner` fallback art | Editorial banner — not a product. |
| `public/home/hero-model.png` | `Home.module.css` background | Editorial hero — not a product. |
| `public/images/zeen-symbol.png`, `zeen-wordmark.png` | `HomeIntro` | Brand marks. |
| `public/home/1.png`, `2.jpg`, `home7.png`, `green-friday-reference.jpeg`, `public/images/banner.png`, `homepage.jpg`, `zeen-hero.png` | Not referenced by the storefront source | Unused assets; no products created from them. |

**Why names and images did not match before:** the tiles were real backend records (the seed command's
"Kesar Quilted Jacket", "Sona Wrap Midi Dress", …, whose own images are random `picsum.photos` placeholders).
`HomeClient.tsx` swapped any picsum URL for one of the campaign photos above, so each tile showed a kurta
photograph under an unrelated product's name and linked to that unrelated product (e.g. a kurta photo
opening "Kesar Quilted Jacket" in Outerwear).

## 2. Products created from the homepage photographs

Created through the admin catalogue API (`POST /catalogue/images/upload`, then `POST /catalogue/products`)
as the tenant's ADMIN user. Images are stored by the backend's upload pipeline and served from its
`/media/...` path (no expiring external URLs). All six: category **Women Kurtas**, status **ACTIVE**,
gender **WOMEN**, one primary image, **no variants, no price, no stock** (see §5).

| Source | Product ID | Name (provisional) | Slug | Image |
|---|---|---|---|---|
| `home1.jpg` | `93b11f7a-05f1-4b08-8667-447a09ba687d` | Pastel Floral Print Kurta with Cutwork Dupatta | `pastel-floral-print-kurta-with-cutwork-dupatta` | `/media/4f121c7d-15b8-4f95-90bf-22aea67abedd/5564fde49e664402b89521b11444e3bd.jpg` |
| `home2.jpg` | `53f8649d-3db7-4370-ba59-d96c4b7ffa7b` | Red Floral Print Kaftan Kurta Set | `red-floral-print-kaftan-kurta-set` | `/media/4f121c7d-15b8-4f95-90bf-22aea67abedd/83a0abcbe8ab4b5482b67607bbfe8e16.jpg` |
| `home3.jpg` | `754dffd1-630b-4360-b5b9-885755a2fcb9` | Blush Botanical Print Kurta Set | `blush-botanical-print-kurta-set` | `/media/4f121c7d-15b8-4f95-90bf-22aea67abedd/bbcc2b3fa3ec4579b8e3576687c43240.jpg` |
| `home4.jpg` | `97043949-c009-4df4-bf42-64e9db36abdb` | Paisley Print Kurta with Mint Salwar | `paisley-print-kurta-with-mint-salwar` | `/media/4f121c7d-15b8-4f95-90bf-22aea67abedd/e6d1a29b786f41a9af2ce5357c73d061.jpg` |
| `home5.jpg` | `d2e8262a-46ac-4cb3-ae7a-fb7c4697e6df` | Maroon Embroidered Kurta with Ivory Salwar | `maroon-embroidered-kurta-with-ivory-salwar` | `/media/4f121c7d-15b8-4f95-90bf-22aea67abedd/8ad06e0ab4af44ed8d4a9d2dc2cba4f2.jpg` |
| `home6.jpg` | `287f9e42-689c-41b0-ada8-b889e0d173d5` | Bottle Green Embroidered Kurta Set with Dupatta | `bottle-green-embroidered-kurta-set-with-dupatta` | `/media/4f121c7d-15b8-4f95-90bf-22aea67abedd/2c12cc99c60e4aa7b4735937afca2264.jpg` |

Recorded: name, short description and description of what is visible, sleeve and neckline as seen.
Not recorded (unknown): brand, fabric, occasion, care, country of origin, size chart, HSN/GST, price, sizes,
colours as variant options, stock.

## 3. Suspected test / dummy records (for your review — nothing changed)

Products:
- **Seed demo products** from `backend/app/commands/seed.py` (non-ethnic catalogue, `picsum.photos` placeholder images, uniform stock 25): Sona Wrap Midi Dress, Ira Poplin Shirt, Nila Wide-Leg Trouser, Kesar Quilted Jacket, Mira Leather Loafer, Tara Huggie Hoops, Dhara Silk Scarf, Ravi Ribbed Lounge Set — all ACTIVE and visible in the catalogue.
- **Updated Product Name** (`27cd0d5f…`, Bags, ACTIVE) — the seed's "Bela Woven Belt" renamed by a QA run; belt SKU and belt images filed under Bags; has `TEST-SKU-010/011` variants; **9 order lines reference it**.
- **Anvi Structured Tote** (`ffb3df04…`, ARCHIVED) — carries `TEST-SKU-001…006` QA variants; **10 order lines reference it**.
- **Bela Woven Belt** (`69b110b0…`, ARCHIVED, Accessories) — second copy of the seed belt, no variants.
- **test** (`a50ab42a…`, ARCHIVED, Bottoms) — named "test", no variants.
- Earlier kurta records (brand "TWS"): Floral Printed Cotton Kurta, Embroidered Straight Cotton Kurta (ACTIVE, no variants/price), Printed Anarkali Kurta (ARCHIVED), Block Print Cotton Kurta (ARCHIVED), A-Line Rayon Kurta (ACTIVE, priced, 6 order lines) — plausible catalogue items, but their images are hot-linked `i.pinimg.com` URLs (third-party, can disappear).

Categories:
- **QA categories**: QA Category, QA Category Inactive, QA Category Null Description, QA Category Required (×2, same name), QA Category Valid, QA Duplicate Slug (all ACTIVE, empty), QA Empty Slug / QA Invalid Slug / QA Missing Slug (ARCHIVED, empty), **QA Partially Updated Category** (ACTIVE, holds Dhara Silk Scarf — so it shows in the storefront filter).
- **Seed categories outside an ethnic-wear catalogue**: Dresses, Tops, Bottoms, Outerwear, Footwear, Bags, Jewellery, Loungewear, Accessories, Scarves & Wraps. Each visible one appears in the filter only because a seed/test product in it is ACTIVE.

Relationship problems:
- Dhara Silk Scarf is in "QA Partially Updated Category" rather than "Scarves & Wraps" (which is empty).
- "Updated Product Name" (a belt) is in Bags.
- Two categories are both named "QA Category Required"; categories have no stored slug, the storefront derives the URL from the name, so these two share one URL and only the first is reachable.
- Variant option casing is inconsistent (`color`/`size` on Block Print Cotton Kurta vs `Color`/`Size` elsewhere; `Size=Medium` vs `M`).

Before deleting any product, note that order lines reference A-Line Rayon Kurta, Anvi Structured Tote and Updated Product Name; archiving keeps order history intact, deleting may not be possible or desirable.

## 4. Full inventory

### Products
| Product ID | Name | Slug | Category | Status | Price (variants) | Images | Variants (active) | Stock avail. | Order lines | On homepage |
|---|---|---|---|---|---|---|---|---|---|---|
| `69b110b0-7109-4d5e-a864-cf6eb031cc1c` | Bela Woven Belt | `bela-woven-belt` | Accessories | ARCHIVED | — | 2 | 0 (0) | 0 | 0 | no |
| `ffb3df04-0d26-4ecb-995d-c35b709df1eb` | Anvi Structured Tote | `anvi-structured-tote` | Bags | ARCHIVED | 500.00–6199.00 | 2 | 6 (1) | 71 | 10 | no |
| `27cd0d5f-ca84-4385-aa57-d3160cacdf63` | Updated Product Name | `updated-product-name` | Bags | ACTIVE | 999.99–1599.00 | 2 | 3 (3) | 44 | 9 | no |
| `0853b3ec-9fc8-440a-ac9a-ca835bbcd1ac` | Nila Wide-Leg Trouser | `nila-wide-leg-trouser` | Bottoms | ACTIVE | 2699.00–2699.00 | 2 | 1 (1) | 25 | 0 | no |
| `a50ab42a-824b-4997-bb69-581d91ff3f67` | test | `test` | Bottoms | ARCHIVED | — | 1 | 0 (0) | 0 | 0 | no |
| `acf74387-8a20-45fd-8284-9cb5e68c6417` | Sona Wrap Midi Dress | `sona-wrap-midi-dress` | Dresses | ACTIVE | 3499.00–3499.00 | 2 | 1 (1) | 25 | 0 | no |
| `dea5ae13-ede7-4dea-a0e3-b65a496ece79` | Mira Leather Loafer | `mira-leather-loafer` | Footwear | ACTIVE | 4299.00–4299.00 | 2 | 1 (1) | 25 | 0 | no |
| `fe1729a8-7f67-4d66-b1d3-70fe67137bb8` | Tara Huggie Hoops | `tara-huggie-hoops` | Jewellery | ACTIVE | 1299.00–1299.00 | 2 | 1 (1) | 25 | 0 | no |
| `dbec7d1d-684f-49d6-b6ec-c33925398410` | Ravi Ribbed Lounge Set | `ravi-ribbed-lounge-set` | Loungewear | ACTIVE | 2999.00–2999.00 | 2 | 1 (1) | 25 | 0 | no |
| `be687b60-9f6c-4fc5-ba4e-ba8d8618d7bd` | Kesar Quilted Jacket | `kesar-quilted-jacket` | Outerwear | ACTIVE | 5499.00–5499.00 | 2 | 1 (1) | 25 | 0 | no |
| `d984543b-825e-4c7f-a08a-b34c72db9601` | Dhara Silk Scarf | `dhara-silk-scarf` | QA Partially Updated Category | ACTIVE | 2199.00–2199.00 | 2 | 1 (1) | 25 | 0 | no |
| `5e16d981-305e-47c4-9d58-650133161ddc` | Ira Poplin Shirt | `ira-poplin-shirt` | Tops | ACTIVE | 1899.00–1899.00 | 2 | 1 (1) | 25 | 0 | no |
| `50e51ff7-d5ec-4707-99a8-1b3705fdec68` | Floral Printed Cotton Kurta | `floral-printed-cotton-kurta` | Women Kurtas | ACTIVE | — | 1 | 0 (0) | 0 | 0 | no |
| `592a24ed-7011-45e9-88db-75f87520d9f1` | Embroidered Straight Cotton Kurta | `embroidered-straight-cotton-kurta` | Women Kurtas | ACTIVE | — | 1 | 0 (0) | 0 | 0 | yes |
| `52814b58-740e-4fa8-b35d-d4419444543a` | Block Print Cotton Kurta | `block-print-cotton-kurta` | Women Kurtas | ARCHIVED | 1299.00–1299.00 | 2 | 1 (0) | 20 | 0 | no |
| `b72148d1-0032-49d4-88b3-cc5e538a0961` | A-Line Rayon Kurta | `a-line-rayon-kurta` | Women Kurtas | ACTIVE | 5499.00–5499.00 | 1 | 1 (1) | 9 | 6 | yes |
| `10badd9a-b8a2-43c3-9938-28a357fa7a58` | Printed Anarkali Kurta | `printed-anarkali-kurta` | Women Kurtas | ARCHIVED | — | 1 | 0 (0) | 0 | 0 | no |
| `93b11f7a-05f1-4b08-8667-447a09ba687d` | Pastel Floral Print Kurta with Cutwork Dupatta | `pastel-floral-print-kurta-with-cutwork-dupatta` | Women Kurtas | ACTIVE | — | 1 | 0 (0) | 0 | 0 | yes |
| `53f8649d-3db7-4370-ba59-d96c4b7ffa7b` | Red Floral Print Kaftan Kurta Set | `red-floral-print-kaftan-kurta-set` | Women Kurtas | ACTIVE | — | 1 | 0 (0) | 0 | 0 | yes |
| `754dffd1-630b-4360-b5b9-885755a2fcb9` | Blush Botanical Print Kurta Set | `blush-botanical-print-kurta-set` | Women Kurtas | ACTIVE | — | 1 | 0 (0) | 0 | 0 | yes |
| `97043949-c009-4df4-bf42-64e9db36abdb` | Paisley Print Kurta with Mint Salwar | `paisley-print-kurta-with-mint-salwar` | Women Kurtas | ACTIVE | — | 1 | 0 (0) | 0 | 0 | yes |
| `d2e8262a-46ac-4cb3-ae7a-fb7c4697e6df` | Maroon Embroidered Kurta with Ivory Salwar | `maroon-embroidered-kurta-with-ivory-salwar` | Women Kurtas | ACTIVE | — | 1 | 0 (0) | 0 | 0 | yes |
| `287f9e42-689c-41b0-ada8-b889e0d173d5` | Bottle Green Embroidered Kurta Set with Dupatta | `bottle-green-embroidered-kurta-set-with-dupatta` | Women Kurtas | ACTIVE | — | 1 | 0 (0) | 0 | 0 | yes |

Image references per product:

- `69b110b0` Bela Woven Belt: `https://picsum.photos/seed/bela-belt-2/800/1000`, `https://picsum.photos/seed/bela-belt-1/800/1000`
- `ffb3df04` Anvi Structured Tote: `https://picsum.photos/seed/anvi-tote-1/800/1000`, `https://picsum.photos/seed/anvi-tote-2/800/1000`
- `27cd0d5f` Updated Product Name: `https://picsum.photos/seed/bela-belt-1/800/1000`, `https://picsum.photos/seed/bela-belt-2/800/1000`
- `0853b3ec` Nila Wide-Leg Trouser: `https://picsum.photos/seed/nila-wide-1/800/1000`, `https://picsum.photos/seed/nila-wide-2/800/1000`
- `a50ab42a` test: `/media/4f121c7d-15b8-4f95-90bf-22aea67abedd/90a0e588013c434b900e4cfa8d567c79.png`
- `acf74387` Sona Wrap Midi Dress: `https://picsum.photos/seed/sona-wrap-1/800/1000`, `https://picsum.photos/seed/sona-wrap-2/800/1000`
- `dea5ae13` Mira Leather Loafer: `https://picsum.photos/seed/mira-loafer-1/800/1000`, `https://picsum.photos/seed/mira-loafer-2/800/1000`
- `fe1729a8` Tara Huggie Hoops: `https://picsum.photos/seed/tara-hoop-1/800/1000`, `https://picsum.photos/seed/tara-hoop-2/800/1000`
- `dbec7d1d` Ravi Ribbed Lounge Set: `https://picsum.photos/seed/ravi-lounge-1/800/1000`, `https://picsum.photos/seed/ravi-lounge-2/800/1000`
- `be687b60` Kesar Quilted Jacket: `https://picsum.photos/seed/kesar-quilt-1/800/1000`, `https://picsum.photos/seed/kesar-quilt-2/800/1000`
- `d984543b` Dhara Silk Scarf: `https://picsum.photos/seed/dhara-silk-1/800/1000`, `https://picsum.photos/seed/dhara-silk-2/800/1000`
- `5e16d981` Ira Poplin Shirt: `https://picsum.photos/seed/ira-poplin-1/800/1000`, `https://picsum.photos/seed/ira-poplin-2/800/1000`
- `50e51ff7` Floral Printed Cotton Kurta: `https://i.pinimg.com/736x/b4/7e/ef/b47eef37399d07206cdc4792dbc65215.jpg`
- `592a24ed` Embroidered Straight Cotton Kurta: `https://i.pinimg.com/736x/e5/c5/f3/e5c5f33143c9aff6bfee6888499f137d.jpg`
- `52814b58` Block Print Cotton Kurta: `https://i.pinimg.com/1200x/74/73/31/7473313c87f3ca3117d8052d964bd370.jpg`, `/media/4f121c7d-15b8-4f95-90bf-22aea67abedd/0d18613dfad648d285705d599a282c88.png`
- `b72148d1` A-Line Rayon Kurta: `https://i.pinimg.com/1200x/f3/5a/4f/f35a4f05d6c58782e270787c555af076.jpg`
- `10badd9a` Printed Anarkali Kurta: `https://i.pinimg.com/736x/68/86/9d/68869d11c1ce0b1554f6353839402f34.jpg`
- `93b11f7a` Pastel Floral Print Kurta with Cutwork Dupatta: `/media/4f121c7d-15b8-4f95-90bf-22aea67abedd/5564fde49e664402b89521b11444e3bd.jpg`
- `53f8649d` Red Floral Print Kaftan Kurta Set: `/media/4f121c7d-15b8-4f95-90bf-22aea67abedd/83a0abcbe8ab4b5482b67607bbfe8e16.jpg`
- `754dffd1` Blush Botanical Print Kurta Set: `/media/4f121c7d-15b8-4f95-90bf-22aea67abedd/bbcc2b3fa3ec4579b8e3576687c43240.jpg`
- `97043949` Paisley Print Kurta with Mint Salwar: `/media/4f121c7d-15b8-4f95-90bf-22aea67abedd/e6d1a29b786f41a9af2ce5357c73d061.jpg`
- `d2e8262a` Maroon Embroidered Kurta with Ivory Salwar: `/media/4f121c7d-15b8-4f95-90bf-22aea67abedd/8ad06e0ab4af44ed8d4a9d2dc2cba4f2.jpg`
- `287f9e42` Bottle Green Embroidered Kurta Set with Dupatta: `/media/4f121c7d-15b8-4f95-90bf-22aea67abedd/2c12cc99c60e4aa7b4735937afca2264.jpg`

### Categories

| Category ID | Name | Derived URL slug | Status | Products | Active products | Created |
|---|---|---|---|---|---|---|
| `773be24c-9f1e-45f9-b9a2-d4ede43f5be0` | Accessories | `accessories` | ACTIVE | 1 | 0 | 2026-08-27 |
| `59a15550-6978-4379-bbfc-8896698b3ba6` | Bags | `bags` | ACTIVE | 2 | 1 | 2026-08-27 |
| `ba53134b-6b42-4cfc-adf1-3643dff11bd5` | Bottoms | `bottoms` | ACTIVE | 2 | 1 | 2026-08-27 |
| `bce1970c-b57c-4ce3-a2e7-8e94c7f056e3` | Dresses | `dresses` | ACTIVE | 1 | 1 | 2026-08-27 |
| `b8ba42af-6c63-40ef-927e-6dc789c7bc5f` | Footwear | `footwear` | ACTIVE | 1 | 1 | 2026-08-27 |
| `1d105be7-31cd-4759-b27e-c2e0f9b08b0c` | Jewellery | `jewellery` | ACTIVE | 1 | 1 | 2026-08-27 |
| `3763b9d0-50b1-4d1b-9d12-923ac7b87f59` | Loungewear | `loungewear` | ACTIVE | 1 | 1 | 2026-08-27 |
| `886ef7f9-5a78-4074-8a4b-60ec472cf9d4` | Outerwear | `outerwear` | ACTIVE | 1 | 1 | 2026-08-27 |
| `37757c56-29e4-43fe-96d8-5a456338f8fc` | QA Category | `qa-category` | ACTIVE | 0 | 0 | 2026-08-28 |
| `7ace5dc9-d676-4cfc-b793-f5c239ecc7c2` | QA Category Inactive | `qa-category-inactive` | ACTIVE | 0 | 0 | 2026-08-27 |
| `9e37d1c2-197b-41c2-8b65-9b55df427a50` | QA Category Null Description | `qa-category-null-description` | ACTIVE | 0 | 0 | 2026-08-27 |
| `8e9f54c4-9a47-4794-b7b4-69002d1b70ad` | QA Category Required (duplicate name) | `qa-category-required` | ACTIVE | 0 | 0 | 2026-08-28 |
| `5398fa9e-a3b5-4718-aab1-690aa19f8858` | QA Category Required (duplicate name) | `qa-category-required` | ACTIVE | 0 | 0 | 2026-08-27 |
| `96336a6f-c592-4ce1-98a3-c8088c566059` | QA Category Valid | `qa-category-valid` | ACTIVE | 0 | 0 | 2026-08-27 |
| `f2965c65-e85c-4eb1-bd7e-d33ec12f544d` | QA Duplicate Slug | `qa-duplicate-slug` | ACTIVE | 0 | 0 | 2026-08-27 |
| `d2b95aff-11fe-4319-bbd8-a756bcff5612` | QA Empty Slug | `qa-empty-slug` | ARCHIVED | 0 | 0 | 2026-08-27 |
| `db577ba5-531e-490a-8d0b-d73e4661c0c4` | QA Invalid Slug | `qa-invalid-slug` | ARCHIVED | 0 | 0 | 2026-08-27 |
| `cf53fe7f-2c6f-4505-8375-c6e39fce5604` | QA Missing Slug | `qa-missing-slug` | ARCHIVED | 0 | 0 | 2026-08-27 |
| `ed2146ab-e589-4668-86c7-cf0be7e832d8` | QA Partially Updated Category | `qa-partially-updated-category` | ACTIVE | 1 | 1 | 2026-08-27 |
| `bca1708d-6c2b-4ff3-bab2-24e7d35130b0` | Scarves & Wraps | `scarves-wraps` | ACTIVE | 0 | 0 | 2026-09-29 |
| `46e248a0-fb03-4b39-9931-a69371ee1121` | Tops | `tops` | ACTIVE | 1 | 1 | 2026-08-27 |
| `628b4549-007f-44af-a254-849b5003c99f` | Women Kurtas | `women-kurtas` | ACTIVE | 11 | 9 | 2026-09-08 |

### Variants

| Variant ID | Product | SKU | Variant name | Status | Price | Sale | Available | Reserved | Options |
|---|---|---|---|---|---|---|---|---|---|
| `dc06668f-6ae6-424a-bddd-dab985a412c0` | A-Line Rayon Kurta | A-LINE-RAYON-KURTA-RED-M | A-Line Rayon Kurta - Red | ACTIVE | 5499.00 | — | 9 | 5 | Color=Red, Size=Medium |
| `7a51f1d0-0762-4a24-ad05-34b90df4fd0c` | Anvi Structured Tote | ANVI-TOTE-STD | S / Black | ACTIVE | 6199.00 | — | 28 | 8 | Color=Black, Size=S |
| `15273273-357e-4d84-b5d5-b8c446d6366e` | Anvi Structured Tote | TEST-SKU-001 | Updated Name Only | ARCHIVED | 799.50 | — | 0 | 0 | — |
| `f293a33a-bad0-4d92-a61a-df4404ddb350` | Anvi Structured Tote | TEST-SKU-002 | Default Status Variant | ARCHIVED | 500.00 | — | 0 | 0 | — |
| `8320e9ac-f532-4583-8344-81c4b30855c9` | Anvi Structured Tote | TEST-SKU-003 | Active Variant | ARCHIVED | 500.00 | — | 0 | 0 | — |
| `53032964-f5fe-424a-a11e-155fa081f9cf` | Anvi Structured Tote | TEST-SKU-004 | Archived Variant | ARCHIVED | 500.00 | — | 0 | 0 | — |
| `185aaa9f-5756-4b5d-bbd1-6cb39e97a13a` | Anvi Structured Tote | TEST-SKU-006 | Lowercase SKU Variant | ARCHIVED | 600.00 | — | 43 | 0 | — |
| `c55e709a-6088-43bd-a831-5366e036ee23` | Block Print Cotton Kurta | BPC-KURTA-BLUE-M | Blue - M | ARCHIVED | 1299.00 | — | 20 | 0 | color=Blue, size=M |
| `16310e56-3a2f-4f01-ac6d-cf7105876b84` | Dhara Silk Scarf | DHARA-SILK-STD | L / Indigo | ACTIVE | 2199.00 | — | 25 | 0 | Color=Indigo, Size=L |
| `c6ee95b9-0c7f-49b5-9078-3538c805ae57` | Ira Poplin Shirt | IRA-POPLIN-STD | M / Ivory | ACTIVE | 1899.00 | — | 25 | 0 | Color=Ivory, Size=M |
| `bfd5d0fd-c9f1-43e0-9e6f-07d6e3eb9b37` | Kesar Quilted Jacket | KESAR-QUILT-STD | M / Olive | ACTIVE | 5499.00 | — | 25 | 0 | Color=Olive, Size=M |
| `93ef8cd3-790b-46d5-b8ae-0f9b7ad90204` | Mira Leather Loafer | MIRA-LOAFER-STD | S / Rust | ACTIVE | 4299.00 | — | 25 | 0 | Color=Rust, Size=S |
| `1e2a89de-bd4a-460c-9a5e-28194e241d2a` | Nila Wide-Leg Trouser | NILA-WIDE-STD | L / Indigo | ACTIVE | 2699.00 | — | 25 | 0 | Color=Indigo, Size=L |
| `a2e70176-6ed2-455a-a7a2-6c7733028a74` | Ravi Ribbed Lounge Set | RAVI-LOUNGE-STD | M / Olive | ACTIVE | 2999.00 | — | 25 | 0 | Color=Olive, Size=M |
| `b20f4b9d-3a7b-4613-8c08-999fc44e6cd8` | Sona Wrap Midi Dress | SONA-WRAP-STD | S / Black | ACTIVE | 3499.00 | — | 25 | 0 | Color=Black, Size=S |
| `f485937c-4fb2-4d7f-bf98-84c23345cbc5` | Tara Huggie Hoops | TARA-HOOP-STD | M / Ivory | ACTIVE | 1299.00 | — | 25 | 0 | Color=Ivory, Size=M |
| `41bb3271-f1c7-4933-b989-96af9c4a030f` | Updated Product Name | BELA-BELT-STD | S / Rust | ACTIVE | 1599.00 | — | 25 | 0 | Color=Rust, Size=S |
| `a4c8a8b3-547e-4ed9-bec8-69f0a9eea96e` | Updated Product Name | TEST-SKU-010 | Testing Variant | ACTIVE | 999.99 | — | 0 | 0 | — |
| `573c1bf8-1072-46ac-b6b2-fa609a75e836` | Updated Product Name | TEST-SKU-011 | belt | ACTIVE | 999.99 | — | 19 | 6 | — |

### Integrity checks

- variants without product: **0**
- variants without inventory row: **0**
- images without product: **0**
- duplicate product slugs: **0**
- duplicate category names: **1**
- variants priced <= 0: **0**

## 5. Needs your confirmation

1. **Image rights.** `home1–6.jpg` look like third-party lookbook photographs (Pinterest-sized, 736 px wide). Confirm ZEEN has the right to sell under them before production use.
2. **Names.** All six names are provisional, descriptive of the photograph.
3. **Per product:** price, sizes and colours to offer (variants and SKUs), opening stock, fabric, occasion, care instructions, country of origin, size chart, HSN code / GST rate, brand label. Until variants exist the products show "Price on request" and "Sold Out" and cannot be added to the bag — the same treatment the listing already gives other unpriced products.
4. **Category.** Placed in the existing "Women Kurtas" category (the `/products` collection). They are kurta *sets* (with salwar/pants, some with dupatta); say if you want a separate category.
5. **Which test records to remove or archive** (§3).

## 6. Update — later on 2026-10-22 (owner-approved changes)

The tables above describe the catalogue **before** these changes. Backups were taken first:
`backend/var/db-backups/tws_ecommerce-20261022-194134-before-catalogue-cleanup.dump` and
`tws-20261022-194616-before-kurta-categories.dump`.

**Hard-deleted** (owner instruction "force remove"): 10 products — Bela Woven Belt, Nila Wide-Leg Trouser,
test, Sona Wrap Midi Dress, Mira Leather Loafer, Tara Huggie Hoops, Ravi Ribbed Lounge Set, Kesar Quilted
Jacket, Dhara Silk Scarf, Ira Poplin Shirt (with their images, options, variants and stock rows); 6 unordered
variants of the two kept products (BELA-BELT-STD, TEST-SKU-001…004, TEST-SKU-010); 20 categories (every one
except Women Kurtas and Bags); 19 cart lines that pointed at deleted variants.

**Kept, archived** (only items on 19 existing orders, so order and payment history stays intact):
Anvi Structured Tote and Updated Product Name (ARCHIVED), their variants ANVI-TOTE-STD, TEST-SKU-006,
TEST-SKU-011 (ARCHIVED), and the Bags category (ARCHIVED). None of these show in the storefront.

**Created** under Women Kurtas (admin API), and products filed into them:

| Category | ID | Products |
|---|---|---|
| Kurta Sets | `80e23377-722c-4799-8f90-1d76cd3ff173` | Red Floral Print Kaftan Kurta Set, Blush Botanical Print Kurta Set |
| Salwar Suits | `e2cd4609-4b1b-427c-9e6f-19b36963916c` | Paisley Print Kurta with Mint Salwar, Maroon Embroidered Kurta with Ivory Salwar, Bottle Green Embroidered Kurta Set with Dupatta |
| Embroidered Kurtas | `64f432ad-2d72-416e-a5ca-94777d68f30e` | Pastel Floral Print Kurta with Cutwork Dupatta |
| A-Line Kurtas | `399c202e-072d-4d73-9ede-29c35ac5ab99` | A-Line Rayon Kurta |
| Straight Kurtas | `69d6ae0f-59a5-4d90-88bb-bc8adfe92266` | Embroidered Straight Cotton Kurta |
| Cotton Kurtas | `81949adc-e4b3-4675-af72-f096e997fd3d` | Floral Printed Cotton Kurta |

Not created (no product or photograph to support them yet): Anarkali Kurtas (only an archived product),
Churidars, Dresses, Festive Wear.

Note for GST setup: checkout looks up a tax rate on the product or its exact category, not on a parent, so
rates must be configured on these sub-categories (or per product), not only on Women Kurtas.

## 7. Update — 2026-10-23

- **Salwar Suits** moved under **Kurta Sets**, so `/collections/kurta-sets` lists all 5 sets (2 of its own + 3 salwar suits).
- **Variants added** (admin API), one photographed colour per product, sizes XS–XXL, 53 new variants in total:

| Product | Colour | New sizes | Price | Opening stock |
|---|---|---|---|---|
| A-Line Rayon Kurta | Red | XS, S, L, XL, XXL (existing "Medium" variant kept unchanged) | ₹5,499 (existing price) | 10 each — placeholder |
| Red Floral Print Kaftan Kurta Set | Ivory | XS–XXL | ₹2,999 — placeholder | 10 each — placeholder |
| Blush Botanical Print Kurta Set | Blush Pink | XS–XXL | ₹2,999 — placeholder | 10 each — placeholder |
| Paisley Print Kurta with Mint Salwar | Multicolour | XS–XXL | ₹2,999 — placeholder | 10 each — placeholder |
| Maroon Embroidered Kurta with Ivory Salwar | Maroon | XS–XXL | ₹2,999 — placeholder | 10 each — placeholder |
| Bottle Green Embroidered Kurta Set with Dupatta | Bottle Green | XS–XXL | ₹2,999 — placeholder | 10 each — placeholder |
| Pastel Floral Print Kurta with Cutwork Dupatta | Pastel Pink | XS–XXL | ₹2,999 — placeholder | 10 each — placeholder |
| Embroidered Straight Cotton Kurta | Sage Green | XS–XXL | ₹2,999 — placeholder | 10 each — placeholder |
| Floral Printed Cotton Kurta | Ivory | XS–XXL | ₹2,999 — placeholder | 10 each — placeholder |

  SKUs follow `ZN-<PRODUCT>-<COLOUR>-<SIZE>`. **Replace every placeholder price and stock before launch.**
- **Gallery images**: 3 detail crops (neckline, sleeve, hem / dupatta edge / print) cut from each product's own photo and uploaded as images 2–4. They are close-ups of the same shot, not new angles; most are 180–480 px wide and look soft when zoomed. Real multi-angle photography is still needed (front, back, side, detail).
- Size naming: A-Line's original variant uses `Medium` while all others use `M`; the size filter therefore lists both. Renaming it is a change to an existing record with order history, so it was left for confirmation.
- Unused assets `public/home/1.png`, `home7.png`, `2.jpg` show one olive-green kurta set from two angles; it is not in the catalogue.
