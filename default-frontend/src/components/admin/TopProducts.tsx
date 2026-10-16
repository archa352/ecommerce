import { formatMoney } from '@/lib/format';
import type { TopSellingProductItem } from '@/types/admin';

/** Ranked by units sold over the same window as the trend chart. */
export default function TopProducts({
  products,
  currency,
  days,
}: {
  products: TopSellingProductItem[];
  currency: string;
  days: number;
}) {
  return (
    <div className="col-xxl-4 col-xl-12">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-20">
            <h6 className="text-lg mb-0">Top products</h6>
            <span className="text-sm fw-medium text-neutral-500">Last {days} days</span>
          </div>

          {products.length === 0 ? (
            <p className="text-neutral-500 text-center py-40 mb-0">
              Nothing sold in this period yet.
            </p>
          ) : (
            <div className="d-flex flex-column gap-16">
              {products.map((product, index) => (
                <div key={product.product_id} className="d-flex align-items-center gap-12">
                  <span className="w-32-px h-32-px bg-neutral-200 text-neutral-600 rounded-circle d-flex justify-content-center align-items-center fw-semibold text-sm flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-grow-1 min-w-0">
                    <p className="text-md fw-medium mb-0 text-truncate">{product.product_name}</p>
                    <span className="text-sm text-neutral-500">
                      {product.quantity_sold} sold
                    </span>
                  </div>
                  <span className="fw-semibold text-sm flex-shrink-0">
                    {formatMoney(product.revenue_generated, currency)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
