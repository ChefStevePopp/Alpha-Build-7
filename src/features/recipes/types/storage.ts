import type { Recipe } from './recipe';

export type Temperature = {
  value: number;
  unit: 'F' | 'C';
  tolerance: number;
};

export type ShelfLife = {
  value: number;
  unit: 'hours' | 'days' | 'weeks';
};

export type Storage = Required<NonNullable<Recipe['storage']>>;

export const DEFAULT_STORAGE: Required<NonNullable<Recipe['storage']>> = {
  location: '',
  container: '',
  containerType: '',
  temperature: {
    value: 40,
    unit: 'F',
    tolerance: 2
  },
  shelfLife: {
    value: 1,
    unit: 'days'
  },
  specialInstructions: []
};