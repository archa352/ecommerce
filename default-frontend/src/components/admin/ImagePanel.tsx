import ActionForm from '@/components/admin/ActionForm';
import DangerAction from '@/components/admin/DangerAction';
import Field from '@/components/admin/Field';
import Thumb from '@/components/admin/Thumb';
import {
  addProductImage,
  deleteProductImage,
  setPrimaryImage,
  uploadProductImage,
} from '@/lib/admin/actions';
import type { ProductAdmin } from '@/types/catalogue-admin';

/**
 * Product photography: upload a file, or point at one already hosted.
 *
 * Uploads go through the API, which writes them into the container's
 * uploads volume and hands back a /media URL -- so they survive a rebuild.
 * The backend refuses to delete a product's last image, and that refusal is
 * shown on the button that tried.
 */
export default function ImagePanel({ product }: { product: ProductAdmin }) {
  const images = [...product.images].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="card">
      <div className="card-body">
        <h6 className="text-lg mb-20">Images</h6>

        {images.length === 0 ? (
          <div className="d-flex align-items-center gap-12 mb-20">
            <Thumb size={56} />
            <p className="text-sm text-secondary-light mb-0">No images yet.</p>
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-3 mb-20">
            {images.map(image => (
              <div
                key={image.id}
                className="d-flex flex-column align-items-center gap-2 border radius-8 p-8"
                style={{ width: 112 }}
              >
                <span className="position-relative">
                  <Thumb url={image.url} alt={image.alt_text} size={88} />
                  {image.is_primary && (
                    <span className="position-absolute bottom-0 start-0 bg-primary-600 text-white text-xs px-4 radius-4">
                      Primary
                    </span>
                  )}
                </span>

                {!image.is_primary && (
                  <ActionForm
                    action={setPrimaryImage}
                    submitLabel="Make primary"
                    hidden={{ image_id: image.id, product_id: product.id }}
                    inline
                    submitClassName="btn btn-outline-primary-600 radius-8 px-12 py-4 text-xs"
                  >
                    <span />
                  </ActionForm>
                )}

                <DangerAction
                  action={deleteProductImage}
                  fields={{ image_id: image.id, product_id: product.id }}
                  label="Delete"
                  confirmLabel="Delete"
                  size="xs"
                />
              </div>
            ))}
          </div>
        )}

        <div className="border border-dashed radius-8 p-16 mb-16">
          <p className="text-sm fw-semibold mb-12">Upload a file</p>
          <ActionForm
            action={uploadProductImage}
            submitLabel="Upload"
            pendingLabel="Uploading…"
            hidden={{ product_id: product.id }}
            resetOnSuccess
          >
            <div className="row gy-3">
              <div className="col-md-6">
                <label className="form-label text-sm fw-medium" htmlFor="file">
                  Image file
                </label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*"
                  className="form-control radius-8"
                />
              </div>
              <Field label="Alt text" name="alt_text" placeholder="What the photo shows" />
            </div>
          </ActionForm>
        </div>

        <div className="border border-dashed radius-8 p-16">
          <p className="text-sm fw-semibold mb-12">Or add one by URL</p>
          <ActionForm
            action={addProductImage}
            submitLabel="Add image"
            hidden={{ product_id: product.id }}
            resetOnSuccess
          >
            <div className="row gy-3">
              <Field label="Image URL" name="url" placeholder="https://…" required />
              <Field label="Alt text" name="alt_text" />
            </div>
          </ActionForm>
        </div>
      </div>
    </div>
  );
}
