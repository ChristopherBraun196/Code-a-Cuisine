import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getDisplayTags, Recipe } from '../../shared/models/recipe.model';
import { Recipes } from '../../shared/services/recipes';

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

  chefsUsed(recipe: Recipe): number[] {
    return [...new Set(recipe.directions.map((direction) => direction.chef))].sort();
  }

  chefIcon(chef: number): string {
    if (chef === 1) return 'images/icons/chef_hat.svg';
    if (chef === 2) return 'images/icons/cooking_spoon.svg';
    if (chef === 3) return 'images/icons/chef_3.svg';
    return 'images/icons/chef_4.svg';
  }

  toggleIngredients(): void {
    this.ingredientsExpanded.update((value) => !value);
  }

  toggleDirections(): void {
    this.directionsExpanded.update((value) => !value);
  }

  heartIcon(): string {
    return this.liked() ? 'images/icons/heart_full.svg' : 'images/icons/heart.svg';
  }

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
