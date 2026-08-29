import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeGenerator } from '../../shared/services/recipe-generator';
import { ErrorPopup } from '../../shared/error-popup/error-popup';
import { TimeCategory } from '../../shared/models/recipe.model';

function toCookingTime(timeCategory: TimeCategory | undefined): CookingTime | null {
  if (!timeCategory) return null;
  return timeCategory === 'elaborate' ? 'complex' : timeCategory;
}

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

  incrementPortions(): void {
    this.portions.update((value) => Math.min(12, value + 1));
  }

  decrementPortions(): void {
    this.portions.update((value) => Math.max(1, value - 1));
  }

  incrementHelpers(): void {
    this.helpers.update((value) => Math.min(3, value + 1));
  }

  decrementHelpers(): void {
    this.helpers.update((value) => Math.max(1, value - 1));
  }

  setPortions(value: number): void {
    this.portions.set(Math.min(12, Math.max(1, value || 1)));
  }

  setHelpers(value: number): void {
    this.helpers.set(Math.min(3, Math.max(1, value || 1)));
  }

  selectCookingTime(value: CookingTime): void {
    this.cookingTime.set(value);
  }

  selectCuisine(value: Cuisine): void {
    this.cuisine.set(value);
  }

  selectDiet(value: Diet): void {
    this.diet.set(value);
  }

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

type CookingTime = 'quick' | 'medium' | 'complex';
type Cuisine = 'german' | 'italian' | 'indian' | 'japanese' | 'gourmet' | 'fusion';
type Diet = 'vegetarian' | 'vegan' | 'keto' | 'none';
