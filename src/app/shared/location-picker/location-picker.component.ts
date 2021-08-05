import { Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import TrimbleMaps from '@trimblemaps/trimblemaps-js';
import { MapService } from '../map.service';
import { Geolocation } from '@capacitor/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform } from '@ionic/angular';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit, OnDestroy {
  @Input() public isFrom;
  @Input() public locationDetails;

  @Output() updateLocation = new EventEmitter();
  @ViewChild('map', { static: true }) public mapElement: ElementRef;
  public isLoading = false;
  public apiKey = '0D8BA43647605743A5FB4B225664EF0F';
  public mapStyle = 'TRANSPORTATION';
  public map: TrimbleMaps.Map;
  public userData: any;
  public mapCenter = {
    lon: -95,
    lat: 38,
    zoom: 4.7
  };
  constructor(
    private mapService: MapService,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private platform: Platform,
    private userService: UserService
  ) {

  }

  ngOnInit() {
    this.userService.getUserData().then(response => {
      this.userData = response || {};
      if (!this.userData || !this.userData.address) {
        this.userData.address = this.userService.defaultLocation;
      }
      if (this.platform.is('android') || this.platform.is('ios')) {
        this.checkGPSPermission();
      } else {
        this.getLocationCoordinates();
      }
    });
  }

  // Check if application having GPS access permission
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {
          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        this.displayMap(true);
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log('4');
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              this.displayMap(true);
              //Show alert if user click on 'No Thanks'
              alert('requestPermission Error requesting location permissions ' + error);
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getLocationCoordinates();
      },
      error => {
        this.displayMap(true);
        alert('Error requesting location permissions ' + JSON.stringify(error));
      }
    );
  }

  // Methos to get device accurate coordinates using device GPS
  getLocationCoordinates() {
    Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      this.mapCenter.lat = resp.coords.latitude;
      this.mapCenter.lon = resp.coords.longitude;
      this.displayMap();
    }).catch((error) => {
      this.displayMap(true);
      alert('Error getting location, Please Choose manually');
    });
  }

  public displayMap(hasAccessLocation?) {
    setTimeout(() => {
      if (hasAccessLocation && (this.isFrom === 'DASHBOARD' || this.isFrom === 'ADD_EVENT')) {
        TrimbleMaps.APIKey = '0D8BA43647605743A5FB4B225664EF0F';
        this.userData.address.region = TrimbleMaps.Common.Region.NA;
        TrimbleMaps.Geocoder.geocode({
          address: this.userData.address,
          listSize: 1,
          success: ((response: any) => {
            if (response && response[0].Errors && response[0].Errors[0] && response[0].Errors[0].Description) {
              console.log(response[0].Errors[0]);
            } else {
              this.mapCenter.lon = response[0].Coords.Lon;
              this.mapCenter.lat = response[0].Coords.Lat;
              this.renderingMapWithConFig(hasAccessLocation);
            }
          }),
          failure: ((error: any) => {
            console.log(error);
          })
        });
      } else {
        this.renderingMapWithConFig(hasAccessLocation);
      }
    }, 1800);
  }

  public renderingMapWithConFig = (hasAccessLocation?) => {
    if ((this.isFrom === 'VIEW_EVENT' || this.isFrom === 'EDIT_EVENT') && this.locationDetails) {
      this.mapCenter.lon = this.locationDetails.lng;
      this.mapCenter.lat = this.locationDetails.lat;
    }
    /** Init Trimble Map */
    this.map = this.mapService.initMap(this.apiKey, {
      container: this.mapElement.nativeElement,
      style: TrimbleMaps.Common.Style[this.mapStyle],
      center: [this.mapCenter.lon, this.mapCenter.lat],
      zoom: this.mapCenter.zoom,
      hash: false
    });
    const self: any = this;

    /** Controls Start */
    this.map.addControl(new TrimbleMaps.NavigationControl());
    this.map.addControl(new TrimbleMaps.FullscreenControl());

    // Get Current location using geolocate
    const geolocate = new TrimbleMaps.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    this.map.addControl(geolocate);
    /** Controls End */


    geolocate.on('geolocate', () => {
      console.log('A geolocate event has occurred.');
    });
    geolocate.on('error', () => {
      alert('Error fetching location');
    });

    /** On Map loading */
    this.map.on('load', () => {
      self.map.scrollZoom.disable();
      if ((self.isFrom === 'ADD_EVENT' || self.isFrom === 'DASHBOARD')) {
        if (hasAccessLocation) {
          self.marker = new TrimbleMaps.Marker()
            .setLngLat([self.mapCenter.lon, self.mapCenter.lat])
            .addTo(self.map);
        } else {
          geolocate.trigger();
        }
      } else {
        if (self.isFrom === 'EDIT_EVENT') {
          self.marker = new TrimbleMaps.Marker()
            .setLngLat([self.locationDetails.lng, self.locationDetails.lat])
            .addTo(self.map);
        } else if (self.isFrom === 'VIEW_EVENT') {
          self.marker = new TrimbleMaps.Marker()
            .setLngLat([self.locationDetails.lng, self.locationDetails.lat])
            .addTo(self.map);
        }
      }
    });

    // OnClick Map
    this.map.on('click', (e) => {
      if (self.isFrom === 'VIEW_EVENT' || self.isFrom === 'DASHBOARD') {
        return;
      }
      if (self.marker) {
        self.marker.remove();
      }
      // While choose place Display marker
      self.marker = new TrimbleMaps.Marker()
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(self.map);
      // Update Location Details
      if (self.updateLocation) {
        self.locationDetails.lat = e.lngLat.lat;
        self.locationDetails.lng = e.lngLat.lng;
        self.locationDetails.loc = e.lngLat.lat + ',' + e.lngLat.lng;
        self.updateLocation.emit();
      }
    });

    const trimbleDom: any = document.getElementsByClassName('trimblemaps-canvas');
    trimbleDom[trimbleDom.length - 1].style.position = 'relative';
  };

  ngOnDestroy() {
    this.map.remove();
  }
}
