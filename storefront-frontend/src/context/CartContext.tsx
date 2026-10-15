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
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
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
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart]);

  async function run(mutation: Promise<{ cart: Cart; error: string | null }>) {
    const result = await mutation;

    setCart(result.cart);
    setError(result.error);

    startTransition(() => router.refresh());
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart.items,
        itemCount: cart.item_count,
        pending,
        error,
        addToCart: (variantId, quantity) => run(addCartItem(variantId, quantity)),
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
