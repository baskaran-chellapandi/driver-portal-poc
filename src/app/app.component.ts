import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Dashboard', url: '/user/dashboard'},
    { title: 'Profile', url: 'user/profile'},
    { title: 'Logout ', url: '/user/login'}
  ];
  constructor() {}
}
