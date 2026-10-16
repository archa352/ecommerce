import MainFooter from '@/components/MainFoooter';

import NotFoundHeader from './NotFoundHeader';
import NotFoundHero from './NotFoundHero';

/**
 * The ZEEN-styled 404 body: header, hero, footer. Pulled out as its own
 * component so both `(storefront)/not-found.tsx` (fires when a storefront
 * page calls `notFound()`, e.g. an invalid product id) and the root
 * `not-found.tsx` (fires for an arbitrary unmatched URL -- see that file's
 * comment for why it has to exist separately) render the same page.
 */
export default function NotFoundPage() {
  return (
    <div className="page-wraper">
      <NotFoundHeader />
      <NotFoundHero />
      <MainFooter />
    </div>
  );
}
