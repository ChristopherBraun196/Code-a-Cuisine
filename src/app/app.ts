import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
/** Root component of the application; hosts the header and the router outlet. */
export class App {
  protected readonly title = signal('code-a-cuisine');
}
