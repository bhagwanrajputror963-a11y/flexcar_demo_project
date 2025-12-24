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
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <TagIcon className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Active Promotions</h2>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Automatically applied to eligible items
        </p>
      </div>

      <div className="px-6 py-4">
        {activePromotions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No active promotions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activePromotions.map((promotion) => (
              <div
                key={promotion.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPromotionBadgeColor(
                          promotion.promotion_type
                        )}`}
                      >
                        {formatPromotionType(promotion.promotion_type)}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900">{promotion.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {getPromotionDescription(promotion)}
                    </p>
                    
                    {promotion.end_time && (
                      <p className="text-xs text-gray-500 mt-2">
                        Ends: {new Date(promotion.end_time).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
