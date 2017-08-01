/**
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppState }                             from './app.service';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';

import '../assets/scss/styles.scss';
import './app.component.scss';

var styleUrlsData = [
  '../assets/css/headings.css'
];

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: styleUrlsData
})
export class AppComponent implements OnInit {
  public angularclassLogo = 'assets/img/dwl-logo.png';
  public angularclassAvatar = 'assets/img/dwl-avatar.png';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://twitter.com/davaskwebltd';

  public isNavbarMenuCollapsed:boolean;
  public isNavbarFooterCollapsed:boolean;

  constructor(
    public appState: AppState
  ) {
  }

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
