import React from 'react';
import { Package, CircleDollarSign, Plus, Trash2 } from 'lucide-react';
import type { Recipe } from '../../types/recipe';
import { useMasterIngredientsStore } from '@/stores/masterIngredientsStore';

interface RecipeInformationProps {
  recipe: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export const RecipeInformation: React.FC<RecipeInformationProps> = ({
  recipe,
  onChange
}) => {
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
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white">Recipe Information</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Recipe Name
            </label>
            <input
              type="text"
              value={recipe.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="input w-full"
              placeholder="Enter recipe name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Recipe Type
            </label>
            <select
              value={recipe.type}
              onChange={(e) => onChange({ type: e.target.value as 'prepared' | 'final' })}
              className="input w-full"
              required
            >
              <option value="prepared">Prepared Item</option>
              <option value="final">Final Plate</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Description
          </label>
          <textarea
            value={recipe.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className="input w-full h-24"
            placeholder="Enter recipe description"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Recipe Unit Ratio
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={recipe.recipeUnitRatio}
                onChange={(e) => onChange({ recipeUnitRatio: e.target.value })}
                className="input flex-1"
                placeholder="e.g., 4 servings"
                required
              />
              <select
                value={recipe.unitType}
                onChange={(e) => onChange({ unitType: e.target.value })}
                className="input w-32"
                required
              >
                <option value="servings">servings</option>
                <option value="portions">portions</option>
                <option value="pieces">pieces</option>
                <option value="g">grams</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">liters</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Station
            </label>
            <select
              value={recipe.station}
              onChange={(e) => onChange({ station: e.target.value })}
              className="input w-full"
              required
            >
              <option value="">Select station...</option>
              <option value="grill">Grill</option>
              <option value="saute">Sauté</option>
              <option value="fry">Fry</option>
              <option value="prep">Prep</option>
              <option value="pantry">Pantry</option>
              <option value="pizza">Pizza</option>
              <option value="expo">Expo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CircleDollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium text-white">Ingredients & Costing</h3>
          </div>
          <button
            onClick={addIngredient}
            className="btn-ghost text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Ingredient
          </button>
        </div>

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
                  Notes
                </label>
                <input
                  type="text"
                  value={ingredient.notes || ''}
                  onChange={(e) => handleIngredientChange(index, 'notes', e.target.value)}
                  className="input w-full"
                  placeholder="Optional notes"
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
      </div>
    </div>
  );
};