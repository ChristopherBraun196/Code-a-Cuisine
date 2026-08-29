import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../shared/models/recipe.model';
import { Recipes } from '../../shared/services/recipes';

@Component({
  imports: [RouterLink],
  selector: 'app-recipe-library',
  styleUrl: './recipe-library.scss',
  templateUrl: './recipe-library.html',
})
/** Cookbook overview: most-liked recipes and cuisine category tiles. */
export class RecipeLibrary {
  private recipesService = inject(Recipes);

  mostLiked = signal<Recipe[]>([]);
  loadingMostLiked = signal(true);

  cuisines: Cuisine[] = [
    { name: 'Italian cuisine', emoji: '🤌', image: 'images/img/italien-card.png', slug: 'italian' },
    { name: 'German cuisine', emoji: '🥨', image: 'images/img/german-card.png', slug: 'german' },
    {
      name: 'Japanese cuisine',
      emoji: '🍣',
      image: 'images/img/japanese-card.png',
      slug: 'japanese',
    },
    { name: 'Gourmet cuisine', emoji: '✨', image: 'images/img/gourmet-card.png', slug: 'gourmet' },
    { name: 'Indian cuisine', emoji: '🍛', image: 'images/img/indian-card.png', slug: 'indian' },
    { name: 'Fusion cuisine', emoji: '🍱', image: 'images/img/fusion-card.png', slug: 'fusion' },
  ];

  private isDragging = false;
  private hasMoved = false;
  private startX = 0;
  private scrollLeftStart = 0;

  constructor() {
    this.recipesService.getMostLiked(3).then((recipes) => {
      this.mostLiked.set(recipes);
      this.loadingMostLiked.set(false);
    });
  }

  /**
   * Starts a click-and-drag horizontal scroll on the "most liked" list.
   *
   * @param event - The mousedown event that started the drag.
   */
  startDrag(event: MouseEvent): void {
    event.preventDefault();
    const list = event.currentTarget as HTMLElement;
    this.isDragging = true;
    this.hasMoved = false;
    this.startX = event.pageX;
    this.scrollLeftStart = list.scrollLeft;
  }

  /**
   * Scrolls the list while dragging, and marks the interaction as a drag
   * (rather than a click) once the pointer has moved more than 5px.
   *
   * @param event - The mousemove event during the drag.
   */
  onDrag(event: MouseEvent): void {
    if (!this.isDragging) return;
    const list = event.currentTarget as HTMLElement;
    const delta = event.pageX - this.startX;
    if (Math.abs(delta) > 5) {
      this.hasMoved = true;
    }
    list.scrollLeft = this.scrollLeftStart - delta;
  }

  /**
   * Ends the drag. If the pointer moved enough to count as a drag rather than
   * a click, swallows the resulting click event so it doesn't also navigate
   * via the card's link.
   *
   * @param event - The mouseup event that ended the drag.
   */
  stopDrag(event: MouseEvent): void {
    this.isDragging = false;
    if (this.hasMoved) {
      const list = event.currentTarget as HTMLElement;
      list.addEventListener(
        'click',
        (clickEvent) => {
          clickEvent.preventDefault();
          clickEvent.stopPropagation();
        },
        { capture: true, once: true },
      );
    }
  }
}

/** A cuisine category tile shown on the cookbook overview. */
interface Cuisine {
  name: string;
  emoji: string;
  image: string;
  slug: string;
}
