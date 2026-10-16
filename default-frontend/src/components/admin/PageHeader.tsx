import Link from 'next/link';

/** Title row shared by every admin page, with an optional trail back up. */
export default function PageHeader({
  title,
  subtitle,
  trail,
  action,
}: {
  title: string;
  subtitle?: string;
  trail?: { label: string; href: string }[];
  action?: React.ReactNode;
}) {
  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
      <div>
        {trail && trail.length > 0 && (
          <p className="text-sm text-secondary-light mb-4 d-flex align-items-center gap-1">
            {trail.map((crumb, index) => (
              <span key={crumb.href} className="d-inline-flex align-items-center gap-1">
                {index > 0 && <span>/</span>}
                <Link href={crumb.href} className="text-secondary-light hover-text-primary">
                  {crumb.label}
                </Link>
              </span>
            ))}
          </p>
        )}
        <h6 className="fw-semibold mb-0">{title}</h6>
        {subtitle && <p className="text-sm text-secondary-light mb-0 mt-4">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
