export interface Recipe {
  id: string;
  name: string;
  cuisine: Cuisine;
  diet: Diet;
  timeCategory: TimeCategory;
  cookingTime: number;
  servings: number;
  likes: number;
  yourIngredients: Ingredient[];
  extraIngredients: Ingredient[];
  directions: Direction[];
  nutritionPerServing: Nutrition;
  nutritionTotal: Nutrition;
  createdAt: number;
}

export interface Ingredient {
  amount: number | null;
  unit: 'g' | 'piece' | 'l' | 'ml' | 'el' | 'tl' | '';
  name: string;
}

export interface Direction {
  step: number;
  title: string;
  chef: 1 | 2 | 3 | 4;
  parallel: boolean;
  waitMinutes: number | null;
  description: string;
}

export interface Nutrition {
  energy: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type Cuisine = 'german' | 'italian' | 'japanese' | 'indian' | 'gourmet' | 'fusion';
export type Diet = 'vegetarian' | 'vegan' | 'keto' | 'none';
export type TimeCategory = 'quick' | 'medium' | 'elaborate';

export const DIET_LABELS: Record<Diet, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  keto: 'Keto',
  none: '',
};

export const TIME_CATEGORY_LABELS: Record<TimeCategory, string> = {
  quick: 'Quick',
  medium: 'Medium',
  elaborate: 'Elaborate',
};

/**
 * Returns the display tags for a recipe (diet + time category) as human-readable labels.
 * Empty labels (e.g. for diet "none") are filtered out.
 *
 * @param recipe - The recipe to derive display tags from.
 * @returns An array of non-empty label strings.
 */
export function getDisplayTags(recipe: Recipe): string[] {
  return [DIET_LABELS[recipe.diet], TIME_CATEGORY_LABELS[recipe.timeCategory]].filter(Boolean);
}
