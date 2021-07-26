import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public userDetails: any = [];
  public email: string;
  constructor(private userService: UserService, private firebase: FirebaseService, private storage: StorageService, private router: Router) {
    storage.get('token').then((email) => {
      this.email = email;
      if (this.email) {
        this.getUserDetails();
      }
    })
  }

  getUserDetails() {
    this.firebase.getOne('User', this.email).valueChanges().subscribe((result) => {
      this.userDetails = result;
    })
  }

  onLogout() {
    this.userService.logout();
    this.router.navigateByUrl("/user/login");
  }
}
