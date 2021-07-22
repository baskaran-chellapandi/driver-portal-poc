import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  public isLoading: Boolean = false;
  public isSent: Boolean = false;
  public errMessage: String = '';
  public isPassWordChanged: Boolean = false;
  constructor(public userService: UserService, private formBuilder: FormBuilder) { }

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
    this.isSent = true;
    this.isLoading = true;
    const resetPasswordParam = { 'pass': form.value.confirmPassword };
    if (true) {
      this.isPassWordChanged = true;
    } else {
      this.errMessage = 'Token Expired';
    }
    this.isLoading = false;
    this.userService.resetPassword(resetPasswordParam).subscribe(
      response => {
      },
      error => {
      }
    );
  }
}

