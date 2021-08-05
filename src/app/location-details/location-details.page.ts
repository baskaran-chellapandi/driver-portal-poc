import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { StorageService } from '../services/storage.service';
import { UserService } from '../user/user.service';
import TrimbleMaps from '@trimblemaps/trimblemaps-js';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.page.html',
  styleUrls: ['./location-details.page.scss'],
})
export class LocationDetailsPage implements OnInit {
  locatoinDetails: FormGroup;
  email: any;
  public isSubmitted = false;
  userData: any = {};
  constructor(public fb: FormBuilder,
    private router: Router,
    public firebase: FirebaseService,
    public toastController: ToastController,
    public storageService: StorageService,
    public userService: UserService) {
    this.storageService.get('token').then(token => {
      this.email = token;
    });
  }

  ngOnInit() {
    this.locatoinDetails = this.fb.group({
      addr: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(5)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
      zip: ['', [Validators.required, Validators.minLength(4)]],
      region: ['', [Validators.required]]
    });
    this.userService.getUserData().then(response => {
      this.userData = response || {};
      if (!this.userData || !this.userData.address) {
        this.locatoinDetails.setValue(this.userService.defaultLocation);
        this.userData.address = this.userService.defaultLocation;
      } else {
        this.locatoinDetails.setValue(this.userData.address);
      }
    });
  }

  formSubmit() {
    /** https://developer.trimblemaps.com/maps-sdk/guide/geocoding/ */
    this.userData.address = this.locatoinDetails.value;
    const self = this;
    TrimbleMaps.APIKey = '0D8BA43647605743A5FB4B225664EF0F';
    self.userData.address.region = TrimbleMaps.Common.Region.NA;
    TrimbleMaps.Geocoder.geocode({
      address: self.userData.address,
      listSize: 1,
      success: ((response: any) => {
        if (response && response[0].Errors && response[0].Errors[0] && response[0].Errors[0].Description) {
          self.presentToast(response[0].Errors[0].Description);
        } else {
          self.updateAddress();
        }
      }),
      failure: ((error: any) => {
        self.presentToast(error.message);
      })
    });
  }

  public updateAddress = () => {
    this.userService.updatePassword(this.userData)
    .then(results => {
      this.presentToast('Default location details updated successfully');
    }).catch((err) => {
      this.presentToast('Something went wrong, please try after some time');
    });
  };

  async presentToast(content?) {
    const toast = await this.toastController.create({
      message: content || 'Please give valid address',
      duration: 5000
    });
    toast.present();
  }

}
