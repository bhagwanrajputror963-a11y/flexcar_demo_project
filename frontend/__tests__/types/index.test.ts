import { Item, Promotion, Cart, CartItem } from '@/types';

describe('TypeScript Types', () => {
  describe('Item', () => {
    it('should have correct structure for quantity-based item', () => {
      const item: Item = {
        id: 1,
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
        category: 'Electronics',
        category_id: 1,
        brand: 'TechBrand',
        sale_unit: 'quantity',
      };

      expect(item.id).toBe(1);
      expect(item.sale_unit).toBe('quantity');
      expect(item.price).toBeGreaterThan(0);
    });

    it('should have correct structure for weight-based item', () => {
      const item: Item = {
        id: 2,
        name: 'Cheese',
        price: 5.99,
        category: 'Food',
        sale_unit: 'weight',
        category_id: 2,
      };

      expect(item.id).toBe(2);
      expect(item.sale_unit).toBe('weight');
    });
  });

  describe('Promotion', () => {
    it('should have correct structure', () => {
      const promotion: Promotion = {
        id: 1,
        name: 'Summer Sale',
        promotion_type: 'percentage_discount',
        target_type: 'Item',
        target_id: 1,
        value: 20,
        active: true,
        start_time: '2024-01-01',
        end_time: '2024-12-31',
      };

      expect(promotion.id).toBe(1);
      expect(promotion.promotion_type).toBe('percentage_discount');
      expect(promotion.active).toBe(true);
    });

    it('should support optional fields', () => {
      const promotion: Promotion = {
        id: 2,
        name: 'Buy X Get Y',
        promotion_type: 'buy_x_get_y',
        target_type: 'Category',
        target_id: 1,
        active: true,
        start_time: '2024-01-01',
        end_time: null,
        config: {
          buy_quantity: 2,
          get_quantity: 1,
          discount_percent: 100,
        },
      };

      expect(promotion.config).toBeDefined();
      expect(promotion.config?.buy_quantity).toBe(2);
    });
  });

  describe('Cart', () => {
    it('should have correct structure', () => {
      const cart: Cart = {
        id: 1,
        items: [],
        subtotal: 0,
        total_discount: 0,
        total: 0,
        applied_promotions: [],
      };

      expect(cart.id).toBe(1);
      expect(cart.items).toEqual([]);
      expect(cart.subtotal).toBe(0);
    });

    it('should support cart items', () => {
      const cartItem: CartItem = {
        item_id: 1,
        item_name: 'Test Item',
        quantity: 2,
        base_price: 20,
        discount: 5,
        final_price: 15,
        promotion: 'Summer Sale',
      };

      const cart: Cart = {
        id: 1,
        items: [cartItem],
        subtotal: 20,
        total_discount: 5,
        total: 15,
        applied_promotions: [],
      };

      expect(cart.items.length).toBe(1);
      expect(cart.items[0].item_name).toBe('Test Item');
      expect(cart.total).toBe(15);
    });
  });

  describe('Cart calculations', () => {
    it('should correctly calculate totals with discount', () => {
      const cart: Cart = {
        id: 1,
        items: [
          {
            item_id: 1,
            item_name: 'Laptop',
            quantity: 1,
            base_price: 1000,
            discount: 100,
            final_price: 900,
          },
          {
            item_id: 2,
            item_name: 'Mouse',
            quantity: 2,
            base_price: 50,
            discount: 0,
            final_price: 50,
          },
        ],
        subtotal: 1050,
        total_discount: 100,
        total: 950,
        applied_promotions: [],
      };

      const calculatedTotal = cart.subtotal - cart.total_discount;
      expect(calculatedTotal).toBe(cart.total);
    });
  });
});
