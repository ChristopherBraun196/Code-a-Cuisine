import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeGenerator } from '../../shared/services/recipe-generator';

@Component({
  imports: [FormsModule],
  selector: 'app-generator',
  styleUrl: './generator.scss',
  templateUrl: './generator.html',
})
export class Generator {
  private router = inject(Router);
  private recipeGenerator = inject(RecipeGenerator);

  ingredients = signal<Ingredient[]>(
    this.recipeGenerator.ingredients().map((ingredient) => ({
      name: ingredient.name,
      amount: ingredient.amount ?? 0,
      unit: ingredient.unit === 'g' ? 'gram' : (ingredient.unit as Ingredient['unit']),
    })),
  );
  showNameError = signal(false);
  showAmountError = signal(false);
  showNoIngredientsError = signal(false);

  newName = '';
  newAmount = 100;
  newUnit: Ingredient['unit'] = 'gram';

  editingIndex = signal<number | null>(null);
  editAmount = 0;
  editUnit: Ingredient['unit'] = 'gram';
  isEditUnitOpen = signal(false);

  isUnitOpen = signal(false);

  selectUnit(unit: Ingredient['unit']): void {
    this.newUnit = unit;
    this.isUnitOpen.set(false);
  }

  addIngredient(): void {
    if (!this.newName.trim() || !this.newAmount || !this.newUnit) {
      this.showNameError.set(true);
      return;
    }

    this.showNameError.set(false);
    this.showAmountError.set(false);

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

  goToNextStep(): void {
    if (this.ingredients().length === 0) {
      this.showNoIngredientsError.set(true);
      return;
    }
    this.showNoIngredientsError.set(false);

    this.recipeGenerator.ingredients.set(
      this.ingredients().map((ingredient) => ({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit === 'gram' ? 'g' : ingredient.unit,
      })),
    );

    this.router.navigate(['/preferences']);
  }

  selectEditUnit(unit: Ingredient['unit']): void {
    this.editUnit = unit;
    this.isEditUnitOpen.set(false);
  }

  startEdit(index: number): void {
    const ingredient = this.ingredients()[index];
    this.editAmount = ingredient.amount;
    this.editUnit = ingredient.unit;
    this.editingIndex.set(index);
  }

  saveEdit(index: number): void {
    this.ingredients.update((list) =>
      list.map((item, i) =>
        i === index ? { ...item, amount: this.editAmount, unit: this.editUnit } : item,
      ),
    );
    this.editingIndex.set(null);
  }
}

interface Ingredient {
  name: string;
  amount: number;
  unit: 'gram' | 'piece' | 'ml';
}
