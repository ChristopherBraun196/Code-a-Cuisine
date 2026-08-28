import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

@Component({
  imports: [RouterLink],
  selector: 'app-cookbook-cuisine',
  styleUrl: './cookbook-cuisine.scss',
  templateUrl: './cookbook-cuisine.html',
})
export class CookbookCuisine {
  private route = inject(ActivatedRoute);
  readonly itemsPerPage = 15;

  private cuisineSlug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('cuisine') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('cuisine') ?? '' },
  );

  cuisineName = computed(() => CUISINE_INFO[this.cuisineSlug()]?.name ?? '');
  heroDesktop = computed(() => CUISINE_INFO[this.cuisineSlug()]?.heroDesktop ?? '');
  heroMobile = computed(() => CUISINE_INFO[this.cuisineSlug()]?.heroMobile ?? '');

  recipes: Recipe[] = buildRecipes();

  currentPage = signal(1);

  totalPages = computed(() => Math.ceil(this.recipes.length / this.itemsPerPage));

  pagedRecipes = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.recipes.slice(start, start + this.itemsPerPage);
  });

  pageNumbers = computed<(number | 'ellipsis')[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | 'ellipsis')[] = [1];

    if (current - 1 > 2) pages.push('ellipsis');
    for (let page = Math.max(2, current - 1); page <= Math.min(total - 1, current + 1); page++) {
      pages.push(page);
    }
    if (current + 1 < total - 1) pages.push('ellipsis');
    if (total > 1) pages.push(total);

    return pages;
  });

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  prevPage(): void {
    this.currentPage.update((page) => Math.max(1, page - 1));
  }

  nextPage(): void {
    this.currentPage.update((page) => Math.min(this.totalPages(), page + 1));
  }
}

function buildRecipes(): Recipe[] {
  const templates: Omit<Recipe, 'id'>[] = [
    {
      name: 'Pasta with spinach and cherry tomatoes',
      cookingTime: 20,
      tags: ['Vegetarian', 'Quick'],
      likes: 66,
    },
    { name: 'Creamy garlic shrimp pasta', cookingTime: 22, tags: ['Quick'], likes: 32 },
    { name: 'Funghi salami pizza', cookingTime: 16, tags: ['Quick'], likes: 42 },
  ];

  return Array.from({ length: 40 }, (_, index) => ({
    id: index + 1,
    ...templates[index % templates.length],
  }));
}

interface Recipe {
  id: number;
  name: string;
  cookingTime: number;
  tags: string[];
  likes: number;
}

const CUISINE_INFO: Record<string, { name: string; heroDesktop: string; heroMobile: string }> = {
  italian: {
    name: 'Italian cuisine',
    heroDesktop: 'images/img/Italian-food.png',
    heroMobile: 'images/img/mobil-Italian-food.png',
  },
  german: {
    name: 'German cuisine',
    heroDesktop: 'images/img/German-food.png',
    heroMobile: 'images/img/mobil-german-food.png',
  },
  japanese: {
    name: 'Japanese cuisine',
    heroDesktop: 'images/img/Japanese-food.png',
    heroMobile: 'images/img/mobil-japanese-food.png',
  },
  gourmet: {
    name: 'Gourmet cuisine',
    heroDesktop: 'images/img/Gourmet_food.png',
    heroMobile: 'images/img/mobil-gourmet-food.png',
  },
  indian: {
    name: 'Indian cuisine',
    heroDesktop: 'images/img/Indian-food.png',
    heroMobile: 'images/img/mobil-indian-food.png',
  },
  fusion: {
    name: 'Fusion cuisine',
    heroDesktop: 'images/img/Fusion-food.png',
    heroMobile: 'images/img/mobil-fusion-food.png',
  },
};
