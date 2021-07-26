import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { AlertController } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { MapService } from "../map.service";

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

  public map: object;

  constructor(
    private alertCtrl: AlertController,
    private mapService: MapService
  ) { }

  ngOnInit() {
    this.locateUser();
  }

  public displayMap () {
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
  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.displayMap();
      this.showErrorAlert();
      return;
    }
    this.isLoading = true;
    Plugins.Geolocation.getCurrentPosition()
      .then(geoPosition => {
        this.mapCenter.lat = geoPosition.coords.latitude;
        this.mapCenter.lon = geoPosition.coords.longitude;
        this.isLoading = false;
        this.displayMap();
      })
      .catch(err => {
        this.isLoading = false;
        this.displayMap();
        this.showErrorAlert();
      });
  }

  private showErrorAlert() {
    this.alertCtrl
      .create({
        header: 'Could not fetch location',
        message: 'Please use the map to pick a location!',
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}
