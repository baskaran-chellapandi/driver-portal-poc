import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { MapService } from "../map.service";
import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';
import { Plugins } from "@capacitor/core";
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
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
  public map: object;
  
  locationCoords: any;
  timetest: any;

  constructor(
    private mapService: MapService,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy
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
    this.checkGPSPermission();
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
      error => alert('Error requesting location permissions ' + JSON.stringify(error))
    );
  }

  // Methos to get device accurate coordinates using device GPS
  getLocationCoordinates() {
    Geolocation.getCurrentPosition().then((resp) => {
      this.mapCenter.lat = resp.coords.latitude;
      this.mapCenter.lon = resp.coords.longitude;
      this.displayMap();
    }).catch((error) => {
      this.displayMap();
      alert('Error getting location, Please Choose manually' + error);
    });
  }

  public displayMap() {
    this.map = this.mapService.initMap(this.apiKey, {
      container: this.mapElement.nativeElement,
      style: TrimbleMaps.Common.Style[this.mapStyle],
      center: [this.mapCenter.lon, this.mapCenter.lat],
      zoom: this.mapCenter.zoom,
      hash: false
    });
    document.getElementsByClassName('trimblemaps-control-container')[0]['style'].display = 'none';
  }

  /**
   * THis method for get user current location
   */
  private async locateUser() {
    this.isLoading = true;
    const position = await Geolocation.getCurrentPosition();
    this.mapCenter.lat = position.coords.latitude;
    this.mapCenter.lon = position.coords.longitude;
    this.isLoading = false;
    this.displayMap();
  }
}
