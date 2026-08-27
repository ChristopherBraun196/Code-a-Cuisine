import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

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

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
  );

  isHomePage = computed(
    () =>
      this.currentUrl() === '/' ||
      this.currentUrl() === '/generating' ||
      this.currentUrl() === '/results',
  );

  isLightPage = computed(
    () => this.currentUrl() === '/generate' || this.currentUrl() === '/preferences',
  );

  backTarget = computed(() => (this.currentUrl() === '/preferences' ? '/generate' : '/'));
  backLabel = computed(() => (this.currentUrl() === '/preferences' ? 'Ingredients' : 'Home'));
}
