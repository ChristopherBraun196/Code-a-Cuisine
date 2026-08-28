import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-recipe-library',
  styleUrl: './recipe-library.scss',
  templateUrl: './recipe-library.html',
})
export class RecipeLibrary {
  mostLiked: LikedRecipe[] = [
    { id: 1, name: 'Pasta with spinach and cherry tomatoes', cookingTime: 20, likes: 66 },
    { id: 2, name: 'Low Carb Vegan No-Bake Paleo Bars', cookingTime: 35, likes: 57 },
    { id: 3, name: 'Schnitzel with potato salad', cookingTime: 40, likes: 48 },
  ];

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

  startDrag(event: MouseEvent): void {
    event.preventDefault();
    const list = event.currentTarget as HTMLElement;
    this.isDragging = true;
    this.hasMoved = false;
    this.startX = event.pageX;
    this.scrollLeftStart = list.scrollLeft;
  }

  onDrag(event: MouseEvent): void {
    if (!this.isDragging) return;
    const list = event.currentTarget as HTMLElement;
    const delta = event.pageX - this.startX;
    if (Math.abs(delta) > 5) {
      this.hasMoved = true;
    }
    list.scrollLeft = this.scrollLeftStart - delta;
  }

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

interface LikedRecipe {
  id: number;
  name: string;
  cookingTime: number;
  likes: number;
}

interface Cuisine {
  name: string;
  emoji: string;
  image: string;
  slug: string;
}
