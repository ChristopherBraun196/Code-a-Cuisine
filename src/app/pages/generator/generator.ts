import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-generator',
  styleUrl: './generator.scss',
  templateUrl: './generator.html',
})
export class Generator {
  ingredients = signal<Ingredient[]>([]);

  newName = '';
  newAmount = 100;
  newUnit: Ingredient['unit'] = 'gram';

  addIngredient(): void {
    this.ingredients.update((list) => [
      ...list,
      { name: this.newName, amount: this.newAmount, unit: this.newUnit },
    ]);

    this.newName = '';
    this.newAmount = 100;
  }

  removeIngredient(index: number): void {
    this.ingredients.update((list) => list.filter((_, i) => i !== index));
  }
}

interface Ingredient {
  name: string;
  amount: number;
  unit: 'gram' | 'stück' | 'liter';
}
