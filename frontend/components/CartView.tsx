'use client';

import { Cart } from '@/types';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface CartViewProps {
  cart: Cart | null;
  onRemoveItem: (itemId: number) => void;
  onClearCart: () => void;
  onUpdateItem?: (itemId: number, quantity?: number, weight?: number) => void;
}

export default function CartView({ cart, onRemoveItem, onClearCart, onUpdateItem }: CartViewProps) {
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  if (!cart) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Shopping Cart</h2>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  const hasItems = cart.items.length > 0;

  const handleQuickAdjust = async (itemId: number, currentValue: number | null, adjustment: number, isWeight: boolean) => {
    if (!onUpdateItem) return;

    // Convert to number in case it's a string
    const current = typeof currentValue === 'string' ? parseFloat(currentValue) : (currentValue || 0);
    const newValue = Math.max(isWeight ? 1 : 1, current + adjustment);

    try {
      if (isWeight) {
        await onUpdateItem(itemId, undefined, newValue);
      } else {
        await onUpdateItem(itemId, Math.floor(newValue), undefined);
      }
    } catch (error) {
      // Error will be handled by parent component
    }
  };

  const handleEditStart = (itemId: number, currentValue: number | null) => {
    setEditingItem(itemId);
    setTempValue(String(currentValue || 0));
  };

  const handleEditSave = async (itemId: number, isWeight: boolean) => {
    if (!onUpdateItem) return;

    const value = parseFloat(tempValue) || 1;
    if (value < 1) {
      setEditingItem(null);
      return;
    }

    try {
      if (isWeight) {
        await onUpdateItem(itemId, undefined, value);
      } else {
        await onUpdateItem(itemId, Math.floor(value), undefined);
      }
      setEditingItem(null);
    } catch (error) {
      // Error will be handled by parent component
      setEditingItem(null);
    }
  };

  const handleEditCancel = () => {
    setEditingItem(null);
    setTempValue('');
  };

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

                      {/* Quantity/Weight Controls */}
                      {onUpdateItem && (
                        <div className="mt-2 flex items-center gap-2">
                          {editingItem === item.item_id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                min="1"
                                step={item.quantity !== null ? "1" : "0.1"}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleEditSave(item.item_id, item.weight !== null);
                                  if (e.key === 'Escape') handleEditCancel();
                                }}
                              />
                              <button
                                onClick={() => handleEditSave(item.item_id, item.weight !== null)}
                                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                ✓
                              </button>
                              <button
                                onClick={handleEditCancel}
                                className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500"
                              >
                                ✗
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQuickAdjust(item.item_id, item.quantity || item.weight, -1, item.weight !== null)}
                                className="p-1 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                                disabled={(item.quantity || item.weight || 0) <= 1}
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEditStart(item.item_id, item.quantity || item.weight)}
                                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
                              >
                                {item.quantity !== null ? `${item.quantity}` : `${item.weight}g`}
                              </button>
                              <button
                                onClick={() => handleQuickAdjust(item.item_id, item.quantity || item.weight, item.weight !== null ? 10 : 1, item.weight !== null)}
                                className="p-1 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                          <span className="text-xs text-gray-500">× ${item.unit_price.toFixed(2)}</span>
                        </div>
                      )}

                      {!onUpdateItem && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          {item.quantity !== null
                            ? `${item.quantity} × $${item.unit_price.toFixed(2)}`
                            : `${item.weight}g × $${item.unit_price.toFixed(2)}`}
                        </p>
                      )}

                      {/* Promotion Badge */}
                      {item.applied_promotion && (
                        <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          -${item.applied_promotion.discount_amount.toFixed(2)}
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
