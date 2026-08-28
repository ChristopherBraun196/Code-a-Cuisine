import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-recipe-library',
  styleUrl: './recipe-library.scss',
  templateUrl: './recipe-library.html',
})
export class RecipeLibrary {}
