"use client";
import { useEffect, useState } from 'react';
// ...existing code...
import { itemsAPI, promotionsAPI, cartsAPI } from '@/lib/api';
import { Item, Promotion, Cart } from '@/types';
import ItemList from '@/components/ItemList';
import CartView from '@/components/CartView';
import PromotionsList from '@/components/PromotionsList';
import ErrorAlert from '@/components/ErrorAlert';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import PromoCodeInput from '@/components/PromoCodeInput';
import Toast from '@/components/Toast';

  export default function Home() {
    const [items, setItems] = useState<Item[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [cart, setCart] = useState<Cart | null>(null);
    const [cartId, setCartId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
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


    const fetchCart = async () => {
      if (!cartId) return;
      try {
        const cartData = await cartsAPI.get(cartId);
        setCart(cartData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cart');
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

  const handleAddToCart = async (item: Item, quantity: number, weight?: number) => {
    if (!cartId) return;
    try {
      setErrorMessage(null);
      const { cart: updatedCart, message } = await cartsAPI.addItem(
        cartId,
        item.id,
        item.sale_unit === 'quantity' ? quantity : undefined,
        item.sale_unit === 'weight' ? weight : undefined
      );
      setCart(updatedCart);
      setSuccessMessage(message);
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to add item to cart';
      setErrorMessage(errorMsg);
      setSuccessMessage(null);
      setTimeout(() => setErrorMessage(null), 5000);
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
            <div className="flex items-center gap-4">
              <a
                href="/inventory"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md border border-gray-300 hover:border-indigo-300 bg-white transition-colors"
              >
                📦 Manage Inventory
              </a>
              <a
                href="/cart"
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>View Cart {cart && cart.items.length > 0 && `(${cart.items.length})`}</span>
              </a>
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

      <Toast message={successMessage || ''} type="success" onClose={() => setSuccessMessage(null)} duration={5000} />
      <Toast message={errorMessage || ''} type="error" onClose={() => setErrorMessage(null)} duration={5000} />

      {/* Active Promotions Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <PromotionsList promotions={promotions} />
      </div>


      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ItemList items={items} onAddToCart={handleAddToCart} />
      </main>
    </div>
  );
}
