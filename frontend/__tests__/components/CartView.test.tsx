import { render, screen, fireEvent } from '@testing-library/react';
import CartView from '@/components/CartView';
import { Cart } from '@/types';

describe('CartView', () => {
  const mockCart: Cart = {
    id: 1,
    items: [
      {
        item_id: 1,
        item_name: 'Test Item',
        quantity: 2,
        weight: null,
        unit_price: 10.0,
        subtotal: 20.0,
        discount: 0,
        total: 20.0,
        applied_promotion: null,
      },
    ],
    subtotal: 20.0,
    total_discount: 0,
    total: 20.0,
    applied_promotion_ids: [],
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  };

  const mockOnRemoveItem = jest.fn();
  const mockOnClearCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when cart is null', () => {
    render(<CartView cart={null} onRemoveItem={mockOnRemoveItem} onClearCart={mockOnClearCart} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders empty cart message when no items', () => {
    const emptyCart = { ...mockCart, items: [] };
    render(<CartView cart={emptyCart} onRemoveItem={mockOnRemoveItem} onClearCart={mockOnClearCart} />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('displays cart items correctly', () => {
    render(<CartView cart={mockCart} onRemoveItem={mockOnRemoveItem} onClearCart={mockOnClearCart} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText(/2 ×/)).toBeInTheDocument();
  });

  it('shows item with applied promotion', () => {
    const cartWithPromo: Cart = {
      ...mockCart,
      items: [
        {
          ...mockCart.items[0],
          discount: 5.0,
          total: 15.0,
          applied_promotion: {
            name: 'SAVE10',
            discount_amount: 5.0,
          },
        },
      ],
      total_discount: 5.0,
      total: 15.0,
    };

    render(<CartView cart={cartWithPromo} onRemoveItem={mockOnRemoveItem} onClearCart={mockOnClearCart} />);
    const discounts = screen.getAllByText(/-\$5.00/);
    expect(discounts.length).toBeGreaterThan(0);
  });

  it('calls onRemoveItem when remove button clicked', () => {
    render(<CartView cart={mockCart} onRemoveItem={mockOnRemoveItem} onClearCart={mockOnClearCart} />);

    const removeButton = screen.getByTitle(/remove/i);
    fireEvent.click(removeButton);

    expect(mockOnRemoveItem).toHaveBeenCalledWith(1);
  });

  it('calls onClearCart when clear button clicked', () => {
    render(<CartView cart={mockCart} onRemoveItem={mockOnRemoveItem} onClearCart={mockOnClearCart} />);

    const clearButton = screen.getByText(/clear/i);
    fireEvent.click(clearButton);

    expect(mockOnClearCart).toHaveBeenCalled();
  });

  it('displays subtotal and total correctly', () => {
    render(<CartView cart={mockCart} onRemoveItem={mockOnRemoveItem} onClearCart={mockOnClearCart} />);
    const subtotalLabels = screen.getAllByText(/subtotal:/i);
    const totalLabels = screen.getAllByText(/total:/i);
    expect(subtotalLabels.length).toBeGreaterThan(0);
    expect(totalLabels.length).toBeGreaterThan(0);
  });

  it('shows savings when discount is applied', () => {
    const cartWithDiscount = {
      ...mockCart,
      total_discount: 5.0,
      total: 15.0,
    };

    render(<CartView cart={cartWithDiscount} onRemoveItem={mockOnRemoveItem} onClearCart={mockOnClearCart} />);
    expect(screen.getByText(/savings:/i)).toBeInTheDocument();
  });

  it('displays proceed to checkout button when items exist', () => {
    render(<CartView cart={mockCart} onRemoveItem={mockOnRemoveItem} onClearCart={mockOnClearCart} />);
    expect(screen.getByText(/proceed to checkout/i)).toBeInTheDocument();
  });

  it('handles weight-based items correctly', () => {
    const cartWithWeightItem: Cart = {
      ...mockCart,
      items: [
        {
          item_id: 2,
          item_name: 'Weight Item',
          quantity: null,
          weight: 250,
          unit_price: 5.0,
          subtotal: 12.5,
          discount: 0,
          total: 12.5,
          applied_promotion: null,
        },
      ],
    };

    render(<CartView cart={cartWithWeightItem} onRemoveItem={mockOnRemoveItem} onClearCart={mockOnClearCart} />);
    expect(screen.getByText(/250g/)).toBeInTheDocument();
  });
});
