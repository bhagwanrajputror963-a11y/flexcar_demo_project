"use client";
import { useEffect, useState } from 'react';
import { inventoryAPI } from '@/lib/api';
import { Item } from '@/types';
import Toast from '@/components/Toast';
import { PlusIcon, MinusIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [tempStock, setTempStock] = useState<string>('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryAPI.getAll();
      setItems(data);
    } catch (error) {
      setErrorMessage('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdjust = async (itemId: number, adjustment: number) => {
    try {
      const { item, message } = await inventoryAPI.adjustStock(itemId, adjustment);
      setItems(items.map(i => i.id === itemId ? item : i));
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || 'Failed to adjust stock');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleEditStart = (item: Item) => {
    setEditingItem(item.id);
    setTempStock(String(item.stock_quantity || 0));
  };

  const handleEditSave = async (itemId: number) => {
    try {
      const stock = parseInt(tempStock) || 0;
      if (stock < 0) {
        setErrorMessage('Stock cannot be negative');
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }

      const { item, message } = await inventoryAPI.update(itemId, stock);
      setItems(items.map(i => i.id === itemId ? item : i));
      setSuccessMessage(message);
      setEditingItem(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || 'Failed to update stock');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleEditCancel = () => {
    setEditingItem(null);
    setTempStock('');
  };

  const getStockStatus = (item: Item) => {
    const stock = item.stock_quantity || 0;
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800 border-red-200' };
    if (stock < 10) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800 border-green-200' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-1">Manage stock levels for all items</p>
          </div>
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm px-4 py-2 rounded transition-colors bg-indigo-50 border border-indigo-100"
          >
            ← Back to Items
          </a>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-2xl font-bold text-gray-900">{items.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">In Stock</p>
            <p className="text-2xl font-bold text-green-600">
              {items.filter(i => (i.stock_quantity || 0) > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-600">
              {items.filter(i => (i.stock_quantity || 0) > 0 && (i.stock_quantity || 0) < 10).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">
              {items.filter(i => (i.stock_quantity || 0) === 0).length}
            </p>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sale Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        {item.brand && <div className="text-xs text-gray-500">{item.brand}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                          {item.sale_unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingItem === item.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={tempStock}
                              onChange={(e) => setTempStock(e.target.value)}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                              min="0"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleEditSave(item.id);
                                if (e.key === 'Escape') handleEditCancel();
                              }}
                            />
                            <button
                              onClick={() => handleEditSave(item.id)}
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Save"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="p-1 text-gray-600 hover:text-gray-800"
                              title="Cancel"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900 w-12">
                              {item.stock_quantity || 0}
                              {item.sale_unit === 'weight' && 'g'}
                            </span>
                            <button
                              onClick={() => handleEditStart(item)}
                              className="p-1 text-gray-400 hover:text-indigo-600"
                              title="Edit stock"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleQuickAdjust(item.id, -10)}
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title={`Remove ${item.sale_unit === 'weight' ? '10g' : '10'}`}
                            disabled={(item.stock_quantity || 0) < 10}
                          >
                            <MinusIcon className="h-4 w-4" />
                            <span className="text-xs">10</span>
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(item.id, -1)}
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title={`Remove ${item.sale_unit === 'weight' ? '1g' : '1'}`}
                            disabled={(item.stock_quantity || 0) < 1}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(item.id, 1)}
                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title={`Add ${item.sale_unit === 'weight' ? '1g' : '1'}`}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(item.id, 10)}
                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title={`Add ${item.sale_unit === 'weight' ? '10g' : '10'}`}
                          >
                            <PlusIcon className="h-4 w-4" />
                            <span className="text-xs">10</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <Toast
          message={successMessage || errorMessage || ''}
          type={successMessage ? 'success' : 'error'}
          onClose={() => {
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
          duration={3000}
        />
      </div>
    </div>
  );
}
