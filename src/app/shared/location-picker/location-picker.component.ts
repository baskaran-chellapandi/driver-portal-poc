import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import TrimbleMaps from "@trimblemaps/trimblemaps-js";
import { MapService } from "../map.service";
import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';
import { Plugins } from "@capacitor/core";

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

  constructor(
    private mapService: MapService
  ) { }

  ngOnInit() {
    this.locateUser();
  }

  async getCurrentPosition() {
    const { Geolocation } = Plugins;
    this.loc = await Geolocation.getCurrentPosition();
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
  private async locateUser() {
    this.isLoading = true;
    const position = await Geolocation.getCurrentPosition();
    this.mapCenter.lat = position.coords.latitude;
    this.mapCenter.lon = position.coords.longitude;
    this.isLoading = false;
    this.displayMap();
  }
}
