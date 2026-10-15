import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ActionForm from '@/components/admin/ActionForm';
import PageHeader from '@/components/admin/PageHeader';
import ProductFormFields from '@/components/admin/ProductFormFields';
import { updateProduct } from '@/lib/admin/actions';
import { adminApi } from '@/lib/api/admin';
import { ApiError } from '@/lib/api/errors';
import { requireStaff } from '@/lib/auth/require-staff';

export const metadata: Metadata = { title: 'Edit product | Admin' };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { token } = await requireStaff();
  const { id } = await params;

  const product = await adminApi.getProduct(token, id).catch(error => {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  });

  const categories = await adminApi
    .listCategories(token, { page_size: 100 })
    .then(page => page.items)
    .catch(() => []);

  return (
    <>
      <PageHeader
        title={`Edit ${product.name}`}
        trail={[
          { label: 'Products', href: '/admin/products' },
          { label: product.name, href: `/admin/products/${product.id}` },
        ]}
      />

      <div className="card">
        <div className="card-body">
          <ActionForm
            action={updateProduct}
            submitLabel="Save changes"
            hidden={{ product_id: product.id }}
          >
            <ProductFormFields categories={categories} product={product} mode="edit" />
          </ActionForm>
        </div>
      </div>
    </>
  );
}
