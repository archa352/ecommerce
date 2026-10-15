import type { Metadata } from 'next';
import Link from 'next/link';

import CatalogueStatusBadge from '@/components/admin/CatalogueStatusBadge';
import EmptyState from '@/components/admin/EmptyState';
import PageHeader from '@/components/admin/PageHeader';
import Pagination from '@/components/admin/Pagination';
import Thumb from '@/components/admin/Thumb';
import { adminApi } from '@/lib/api/admin';
import { requireStaff } from '@/lib/auth/require-staff';
import type { CatalogueStatus } from '@/types/catalogue-admin';

export const metadata: Metadata = { title: 'Products | Admin' };

const PAGE_SIZE = 20;
const STATUSES: CatalogueStatus[] = ['DRAFT', 'ACTIVE', 'ARCHIVED'];

function asStatus(value: string | undefined): CatalogueStatus | undefined {
  return STATUSES.includes(value as CatalogueStatus) ? (value as CatalogueStatus) : undefined;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; category_id?: string }>;
}) {
  const { token } = await requireStaff();
  const params = await searchParams;

  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const search = (params.search ?? '').trim();
  const status = asStatus(params.status);
  const categoryId = (params.category_id ?? '').trim();

  /* The category filter needs names for the ids the products carry, and the
     dropdown needs the full list either way. */
  const [products, categories] = await Promise.all([
    adminApi
      .listProducts(token, {
        page,
        page_size: PAGE_SIZE,
        search: search || undefined,
        status,
        category_id: categoryId || undefined,
      })
      .catch(() => null),
    adminApi
      .listCategories(token, { page_size: 100 })
      .then(result => result.items)
      .catch(() => []),
  ]);

  const categoryName = new Map(categories.map(category => [category.id, category.name]));

  function hrefFor(nextPage: number) {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (status) query.set('status', status);
    if (categoryId) query.set('category_id', categoryId);
    if (nextPage > 1) query.set('page', String(nextPage));
    const encoded = query.toString();
    return encoded ? `/admin/products?${encoded}` : '/admin/products';
  }

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="The catalogue as staff see it, drafts and archives included."
        action={
          <Link href="/admin/products/new" className="btn btn-primary-600 radius-8 px-20 py-9">
            New product
          </Link>
        }
      />

      <div className="card">
        <div className="card-body">
          <form className="row gy-3 align-items-end mb-24" method="get">
            <div className="col-sm-6 col-md-3">
              <label className="form-label text-sm fw-medium" htmlFor="search">
                Search
              </label>
              <input
                id="search"
                name="search"
                type="search"
                className="form-control radius-8"
                placeholder="Product name"
                defaultValue={search}
              />
            </div>

            <div className="col-sm-6 col-md-3">
              <label className="form-label text-sm fw-medium" htmlFor="category_id">
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                className="form-select radius-8"
                defaultValue={categoryId}
              >
                <option value="">All</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-6 col-md-2">
              <label className="form-label text-sm fw-medium" htmlFor="status">
                Status
              </label>
              <select id="status" name="status" className="form-select radius-8" defaultValue={status ?? ''}>
                <option value="">All</option>
                {STATUSES.map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 d-flex gap-2">
              <button type="submit" className="btn btn-primary-600 radius-8 px-20 py-9">
                Filter
              </button>
              <Link href="/admin/products" className="btn btn-outline-secondary radius-8 px-20 py-9">
                Reset
              </Link>
            </div>
          </form>

          {products === null ? (
            <EmptyState title="Could not load products." hint="The API did not answer." />
          ) : products.items.length === 0 ? (
            <EmptyState
              icon="solar:box-outline"
              title="No products match these filters."
              hint="Create one with the button above."
            />
          ) : (
            <>
              <div className="table-responsive scroll-sm">
                <table className="table bordered-table sm-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col">Category</th>
                      <th scope="col">Brand</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="text-end">
                        &nbsp;
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.items.map(product => {
                      const primary = product.images.find(image => image.is_primary) ?? product.images[0];

                      return (
                        <tr key={product.id}>
                          <td>
                            <div className="d-flex align-items-center gap-12">
                              <Thumb url={primary?.url} alt={primary?.alt_text} />
                              <div className="min-w-0">
                                <span className="fw-medium d-block text-truncate">{product.name}</span>
                                {product.is_featured && (
                                  <span className="text-xs text-primary-600">Featured</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-sm">{categoryName.get(product.category_id) ?? '—'}</td>
                          <td className="text-sm">{product.brand ?? '—'}</td>
                          <td>
                            <CatalogueStatusBadge status={product.status} />
                          </td>
                          <td className="text-end">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="text-primary-600 fw-medium text-sm"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={products.meta.page}
                totalPages={products.meta.total_pages}
                totalItems={products.meta.total_items}
                hrefFor={hrefFor}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
