import HomeClient from "./_components/luxe/HomeClient";
import { catalogueApi } from "@/lib/api/catalogue";
import type { CategoryStorefront, ProductStorefront } from "@/types/catalogue";

export const metadata = {
  title: "Zeen | Women's Ethnic & Casual Wear",
  description:
    "Zeen makes everyday and ethnic wear for women — churidars cut in considered fabrics with careful finishing and quiet modern ease.",
};

/**
 * Newest first, so the grid moves as the catalogue does.
 *
 * The product page is wider than the four tiles the grid shows: the category
 * strip borrows a product image per category, and categories carry no image
 * of their own, so the extra rows are what give those tiles something to
 * show. Categories are optional -- a failure there costs the strip its live
 * labels, not the whole page.
 */
const HomePage = async () => {
  const [productsPage, categories] = await Promise.all([
    catalogueApi.listProducts({ page_size: 24, sort: "newest" }),
    catalogueApi
      .listCategories({ page_size: 12 })
      .then(page => page.items)
      .catch((): CategoryStorefront[] => []),
  ]);

  const products = productsPage.items;

  // The spotlight section shows one product full-detail (its own gallery,
  // options and variants, not just the catalogue-tile thumbnail), so it
  // needs the full record.
  const spotlightProduct: ProductStorefront | null = products[0]
    ? await catalogueApi.getProduct(products[0].id).catch(() => null)
    : null;

  return <HomeClient products={products} categories={categories} spotlightProduct={spotlightProduct} />;
};

export default HomePage;
