import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from '../../user/user.service';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title: string;
  public userDetails: any = [];
  public email: string;
  constructor(private popup: PopoverController, private userService: UserService, private firebase: FirebaseService, private storage: StorageService, private router: Router) {
  }

  ngOnInit() {
    this.loadingUserDetails();
  }

  loadingUserDetails() {
    this.storage.get('token').then((email) => {
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

  async profile(ev: any) {
    const popover = await this.popup.create({
      component: PopoverComponent,
      componentProps: { "data": this.userDetails },
      event: ev,
      showBackdrop: false,
      translucent: true
    });
    await popover.present();

    await popover.onDidDismiss();
  }

  onLogout() {
    this.userService.logout();
    this.router.navigateByUrl("/user/login");
  }
}