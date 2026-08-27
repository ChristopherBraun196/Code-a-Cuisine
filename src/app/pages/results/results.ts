import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';



@Component({
  imports: [RouterLink],
  selector: 'app-results',
  styleUrl: './results.scss',
  templateUrl: './results.html',
})
export class Results {
  cuisine = 'Italian';
  cookingTime = 'Quick';

  recipes: Recipe[] = [
    { id: 1, name: 'Pasta with spinach and cherry tomatoes', cookingTime: 20 },
    { id: 2, name: 'Creamy garlic shrimp pasta', cookingTime: 22 },
    { id: 3, name: 'Pasta alla Trapanese (Sicilian Tomato Pesto)', cookingTime: 20 },
  ];
}

interface Recipe {
  id: number;
  name: string;
  cookingTime: number;
}
