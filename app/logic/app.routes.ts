import { Routes }             from '@angular/router';
import { HomeComponent }      from './home';
import { AboutComponent }     from './about';
import { NoContentComponent } from './no-content';

import { DataResolver }       from './app.resolver';

export const ROUTES: Routes = [
  { path: '',       component: HomeComponent },
  { path: 'home',   component: HomeComponent },
  { path: 'page',  component: AboutComponent },
  { path: 'search', loadChildren: './+detail#DetailModule'},
  { path: 'tags', loadChildren: './+barrel#BarrelModule'},
  { path: '**',     component: NoContentComponent },
];
