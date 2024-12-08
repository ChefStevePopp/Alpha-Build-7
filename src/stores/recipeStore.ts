import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Recipe } from '@/features/recipes/types/recipe';
import toast from 'react-hot-toast';

interface RecipeStore {
  recipes: Recipe[];
  isLoading: boolean;
  currentRecipe: Recipe | null;
  fetchRecipes: () => Promise<void>;
  createRecipe: (recipe: Omit<Recipe, 'id' | 'lastModified'>) => Promise<void>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  setCurrentRecipe: (recipe: Recipe | null) => void;
  calculateCosts: (recipe: Recipe) => { totalCost: number; costPerServing: number };
  filterRecipes: (type: 'prepared' | 'final', searchTerm: string) => Recipe[];
}

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recipes: [],
  isLoading: false,
  currentRecipe: null,

  fetchRecipes: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('organization_id', user.user_metadata.organizationId)
        .order('name');

      if (error) throw error;

      // Initialize storage property for recipes that don't have it
      const recipesWithStorage = data.map(recipe => ({
        ...recipe,
        storage: recipe.storage || {
          temperature: {
            value: 40,
            unit: 'F' as const,
            tolerance: 2
          },
          shelfLife: {
            value: 1,
            unit: 'days' as const
          },
          specialInstructions: []
        }
      }));

      set({ recipes: recipesWithStorage });
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      set({ isLoading: false });
    }
  },

  createRecipe: async (recipe) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const newRecipe = {
        ...recipe,
        organization_id: user.user_metadata.organizationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user.id,
        modified_by: user.id,
        storage: recipe.storage || {
          temperature: {
            value: 40,
            unit: 'F' as const,
            tolerance: 2
          },
          shelfLife: {
            value: 1,
            unit: 'days' as const
          },
          specialInstructions: []
        }
      };

      const { data, error } = await supabase
        .from('recipes')
        .insert([newRecipe])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        recipes: [...state.recipes, data]
      }));

      toast.success('Recipe created successfully');
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('Failed to create recipe');
      throw error;
    }
  },

  updateRecipe: async (id, updates) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { error } = await supabase
        .from('recipes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
          modified_by: user.id
        })
        .eq('id', id)
        .eq('organization_id', user.user_metadata.organizationId);

      if (error) throw error;

      set(state => ({
        recipes: state.recipes.map(recipe =>
          recipe.id === id ? { ...recipe, ...updates } : recipe
        )
      }));

      toast.success('Recipe updated successfully');
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('Failed to update recipe');
      throw error;
    }
  },

  deleteRecipe: async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.organizationId) {
        throw new Error('No organization ID found');
      }

      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)
        .eq('organization_id', user.user_metadata.organizationId);

      if (error) throw error;

      set(state => ({
        recipes: state.recipes.filter(recipe => recipe.id !== id)
      }));

      toast.success('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
      throw error;
    }
  },

  setCurrentRecipe: (recipe) => {
    set({ currentRecipe: recipe });
  },

  calculateCosts: (recipe) => {
    const ingredientCost = recipe.ingredients.reduce((sum, ingredient) => 
      sum + ingredient.cost, 0);
    
    const laborCost = ((recipe.prepTime + recipe.cookTime) / 60) * 30; // $30/hr labor rate
    const totalCost = ingredientCost + laborCost;
    const costPerServing = totalCost / parseInt(recipe.recipeUnitRatio);

    return { totalCost, costPerServing };
  },

  filterRecipes: (type, searchTerm) => {
    const { recipes } = get();
    return recipes.filter(recipe => {
      const matchesType = recipe.type === type;
      const matchesSearch = searchTerm ? (
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.station.toLowerCase().includes(searchTerm.toLowerCase())
      ) : true;
      return matchesType && matchesSearch;
    });
  }
}));