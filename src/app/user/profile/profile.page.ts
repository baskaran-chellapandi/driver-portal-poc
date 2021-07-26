import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public editProfile: FormGroup;
  private loginUser : User;
  
  constructor(
    private userService : UserService,
    private loadingCtrl : LoadingController,
    private router : Router
    ) { }

  ngOnInit() {

    this.loginUser = {firstName : "vino",
    lastName : "raja",
    email : "vino@gmail.com",
    password : "welcome123",
    gender : "female",
    role : "driver"
    //imageUrl :  'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg'
    };
    this.editProfile = new FormGroup({
      firstName: new FormControl(this.loginUser.firstName, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      lastName: new FormControl(this.loginUser.lastName, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      gender : new FormControl(this.loginUser.gender,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      email : new FormControl(this.loginUser.email,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      password : new FormControl(this.loginUser.password,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      role : new FormControl(this.loginUser.role,{
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onUpdateProfile() {
    if (!this.editProfile.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating place...'
      })
      .then(loadingEl => {
        loadingEl.present();
        console.log(this.editProfile.value);
        this.userService.updateProfile(this.editProfile.value)
        .then(
          response => {
            console.log(response);
            loadingEl.dismiss();
            this.editProfile.reset();
            this.router.navigateByUrl("/user/dashboard");
        });
      });
  }

}
