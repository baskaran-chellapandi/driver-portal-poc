import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@Component({
  selector: 'app-forgot-page',
  templateUrl: './forgot-page.page.html',
  styleUrls: ['./forgot-page.page.scss'],
})
export class ForgotPagePage implements OnInit {
  public isLoading: Boolean = false;
  public errMessage: any;
  constructor(public userService: UserService, private router: Router, private locationAccuracy: LocationAccuracy) { }

  ngOnInit() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => console.log('Request successful'),
          error => console.log('Error requesting location permissions', error)
        );
      }
    });
  }

  public send = (form: NgForm) => {
    this.isLoading = true;
    if (!form.valid) {
      return;
    }
    this.userService.sendResetPasswordLink(form.value.email).subscribe(
      response => {
        if (response && response.length > 0) {
          this.userService.userData = response[0];
          this.isLoading = false;
          this.router.navigateByUrl('/user/forgot/reset');
        } else {
          this.errMessage = 'Invalid Account.Try with other email';
          setTimeout(() => {
            this.errMessage = '';
          }, 5000);
          this.isLoading = false;
        }
      }
    );
  }
}
