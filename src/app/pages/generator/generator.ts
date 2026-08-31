import { Component, signal, inject, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeGenerator } from '../../shared/services/recipe-generator';

/** Allows only letters (incl. umlauts/accents), spaces, hyphens, and apostrophes. */
const NAME_PATTERN = /^[\p{L}\s'-]+$/u;
/** Requires at least one vowel, to reject keyboard-mashed input like "dfgbrbdfdb". */
const VOWEL_PATTERN = /[aeiouyäöüàáâãåæèéêëìíîïòóôõøùúûý]/i;
/** Rejects the same character repeated 3+ times in a row (e.g. "aaaa", "xxxxx"). */
const REPEATED_CHAR_PATTERN = /(.)\1{2,}/i;

/** First step of the recipe wizard: lets the user add, edit, and remove ingredients. */
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

  /**
   * Sets the unit for the ingredient currently being added and closes the unit dropdown.
   *
   * @param unit - The unit to select.
   */
  selectUnit(unit: Ingredient['unit']): void {
    this.newUnit = unit;
    this.isUnitOpen.set(false);
  }

  /**
   * Checks whether an ingredient name is non-empty, contains only letters,
   * spaces, hyphens, and apostrophes, has at least one vowel, and has no
   * character repeated 3+ times in a row. This is a heuristic to catch
   * keyboard-mashed input (e.g. "dfgbrbdfdb") — it cannot verify the name is
   * an actual, real-world ingredient.
   *
   * @param name - The ingredient name to validate.
   * @returns `true` if the name is invalid.
   */
  isNameInvalid(name: string): boolean {
    const trimmed = name.trim();
    return (
      !trimmed ||
      !NAME_PATTERN.test(trimmed) ||
      !VOWEL_PATTERN.test(trimmed) ||
      REPEATED_CHAR_PATTERN.test(trimmed)
    );
  }

  /** Validates and adds the currently entered ingredient to the list, then resets the form fields. */
  addIngredient(): void {
    if (this.isNameInvalid(this.newName) || !this.newAmount || !this.newUnit) {
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

  /**
   * Removes an ingredient from the list by index.
   *
   * @param index - The index of the ingredient to remove.
   */
  removeIngredient(index: number): void {
    this.ingredients.update((list) => list.filter((_, i) => i !== index));
  }

  /**
   * Validates that at least one ingredient has been entered, then stores the
   * ingredients in the shared `RecipeGenerator` service and navigates to the
   * Preferences page. If the list is empty, shows a validation error instead
   * of navigating.
   */
  goToNextStep(): void {
    if (this.ingredients().length === 0) {
      this.showNoIngredientsError.set(true);
      this.showNameError.set(true);
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

  /**
   * Sets the unit for the ingredient currently being edited and closes the unit dropdown.
   *
   * @param unit - The unit to select.
   */
  selectEditUnit(unit: Ingredient['unit']): void {
    this.editUnit = unit;
    this.isEditUnitOpen.set(false);
  }

  /**
   * Closes both unit dropdowns when the user clicks anywhere outside of them.
   *
   * @param target - The element that was clicked.
   */
  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null): void {
    if (!(target instanceof Element)) {
      return;
    }

    if (!target.closest('.generate__unit-dropdown')) {
      this.isUnitOpen.set(false);
    }
    if (!target.closest('.generate__edit-unit-dropdown')) {
      this.isEditUnitOpen.set(false);
    }
  }

  /**
   * Starts inline editing for an ingredient, pre-filling the edit fields with its current values.
   *
   * @param index - The index of the ingredient to edit.
   */
  startEdit(index: number): void {
    const ingredient = this.ingredients()[index];
    this.editAmount = ingredient.amount;
    this.editUnit = ingredient.unit;
    this.editingIndex.set(index);
  }

  /**
   * Saves the edited amount and unit for an ingredient and exits edit mode.
   *
   * @param index - The index of the ingredient being edited.
   */
  saveEdit(index: number): void {
    this.ingredients.update((list) =>
      list.map((item, i) =>
        i === index ? { ...item, amount: this.editAmount, unit: this.editUnit } : item,
      ),
    );
    this.editingIndex.set(null);
  }
}

/** An ingredient as entered in the Generator form (before mapping to the shared Recipe model). */
interface Ingredient {
  name: string;
  amount: number;
  unit: 'gram' | 'piece' | 'ml';
}
