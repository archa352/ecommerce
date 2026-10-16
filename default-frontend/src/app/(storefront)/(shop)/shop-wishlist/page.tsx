import homeStyles from '@/app/(storefront)/(home)/home/_components/luxe/Home.module.css';
import LuxeFooter from '@/components/luxe/LuxeFooter';
import LuxeHeader from '@/components/luxe/LuxeHeader';
import MobileBottomNav from '@/components/luxe/MobileBottomNav';

import ShopWishList from './_components/ShopWishList';

export const metadata = {
  title: 'Wishlist | Zeen',
  description: 'Everything you have saved to your Zeen wishlist.',
};

export default function ShopWishListPage() {
  return (
    <div className={homeStyles.page}>
      <LuxeHeader />
      <ShopWishList />
      <LuxeFooter />
      <MobileBottomNav />
    </div>
  );
}
