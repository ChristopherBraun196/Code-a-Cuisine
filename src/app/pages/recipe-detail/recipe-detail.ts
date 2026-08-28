import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-recipe-detail',
  styleUrl: './recipe-detail.scss',
  templateUrl: './recipe-detail.html',
})
export class RecipeDetail {
  recipe: Recipe = {
    name: 'Pasta with spinach and cherry tomatoes',
    cookingTime: 20,
    servings: 2,
    tags: ['Vegetarian', 'Quick'],
    likes: 66,
    nutrition: { energy: 630, protein: 18, fat: 24, carbs: 58 },
    yourIngredients: [
      { amount: '80g', name: 'Pasta noodles' },
      { amount: '100g', name: 'Baby spinach' },
      { amount: '150g', name: 'Cherry tomatoes' },
      { amount: '1 piece', name: 'Egg' },
    ],
    extraIngredients: [
      { amount: '40g', name: 'Parmesan cheese' },
      { amount: '30ml', name: 'Olive oil' },
      { amount: '', name: 'Herbs (dry basil, oregano, garlic)' },
    ],
    directions: [
      {
        step: 1,
        title: 'Cook the pasta',
        chef: 1,
        description:
          'Cook your noodles in boiling, salted water, until the pasta is al dente. Drain the pasta and reserve some of the pasta water.',
      },
      {
        step: 2,
        title: 'Make the sauce',
        chef: 2,
        description:
          'While the pasta is cooking, heat olive oil in a pan over medium heat. Add the garlic, and sauté until it starts to turn golden. Add the tomatoes, oregano, salt, and pepper, and cook for 3-4 minutes.',
      },
      {
        step: 3,
        title: 'Finish the pasta',
        chef: 1,
        description:
          'Add the noodles to the sauce, then add pasta water until the sauce is the right consistency. Simmer for 1 minute, then add the spinach, basil, chili flakes, and parmesan.',
      },
      {
        step: 4,
        title: 'Make the sauce',
        chef: 2,
        description:
          'Lower the heat to low, stir until mixed, and remove from the heat. Season to taste, top with parmesan cheese, and enjoy.',
      },
    ],
  };

  ingredientsExpanded = signal(true);
  directionsExpanded = signal(true);

  toggleIngredients(): void {
    this.ingredientsExpanded.update((value) => !value);
  }

  toggleDirections(): void {
    this.directionsExpanded.update((value) => !value);
  }
}

interface Recipe {
  name: string;
  cookingTime: number;
  servings: number;
  tags: string[];
  likes: number;
  nutrition: { energy: number; protein: number; fat: number; carbs: number };
  yourIngredients: Ingredient[];
  extraIngredients: Ingredient[];
  directions: Direction[];
}

interface Ingredient {
  amount: string;
  name: string;
}

interface Direction {
  step: number;
  title: string;
  chef: 1 | 2;
  description: string;
}
