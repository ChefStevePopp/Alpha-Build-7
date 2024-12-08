import React from 'react';
import type { Recipe } from '../../../types/recipe';
import type { OperationsSettings } from '@/types/operations';

interface MisEnPlaceCategoryProps {
  recipe: Recipe;
  settings: OperationsSettings | null;
  onChange: (updates: Partial<Recipe>) => void;
}

export const MisEnPlaceCategory: React.FC<MisEnPlaceCategoryProps> = ({
  recipe,
  settings,
  onChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">
        Mise en Place Category
      </label>
      <select
        value={recipe.miseEnPlaceCategory}
        onChange={(e) => onChange({ miseEnPlaceCategory: e.target.value })}
        className="input w-full"
      >
        <option value="">Select category...</option>
        {settings?.mise_en_place_categories?.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <p className="text-sm text-gray-500 mt-1">
        Categorize this recipe for mise en place organization
      </p>
    </div>
  );
};