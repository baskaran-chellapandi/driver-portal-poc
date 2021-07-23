import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  public isLoading: Boolean = false;
  public errMessage: String = '';
  public isPassWordChanged: Boolean = false;
  constructor(public userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  public changePassword = (form: NgForm) => {
    if (!form.valid) {
      return;
    }
    if (form.value.confirmPassword !== form.value.password) {
      this.errMessage = 'Password mismatch';
      return;
    }
    if (!this.userService.userData) {
      this.errMessage = 'Token Expired';
      return;
    }
    this.isLoading = true;
    this.userService.userData.password = form.value.confirmPassword;
    this.userService.updatePassword(this.userService.userData)
    .then(results => {
      console.log(results);
      this.router.navigateByUrl('/user/login');
    })
    .catch((err) => { 
      this.errMessage = 'Token Expired, Please Try again';
      this.isLoading = false;
    });
  }
}

