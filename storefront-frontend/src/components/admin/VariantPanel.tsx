import ActionForm from '@/components/admin/ActionForm';
import CatalogueStatusBadge from '@/components/admin/CatalogueStatusBadge';
import DangerAction from '@/components/admin/DangerAction';
import Field from '@/components/admin/Field';
import {
  adjustInventory,
  archiveVariant,
  createVariant,
  setInventory,
  setLowStockThreshold,
  updateVariant,
} from '@/lib/admin/actions';
import { STOREFRONT_CURRENCY } from '@/lib/currency';
import { formatMoney } from '@/lib/format';
import type { ProductAdmin, VariantAdmin } from '@/types/catalogue-admin';

/**
 * Everything the API can do to one variant, next to the variant itself.
 *
 * Stock has two verbs on purpose: "set" writes an absolute count (a
 * stocktake), "adjust" writes a signed delta (a delivery, breakage). The
 * backend records either as a movement, so which one was used stays visible
 * in the history.
 */
function VariantRow({ variant, product }: { variant: VariantAdmin; product: ProductAdmin }) {
  const inventory = variant.inventory;
  const ids = { variant_id: variant.id, product_id: product.id };

  return (
    <div className="border radius-8 p-16 mb-16">
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-16">
        <div>
          <span className="fw-semibold d-block">{variant.name}</span>
          <span className="text-sm text-secondary-light">
            {variant.sku}
            {Object.keys(variant.options).length > 0 && (
              <>
                {' · '}
                {Object.entries(variant.options)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(' · ')}
              </>
            )}
          </span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold">{formatMoney(variant.price, STOREFRONT_CURRENCY)}</span>
          <CatalogueStatusBadge status={variant.status} />
          {variant.status !== 'ARCHIVED' && (
            <DangerAction
              action={archiveVariant}
              fields={ids}
              label="Archive"
              confirmLabel="Archive"
              size="xs"
            />
          )}
        </div>
      </div>

      <div className="row gy-3">
        <div className="col-lg-6">
          <p className="text-sm fw-semibold mb-8">Details</p>
          <ActionForm action={updateVariant} submitLabel="Save" hidden={ids}>
            <div className="row gy-2">
              <Field label="SKU" name="sku" defaultValue={variant.sku} required className="col-6" />
              <Field label="Name" name="name" defaultValue={variant.name} required className="col-6" />
              <Field
                label="Price"
                name="price"
                defaultValue={variant.price}
                inputMode="decimal"
                required
                className="col-6"
              />
              <div className="col-6">
                <label className="form-label text-sm fw-medium" htmlFor={`status-${variant.id}`}>
                  Status
                </label>
                <select
                  id={`status-${variant.id}`}
                  name="status"
                  className="form-select radius-8"
                  defaultValue={variant.status}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </ActionForm>
        </div>

        <div className="col-lg-6">
          <p className="text-sm fw-semibold mb-8">
            Stock
            {inventory && (
              <span className="text-secondary-light fw-normal">
                {' — '}
                {inventory.sellable_quantity} sellable, {inventory.available_quantity} on hand,{' '}
                {inventory.reserved_quantity} reserved
              </span>
            )}
          </p>

          <div className="d-flex flex-column gap-2">
            <ActionForm action={adjustInventory} submitLabel="Apply" hidden={ids} inline resetOnSuccess>
              <Field
                label="Change by"
                name="delta"
                placeholder="10 or -3"
                inputMode="numeric"
                className="flex-grow-1"
              />
            </ActionForm>

            <ActionForm action={setInventory} submitLabel="Set" hidden={ids} inline>
              <Field
                label="Set on hand to"
                name="available_quantity"
                defaultValue={inventory?.available_quantity ?? 0}
                inputMode="numeric"
                className="flex-grow-1"
              />
            </ActionForm>

            <ActionForm action={setLowStockThreshold} submitLabel="Save" hidden={ids} inline>
              <Field
                label="Low-stock threshold"
                name="low_stock_threshold"
                defaultValue={inventory?.low_stock_threshold ?? 0}
                inputMode="numeric"
                className="flex-grow-1"
              />
            </ActionForm>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VariantPanel({
  product,
  variants,
}: {
  product: ProductAdmin;
  variants: VariantAdmin[];
}) {
  return (
    <div className="card">
      <div className="card-body">
        <h6 className="text-lg mb-20">Variants</h6>

        {variants.length === 0 ? (
          <p className="text-sm text-secondary-light">
            No variants yet. A product needs at least one before it can be sold.
          </p>
        ) : (
          variants.map(variant => (
            <VariantRow key={variant.id} variant={variant} product={product} />
          ))
        )}

        <div className="border border-dashed radius-8 p-16 mt-8">
          <p className="text-sm fw-semibold mb-12">Add a variant</p>

          <ActionForm
            action={createVariant}
            submitLabel="Add variant"
            hidden={{ product_id: product.id }}
            resetOnSuccess
          >
            <div className="row gy-3">
              <Field label="SKU" name="sku" placeholder="ZEEN-KURTA-S" required className="col-md-4" />
              <Field label="Name" name="name" placeholder="S / Indigo" required className="col-md-4" />
              <Field label="Price" name="price" placeholder="2499.00" inputMode="decimal" required className="col-md-4" />

              <Field label="Option 1 name" name="option_name" placeholder="Colour" className="col-md-3" />
              <Field label="Option 1 value" name="option_value" placeholder="Indigo" className="col-md-3" />
              <Field label="Option 2 name" name="option_name" placeholder="Size" className="col-md-3" />
              <Field label="Option 2 value" name="option_value" placeholder="S" className="col-md-3" />

              <Field
                label="Opening stock"
                name="initial_quantity"
                defaultValue={0}
                inputMode="numeric"
                className="col-md-4"
              />
              <Field
                label="Low-stock threshold"
                name="low_stock_threshold"
                defaultValue={0}
                inputMode="numeric"
                className="col-md-4"
              />

              <div className="col-md-4 d-flex align-items-end">
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    className="form-check-input m-0 flex-shrink-0"
                    type="checkbox"
                    id="variant-active"
                    name="active"
                    defaultChecked
                  />
                  <label className="form-check-label text-sm" htmlFor="variant-active">
                    Active
                  </label>
                </div>
              </div>
            </div>
          </ActionForm>
        </div>
      </div>
    </div>
  );
}
