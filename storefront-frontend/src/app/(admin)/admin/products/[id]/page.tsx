import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import CatalogueStatusBadge from '@/components/admin/CatalogueStatusBadge';
import DangerAction from '@/components/admin/DangerAction';
import ImagePanel from '@/components/admin/ImagePanel';
import PageHeader from '@/components/admin/PageHeader';
import VariantPanel from '@/components/admin/VariantPanel';
import { archiveProduct } from '@/lib/admin/actions';
import { adminApi } from '@/lib/api/admin';
import { ApiError } from '@/lib/api/errors';
import { requireStaff } from '@/lib/auth/require-staff';

export const metadata: Metadata = { title: 'Product | Admin' };

export default async function AdminProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ failed?: string }>;
}) {
  const { token } = await requireStaff();
  const { id } = await params;
  const { failed } = await searchParams;
  const problems = (failed ?? '').split(',').filter(Boolean);

  const product = await adminApi.getProduct(token, id).catch(error => {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  });

  /* Variants carry their own inventory, so stock needs no extra round trip.
     A failure here costs the variants panel, not the page. */
  const variants = await adminApi
    .listVariants(token, id, { page_size: 100 })
    .then(result => result.items)
    .catch(() => []);

  const options = product.options
    ? [...product.options].sort((a, b) => a.position - b.position).map(option => option.name)
    : [];

  return (
    <>
      <PageHeader
        title={product.name}
        subtitle={product.short_description ?? undefined}
        trail={[{ label: 'Products', href: '/admin/products' }]}
        action={
          <div className="d-flex align-items-center gap-3">
            <CatalogueStatusBadge status={product.status} />
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="btn btn-outline-primary-600 radius-8 px-16 py-6 text-sm"
            >
              Edit
            </Link>
            {product.status !== 'ARCHIVED' && (
              <DangerAction
                action={archiveProduct}
                fields={{ product_id: product.id }}
                label="Archive product"
                confirmLabel="Archive it"
              />
            )}
          </div>
        }
      />

      {problems.length > 0 && (
        <div className="alert alert-warning radius-8 mb-24" role="alert">
          The product was created, but{' '}
          {problems.includes('upload') && (
            <>its image did not upload — it is showing a placeholder, so add the real photo below and
            delete the placeholder{problems.length > 1 ? ', and ' : '. '}</>
          )}
          {problems.includes('variant') && (
            <>its first variant was not created — add one below, or it has no price and cannot be
            bought.</>
          )}
        </div>
      )}

      <div className="row gy-4">
        <div className="col-12">
          <VariantPanel product={product} variants={variants} />
        </div>

        <div className="col-xxl-8">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="text-lg mb-16">Details</h6>

              <div className="d-flex align-items-center justify-content-between py-8 border-bottom">
                <span className="text-sm text-secondary-light">Brand</span>
                <span className="text-sm">{product.brand ?? '—'}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between py-8 border-bottom">
                <span className="text-sm text-secondary-light">Gender</span>
                <span className="text-sm">{product.gender ?? '—'}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between py-8 border-bottom">
                <span className="text-sm text-secondary-light">Featured</span>
                <span className="text-sm">{product.is_featured ? 'Yes' : 'No'}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between py-8 border-bottom">
                <span className="text-sm text-secondary-light">Options</span>
                <span className="text-sm">{options.length > 0 ? options.join(', ') : '—'}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between py-8">
                <span className="text-sm text-secondary-light">SEO title</span>
                <span className="text-sm">{product.seo_title ?? '—'}</span>
              </div>

              {product.description && (
                <>
                  <h6 className="text-lg mt-24 mb-12">Description</h6>
                  <p className="text-sm text-secondary-light mb-0">{product.description}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-xxl-4">
          <ImagePanel product={product} />
        </div>
      </div>
    </>
  );
}
