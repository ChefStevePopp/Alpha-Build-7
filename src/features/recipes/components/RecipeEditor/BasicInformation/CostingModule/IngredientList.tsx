import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useMasterIngredientsStore } from '@/stores/masterIngredientsStore';
import type { Recipe, RecipeIngredient } from '@/types/recipe';

interface IngredientListProps {
  recipe: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export const IngredientList: React.FC<IngredientListProps> = ({ recipe, onChange }) => {
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

  return (
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

      <button
        onClick={addIngredient}
        className="btn-ghost text-sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Ingredient
      </button>
    </div>
  );
};