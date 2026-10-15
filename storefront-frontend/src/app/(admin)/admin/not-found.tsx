import Link from 'next/link';

import EmptyState from '@/components/admin/EmptyState';

/**
 * The admin group's own 404.
 *
 * `(admin)` is a separate root layout, so the root `not-found.tsx` (which
 * renders the storefront's 404 in its own `<html>`) cannot serve these
 * routes -- without this file `notFound()` from an admin page returns an
 * empty 200. It sits under /admin so it renders inside the admin shell.
 */
export default function AdminNotFound() {
  return (
    <div className="card">
      <div className="card-body">
        <EmptyState
          icon="solar:question-circle-outline"
          title="That page does not exist."
          hint="The record may have been deleted, or the link may be wrong."
        />
        <div className="text-center">
          <Link href="/admin" className="btn btn-primary-600 radius-8 px-20 py-9">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
