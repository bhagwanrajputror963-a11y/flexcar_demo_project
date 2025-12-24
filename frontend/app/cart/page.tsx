"use client";
import { useEffect, useState } from 'react';
import { cartsAPI } from '@/lib/api';
import { Cart } from '@/types';
import CartView from '@/components/CartView';
import PromoCodeInput from '@/components/PromoCodeInput';
import Toast from '@/components/Toast';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedCartId = localStorage.getItem('cartId');
    if (savedCartId) {
      setCartId(parseInt(savedCartId));
      fetchCart(parseInt(savedCartId));
    }
  }, []);

  const fetchCart = async (id: number) => {
    try {
      const cartData = await cartsAPI.get(id);
      setCart(cartData);
    } catch {}
  };

  const handleRemoveFromCart = async (itemId: number) => {
    if (!cartId) return;
    const { cart: updatedCart, message } = await cartsAPI.removeItem(cartId, itemId);
    setCart(updatedCart);
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleUpdateItem = async (itemId: number, quantity?: number, weight?: number) => {
    if (!cartId) return;
    try {
      const { cart: updatedCart, message } = await cartsAPI.updateItem(cartId, itemId, quantity, weight);
      setCart(updatedCart);
      setSuccessMessage(message);
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || 'Failed to update item';
      setErrorMessage(errorMsg);
      setSuccessMessage(null);
      setTimeout(() => setErrorMessage(null), 5000);
      // Refresh cart to reset to actual quantities
      if (cartId) fetchCart(cartId);
    }
  };

  const handleClearCart = async () => {
    if (!cartId) return;
    const { cart: updatedCart, message } = await cartsAPI.clear(cartId);
    setCart(updatedCart);
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
          <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm px-4 py-2 rounded transition-colors bg-indigo-50 border border-indigo-100">← Back to Items List</a>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Items List */}
          <div>
            <CartView
              cart={cart}
              onRemoveItem={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onUpdateItem={handleUpdateItem}
            />
          </div>
          {/* Right: Promo, Summary, Checkout */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-6">
            <PromoCodeInput cartId={cartId ? cartId.toString() : null} onPromoApplied={() => fetchCart(cartId!)} />
            {cart && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal:</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                {cart.total_discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Savings:</span>
                    <span>-${cart.total_discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span className="text-indigo-600">${cart.total.toFixed(2)}</span>
                </div>
              </div>
            )}
            <button className="w-full mt-4 bg-indigo-600 text-white py-2.5 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
        <Toast message={successMessage || ''} type="success" onClose={() => setSuccessMessage(null)} duration={5000} />
        <Toast message={errorMessage || ''} type="error" onClose={() => setErrorMessage(null)} duration={5000} />
      </div>
    </div>
  );
}
