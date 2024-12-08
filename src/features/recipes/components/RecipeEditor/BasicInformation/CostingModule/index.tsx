import React from 'react';
import { CircleDollarSign, Plus } from 'lucide-react';
import { IngredientList } from './IngredientList';
import { CostSummary } from './CostSummary';
import type { Recipe } from '@/types/recipe';

interface CostingModuleProps {
  recipe: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export const CostingModule: React.FC<CostingModuleProps> = ({ recipe, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <CircleDollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-lg font-medium text-white">Recipe Costing</h3>
        </div>
        <button
          onClick={() => onChange({
            ingredients: [
              ...recipe.ingredients,
              {
                id: `ing-${Date.now()}`,
                type: 'raw',
                name: '',
                quantity: '',
                unit: '',
                notes: '',
                cost: 0
              }
            ]
          })}
          className="btn-ghost text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Ingredient
        </button>
      </div>

      <IngredientList recipe={recipe} onChange={onChange} />
      <CostSummary recipe={recipe} onChange={onChange} />
    </div>
  );
};