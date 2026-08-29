import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getDisplayTags, Nutrition, Recipe } from '../../shared/models/recipe.model';

/** Calories per gram for each macronutrient, used to derive % of total energy. */
const KCAL_PER_GRAM: Record<'protein' | 'carbs' | 'fat', number> = {
  protein: 4,
  carbs: 4,
  fat: 9,
};
import { Recipes } from '../../shared/services/recipes';

/** Full detail view for a single recipe, loaded by ID from the route. */
@Component({
  imports: [RouterLink],
  selector: 'app-recipe-detail',
  styleUrl: './recipe-detail.scss',
  templateUrl: './recipe-detail.html',
})
export class RecipeDetail {
  private route = inject(ActivatedRoute);
  private recipesService = inject(Recipes);
  protected readonly getDisplayTags = getDisplayTags;

  recipe = signal<Recipe | null>(null);
  loading = signal(true);
  liked = signal(false);

  ingredientsExpanded = signal(true);
  directionsExpanded = signal(true);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipesService.getById(id).then((recipe) => {
        this.recipe.set(recipe);
        this.loading.set(false);
        this.liked.set(localStorage.getItem(`liked-${id}`) === 'true');
      });
    } else {
      this.loading.set(false);
    }
  }

  /**
   * Returns the distinct chef numbers used across a recipe's directions, sorted ascending.
   *
   * @param recipe - The recipe to inspect.
   * @returns The sorted list of chef numbers assigned to at least one step.
   */
  chefsUsed(recipe: Recipe): number[] {
    return [...new Set(recipe.directions.map((direction) => direction.chef))].sort();
  }

  /**
   * Returns the icon path for a given chef number.
   *
   * @param chef - The chef number (1–4).
   * @returns The path to the matching chef icon.
   */
  chefIcon(chef: number): string {
    if (chef === 1) return 'images/icons/chef_hat.svg';
    if (chef === 2) return 'images/icons/cooking_spoon.svg';
    if (chef === 3) return 'images/icons/chef_3.svg';
    return 'images/icons/chef_4.svg';
  }

  /**
   * Returns what share of a nutrition entry's total energy comes from a given
   * macronutrient, as a rounded percentage (e.g. protein/carbs/fat all add up to ~100%).
   *
   * @param macro - Which macronutrient to compute the share for.
   * @param nutrition - The nutrition values to derive the percentage from.
   * @returns The macronutrient's share of total energy, rounded to the nearest percent.
   */
  macroPercent(macro: 'protein' | 'carbs' | 'fat', nutrition: Nutrition): number {
    if (!nutrition.energy) return 0;
    const macroCalories = nutrition[macro] * KCAL_PER_GRAM[macro];
    return Math.round((macroCalories / nutrition.energy) * 100);
  }

  /** Toggles whether the ingredients section is expanded (used on mobile). */
  toggleIngredients(): void {
    this.ingredientsExpanded.update((value) => !value);
  }

  /** Toggles whether the directions section is expanded (used on mobile). */
  toggleDirections(): void {
    this.directionsExpanded.update((value) => !value);
  }

  /** Returns the heart icon path matching the current like state. */
  heartIcon(): string {
    return this.liked() ? 'images/icons/heart_full.svg' : 'images/icons/heart.svg';
  }

  /**
   * Likes the current recipe: optimistically updates the UI and localStorage
   * (to prevent repeat likes from this browser, since there is no account
   * system), then persists the like to Firebase. Rolls back on failure.
   */
  async toggleLike(): Promise<void> {
    const recipe = this.recipe();
    if (!recipe || this.liked()) return;

    const previousLikes = recipe.likes;
    this.liked.set(true);
    localStorage.setItem(`liked-${recipe.id}`, 'true');
    this.recipe.set({ ...recipe, likes: previousLikes + 1 });

    try {
      await this.recipesService.likeRecipe(recipe.id);
    } catch {
      this.liked.set(false);
      localStorage.removeItem(`liked-${recipe.id}`);
      this.recipe.set({ ...recipe, likes: previousLikes });
    }
  }
}
