import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { Location } from '@angular/common';

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
