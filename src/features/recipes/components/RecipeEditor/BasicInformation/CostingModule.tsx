import React from 'react';
import { CircleDollarSign, Plus, Trash2 } from 'lucide-react';
import { useMasterIngredientsStore } from '@/stores/masterIngredientsStore';
import type { Recipe, RecipeIngredient } from '@/types/recipe';
import { LABOR_RATE_PER_HOUR } from '@/constants';

interface CostingModuleProps {
  recipe: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export const CostingModule: React.FC<CostingModuleProps> = ({ recipe, onChange }) => {
  const { ingredients: masterIngredients } = useMasterIngredientsStore();

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const newIngredients = [...recipe.ingredients];
    const ingredient = newIngredients[index];

    if (field === 'name') {
      // Find the selected master ingredient
      const masterIngredient = masterIngredients.find(item => item.id === value);
      if (masterIngredient) {
        // Update ingredient with master ingredient details
        ingredient.name = value;
        ingredient.unit = masterIngredient.recipe_unit_type || masterIngredient.unit_of_measure;
        ingredient.cost = masterIngredient.cost_per_recipe_unit;
      }
    } else {
      ingredient[field] = value;
    }

    onChange({ ingredients: newIngredients });
  };

  const addIngredient = () => {
    onChange({
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
    });
  };

  const removeIngredient = (index: number) => {
    onChange({
      ingredients: recipe.ingredients.filter((_, i) => i !== index)
    });
  };

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
          onClick={addIngredient}
          className="btn-ghost text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Ingredient
        </button>
      </div>

      {/* Ingredients List */}
      <div className="space-y-4">
        {recipe.ingredients.map((ingredient, index) => (
          <div
            key={ingredient.id}
            className="grid grid-cols-6 gap-4 bg-gray-800/50 p-4 rounded-lg"
          >
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Ingredient
              </label>
              <select
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                className="input w-full"
                required
              >
                <option value="">Select ingredient</option>
                {masterIngredients.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.product}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Quantity
              </label>
              <input
                type="text"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                className="input w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={ingredient.unit}
                className="input w-full bg-gray-700"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Cost per Unit
              </label>
              <input
                type="text"
                value={`$${ingredient.cost.toFixed(2)}`}
                className="input w-full bg-gray-700"
                disabled
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => removeIngredient(index)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cost Summary */}
      <div className="bg-emerald-500/10 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-6">
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
            <div className="pt-4 border-t border-emerald-500/20">
              <div className="flex justify-between items-center">
                <span className="text-emerald-400 font-medium">Total Cost</span>
                <span className="text-2xl font-medium text-emerald-400">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-emerald-400 font-medium">Cost per {recipe.yield?.unit || 'unit'}</span>
                <span className="text-xl font-medium text-emerald-400">
                  ${costPerUnit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-4">
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
              <div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};