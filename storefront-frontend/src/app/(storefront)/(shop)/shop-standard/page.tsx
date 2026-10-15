import { catalogueApi } from '@/lib/api/catalogue';
import ShopStandard from './_components/ShopStandard';

/** The grid is served whole from the catalogue, paged by the backend. */
async function ShopStandardPage() {
  const page = await catalogueApi.listProducts({ page: 1, page_size: 24 });

  return (
    <>
      <ShopStandard products={page.items} totalItems={page.meta.total_items} />
    </>
  );
}

export default ShopStandardPage;
