import { useEffect, useState } from 'react';
import { CART_UPDATED_EVENT, loadCart } from '@/utils/localStorage';
import type { CartItem } from '@/types/checkout';

const getCartCount = () => {
  const cart = loadCart();
  const items = (cart.items ?? []) as CartItem[];
  return items.reduce((total, item) => total + (item.quantity || 0), 0);
};

export const useCartCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setCount(getCartCount());

    updateCount();

    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener(CART_UPDATED_EVENT, updateCount);
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  return count;
};
