'use client';

import { Promotion } from '@/types';
import { TagIcon } from '@heroicons/react/24/outline';

interface PromotionsListProps {
  promotions: Promotion[];
}

export default function PromotionsList({ promotions }: PromotionsListProps) {
  const activePromotions = promotions.filter((p) => p.active);

  const getPromotionDescription = (promotion: Promotion): string => {
    switch (promotion.promotion_type) {
      case 'flat_discount':
        return `$${promotion.value?.toFixed(2)} off ${promotion.target_name}`;
      case 'percentage_discount':
        return `${promotion.value}% off ${promotion.target_name}`;
      case 'buy_x_get_y':
        const buyQty = promotion.config?.buy_quantity || 'X';
        const getQty = promotion.config?.get_quantity || 'Y';
        const discount = promotion.config?.discount_percent || 100;
        return `Buy ${buyQty} get ${getQty} ${discount}% off on ${promotion.target_name}`;
      case 'weight_threshold':
        const threshold = promotion.config?.threshold_weight;
        return `${promotion.value}% off when buying ${threshold}g+ of ${promotion.target_name}`;
      default:
        return promotion.name;
    }
  };

  const getPromotionBadgeColor = (type: string): string => {
    switch (type) {
      case 'flat_discount':
        return 'bg-blue-100 text-blue-800';
      case 'percentage_discount':
        return 'bg-purple-100 text-purple-800';
      case 'buy_x_get_y':
        return 'bg-pink-100 text-pink-800';
      case 'weight_threshold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPromotionType = (type: string): string => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white border-l-4 border-indigo-500 rounded-lg px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <TagIcon className="h-5 w-5 text-indigo-600" />
          <span className="font-semibold text-sm text-gray-900">
            Active Promotions ({activePromotions.length})
          </span>
        </div>
        {activePromotions.length > 0 && (
          <div className="flex flex-wrap gap-2 text-sm">
            {activePromotions.map((promotion) => (
              <span
                key={promotion.id}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium"
              >
                {promotion.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
