'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState, useTransition } from 'react';

import { addCartItem, clearCart, removeCartLine, setCartItemQuantity } from '@/lib/cart/actions';
import type { Cart, CartItem } from '@/types/cart';

interface CartContextType {
  cart: Cart;
  items: CartItem[];
  itemCount: number;
  pending: boolean;
  error: string | null;
  cartDrawerOpen: boolean;
  closeCartDrawer: () => void;
  openCartDrawer: () => void;
  /** Each mutation resolves to the API's error message, or null when it succeeded. */
  addToCart: (variantId: string, quantity: number) => Promise<string | null>;
  updateQuantity: (itemId: string, quantity: number) => Promise<string | null>;
  removeFromCart: (itemId: string) => Promise<string | null>;
  clearCart: () => Promise<string | null>;
}

const CartContext = createContext<CartContextType | null>(null);

/**
 * The cart, held by the backend rather than in the browser.
 *
 * Every mutation answers with the whole cart, so prices, line subtotals and
 * stock always come from the API and are never recomputed here. The router
 * refresh afterwards is what lets server-rendered views -- the header badge,
 * the checkout summary -- see the same change.
 */
export function CartProvider({ initialCart, children }: { initialCart: Cart; children: React.ReactNode }) {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>(initialCart);
  const [error, setError] = useState<string | null>(null);
  const [transitionPending, startTransition] = useTransition();
  const [mutationCount, setMutationCount] = useState(0);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart]);

  async function run(mutation: Promise<{ cart: Cart; error: string | null }>, openDrawerOnSuccess = false) {
    setMutationCount(count => count + 1);
    try {
      const result = await mutation;

      setCart(result.cart);
      setError(result.error);
      if (openDrawerOnSuccess && !result.error) setCartDrawerOpen(true);

      startTransition(() => router.refresh());
      return result.error;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'We could not update your cart. Please try again.';
      setError(message);
      return message;
    } finally {
      setMutationCount(count => Math.max(0, count - 1));
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart.items,
        itemCount: cart.item_count,
        pending: transitionPending || mutationCount > 0,
        error,
        cartDrawerOpen,
        openCartDrawer: () => setCartDrawerOpen(true),
        closeCartDrawer: () => setCartDrawerOpen(false),
        addToCart: (variantId, quantity) => run(addCartItem(variantId, quantity), true),
        updateQuantity: (itemId, quantity) => run(setCartItemQuantity(itemId, quantity)),
        removeFromCart: itemId => run(removeCartLine(itemId)),
        clearCart: () => run(clearCart()),
      }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
