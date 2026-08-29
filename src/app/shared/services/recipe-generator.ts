import { Service, signal, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cuisine, Diet, Ingredient, Recipe, TimeCategory } from '../models/recipe.model';

/** User-selected preferences collected on the Preferences page. */
interface Preferences {
  servings: number;
  timeCategory: TimeCategory;
  cuisine: Cuisine;
  diet: Diet;
  helperCount: number;
}

const INGREDIENTS_KEY = 'recipe-generator-ingredients';
const PREFERENCES_KEY = 'recipe-generator-preferences';

/**
 * Reads and parses a JSON value from localStorage, falling back to a default on failure.
 *
 * @param key - The localStorage key to read.
 * @param fallback - The value to return if the key is missing or invalid.
 * @returns The parsed value, or `fallback`.
 */
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Holds the recipe-request form state (ingredients, preferences) across the
 * Generator → Preferences → Generating → Results flow, and calls the n8n
 * webhook to generate recipes. Ingredients and preferences are persisted to
 * localStorage so they survive navigation and page reloads until a recipe
 * has been successfully generated.
 */
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

  /**
   * Sends the current ingredients and preferences to the n8n webhook to generate recipes.
   * On success, stores the results and clears the persisted form data. On failure,
   * sets `errorMessage` with a user-facing message and rethrows.
   *
   * @throws If `preferences` has not been set yet, or if the request fails.
   */
  async generate(): Promise<void> {
    const prefs = this.preferences();
    if (!prefs) {
      throw new Error('Preferences have not been set');
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
