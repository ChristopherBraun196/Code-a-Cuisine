import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-preferences',
  styleUrl: './preferences.scss',
  templateUrl: './preferences.html',
})
export class Preferences {
  private router = inject(Router);

  portions = signal(2);
  helpers = signal(1);

  cookingTime = signal<CookingTime | null>(null);
  cuisine = signal<Cuisine | null>(null);
  diet = signal<Diet | null>(null);

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
    this.router.navigate(['/generating']);
  }
}

type CookingTime = 'quick' | 'medium' | 'complex';
type Cuisine = 'german' | 'italian' | 'indian' | 'japanese' | 'gourmet' | 'fusion';
type Diet = 'vegetarian' | 'vegan' | 'keto' | 'none';
