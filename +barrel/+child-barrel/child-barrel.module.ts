import { NgbModule }            from '@ng-bootstrap/ng-bootstrap';

import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { NgModule }             from '@angular/core';
import { RouterModule }         from '@angular/router';

import { routes }               from './child-barrel.routes';
import { ChildBarrelComponent } from './child-barrel.component';

console.log('`ChildBarrel` bundle loaded asynchronously');

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    ChildBarrelComponent,
  ],
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class ChildBarrelModule {
  public static routes = routes;
}
