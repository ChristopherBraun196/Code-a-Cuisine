import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { getDisplayTags, Recipe } from '../../shared/models/recipe.model';
import { Recipes } from '../../shared/services/recipes';

@Component({
  imports: [RouterLink],
  selector: 'app-cookbook-cuisine',
  styleUrl: './cookbook-cuisine.scss',
  templateUrl: './cookbook-cuisine.html',
})
/** Paginated recipe list for a single cuisine (route: `/cookbook/:cuisine`). */
export class CookbookCuisine {
  private route = inject(ActivatedRoute);
  private recipesService = inject(Recipes);
  protected readonly getDisplayTags = getDisplayTags;

  readonly itemsPerPage = 15;

  private cuisineSlug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('cuisine') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('cuisine') ?? '' },
  );

  cuisineName = computed(() => CUISINE_INFO[this.cuisineSlug()]?.name ?? '');
  heroDesktop = computed(() => CUISINE_INFO[this.cuisineSlug()]?.heroDesktop ?? '');
  heroMobile = computed(() => CUISINE_INFO[this.cuisineSlug()]?.heroMobile ?? '');

  recipes = signal<Recipe[]>([]);
  loading = signal(true);
  currentPage = signal(1);

  totalPages = computed(() => Math.ceil(this.recipes().length / this.itemsPerPage));

  pagedRecipes = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.recipes().slice(start, start + this.itemsPerPage);
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

  constructor() {
    effect(() => {
      const cuisine = this.cuisineSlug();
      this.loading.set(true);
      this.recipesService.getByCuisine(cuisine as Recipe['cuisine']).then((recipes) => {
        this.recipes.set(recipes);
        this.currentPage.set(1);
        this.loading.set(false);
      });
    });
  }

  /**
   * Navigates to a specific page of results and scrolls back to the top.
   *
   * @param page - The 1-based page number to show.
   */
  goToPage(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /** Navigates to the previous page of results, if any, and scrolls back to the top. */
  prevPage(): void {
    this.currentPage.update((page) => Math.max(1, page - 1));
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /** Navigates to the next page of results, if any, and scrolls back to the top. */
  nextPage(): void {
    this.currentPage.update((page) => Math.min(this.totalPages(), page + 1));
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

/** Display name and hero images per cuisine slug, keyed by route parameter. */
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
