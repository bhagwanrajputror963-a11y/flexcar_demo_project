'use client';

import { Cart } from '@/types';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface CartViewProps {
  cart: Cart | null;
  onRemoveItem: (itemId: number) => void;
  onClearCart: () => void;
}

export default function CartView({ cart, onRemoveItem, onClearCart }: CartViewProps) {
  if (!cart) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Shopping Cart</h2>
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  const hasItems = cart.items.length > 0;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
        {hasItems && (
          <button
            onClick={onClearCart}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="px-6 py-4">
        {!hasItems ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
            <p className="text-sm text-gray-400 mt-2">Add items to get started</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div
                  key={item.item_id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.item_name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.quantity !== null
                          ? `Qty: ${item.quantity}`
                          : `Weight: ${item.weight}g`}
                        {' × $'}
                        {item.unit_price.toFixed(2)}
                      </p>
                      
                      {/* Promotion Applied */}
                      {item.applied_promotion && (
                        <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          {item.applied_promotion.name}
                          {' - '}
                          ${item.applied_promotion.discount_amount.toFixed(2)} off
                        </div>
                      )}
                      
                      {/* Price Breakdown */}
                      <div className="mt-2 text-sm space-y-1">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal:</span>
                          <span>${item.subtotal.toFixed(2)}</span>
                        </div>
                        {item.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span>-${item.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t">
                          <span>Total:</span>
                          <span>${item.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.item_id)}
                      className="ml-4 text-red-600 hover:text-red-800"
                      title="Remove from cart"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
              </div>
              
              {cart.total_discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">Total Savings:</span>
                  <span className="font-bold">-${cart.total_discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t-2 border-gray-300">
                <span>Total:</span>
                <span className="text-indigo-600">${cart.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
