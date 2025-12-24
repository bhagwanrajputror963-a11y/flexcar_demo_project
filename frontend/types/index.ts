export interface Item {
  id: number;
  name: string;
  price: number;
  sale_unit: 'quantity' | 'weight';
  category: string;
  brand: string;
  stock_quantity?: number;
  in_stock?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: number;
  name: string;
  promotion_type: string;
  value: number | null;
  target_type: string;
  target_id: number;
  target_name: string;
  start_time: string;
  end_time: string | null;
  config: Record<string, any>;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AppliedPromotion {
  id: number;
  name: string;
  type: string;
  discount_amount: number;
}

export interface CartItem {
  item_id: number;
  item_name: string;
  quantity: number | null;
  weight: number | null;
  unit_price: number;
  subtotal: number;
  discount: number;
  total: number;
  applied_promotion: AppliedPromotion | null;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  total_discount: number;
  total: number;
  created_at: string;
  updated_at: string;
}
