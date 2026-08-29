import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { Location } from '@angular/common';

/**
 * Global site header. Adapts its appearance and back-navigation target based on
 * the current route, and uses browser history (instead of a fixed link) for
 * pages reachable from multiple places (e.g. a recipe opened from Results vs.
 * from the Cookbook).
 */
@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
  host: {
    '[class.header--light]': 'isLightPage()',
  },
})
export class Header {
  private router = inject(Router);
  private location = inject(Location);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  private currentPath = computed(() => this.currentUrl().split('?')[0]);
  private cameFromRecipe = computed(() => this.currentUrl().includes('from=recipe'));

  isHomePage = computed(
    () =>
      this.currentPath() === '/' ||
      this.currentPath() === '/generating' ||
      this.currentPath() === '/results',
  );

  isLightPage = computed(
    () =>
      this.currentPath() === '/generate' ||
      this.currentPath() === '/preferences' ||
      this.currentPath().startsWith('/recipe/') ||
      this.currentPath().startsWith('/cookbook'),
  );

  backTarget = computed(() => {
    if (this.currentPath() === '/preferences') return '/generate';
    if (this.currentPath().startsWith('/recipe/')) return '/results';
    if (this.currentPath().startsWith('/cookbook/')) return '/cookbook';
    return '/';
  });

  backLabel = computed(() => {
    if (this.currentPath() === '/preferences') return 'Ingredients';
    if (this.currentPath() === '/cookbook') return 'Back';
    if (this.currentPath().startsWith('/cookbook/')) return 'Cookbook';
    if (this.currentPath().startsWith('/recipe/')) return 'Back';
    return 'Home';
  });

  /**
   * Intercepts the back link's click for routes that can be reached from more
   * than one place, and uses `Location.back()` instead of the fixed
   * `backTarget` link so the user returns to wherever they actually came from
   * (e.g. a recipe detail page opened from Results vs. from the Cookbook).
   *
   * @param event - The click event on the back link; prevented when history navigation is used.
   */
  goBack(event: MouseEvent): void {
    const path = this.currentPath();

    if (path.startsWith('/recipe/') || path.startsWith('/cookbook/')) {
      event.preventDefault();
      this.location.back();
      return;
    }

    if (path === '/cookbook' && this.cameFromRecipe()) {
      event.preventDefault();
      this.location.back();
    }
  }
}
