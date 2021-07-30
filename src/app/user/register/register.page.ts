import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../user.model';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Constants } from 'src/app/constants';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core'
import { Base64 } from '@ionic-native/base64/ngx';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public isLoading : Boolean = false;
  private newUser : User;
  public selectedImage : string;
  public currentFile : string;
  public isAndroid : boolean = false;

  constructor(
    private userService : UserService,
    private router : Router,
    private fileChooser: FileChooser,
    private base64: Base64
    ) { }

  ngOnInit() {
      console.log(Capacitor.platform);
      console.log(Capacitor.getPlatform());
      if(Capacitor.getPlatform() == "android"){
        this.isAndroid = true;
      }
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
    } else {
      this.newUser.imageUrl = Constants.default_events_logo;
    }
  
    if(this.isAndroid && this.currentFile){
      this.newUser.imageUrl = this.currentFile;
    } else {
      this.newUser.imageUrl = Constants.default_events_logo;
    }
    this.userService.signup(this.newUser)
    .then(
      response => {
        console.log(response);
          form.reset();
          this.isLoading = false;
          this.router.navigateByUrl('/user/dashboard');
    });
  }

  openChooser() {
    console.log('Opening chooser')
    this.fileChooser.open()
      .then(uri => {
      console.log('File chosen: ', uri);
        this.base64.encodeFile(uri).then((base64File: string) => {
          console.log(base64File);
          this.currentFile = base64File;
        }, (err) => {
          console.log(err);
        });
        //this.currentFile = uri;
      })
      .catch(e => {
        console.log('Error choosing file: ', e);
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
