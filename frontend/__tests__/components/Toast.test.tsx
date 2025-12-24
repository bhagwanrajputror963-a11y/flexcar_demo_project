import { render, screen } from '@testing-library/react';
import Toast from '@/components/Toast';

describe('Toast', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders success toast message', () => {
    render(<Toast message="Success!" type="success" onClose={mockOnClose} duration={3000} />);
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('renders error toast message', () => {
    render(<Toast message="Error occurred" type="error" onClose={mockOnClose} duration={3000} />);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('does not render when message is empty', () => {
    const { container } = render(<Toast message="" type="success" onClose={mockOnClose} duration={3000} />);
    expect(container.firstChild).toBeNull();
  });

  it('auto-closes after duration', () => {
    render(<Toast message="Auto close" type="success" onClose={mockOnClose} duration={3000} />);

    jest.advanceTimersByTime(3000);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('applies correct styling for success type', () => {
    const { container } = render(<Toast message="Success" type="success" onClose={mockOnClose} duration={3000} />);
    const toast = container.querySelector('[class*="success"]') || container.querySelector('[class*="green"]');
    expect(toast).toBeTruthy();
  });

  it('applies correct styling for error type', () => {
    const { container } = render(<Toast message="Error" type="error" onClose={mockOnClose} duration={3000} />);
    const toast = container.querySelector('[class*="error"]') || container.querySelector('[class*="red"]');
    expect(toast).toBeTruthy();
  });
});
