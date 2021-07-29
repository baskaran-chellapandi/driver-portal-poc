import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { MapService } from "../map.service";
import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';
import { Plugins } from "@capacitor/core";
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform } from "@ionic/angular";
// https://developer.trimblemaps.com/maps-sdk/guide/geocoding/

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit, OnDestroy {
  public selectedLocationImage: string;
  public isLoading = false;
  public apiKey: string = '0D8BA43647605743A5FB4B225664EF0F';
  public mapStyle = "TRANSPORTATION";
  public mapCenter = {
    lon: -95,
    lat: 38,
    zoom: 4.7
  };
  @ViewChild("map", { static: true }) mapElement: ElementRef;
  loc: GeolocationPosition;
  public map: TrimbleMaps.Map;

  locationCoords: any;
  timetest: any;

  constructor(
    private mapService: MapService,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private platform: Platform
  ) {
    this.locationCoords = {
      latitude: "",
      longitude: "",
      accuracy: "",
      timestamp: ""
    }
    this.timetest = Date.now();
  }

  ngOnInit() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.checkGPSPermission();
    } else {
      this.getLocationCoordinates();
    }
  }

  async getCurrentPosition() {
    const { Geolocation } = Plugins;
    this.loc = await Geolocation.getCurrentPosition();
  }

  //Check if application having GPS access permission  
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
        alert(err);
        this.displayMap();
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              this.displayMap();
              //Show alert if user click on 'No Thanks'
              alert('requestPermission Error requesting location permissions ' + error)
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getLocationCoordinates()
      },
      error => {
        this.displayMap();
        alert('Error requesting location permissions ' + JSON.stringify(error))
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
      this.displayMap();
      alert('Error getting location, Please Choose manually');
    });
  }

  public displayMap() {
    this.map = this.mapService.initMap(this.apiKey, {
      container: this.mapElement.nativeElement,
      style: TrimbleMaps.Common.Style[this.mapStyle],
      center: [this.mapCenter.lon, this.mapCenter.lat],
      zoom: this.mapCenter.zoom,
      hash: false,
      pitch: 20,
      bearing: 20
    });
    this.map.addControl(new TrimbleMaps.NavigationControl());
    const self: any = this;
    // OnClick Map
    this.map.on('click', function (e) {
      // While choose place Display marker
      if (self.marker) {
        self.marker.remove();
      }
      self.marker = new TrimbleMaps.Marker()
      .setLngLat([e.lngLat.lng, e.lngLat.lat])
      .addTo(self.map);
    });

    // Get Current location
    var geolocate = new TrimbleMaps.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    this.map.addControl(geolocate);

    geolocate.on('geolocate', function () {
      console.log('A geolocate event has occurred.')
    });
    geolocate.on('error', function () {
      alert('Error fetching location')
    });

    // new TrimbleMaps.Popup()
    //   .setLngLat([this.mapCenter.lon, this.mapCenter.lat])
    //   .setHTML("<h6>You are Here</h6>")
    //   .addTo(this.map);

    // For get location using address
    // var geocodeLocation = TrimbleMaps.Geocoder.geocode({
    //   address: {
    //     addr: '1 Independence Way',
    //     city: 'Princeton',
    //     state: 'NJ',
    //     zip: '08540',
    //     region: TrimbleMaps.Common.Region.NA
    //   },
    //   listSize: 1,
    //   success: function (response) {
    //     console.log(response);
    //   },
    //   failure: function (response) {
    //     console.log(response);
    //   }
    // });
      document.getElementsByClassName('trimblemaps-canvas')[0]['style'].position = 'relative';
  }

  ngOnDestroy() {
    this.map.remove();
  }
}
