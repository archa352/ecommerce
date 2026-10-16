import Link from 'next/link';
import { notFound } from 'next/navigation';

import ProductReviews from '@/elements/SingleProductPage/ProductReviews';
import SingleProduct from '@/elements/SingleProductPage/SingleProduct';
import { catalogueApi } from '@/lib/api/catalogue';
import { ApiError } from '@/lib/api/errors';
import { reviewApi } from '@/lib/api/reviews';
import { getCurrentUser } from '@/lib/auth/current-user';
import type { ProductStorefront } from '@/types/catalogue';

import homeStyles from '../../../(home)/home/_components/luxe/Home.module.css';
import listingStyles from '../../shop-list/_components/luxe/Listing.module.css';
import productStyles from '@/elements/SingleProductPage/luxe/Product.module.css';

const SingleProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  let product: ProductStorefront;

  try {
    product = await catalogueApi.getProduct(id);
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  }

  /* A product with no reviews still renders, with an empty star row, and
     "you might also like" falls back to nothing rather than to filler. */
  const [summary, related, reviews, user] = await Promise.all([
    reviewApi.summary(id).catch(() => null),
    catalogueApi
      .listProducts({ category_id: product.category.id, page_size: 4 })
      .then(page => page.items.filter(item => item.id !== product.id).slice(0, 3))
      .catch(() => []),
    reviewApi
      .listForProduct(id, { page_size: 20 })
      .then(page => page.items)
      .catch(() => []),
    getCurrentUser().catch(() => null),
  ]);

  return (
    <div className={homeStyles.page}>
      <section className={productStyles.crumbBar}>
        <div className={homeStyles.container}>
          <p className={listingStyles.crumb} style={{ margin: 0 }}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/shop-list">Shop</Link>
            <span>/</span>
            <span aria-current="page">{product.name}</span>
          </p>
        </div>
      </section>

      <div className={homeStyles.container}>
        <SingleProduct product={product} rating={summary ? summary.average_rating : 0} related={related} />
      </div>

      <ProductReviews productId={id} reviews={reviews} summary={summary} currentUserId={user?.id ?? null} />
    </div>
  );
};

export default SingleProductPage;
