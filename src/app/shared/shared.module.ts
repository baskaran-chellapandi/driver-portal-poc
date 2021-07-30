import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LocationPickerComponent } from './location-picker/location-picker.component';
import { HeaderComponent } from './header/header.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@NgModule({
  declarations: [LocationPickerComponent, HeaderComponent],
  imports: [CommonModule, RouterModule, IonicModule],
  exports: [LocationPickerComponent, HeaderComponent],
  providers: [
    Geolocation,
    LocationAccuracy,
    AndroidPermissions
  ]
})
export class SharedModule {}
