import { render, screen } from '@testing-library/react';
import PromotionsList from '@/components/PromotionsList';
import { Promotion } from '@/types';

describe('PromotionsList', () => {
  const mockPromotions: Promotion[] = [
    {
      id: 1,
      name: 'Summer Sale',
      description: 'Get 20% off',
      promotion_type: 'percentage_discount',
      target_type: 'Item',
      target_id: 1,
      value: 20,
      start_time: '2024-01-01',
      end_time: '2024-12-31',
      active: true,
    },
    {
      id: 2,
      name: 'Buy 2 Get 1',
      description: 'Buy 2, get 1 free',
      promotion_type: 'buy_x_get_y',
      target_type: 'Category',
      target_id: 2,
      config: { buy_quantity: 2, get_quantity: 1 },
      start_time: '2024-01-01',
      end_time: null,
      active: true,
    },
  ];

  it('renders all promotions', () => {
    render(<PromotionsList promotions={mockPromotions} />);
    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
    expect(screen.getByText('Buy 2 Get 1')).toBeInTheDocument();
  });

  it('displays promotion count', () => {
    render(<PromotionsList promotions={mockPromotions} />);
    expect(screen.getByText(/Active Promotions \(2\)/)).toBeInTheDocument();
  });

  it('renders empty state when no promotions', () => {
    render(<PromotionsList promotions={[]} />);
    expect(screen.getByText(/Active Promotions \(0\)/)).toBeInTheDocument();
  });

  it('displays promotion names', () => {
    render(<PromotionsList promotions={mockPromotions} />);
    const promotionNames = screen.getAllByText(/Summer Sale|Buy 2 Get 1/);
    expect(promotionNames.length).toBe(2);
  });

  it('handles single promotion', () => {
    render(<PromotionsList promotions={[mockPromotions[0]]} />);
    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
    expect(screen.queryByText('Buy 2 Get 1')).not.toBeInTheDocument();
  });
});
