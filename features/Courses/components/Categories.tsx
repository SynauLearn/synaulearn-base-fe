import { SafeArea } from "@coinbase/onchainkit/minikit";
import React from 'react';

// Local type definition (moved from supabase)
type DifficultyLevel = 'Basic' | 'Intermediate' | 'Advanced' | 'Professional';
import { useLocale } from '@/lib/LocaleContext';

interface CategoriesProps {
  selected: DifficultyLevel;
  onSelect: (category: DifficultyLevel) => void;
}

const Categories = ({ selected, onSelect }: CategoriesProps) => {
  const { t } = useLocale();

  const categories: { value: DifficultyLevel; label: string }[] = [
    { value: 'Basic', label: t('difficulty.basic') },
    { value: 'Advanced', label: t('difficulty.advanced') },
    { value: 'Professional', label: t('difficulty.professional') },
  ];

  return (
    <SafeArea>
      <div className="flex justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onSelect(category.value)}
            className={`px-6 py-2 rounded-full text-small transition-all ${selected === category.value
              ? "bg-blue-600 text-white"
              : "bg-[#2a2d42] text-gray-400 hover:bg-[#333649]"
              }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </SafeArea>
  );
};

export default Categories;
