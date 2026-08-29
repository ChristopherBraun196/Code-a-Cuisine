import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeGenerator } from '../../shared/services/recipe-generator';
import { ErrorPopup } from '../../shared/error-popup/error-popup';
import { TimeCategory } from '../../shared/models/recipe.model';

/**
 * Maps the shared model's `TimeCategory` to this page's local `CookingTime` type.
 *
 * @param timeCategory - The time category from a previously stored preference, if any.
 * @returns The matching `CookingTime` value, or null if none was set.
 */
function toCookingTime(timeCategory: TimeCategory | undefined): CookingTime | null {
  if (!timeCategory) return null;
  return timeCategory === 'elaborate' ? 'complex' : timeCategory;
}

/** Second step of the recipe wizard: collects servings, time, cuisine, diet, and helper count. */
@Component({
  imports: [FormsModule, ErrorPopup],
  selector: 'app-preferences',
  styleUrl: './preferences.scss',
  templateUrl: './preferences.html',
})
export class Preferences {
  private router = inject(Router);
  private recipeGenerator = inject(RecipeGenerator);

  portions = signal(this.recipeGenerator.preferences()?.servings ?? 2);
  helpers = signal(this.recipeGenerator.preferences()?.helperCount ?? 1);

  cookingTime = signal<CookingTime | null>(
    toCookingTime(this.recipeGenerator.preferences()?.timeCategory),
  );
  cuisine = signal<Cuisine | null>(this.recipeGenerator.preferences()?.cuisine ?? null);
  diet = signal<Diet | null>(this.recipeGenerator.preferences()?.diet ?? null);

  /** Increments the number of portions, capped at 12. */
  incrementPortions(): void {
    this.portions.update((value) => Math.min(12, value + 1));
  }

  /** Decrements the number of portions, floored at 1. */
  decrementPortions(): void {
    this.portions.update((value) => Math.max(1, value - 1));
  }

  /** Increments the number of cooking helpers, capped at 3. */
  incrementHelpers(): void {
    this.helpers.update((value) => Math.min(3, value + 1));
  }

  /** Decrements the number of cooking helpers, floored at 1. */
  decrementHelpers(): void {
    this.helpers.update((value) => Math.max(1, value - 1));
  }

  /**
   * Sets the number of portions directly, clamped to the valid 1–12 range.
   *
   * @param value - The requested number of portions.
   */
  setPortions(value: number): void {
    this.portions.set(Math.min(12, Math.max(1, value || 1)));
  }

  /**
   * Sets the number of cooking helpers directly, clamped to the valid 1–3 range.
   *
   * @param value - The requested number of helpers.
   */
  setHelpers(value: number): void {
    this.helpers.set(Math.min(3, Math.max(1, value || 1)));
  }

  /**
   * Selects the desired cooking time category.
   *
   * @param value - The time category to select.
   */
  selectCookingTime(value: CookingTime): void {
    this.cookingTime.set(value);
  }

  /**
   * Selects the desired cuisine.
   *
   * @param value - The cuisine to select.
   */
  selectCuisine(value: Cuisine): void {
    this.cuisine.set(value);
  }

  /**
   * Selects the desired diet.
   *
   * @param value - The diet to select.
   */
  selectDiet(value: Diet): void {
    this.diet.set(value);
  }

  /**
   * Stores the selected preferences in the shared `RecipeGenerator` service and
   * navigates to the Generating page, which triggers the actual n8n request.
   */
  generateRecipe(): void {
    const cookingTime = this.cookingTime()!;

    this.recipeGenerator.preferences.set({
      servings: this.portions(),
      timeCategory: cookingTime === 'complex' ? 'elaborate' : cookingTime,
      cuisine: this.cuisine()!,
      diet: this.diet()!,
      helperCount: this.helpers(),
    });

    this.router.navigate(['/generating']);
  }
}

/** Local cooking-time option shown in the UI ("complex" maps to the model's "elaborate"). */
type CookingTime = 'quick' | 'medium' | 'complex';
/** Local cuisine option shown in the UI. */
type Cuisine = 'german' | 'italian' | 'indian' | 'japanese' | 'gourmet' | 'fusion';
/** Local diet option shown in the UI. */
type Diet = 'vegetarian' | 'vegan' | 'keto' | 'none';
