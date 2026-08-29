import { Service } from '@angular/core';
import { get, ref, runTransaction } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import { auth, database } from '../../firebase';
import { Cuisine, Recipe } from '../models/recipe.model';

/** Reads stored recipes from the Firebase Realtime Database and manages likes. */
@Service()
export class Recipes {
  private recipesRef = ref(database, 'recipes');

  /**
   * Loads all recipes stored in Firebase.
   *
   * @returns All stored recipes as an array.
   */
  async getAll(): Promise<Recipe[]> {
    const snapshot = await get(this.recipesRef);
    return this.toRecipeArray(snapshot.val());
  }

  /**
   * Loads a single recipe by its Firebase ID.
   *
   * @param id - The Firebase key of the recipe.
   * @returns The recipe, or null if no recipe exists for the given ID.
   */
  async getById(id: string): Promise<Recipe | null> {
    const snapshot = await get(ref(database, `recipes/${id}`));
    const data = snapshot.val();
    return data ? { id, ...data } : null;
  }

  /**
   * Loads all recipes belonging to a given cuisine.
   *
   * @param cuisine - The cuisine to filter recipes by.
   * @returns All recipes matching the given cuisine.
   */
  async getByCuisine(cuisine: Cuisine): Promise<Recipe[]> {
    const all = await this.getAll();
    return all.filter((recipe) => recipe.cuisine === cuisine);
  }

  /**
   * Converts the object Firebase returns (recipe ID as key) into an array of recipes.
   *
   * @param data - The raw object returned by Firebase, or null if empty.
   * @returns An array of recipes with their IDs attached.
   */
  private toRecipeArray(data: Record<string, Omit<Recipe, 'id'>> | null): Recipe[] {
    if (!data) return [];
    return Object.entries(data).map(([id, recipe]) => ({ id, ...recipe }));
  }

  /**
   * Loads the most-liked recipes, sorted by like count descending.
   *
   * @param count - The maximum number of recipes to return.
   * @returns The top `count` recipes by like count.
   */
  async getMostLiked(count: number): Promise<Recipe[]> {
    const all = await this.getAll();
    return [...all].sort((a, b) => b.likes - a.likes).slice(0, count);
  }

  /**
   * Increments a recipe's like count by 1 and returns the new value.
   * Signs the browser in anonymously if needed (security rules require auth for writes),
   * and uses a transaction to avoid race conditions when multiple users like at once.
   *
   * @param id - The Firebase key of the recipe to like.
   * @returns The updated like count.
   */
  async likeRecipe(id: string): Promise<number> {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }

    const result = await runTransaction(
      ref(database, `recipes/${id}/likes`),
      (current) => (current || 0) + 1,
    );
    return result.snapshot.val();
  }
}
