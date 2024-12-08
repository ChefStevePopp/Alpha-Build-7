import React from 'react';
import { Package } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { NameAndType } from './NameAndType';
import { MisEnPlaceCategory } from './MisEnPlaceCategory';
import { CostingModule } from './CostingModule';

interface BasicInformationProps {
  recipe: Recipe;
  onChange: (updates: Partial<Recipe>) => void;
}

export const BasicInformation: React.FC<BasicInformationProps> = ({
  recipe,
  onChange
}) => {
  return (
    <div className="space-y-8">
      {/* Basic Information Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Package className="w-4 h-4 text-blue-400" />
        </div>
        <h3 className="text-lg font-medium text-white">Recipe Information</h3>
      </div>
      
      {/* Name, Type and Description */}
      <NameAndType 
        recipe={recipe}
        onChange={onChange}
      />

      {/* Costing Module */}
      <CostingModule 
        recipe={recipe}
        onChange={onChange}
      />

      {/* Mise en Place Category */}
      <MisEnPlaceCategory 
        recipe={recipe}
        onChange={onChange}
      />
    </div>
  );
};