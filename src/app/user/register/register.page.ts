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
  public isLoading : Boolean = false;
  private newUser : User;
  public selectedImage : string;

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
       gender : form.value.gender,
    }
    if (this.selectedImage) {
      this.newUser.imageUrl = this.selectedImage;
    }
    console.log(this.newUser);
    
    this.userService.signup(this.newUser)
    .then(
      response => {
        console.log(response);
          this.isLoading = false;
          this.router.navigateByUrl('/user/dashboard');
    });
  }


   onFileChosen(event: Event){
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
    };
    fr.readAsDataURL(pickedFile);
   }
}
