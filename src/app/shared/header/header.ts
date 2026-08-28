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

  isHomePage = computed(
    () =>
      this.currentUrl() === '/' ||
      this.currentUrl() === '/generating' ||
      this.currentUrl() === '/results',
  );

  isLightPage = computed(
    () =>
      this.currentUrl() === '/generate' ||
      this.currentUrl() === '/preferences' ||
      this.currentUrl().startsWith('/recipe/') ||
      this.currentUrl().startsWith('/cookbook'),
  );

  backTarget = computed(() => {
    if (this.currentUrl() === '/preferences') return '/generate';
    if (this.currentUrl().startsWith('/recipe/')) return '/results';
    if (this.currentUrl().startsWith('/cookbook/')) return '/cookbook';
    return '/';
  });

  backLabel = computed(() => {
    if (this.currentUrl() === '/preferences') return 'Ingredients';
    if (this.currentUrl() === '/cookbook') return 'Back';
    if (this.currentUrl().startsWith('/cookbook/')) return 'Cookbook';
    if (this.currentUrl().startsWith('/recipe/')) return 'Back';
    return 'Home';
  });

  goBack(event: MouseEvent): void {
    if (this.currentUrl() === '/cookbook' || this.currentUrl().startsWith('/recipe/')) {
      event.preventDefault();
      this.location.back();
    }
  }
}
