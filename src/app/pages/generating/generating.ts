import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeGenerator } from '../../shared/services/recipe-generator';

@Component({
  imports: [],
  selector: 'app-generating',
  styleUrl: './generating.scss',
  templateUrl: './generating.html',
})
/**
 * Loading screen shown while the recipe request is sent to n8n. Triggers the
 * actual generation on init and navigates to Results on success, or back to
 * Preferences on failure (the error is shown via `ErrorPopup`).
 */
export class Generating implements OnInit {
  private router = inject(Router);
  private recipeGenerator = inject(RecipeGenerator);

  ngOnInit(): void {
    this.recipeGenerator
      .generate()
      .then(() => this.router.navigate(['/results']))
      .catch(() => this.router.navigate(['/preferences']));
  }
}
