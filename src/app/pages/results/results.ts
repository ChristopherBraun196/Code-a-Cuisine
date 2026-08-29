import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeGenerator } from '../../shared/services/recipe-generator';
import { Recipe, TIME_CATEGORY_LABELS } from '../../shared/models/recipe.model';

@Component({
  imports: [RouterLink],
  selector: 'app-results',
  styleUrl: './results.scss',
  templateUrl: './results.html',
})
export class Results {
  private recipeGenerator = inject(RecipeGenerator);

  get recipes(): Recipe[] {
    return this.recipeGenerator.results();
  }

  get cuisine(): string {
    const value = this.recipeGenerator.preferences()?.cuisine ?? '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  get cookingTime(): string {
    const timeCategory = this.recipeGenerator.preferences()?.timeCategory;
    return timeCategory ? TIME_CATEGORY_LABELS[timeCategory] : '';
  }
}
