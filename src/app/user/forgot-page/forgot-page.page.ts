import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-forgot-page',
  templateUrl: './forgot-page.page.html',
  styleUrls: ['./forgot-page.page.scss'],
})
export class ForgotPagePage implements OnInit {
  public isLoading: Boolean = false;
  public isSent: Boolean = false;
  public submitDisabled: Boolean = false;
  constructor(public userService: UserService) { }

  ngOnInit() {
  }

  public send = (form: NgForm) => {
    this.isLoading = true;
    if (!form.valid) {
      return;
    }
    const resetPasswordParam = { 'email': form.value.email };
    this.submitDisabled = true;
    setTimeout(() => {
      this.submitDisabled = false;
      this.isSent = true;
    }, 10000);
    this.userService.sendResetPasswordLink(resetPasswordParam).subscribe(
      response => {
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      }
    );
  }
}
