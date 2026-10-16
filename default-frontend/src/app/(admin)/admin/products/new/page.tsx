import type { Metadata } from 'next';

import ActionForm from '@/components/admin/ActionForm';
import EmptyState from '@/components/admin/EmptyState';
import Field from '@/components/admin/Field';
import PageHeader from '@/components/admin/PageHeader';
import ProductFormFields from '@/components/admin/ProductFormFields';
import { createProduct } from '@/lib/admin/actions';
import { adminApi } from '@/lib/api/admin';
import { requireStaff } from '@/lib/auth/require-staff';

export const metadata: Metadata = { title: 'New product | Admin' };

export default async function NewProductPage() {
  const { token } = await requireStaff();

  const categories = await adminApi
    .listCategories(token, { page_size: 100 })
    .then(page => page.items.filter(category => category.status !== 'ARCHIVED'))
    .catch(() => []);

  return (
    <>
      <PageHeader
        title="New product"
        subtitle="Everything the storefront needs: details, a photo, and the first variant to sell."
        trail={[{ label: 'Products', href: '/admin/products' }]}
      />

      <div className="card">
        <div className="card-body">
          {categories.length === 0 ? (
            <EmptyState
              title="No categories to put a product in."
              hint="Create a category first — every product belongs to one."
            />
          ) : (
            <ActionForm action={createProduct} submitLabel="Create product" pendingLabel="Creating…">
              <ProductFormFields categories={categories} mode="create" />

              <hr className="my-24" />

              <h6 className="text-md mb-4">First image</h6>
              <p className="text-sm text-secondary-light mb-16">
                Required — a product cannot be created without one. The file is stored by the API and
                served from it, so it survives a rebuild. JPEG, PNG or WebP, up to 5MB; anything larger
                than 2000px is scaled down for you.
              </p>

              <div className="row gy-3">
                <div className="col-md-6">
                  <label className="form-label text-sm fw-medium" htmlFor="image">
                    Image file <span className="text-danger-main">*</span>
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="form-control radius-8"
                    required
                  />
                </div>
                <Field label="Alt text" name="image_alt" placeholder="What the photo shows" />
              </div>

              <hr className="my-24" />

              <h6 className="text-md mb-4">First variant</h6>
              <p className="text-sm text-secondary-light mb-16">
                Also required — a product with no variant has no price and nothing a shopper can add to
                a basket. Add more sizes or colours on the product page afterwards.
              </p>

              <div className="row gy-3">
                <Field label="SKU" name="sku" placeholder="ZEEN-KURTA-S" required className="col-md-4" />
                <Field
                  label="Variant name"
                  name="variant_name"
                  placeholder="S / Indigo — defaults to “Default”"
                  className="col-md-4"
                />
                <Field
                  label="Price"
                  name="price"
                  placeholder="2499.00"
                  inputMode="decimal"
                  required
                  className="col-md-4"
                />

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
              </div>
            </ActionForm>
          )}
        </div>
      </div>
    </>
  );
}
