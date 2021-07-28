import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LocationPickerComponent } from './location-picker/location-picker.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@NgModule({
  declarations: [LocationPickerComponent],
  imports: [CommonModule, IonicModule],
  exports: [LocationPickerComponent],
  providers: [
    Geolocation,
    LocationAccuracy,
    AndroidPermissions
  ]
})
export class SharedModule {}
