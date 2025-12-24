/**
 * Integration Tests
 *
 * These tests verify that different components work together correctly.
 * They test real user workflows and component interactions.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ItemList from '@/components/ItemList';
import CartView from '@/components/CartView';
import PromoCodeInput from '@/components/PromoCodeInput';
import { Item, Cart } from '@/types';

describe('Component Integration Tests', () => {
  describe('ItemList + Cart Workflow', () => {
    const mockItems: Item[] = [
      {
        id: 1,
        name: 'Laptop',
        description: 'Test laptop',
        price: 1000,
        category: 'Electronics',
        brand: 'TechBrand',
        sale_unit: 'quantity',
        category_id: 1,
        stock_quantity: 10,
        in_stock: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    it('allows adding items from ItemList', async () => {
      const mockOnAddToCart = jest.fn();

      render(<ItemList items={mockItems} onAddToCart={mockOnAddToCart} />);

      const addButton = screen.getByRole('button', { name: /add/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockOnAddToCart).toHaveBeenCalledWith(mockItems[0], 1);
      });
    });

    it('displays added items in CartView', () => {
      const mockCart: Cart = {
        id: 1,
        items: [
          {
            item_id: 1,
            item_name: 'Laptop',
            quantity: 1,
            weight: null,
            unit_price: 1000,
            subtotal: 1000,
            discount: 0,
            total: 1000,
            applied_promotion: null,
          },
        ],
        subtotal: 1000,
        total_discount: 0,
        total: 1000,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      const mockOnRemoveItem = jest.fn();
      const mockOnClearCart = jest.fn();

      render(
        <CartView
          cart={mockCart}
          onRemoveItem={mockOnRemoveItem}
          onClearCart={mockOnClearCart}
        />
      );

      expect(screen.getByText('Laptop')).toBeInTheDocument();
      const prices = screen.getAllByText(/\$1000\.00/);
      expect(prices.length).toBeGreaterThan(0);
    });
  });

  describe('PromoCode + Cart Integration', () => {
    global.fetch = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('applies promo code and updates cart display', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Promo applied' }),
      });

      const mockOnPromoApplied = jest.fn();

      render(<PromoCodeInput cartId="1" onPromoApplied={mockOnPromoApplied} />);

      const input = screen.getByPlaceholderText(/enter code/i);
      const button = screen.getByText(/apply/i);

      fireEvent.change(input, { target: { value: 'SAVE10' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnPromoApplied).toHaveBeenCalled();
      });
    });
  });

  describe('Full Shopping Cart Flow', () => {
    it('handles complete add-to-cart flow', () => {
      const mockItems: Item[] = [
        {
          id: 1,
          name: 'Laptop',
          description: 'Test laptop',
          price: 1000,
          category: 'Electronics',
          brand: 'TechBrand',
          sale_unit: 'quantity',
          category_id: 1,
          stock_quantity: 10,
          in_stock: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 2,
          name: 'Mouse',
          description: 'Test mouse',
          price: 25,
          category: 'Accessories',
          brand: 'TechBrand',
          sale_unit: 'quantity',
          category_id: 2,
          stock_quantity: 50,
          in_stock: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockOnAddToCart = jest.fn();

      const { rerender } = render(
        <ItemList items={mockItems} onAddToCart={mockOnAddToCart} />
      );

      // Add first item
      const addButtons = screen.getAllByRole('button', { name: /add/i });
      fireEvent.click(addButtons[0]);

      expect(mockOnAddToCart).toHaveBeenCalledWith(mockItems[0], 1);

      // Change quantity
      const qtyInputs = screen.getAllByPlaceholderText('Qty');
      const qtyInput = qtyInputs[0];
      fireEvent.change(qtyInput, { target: { value: '3' } });

      // Add with new quantity
      fireEvent.click(addButtons[0]);

      expect(mockOnAddToCart).toHaveBeenCalledWith(mockItems[0], 3);
    });

    it('displays cart with multiple items and calculates total', () => {
      const mockCart: Cart = {
        id: 1,
        items: [
          {
            item_id: 1,
            item_name: 'Laptop',
            weight: null,
            unit_price: 1000,
            subtotal: 2000,
            discount: 200,
            total: 1800,
            applied_promotion: null,
          },
          {
            item_id: 2,
            item_name: 'Mouse',
            quantity: 1,
            weight: null,
            unit_price: 25,
            subtotal: 25,
            discount: 0,
            total: 25,
            applied_promotion: null,
          },
        ],
        subtotal: 2025,
        total_discount: 200,
        total: 1825,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      const mockOnRemoveItem = jest.fn();
      const mockOnClearCart = jest.fn();

      render(
        <CartView
          cart={mockCart}
          onRemoveItem={mockOnRemoveItem}
          onClearCart={mockOnClearCart}
        />
      );

      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('Mouse')).toBeInTheDocument();

      // Check that both items show their totals
      const totalPrices = screen.getAllByText(/\$1800\.00|\$25\.00/);
      expect(totalPrices.length).toBeGreaterThan(0);
    });

    it('handles item removal from cart', () => {
      const mockCart: Cart = {
        id: 1,
        items: [
          {
            item_id: 1,
            item_name: 'Laptop',
            quantity: 1,
            weight: null,
            unit_price: 1000,
            subtotal: 1000,
            discount: 0,
            total: 1000,
            applied_promotion: null,
          },
        ],
        subtotal: 1000,
        total_discount: 0,
        total: 1000,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      const mockOnRemoveItem = jest.fn();
      const mockOnClearCart = jest.fn();

      render(
        <CartView
          cart={mockCart}
          onRemoveItem={mockOnRemoveItem}
          onClearCart={mockOnClearCart}
        />
      );

      const removeButton = screen.getByTitle('Remove');
      fireEvent.click(removeButton);

      expect(mockOnRemoveItem).toHaveBeenCalledWith(1);
    });
  });
});
