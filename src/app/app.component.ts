import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user/user.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // public appPages = [
  //   { title: 'Dashboard', url: '/user/dashboard'},
  //   { title: 'Profile', url: 'user/profile'},
  //   { title: 'Logout ', url: '/user/login'}
  // ];
  constructor(
    private userService : UserService,
    private router : Router
    ) {}

  onLogout(){
    this.userService.logout();
    this.router.navigateByUrl("/user/login");
  }
}
