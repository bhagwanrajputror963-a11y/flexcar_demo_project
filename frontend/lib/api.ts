import axios from 'axios';
import { Item, Promotion, Cart } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Items API
export const itemsAPI = {
  getAll: async (): Promise<Item[]> => {
    const response = await api.get('/items');
    return response.data.items;
  },

  getById: async (id: number): Promise<Item> => {
    const response = await api.get(`/items/${id}`);
    return response.data.item;
  },
};

// Promotions API
export const promotionsAPI = {
  getAll: async (): Promise<Promotion[]> => {
    const response = await api.get('/promotions');
    return response.data.promotions;
  },

  getById: async (id: number): Promise<Promotion> => {
    const response = await api.get(`/promotions/${id}`);
    return response.data.promotion;
  },
};

// Carts API
export const cartsAPI = {
  create: async (): Promise<{ cart_id: number; message: string }> => {
    const response = await api.post('/carts');
    return response.data;
  },

  get: async (id: number): Promise<Cart> => {
    const response = await api.get(`/carts/${id}`);
    return response.data.cart;
  },

  addItem: async (
    cartId: number,
    itemId: number,
    quantity?: number,
    weight?: number
  ): Promise<{ cart: Cart; message: string }> => {
    const response = await api.post(`/carts/${cartId}/add_item`, {
      item_id: itemId,
      quantity,
      weight,
    });
    return response.data;
  },

  updateItem: async (
    cartId: number,
    itemId: number,
    quantity?: number,
    weight?: number
  ): Promise<{ cart: Cart; message: string }> => {
    const response = await api.patch(`/carts/${cartId}/update_item/${itemId}`, {
      item_id: itemId,
      quantity,
      weight,
    });
    return response.data;
  },

  removeItem: async (
    cartId: number,
    itemId: number
  ): Promise<{ cart: Cart; message: string }> => {
    const response = await api.delete(`/carts/${cartId}/remove_item/${itemId}`);
    return response.data;
  },

  clear: async (cartId: number): Promise<{ cart: Cart; message: string }> => {
    const response = await api.delete(`/carts/${cartId}/clear`);
    return response.data;
  },

  applyPromo: async (cartId: number, promoCode: string): Promise<{ cart: Cart; message: string }> => {
    const response = await api.post(`/carts/${cartId}/apply_promo`, { promo_code: promoCode });
    return response.data;
  },

  removePromo: async (cartId: number, promoCode: string): Promise<{ cart: Cart; message: string }> => {
    const response = await api.delete(`/carts/${cartId}/remove_promo`, { data: { promo_code: promoCode } });
    return response.data;
  },
};

// Inventory API
export const inventoryAPI = {
  getAll: async (): Promise<Item[]> => {
    const response = await api.get('/inventory');
    return response.data.items;
  },

  getById: async (id: number): Promise<Item> => {
    const response = await api.get(`/inventory/${id}`);
    return response.data.item;
  },

  update: async (id: number, stock_quantity: number): Promise<{ item: Item; message: string }> => {
    const response = await api.patch(`/inventory/${id}`, {
      item: { stock_quantity }
    });
    return response.data;
  },

  adjustStock: async (id: number, adjustment: number): Promise<{ item: Item; message: string }> => {
    const response = await api.patch(`/inventory/${id}/adjust_stock`, {
      adjustment
    });
    return response.data;
  },
};

export default api;
