import { Icon } from '@iconify/react';

import { mediaUrl } from '@/lib/media';

/**
 * A product thumbnail, or an obviously-empty slot when there is none.
 *
 * The empty state is drawn as a dashed outline rather than a filled square:
 * a solid block reads as a tile that failed to load, especially in the dark
 * theme where the neutral fill is a near-opaque slate.
 *
 * Catalogue images are remote and unoptimised on purpose -- seed and
 * uploaded URLs point at hosts next.config does not allow through
 * next/image.
 */
export default function Thumb({
  url,
  alt,
  size = 40,
}: {
  url?: string | null;
  alt?: string | null;
  size?: number;
}) {
  const box = { width: size, height: size };

  if (!url) {
    return (
      <span
        className="radius-8 d-inline-flex align-items-center justify-content-center flex-shrink-0 border border-dashed text-secondary-light"
        style={{ ...box, borderColor: 'var(--border-color)' }}
        aria-label="No image"
        title="No image"
      >
        <Icon icon="solar:gallery-outline" width={Math.round(size * 0.45)} />
      </span>
    );
  }

  return (
    <img
      src={mediaUrl(url)}
      alt={alt ?? ''}
      className="radius-8 object-fit-cover flex-shrink-0"
      style={box}
    />
  );
}
