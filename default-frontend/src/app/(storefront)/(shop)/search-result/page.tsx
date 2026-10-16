import Link from 'next/link';

import CommonBanner2 from '@/components/CommonBanner2';
import ProductCard from '@/elements/Shop/ProductCard';
import { catalogueApi } from '@/lib/api/catalogue';
import { searchApi } from '@/lib/api/search';
import { getAccessToken } from '@/lib/auth/session';
import type { ProductStorefront, ProductSummaryStorefront } from '@/types/catalogue';

const PAGE_SIZE = 24;

function toSummary(product: ProductStorefront): ProductSummaryStorefront {
  return {
    id: product.id,
    category_id: product.category.id,
    name: product.name,
    short_description: product.short_description,
    brand: product.brand,
    is_featured: product.is_featured,
    primary_image: product.images.find(image => image.is_primary) ?? product.images[0] ?? null,
    price_from: product.price_from,
    price_to: product.price_to,
    in_stock: product.in_stock,
  };
}

/**
 * The search results grid.
 *
 * `/storefront/search-products` carries no image, so each match is resolved
 * against `/storefront/products/{id}` for the card the rest of the site
 * uses -- and, when the shopper is signed in, this is also what records the
 * query in their search history.
 */
export default async function SearchResultPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = '', page: pageParam } = await searchParams;
  const query = q.trim();
  const page = Math.max(1, Number(pageParam ?? 1) || 1);

  const token = await getAccessToken();

  const results = query
    ? await searchApi.searchProducts({ q: query, page, size: PAGE_SIZE }, token).catch(() => null)
    : null;

  const detailed = results
    ? await Promise.all(results.items.map(item => catalogueApi.getProduct(item.id).catch(() => null)))
    : [];

  const products = detailed
    .filter((item): item is ProductStorefront => item !== null)
    .map(toSummary);

  return (
    <>
      <CommonBanner2
        parentText="Home"
        currentText="Search"
        mainText={query ? `Results for "${query}"` : 'Search'}
      />

      <div className="container py-5">
        {!query && <p>Enter a search term to find products.</p>}

        {query && products.length === 0 && <p>No products matched &quot;{query}&quot;.</p>}

        {products.length > 0 && (
          <div className="row gx-xl-4 g-3">
            {products.map(product => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {results && results.meta.total_pages > 1 && (
          <div className="d-flex justify-content-center gap-3 mt-5">
            {page > 1 && (
              <Link
                href={`/search-result?q=${encodeURIComponent(query)}&page=${page - 1}`}
                className="btn btn-secondary btnhover">
                Previous
              </Link>
            )}

            {page < results.meta.total_pages && (
              <Link
                href={`/search-result?q=${encodeURIComponent(query)}&page=${page + 1}`}
                className="btn btn-secondary btnhover">
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
