import { Component, inject, effect, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeGenerator } from '../services/recipe-generator';

@Component({
  imports: [],
  selector: 'app-error-popup',
  styleUrl: './error-popup.scss',
  templateUrl: './error-popup.html',
})
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

  dismiss(): void {
    this.recipeGenerator.errorMessage.set(null);
  }

  goBackToIngredients(): void {
    this.dismiss();
    this.router.navigate(['/generate']);
  }
}
