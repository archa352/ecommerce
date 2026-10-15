import Link from 'next/link';

/** Page numbers around the current one, e.g. 1 … 4 5 [6] 7 8 … 12. */
function window(current: number, total: number): (number | 'gap')[] {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter(page => page >= 1 && page <= total).sort((a, b) => a - b);

  const out: (number | 'gap')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push('gap');
    out.push(sorted[i]);
  }
  return out;
}

export default function Pagination({
  page,
  totalPages,
  totalItems,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  hrefFor: (page: number) => string;
}) {
  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
      <span className="text-sm text-secondary-light">
        {totalItems} {totalItems === 1 ? 'result' : 'results'}
      </span>

      {totalPages > 1 && (
        <nav aria-label="Pagination">
          <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center mb-0">
            {page > 1 && (
              <li className="page-item">
                <Link className="page-link px-12 py-6 radius-8" href={hrefFor(page - 1)}>
                  Previous
                </Link>
              </li>
            )}

            {window(page, totalPages).map((entry, index) =>
              entry === 'gap' ? (
                <li key={`gap-${index}`} className="page-item">
                  <span className="px-8 text-secondary-light">…</span>
                </li>
              ) : (
                <li key={entry} className="page-item">
                  <Link
                    className={`page-link px-12 py-6 radius-8 ${entry === page ? 'bg-primary-600 text-white' : ''}`}
                    href={hrefFor(entry)}
                    aria-current={entry === page ? 'page' : undefined}
                  >
                    {entry}
                  </Link>
                </li>
              ),
            )}

            {page < totalPages && (
              <li className="page-item">
                <Link className="page-link px-12 py-6 radius-8" href={hrefFor(page + 1)}>
                  Next
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}
