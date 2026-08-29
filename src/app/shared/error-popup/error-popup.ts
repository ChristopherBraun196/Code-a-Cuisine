import { Component, inject, effect, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeGenerator } from '../services/recipe-generator';

@Component({
  imports: [],
  selector: 'app-error-popup',
  styleUrl: './error-popup.scss',
  templateUrl: './error-popup.html',
})
/**
 * Modal popup shown whenever a recipe-generation request fails (validation, quota,
 * or network errors). Reads its message from `RecipeGenerator.errorMessage` and
 * locks page scrolling while visible.
 */
export class ErrorPopup implements OnDestroy {
  protected recipeGenerator = inject(RecipeGenerator);
  private router = inject(Router);

  constructor() {
    effect(() => {
      document.body.style.overflow = this.recipeGenerator.errorMessage() ? 'hidden' : '';
    });
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  /** Closes the popup by clearing the error message. */
  dismiss(): void {
    this.recipeGenerator.errorMessage.set(null);
  }

  /** Closes the popup and navigates back to the ingredients (Generator) page. */
  goBackToIngredients(): void {
    this.dismiss();
    this.router.navigate(['/generate']);
  }
}
