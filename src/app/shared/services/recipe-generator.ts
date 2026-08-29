import { Service, signal, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cuisine, Diet, Ingredient, Recipe, TimeCategory } from '../models/recipe.model';

interface Preferences {
  servings: number;
  timeCategory: TimeCategory;
  cuisine: Cuisine;
  diet: Diet;
  helperCount: number;
}

const INGREDIENTS_KEY = 'recipe-generator-ingredients';
const PREFERENCES_KEY = 'recipe-generator-preferences';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

@Service()
export class RecipeGenerator {
  private http = inject(HttpClient);

  ingredients = signal<Ingredient[]>(loadFromStorage(INGREDIENTS_KEY, []));
  preferences = signal<Preferences | null>(loadFromStorage(PREFERENCES_KEY, null));
  results = signal<Recipe[]>([]);
  errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(this.ingredients()));
    });
    effect(() => {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.preferences()));
    });
  }

  async generate(): Promise<void> {
    const prefs = this.preferences();
    if (!prefs) {
      throw new Error('Preferences fehlen');
    }

    this.errorMessage.set(null);

    const body = {
      ingredients: this.ingredients(),
      servings: prefs.servings,
      timeCategory: prefs.timeCategory,
      cuisine: prefs.cuisine,
      diet: prefs.diet,
      helperCount: prefs.helperCount,
    };

    try {
      const response = await firstValueFrom(
        this.http.post<{ recipes: Recipe[] }>(environment.n8nWebhookUrl, body),
      );
      this.results.set(response.recipes);
      localStorage.removeItem(INGREDIENTS_KEY);
      localStorage.removeItem(PREFERENCES_KEY);
    } catch (error: any) {
      const message =
        error?.error?.message ??
        error?.error?.details?.join(', ') ??
        'Something went wrong while generating recipes. Please try again.';
      this.errorMessage.set(message);
      throw error;
    }
  }
}
