import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeGenerator } from '../../shared/services/recipe-generator';

@Component({
  imports: [],
  selector: 'app-generating',
  styleUrl: './generating.scss',
  templateUrl: './generating.html',
})
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
