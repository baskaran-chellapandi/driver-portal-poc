import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-forgot-page',
  templateUrl: './forgot-page.page.html',
  styleUrls: ['./forgot-page.page.scss'],
})
export class ForgotPagePage implements OnInit {
  public isLoading: Boolean = false;
  public errMessage: any;
  constructor(public userService: UserService, private router: Router) { }

  ngOnInit() {
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
