import type { Metadata } from 'next';

import ActionForm from '@/components/admin/ActionForm';
import CatalogueStatusBadge from '@/components/admin/CatalogueStatusBadge';
import DangerAction from '@/components/admin/DangerAction';
import EmptyState from '@/components/admin/EmptyState';
import Field from '@/components/admin/Field';
import PageHeader from '@/components/admin/PageHeader';
import Pagination from '@/components/admin/Pagination';
import { archiveCategory, createCategory, updateCategory } from '@/lib/admin/actions';
import { adminApi } from '@/lib/api/admin';
import { requireStaff } from '@/lib/auth/require-staff';

export const metadata: Metadata = { title: 'Categories | Admin' };

const PAGE_SIZE = 20;

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { token } = await requireStaff();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const categories = await adminApi
    .listCategories(token, { page, page_size: PAGE_SIZE })
    .catch(() => null);

  return (
    <>
      <PageHeader title="Categories" subtitle="How the catalogue is grouped for shoppers." />

      <div className="card mb-24">
        <div className="card-body">
          <h6 className="text-md mb-16">New category</h6>
          <ActionForm action={createCategory} submitLabel="Create category" resetOnSuccess>
            <div className="row gy-3">
              <Field label="Name" name="name" placeholder="Kurtas" required className="col-md-4" />
              <Field
                label="Description"
                name="description"
                placeholder="What belongs in it"
                className="col-md-5"
              />
              <div className="col-md-3 d-flex align-items-end">
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    className="form-check-input m-0 flex-shrink-0"
                    type="checkbox"
                    id="new-category-active"
                    name="active"
                    defaultChecked
                  />
                  <label className="form-check-label text-sm" htmlFor="new-category-active">
                    Active
                  </label>
                </div>
              </div>
            </div>
          </ActionForm>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {categories === null ? (
            <EmptyState title="Could not load categories." hint="The API did not answer." />
          ) : categories.items.length === 0 ? (
            <EmptyState title="No categories yet." />
          ) : (
            <>
              <div className="table-responsive scroll-sm">
                <table className="table bordered-table sm-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Description</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="text-end">
                        &nbsp;
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.items.map(category => (
                      <tr key={category.id}>
                        <td colSpan={3}>
                          <ActionForm
                            action={updateCategory}
                            submitLabel="Save"
                            hidden={{ category_id: category.id }}
                            inline
                          >
                            <Field
                              label="Name"
                              name="name"
                              defaultValue={category.name}
                              required
                              hideLabel
                              className="flex-grow-1"
                            />
                            <Field
                              label="Description"
                              name="description"
                              defaultValue={category.description}
                              hideLabel
                              className="flex-grow-1"
                            />
                            <div className="form-check d-flex align-items-center gap-2">
                              <input
                                className="form-check-input m-0 flex-shrink-0"
                                type="checkbox"
                                id={`active-${category.id}`}
                                name="active"
                                defaultChecked={category.status === 'ACTIVE'}
                              />
                              <label className="form-check-label text-sm" htmlFor={`active-${category.id}`}>
                                Active
                              </label>
                            </div>
                          </ActionForm>
                          <span className="d-none">
                            <CatalogueStatusBadge status={category.status} />
                          </span>
                        </td>
                        <td className="text-end">
                          {category.status !== 'ARCHIVED' && (
                            <DangerAction
                              action={archiveCategory}
                              fields={{ category_id: category.id }}
                              label="Archive"
                              confirmLabel="Archive"
                              size="xs"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={categories.meta.page}
                totalPages={categories.meta.total_pages}
                totalItems={categories.meta.total_items}
                hrefFor={next => (next > 1 ? `/admin/categories?page=${next}` : '/admin/categories')}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
