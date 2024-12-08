import React from 'react';
import type { Recipe } from '../../../types/recipe';

interface NameAndTypeProps {
  recipe: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export const NameAndType: React.FC<NameAndTypeProps> = ({
  recipe,
  onChange
}) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};