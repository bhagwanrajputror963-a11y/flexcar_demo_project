'use client';

import { useState } from 'react';
import { Item } from '@/types';
import { PlusIcon } from '@heroicons/react/24/outline';

interface ItemListProps {
  items: Item[];
  onAddToCart: (item: Item, quantity: number, weight?: number) => void;
}

export default function ItemList({ items, onAddToCart }: ItemListProps) {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [weights, setWeights] = useState<Record<number, number>>({});

  const handleQuantityChange = (itemId: number, value: string) => {
    const num = parseInt(value) || 1;
    setQuantities({ ...quantities, [itemId]: num });
  };

  const handleWeightChange = (itemId: number, value: string) => {
    const num = parseFloat(value) || 1;
    setWeights({ ...weights, [itemId]: num });
  };

  const handleAddToCart = (item: Item) => {
    if (item.sale_unit === 'quantity') {
      onAddToCart(item, quantities[item.id] || 1);
    } else {
      onAddToCart(item, 1, weights[item.id] || 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Available Items ({items.length})</h2>
        <p className="mt-0.5 text-xs text-gray-600">Browse and add to cart</p>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-1 gap-3 p-4">
          {items.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">No items available</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-3 hover:border-indigo-300 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 flex-shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>{item.brand}</span>
                      <span className="font-semibold text-gray-900">
                        ${item.price.toFixed(2)}
                        {item.sale_unit === 'weight' && <span className="text-gray-600 font-normal">/g</span>}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.sale_unit === 'quantity' ? (
                      <input
                        type="number"
                        id={`qty-${item.id}`}
                        min="1"
                        value={quantities[item.id] || 1}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-16 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Qty"
                      />
                    ) : (
                      <input
                        type="number"
                        id={`weight-${item.id}`}
                        min="1"
                        step="1"
                        value={weights[item.id] || 1}
                        onChange={(e) => handleWeightChange(item.id, e.target.value)}
                        className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Grams"
                      />
                    )}

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-all"
                      title={`Add ${item.name} to cart`}
                    >
                      <PlusIcon className="h-4 w-4 mr-1.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
