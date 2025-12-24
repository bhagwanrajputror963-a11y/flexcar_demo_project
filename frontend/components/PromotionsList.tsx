'use client';

import { Promotion } from '@/types';
import { TagIcon } from '@heroicons/react/24/outline';

interface PromotionsListProps {
  promotions: Promotion[];
}

export default function PromotionsList({ promotions }: PromotionsListProps) {
  const activePromotions = promotions.filter((p) => p.active);

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
