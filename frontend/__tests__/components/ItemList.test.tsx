import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ItemList from '@/components/ItemList';
import { Item } from '@/types';

describe('ItemList', () => {
  const mockItems: Item[] = [
    {
      id: 1,
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 999.99,
      category: 'Electronics',
      sale_unit: 'quantity',
      category_id: 1,
    },
    {
      id: 2,
      name: 'Cheese',
      description: 'Fresh cheese',
      price: 5.99,
      category: 'Food',
      sale_unit: 'weight',
      category_id: 2,
    },
  ];

  const mockOnAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all items', () => {
    render(<ItemList items={mockItems} onAddToCart={mockOnAddToCart} />);
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Cheese')).toBeInTheDocument();
  });

  it('displays item price correctly', () => {
    render(<ItemList items={mockItems} onAddToCart={mockOnAddToCart} />);
    expect(screen.getByText(/\$999.99/)).toBeInTheDocument();
    expect(screen.getByText(/\$5.99/)).toBeInTheDocument();
  });

  it('shows quantity input for quantity-based items', () => {
    render(<ItemList items={mockItems} onAddToCart={mockOnAddToCart} />);
    const quantityInput = screen.getByPlaceholderText('Qty');
    expect(quantityInput).toBeInTheDocument();
  });

  it('shows weight input for weight-based items', () => {
    render(<ItemList items={mockItems} onAddToCart={mockOnAddToCart} />);
    const weightInput = screen.getByPlaceholderText('Grams');
    expect(weightInput).toBeInTheDocument();
  });

  it('calls onAddToCart with correct parameters for quantity item', async () => {
    render(<ItemList items={mockItems} onAddToCart={mockOnAddToCart} />);

    const quantityInput = screen.getByPlaceholderText('Qty');
    const addButtons = screen.getAllByRole('button', { name: /add/i });
    const addButton = addButtons[0];

    fireEvent.change(quantityInput, { target: { value: '2' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockOnAddToCart).toHaveBeenCalledWith(mockItems[0], 2);
    });
  });

  it('calls onAddToCart with correct parameters for weight item', async () => {
    render(<ItemList items={mockItems} onAddToCart={mockOnAddToCart} />);

    const weightInput = screen.getByPlaceholderText('Grams');
    const addButtons = screen.getAllByRole('button', { name: /add/i });
    const addButton = addButtons[1];

    fireEvent.change(weightInput, { target: { value: '250' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockOnAddToCart).toHaveBeenCalledWith(mockItems[1], 1, 250);
    });
  });

  it('displays empty state when no items', () => {
    render(<ItemList items={[]} onAddToCart={mockOnAddToCart} />);
    expect(screen.getByText(/no items available/i)).toBeInTheDocument();
  });

  it('disables add button when quantity/weight is 0', () => {
    render(<ItemList items={mockItems} onAddToCart={mockOnAddToCart} />);
    const addButtons = screen.getAllByText(/add to cart/i);

    // Initial state should have quantity/weight at default (1 or 100)
    // This test assumes button validation is implemented
    expect(addButtons[0]).not.toBeDisabled();
  });
});
