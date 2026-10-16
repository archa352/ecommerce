import { Icon } from '@iconify/react';

import type { InventoryOverview, InventoryVariantItem } from '@/types/admin';

function VariantRow({ variant, tone }: { variant: InventoryVariantItem; tone: string }) {
  return (
    <div className="d-flex align-items-center justify-content-between gap-12 py-8 border-bottom">
      <div className="min-w-0">
        <p className="text-md fw-medium mb-0 text-truncate">{variant.product_name}</p>
        <span className="text-sm text-neutral-500">{variant.sku}</span>
      </div>
      <span className={`px-16 py-4 rounded-pill fw-medium text-sm flex-shrink-0 ${tone}`}>
        {variant.available_quantity} left
      </span>
    </div>
  );
}

/**
 * What needs restocking, with the counts first.
 *
 * The overview carries a sample of variants rather than the full list, so
 * the counts are authoritative and the rows underneath are examples.
 */
export default function InventoryAlerts({ inventory }: { inventory: InventoryOverview }) {
  const clear = inventory.out_of_stock_count === 0 && inventory.low_stock_count === 0;

  return (
    <div className="col-xxl-8 col-xl-12">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-20">
            <h6 className="text-lg mb-0">Inventory alerts</h6>
            <div className="d-flex align-items-center gap-12">
              <span className="text-sm fw-medium text-danger-main">
                {inventory.out_of_stock_count} out of stock
              </span>
              <span className="text-sm fw-medium text-warning-main">
                {inventory.low_stock_count} low
              </span>
            </div>
          </div>

          {clear ? (
            <p className="text-neutral-500 text-center py-40 mb-0 d-flex align-items-center justify-content-center gap-2">
              <Icon icon="solar:check-circle-bold" className="text-success-main text-xl" />
              Every variant is stocked above its threshold.
            </p>
          ) : (
            <div className="row gy-4">
              <div className="col-md-6">
                <p className="text-sm fw-semibold text-danger-main mb-8">Out of stock</p>
                {inventory.out_of_stock_variants.length === 0 ? (
                  <p className="text-sm text-neutral-500 mb-0">None.</p>
                ) : (
                  inventory.out_of_stock_variants.map(variant => (
                    <VariantRow
                      key={variant.variant_id ?? variant.sku}
                      variant={variant}
                      tone="bg-danger-focus text-danger-main"
                    />
                  ))
                )}
              </div>

              <div className="col-md-6">
                <p className="text-sm fw-semibold text-warning-main mb-8">Running low</p>
                {inventory.low_stock_variants.length === 0 ? (
                  <p className="text-sm text-neutral-500 mb-0">None.</p>
                ) : (
                  inventory.low_stock_variants.map(variant => (
                    <VariantRow
                      key={variant.variant_id ?? variant.sku}
                      variant={variant}
                      tone="bg-warning-focus text-warning-main"
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
