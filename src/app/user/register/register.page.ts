import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  isLoading = false;
  private newUser : User;

  constructor(
    private router : Router,
    private userService : UserService
    ) { }

  ngOnInit() {
  }

  register(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log( form.value);
  
    this.isLoading = true;
    this.newUser = {
       email : form.value.email,
       password : form.value.password,
       firstName:  form.value.firstName,
       lastName : form.value.lastName,
       role : form.value.role,
       gender : form.value.gender
    }
    console.log(this.newUser);
    this.userService.signup(this.newUser).subscribe(
      response => {
        this.isLoading = false;
        this.router.navigateByUrl('/folder/Inbox');
      },
      error => {
        this.isLoading = false;
        this.router.navigateByUrl('/folder/Inbox');
      }
    );
   }
}
