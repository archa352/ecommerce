import Field from '@/components/admin/Field';
import type { CategoryAdmin, ProductAdmin } from '@/types/catalogue-admin';

const GENDERS = ['MEN', 'WOMEN', 'UNISEX'];

/**
 * The product body, shared by the create and edit forms.
 *
 * Create posts an `active` checkbox (a new product is a draft unless the
 * box is ticked) while edit exposes the full status including ARCHIVED,
 * which is the one state a form should not be able to set by accident.
 */
export default function ProductFormFields({
  categories,
  product,
  mode,
}: {
  categories: CategoryAdmin[];
  product?: ProductAdmin;
  mode: 'create' | 'edit';
}) {
  return (
    <div className="row gy-3">
      <Field label="Name" name="name" defaultValue={product?.name} required />

      <div className="col-md-6">
        <label className="form-label text-sm fw-medium" htmlFor="category_id">
          Category <span className="text-danger-main">*</span>
        </label>
        <select
          id="category_id"
          name="category_id"
          className="form-select radius-8"
          defaultValue={product?.category_id ?? ''}
          required
        >
          <option value="" disabled>
            Choose a category
          </option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <Field label="Brand" name="brand" defaultValue={product?.brand} />

      <div className="col-md-6">
        <label className="form-label text-sm fw-medium" htmlFor="gender">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          className="form-select radius-8"
          defaultValue={product?.gender ?? ''}
        >
          <option value="">Not specified</option>
          {GENDERS.map(value => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <Field
        label="Short description"
        name="short_description"
        defaultValue={product?.short_description}
        className="col-12"
      />

      <div className="col-12">
        <label className="form-label text-sm fw-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="form-control radius-8"
          rows={4}
          defaultValue={product?.description ?? ''}
        />
      </div>

      <Field label="SEO title" name="seo_title" defaultValue={product?.seo_title} />
      <Field label="SEO description" name="seo_description" defaultValue={product?.seo_description} />

      {mode === 'edit' ? (
        <div className="col-md-6">
          <label className="form-label text-sm fw-medium" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="form-select radius-8"
            defaultValue={product?.status ?? 'DRAFT'}
          >
            <option value="DRAFT">Draft — hidden from the storefront</option>
            <option value="ACTIVE">Active — on sale</option>
            <option value="ARCHIVED">Archived — retired</option>
          </select>
        </div>
      ) : (
        <div className="col-md-6 d-flex align-items-end">
          <div className="form-check d-flex align-items-center gap-2">
            <input
              className="form-check-input m-0 flex-shrink-0"
              type="checkbox"
              id="active"
              name="active"
            />
            <label className="form-check-label text-sm" htmlFor="active">
              Publish straight away (otherwise saved as a draft)
            </label>
          </div>
        </div>
      )}

      <div className="col-md-6 d-flex align-items-end">
        <div className="form-check d-flex align-items-center gap-2">
          <input
            className="form-check-input m-0 flex-shrink-0"
            type="checkbox"
            id="is_featured"
            name="is_featured"
            defaultChecked={product?.is_featured ?? false}
          />
          <label className="form-check-label text-sm" htmlFor="is_featured">
            Feature on the storefront
          </label>
        </div>
      </div>
    </div>
  );
}
