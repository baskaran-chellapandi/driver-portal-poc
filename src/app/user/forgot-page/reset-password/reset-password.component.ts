import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  public isLoading = false;
  public errMessage = '';
  public isPassWordChanged = false;
  constructor(public userService: UserService, private router: Router, public toastController: ToastController) { }

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
      this.presentToast();
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/user/login']);
      }, 1000);
    }).catch((err) => {
      this.errMessage = 'Token Expired, Please Try again';
      this.isLoading = false;
    });
  };

  /**
   * This method for render alert popup
   */
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your password changed successfully.',
      duration: 5000
    });
    toast.present();
  }
}

