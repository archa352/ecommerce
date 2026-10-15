import type { Metadata } from 'next';

import EmptyState from '@/components/admin/EmptyState';
import PageHeader from '@/components/admin/PageHeader';
import { ShippingForm, TaxForm } from '@/components/admin/SettingsForms';
import { adminApi } from '@/lib/api/admin';
import { requireStaff } from '@/lib/auth/require-staff';

export const metadata: Metadata = { title: 'Settings | Admin' };

/**
 * The two numbers checkout prices every order with.
 *
 * They are the only store settings the backend exposes -- there is no
 * endpoint for the tenant's name, currency or anything else, so nothing
 * else is offered here.
 */
export default async function AdminSettingsPage() {
  const { token } = await requireStaff();

  const [shipping, tax] = await Promise.all([
    adminApi.getShippingSettings(token).catch(() => null),
    adminApi.getTaxSettings(token).catch(() => null),
  ]);

  return (
    <>
      <PageHeader title="Settings" subtitle="What checkout charges on top of the basket." />

      <div className="row gy-4">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="text-lg mb-20">Shipping</h6>
              {shipping === null ? (
                <EmptyState title="Could not load shipping settings." />
              ) : (
                <ShippingForm settings={shipping} />
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="text-lg mb-20">Tax</h6>
              {tax === null ? <EmptyState title="Could not load tax settings." /> : <TaxForm settings={tax} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
