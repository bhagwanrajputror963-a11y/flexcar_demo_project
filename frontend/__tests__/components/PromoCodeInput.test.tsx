import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PromoCodeInput from '@/components/PromoCodeInput';

// Mock fetch
global.fetch = jest.fn();

describe('PromoCodeInput', () => {
  const mockOnPromoApplied = jest.fn();
  const cartId = '1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders promo code input field', () => {
    render(<PromoCodeInput cartId={cartId} onPromoApplied={mockOnPromoApplied} />);
    expect(screen.getByPlaceholderText(/enter promo code/i)).toBeInTheDocument();
  });

  it('applies valid promo code successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Promo applied successfully' }),
    });

    render(<PromoCodeInput cartId={cartId} onPromoApplied={mockOnPromoApplied} />);

    const input = screen.getByPlaceholderText(/enter promo code/i);
    const button = screen.getByText(/apply/i);

    fireEvent.change(input, { target: { value: 'SAVE10' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnPromoApplied).toHaveBeenCalled();
      expect(screen.getByText(/promo applied successfully/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid promo code', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid promo code' }),
    });

    render(<PromoCodeInput cartId={cartId} onPromoApplied={mockOnPromoApplied} />);

    const input = screen.getByPlaceholderText(/enter promo code/i);
    const button = screen.getByText(/apply/i);

    fireEvent.change(input, { target: { value: 'INVALID' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/invalid promo code/i)).toBeInTheDocument();
    });
  });

  it('disables apply button when input is empty', () => {
    render(<PromoCodeInput cartId={cartId} onPromoApplied={mockOnPromoApplied} />);

    const button = screen.getByText(/apply/i);
    expect(button).toBeDisabled();
  });

  it('does not apply promo when cartId is null', () => {
    render(<PromoCodeInput cartId={null} onPromoApplied={mockOnPromoApplied} />);

    const input = screen.getByPlaceholderText(/enter promo code/i);
    const button = screen.getByText(/apply/i);

    fireEvent.change(input, { target: { value: 'SAVE10' } });
    fireEvent.click(button);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('auto-hides success message after timeout', async () => {
    jest.useFakeTimers();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Promo applied' }),
    });

    render(<PromoCodeInput cartId={cartId} onPromoApplied={mockOnPromoApplied} />);

    const input = screen.getByPlaceholderText(/enter promo code/i);
    const button = screen.getByText(/apply/i);

    fireEvent.change(input, { target: { value: 'SAVE10' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/promo applied/i)).toBeInTheDocument();
    });

    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.queryByText(/promo applied/i)).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
