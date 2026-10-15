'use client';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-share.css';

import '../../public/assets/icons/iconly/index.min.css';
import '../../public/assets/vendor/swiper/swiper-bundle.min.css';
import '../../public/assets/vendor/animate/animate.css';
import '../../public/assets/css/style.css';
import '../../public/assets/css/skin/skin-1.css';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ScrollToTopButton from '@/constant/ScrollToTopButton';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import type { UserProfile } from '@/types/auth';
import type { Cart, Wishlist } from '@/types/cart';

/**
 * The template's browser-side chrome, split out of the layout.
 *
 * The layout itself has to be a server component so it can read the session
 * cookie and the cart before rendering; the vendor CSS, the WOW animations
 * and the providers all need the browser, so they live here and receive
 * what the server resolved as props.
 */
export default function StorefrontShell({
  user,
  cart,
  wishlist,
  children,
}: {
  user: UserProfile | null;
  cart: Cart;
  wishlist: Wishlist;
  children: React.ReactNode;
}) {
  const path = usePathname();

  useEffect(() => {
    setTimeout(() => {
      const links = document.querySelectorAll('a[href="#"]');
      const handleClick = (event: any) => {
        event.preventDefault();
      };
      if (links) {
        links.forEach(link => {
          link.addEventListener('click', handleClick);
        });
      }
    }, 600);
  }, [path]);

  useEffect(() => {
    setTimeout(() => {
      const { WOW } = require('wowjs');
      const wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: false,
        once: true,
        live: false,
        callback: function (box: HTMLElement) {
          box.classList.add('will-animate');
          box.classList.add('animated');
        },
      });
      wow.init();
    }, 100);
  }, [path]);

  return (
    <>
      <AuthProvider user={user}>
        <CartProvider initialCart={cart}>
          <WishlistProvider initialWishlist={wishlist}>{children}</WishlistProvider>
        </CartProvider>
      </AuthProvider>
      <ScrollToTopButton />
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}
