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
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Available Items</h2>
        <p className="mt-1 text-sm text-gray-600">Browse our products and add them to your cart</p>
      </div>

      <div className="divide-y divide-gray-200">
        {items.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No items available</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">Brand: {item.brand}</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    ${item.price.toFixed(2)}
                    {item.sale_unit === 'weight' && (
                      <span className="text-sm font-normal text-gray-600">/gram</span>
                    )}
                  </p>
                </div>

                <div className="ml-4 flex items-end space-x-2">
                  {item.sale_unit === 'quantity' ? (
                    <div className="flex items-center space-x-2">
                      <label htmlFor={`qty-${item.id}`} className="text-sm text-gray-700">
                        Qty:
                      </label>
                      <input
                        type="number"
                        id={`qty-${item.id}`}
                        min="1"
                        value={quantities[item.id] || 1}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <label htmlFor={`weight-${item.id}`} className="text-sm text-gray-700">
                        Grams:
                      </label>
                      <input
                        type="number"
                        id={`weight-${item.id}`}
                        min="1"
                        step="0.1"
                        value={weights[item.id] || 1}
                        onChange={(e) => handleWeightChange(item.id, e.target.value)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
