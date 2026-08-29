import { Service } from '@angular/core';
import { get, ref, runTransaction } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import { auth, database } from '../../firebase';
import { Cuisine, Recipe } from '../models/recipe.model';

@Service()
export class Recipes {
  private recipesRef = ref(database, 'recipes');

  async getAll(): Promise<Recipe[]> {
    const snapshot = await get(this.recipesRef);
    return this.toRecipeArray(snapshot.val());
  }

  async getById(id: string): Promise<Recipe | null> {
    const snapshot = await get(ref(database, `recipes/${id}`));
    const data = snapshot.val();
    return data ? { id, ...data } : null;
  }

  async getByCuisine(cuisine: Cuisine): Promise<Recipe[]> {
    const all = await this.getAll();
    return all.filter((recipe) => recipe.cuisine === cuisine);
  }

  private toRecipeArray(data: Record<string, Omit<Recipe, 'id'>> | null): Recipe[] {
    if (!data) return [];
    return Object.entries(data).map(([id, recipe]) => ({ id, ...recipe }));
  }

  async getMostLiked(count: number): Promise<Recipe[]> {
    const all = await this.getAll();
    return [...all].sort((a, b) => b.likes - a.likes).slice(0, count);
  }

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
