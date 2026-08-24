import { Routes } from '@angular/router';
import { Generator } from './pages/generator/generator';
import { Home } from './pages/home/home';
import { RecipeLibrary } from './pages/recipe-library/recipe-library';
import { RecipeDetail } from './pages/recipe-detail/recipe-detail';
import { Imprint } from './pages/imprint/imprint';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'generate', component: Generator },
  { path: 'cookbook', component: RecipeLibrary },
  { path: 'recipe/:id', component: RecipeDetail },
  { path: 'imprint', component: Imprint },
];
