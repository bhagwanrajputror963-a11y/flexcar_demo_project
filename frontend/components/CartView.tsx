'use client';

import { Cart } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface CartViewProps {
  cart: Cart | null;
  onRemoveItem: (itemId: number) => void;
  onClearCart: () => void;
}

export default function CartView({ cart, onRemoveItem, onClearCart }: CartViewProps) {
  if (!cart) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Shopping Cart</h2>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  const hasItems = cart.items.length > 0;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Cart ({cart.items.length})</h2>
        {hasItems && (
          <button
            onClick={onClearCart}
            className="text-xs text-red-600 hover:text-red-800 font-medium"
          >
            Clear
          </button>
        )}
      </div>

      <div className="px-4 py-3">
        {!hasItems ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {cart.items.map((item) => (
                <div
                  key={item.item_id}
                  className="border border-gray-200 rounded-md p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 truncate">{item.item_name}</h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {item.quantity !== null
                          ? `${item.quantity} × $${item.unit_price.toFixed(2)}`
                          : `${item.weight}g × $${item.unit_price.toFixed(2)}`}
                      </p>

                      {/* Promotion Badge */}
                      {item.applied_promotion && (
                        <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          -{item.applied_promotion.discount_amount.toFixed(2)}
                        </div>
                      )}

                      {/* Price */}
                      <div className="mt-1.5 flex items-center justify-between text-sm">
                        {item.discount > 0 ? (
                          <>
                            <span className="text-gray-500 line-through">${item.subtotal.toFixed(2)}</span>
                            <span className="font-semibold text-gray-900">${item.total.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="font-semibold text-gray-900 ml-auto">${item.total.toFixed(2)}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.item_id)}
                      className="text-gray-400 hover:text-red-600 flex-shrink-0"
                      title="Remove"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-gray-200 pt-3 space-y-1.5">
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

            {/* Checkout Button */}
            <button className="w-full mt-4 bg-indigo-600 text-white py-2.5 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
