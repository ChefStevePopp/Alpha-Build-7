import React from 'react';
import { CircleDollarSign, AlertTriangle } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { LABOR_RATE_PER_HOUR } from '@/constants';

interface CostSummaryProps {
  recipe: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export const CostSummary: React.FC<CostSummaryProps> = ({ recipe, onChange }) => {
  // Calculate total ingredient cost
  const ingredientCost = recipe.ingredients.reduce((sum, ingredient) => {
    const quantity = parseFloat(ingredient.quantity) || 0;
    return sum + (quantity * ingredient.cost);
  }, 0);

  // Calculate labor cost
  const laborCost = ((recipe.prepTime + recipe.cookTime) / 60) * (recipe.laborCostPerHour || LABOR_RATE_PER_HOUR);

  // Calculate total cost and cost per unit
  const totalCost = ingredientCost + laborCost;
  const costPerUnit = totalCost / (recipe.yield?.amount || 1);

  // Calculate target cost
  const targetCost = totalCost * (recipe.targetCostPercent / 100);
  const isOverTarget = totalCost > targetCost;

  return (
    <div className="bg-emerald-500/10 rounded-lg p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <CircleDollarSign className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-emerald-400 font-medium">Recipe Cost Summary</p>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ingredient Cost</span>
                <span className="text-xl font-medium text-white">
                  ${ingredientCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Labor Cost</span>
                <span className="text-xl font-medium text-white">
                  ${laborCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-emerald-500/20">
                <span className="text-emerald-400 font-medium">Total Cost</span>
                <span className="text-2xl font-medium text-emerald-400">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-400 font-medium">Cost per {recipe.yield?.unit || 'unit'}</span>
                <span className="text-xl font-medium text-emerald-400">
                  ${costPerUnit.toFixed(2)}
                </span>
              </div>
            </div>

            <div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Labor Rate (per hour)
                </label>
                <input
                  type="number"
                  value={recipe.laborCostPerHour || LABOR_RATE_PER_HOUR}
                  onChange={(e) => onChange({ laborCostPerHour: parseFloat(e.target.value) })}
                  className="input w-full"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Target Cost %
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={recipe.targetCostPercent}
                    onChange={(e) => onChange({ targetCostPercent: parseInt(e.target.value) })}
                    className="input flex-1"
                    min="0"
                    max="100"
                    step="1"
                  />
                  <span className="input w-12 flex items-center justify-center bg-gray-700">
                    %
                  </span>
                </div>
              </div>

              {isOverTarget && (
                <div className="mt-4 bg-rose-500/10 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    <div>
                      <p className="text-rose-400 font-medium">Cost Warning</p>
                      <p className="text-sm text-gray-300 mt-1">
                        Current cost is above target. Target cost should be ${targetCost.toFixed(2)}.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};