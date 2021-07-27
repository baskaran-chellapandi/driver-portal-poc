import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public isLoading : Boolean = false;
  public isInvalid : Boolean = false;
  private loginUser : User;

  constructor(
    private router : Router,
    private userService : UserService,
    private storageService : StorageService
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
   
    this.isLoading = true;

    this.userService.login(this.loginUser).subscribe(
      response => {
        if (response && response.length > 0){
          this.storageService.set("role", response[0]["role"]);
          this.isLoading = false;
          this.router.navigateByUrl('/user/dashboard');
        } else {
          this.isLoading = false;
          this.isInvalid = true;
        }
      }
    );
  }
}
