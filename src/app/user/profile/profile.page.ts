import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public profileEditForm: FormGroup;
  public profilePicUrl : string;
  public selectedImage : string;
  
  constructor(
    private userService : UserService,
    private loadingCtrl : LoadingController,
    private router : Router,
    public formbuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.profileEditForm = this.formbuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      role :['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]]
    });


    this.userService.getUserData().then(response => {
      if (response) {
        if( response["imageUrl"]){
          this.profilePicUrl = response["imageUrl"];
        } else {
          response["imageUrl"] = "";
        }
        this.profileEditForm.setValue(response);
      }
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

  onUpdateProfile() {
    if (!this.profileEditForm.valid) {
      return;
    }

    if ( this.selectedImage){
      this.profileEditForm.value.imageUrl = this.selectedImage;
    }
    this.loadingCtrl
      .create({
        message: 'Updating place...'
      })
      .then(loadingEl => {
        loadingEl.present();
        console.log(this.profileEditForm.value);
        this.userService.updateProfile(this.profileEditForm.value)
        .then(
          response => {
            console.log(response);
            loadingEl.dismiss();
            this.profileEditForm.reset();
            this.router.navigateByUrl("/user/dashboard");
        });
      });
  }

}
