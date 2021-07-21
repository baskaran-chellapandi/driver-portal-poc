import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading = false;
  isInvalid = false;
  private loginUser : User;

  constructor(
    private router : Router,
    private userService : UserService
  ) { }

  ngOnInit() {
  }

  login(form: NgForm) {
    if(!form.valid){
      return;
    }

    this.loginUser = {
      email: form.value.email,
      password : form.value.password
    }
   
    console.log(this.loginUser);
    this.isLoading = true;
    this.userService.login(this.loginUser).subscribe(
      response => {
        this.isLoading = false;
        this.router.navigateByUrl('/folder/Inbox');
        form.reset();
      },error => {
        this.isLoading = false;
        this.router.navigateByUrl('/folder/Inbox');
    });
  }
}
