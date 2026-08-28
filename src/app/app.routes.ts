import { Routes } from '@angular/router';
import { Generator } from './pages/generator/generator';
import { Home } from './pages/home/home';
import { RecipeLibrary } from './pages/recipe-library/recipe-library';
import { RecipeDetail } from './pages/recipe-detail/recipe-detail';
import { Imprint } from './pages/imprint/imprint';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { Preferences } from './pages/preferences/preferences';
import { Generating } from './pages/generating/generating';
import { Results } from './pages/results/results';
import { CookbookCuisine } from './pages/cookbook-cuisine/cookbook-cuisine';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'generate', component: Generator },
  { path: 'cookbook', component: RecipeLibrary },
  { path: 'cookbook/:cuisine', component: CookbookCuisine },
  { path: 'recipe/:id', component: RecipeDetail },
  { path: 'imprint', component: Imprint },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'preferences', component: Preferences },
  { path: 'generating', component: Generating },
  { path: 'results', component: Results },
];
