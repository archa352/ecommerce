import { Icon } from '@iconify/react';

/** One look for "there is nothing here", whatever the reason. */
export default function EmptyState({
  icon = 'solar:inbox-outline',
  title,
  hint,
}: {
  icon?: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="text-center py-40">
      <Icon icon={icon} className="text-2xxl text-secondary-light mb-8" />
      <p className="mb-0 fw-medium">{title}</p>
      {hint && <p className="text-sm text-secondary-light mb-0">{hint}</p>}
    </div>
  );
}
