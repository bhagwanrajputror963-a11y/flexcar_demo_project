'use client';

import { useEffect, useState } from 'react';
import { itemsAPI, promotionsAPI, cartsAPI } from '@/lib/api';
import { Item, Promotion, Cart } from '@/types';
import ItemList from '@/components/ItemList';
import CartView from '@/components/CartView';
import PromotionsList from '@/components/PromotionsList';
import ErrorAlert from '@/components/ErrorAlert';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeApp();
  }, []);

  useEffect(() => {
    if (cartId && mounted) {
      localStorage.setItem('cartId', cartId.toString());
      fetchCart();
    }
  }, [cartId, mounted]);

  const initializeApp = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load items and promotions
      const [itemsData, promotionsData] = await Promise.all([
        itemsAPI.getAll(),
        promotionsAPI.getAll(),
      ]);

      setItems(itemsData);
      setPromotions(promotionsData);

      // Check for existing cart or create new one (only on client)
      if (typeof window !== 'undefined') {
        const savedCartId = localStorage.getItem('cartId');
        if (savedCartId) {
          try {
            const cartData = await cartsAPI.get(parseInt(savedCartId));
            setCart(cartData);
            setCartId(parseInt(savedCartId));
          } catch {
            // Cart doesn't exist, create new one
            await createNewCart();
          }
        } else {
          await createNewCart();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const createNewCart = async () => {
    try {
      const { cart_id } = await cartsAPI.create();
      setCartId(cart_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create cart');
    }
  };

  const fetchCart = async () => {
    if (!cartId) return;

    try {
      const cartData = await cartsAPI.get(cartId);
      setCart(cartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
    }
  };

  const handleAddToCart = async (item: Item, quantity: number, weight?: number) => {
    if (!cartId) return;

    try {
      setError(null);
      const { cart: updatedCart, message } = await cartsAPI.addItem(
        cartId,
        item.id,
        item.sale_unit === 'quantity' ? quantity : undefined,
        item.sale_unit === 'weight' ? weight : undefined
      );
      setCart(updatedCart);
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to add item to cart');
    }
  };

  const handleRemoveFromCart = async (itemId: number) => {
    if (!cartId) return;

    try {
      setError(null);
      const { cart: updatedCart, message } = await cartsAPI.removeItem(cartId, itemId);
      setCart(updatedCart);
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to remove item from cart');
    }
  };

  const handleClearCart = async () => {
    if (!cartId) return;

    try {
      setError(null);
      const { cart: updatedCart, message } = await cartsAPI.clear(cartId);
      setCart(updatedCart);
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to clear cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Flexcar Promotions Store</h1>
              <p className="mt-1 text-sm text-gray-600">
                Smart promotions automatically applied to your cart
              </p>
            </div>
            <div className="flex items-center space-x-2 text-indigo-600">
              <ShoppingCartIcon className="h-8 w-8" />
              <span className="text-2xl font-bold">{cart?.items.length || 0}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <ErrorAlert message={error} onClose={() => setError(null)} />
        </div>
      )}

      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Items */}
          <div className="lg:col-span-2">
            <ItemList items={items} onAddToCart={handleAddToCart} />
          </div>

          {/* Right Column: Cart and Promotions */}
          <div className="space-y-8">
            <CartView
              cart={cart}
              onRemoveItem={handleRemoveFromCart}
              onClearCart={handleClearCart}
            />
            <PromotionsList promotions={promotions} />
          </div>
        </div>
      </main>
    </div>
  );
}
