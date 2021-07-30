import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  public eventId: any;
  public event: any = [];
  public locationDetails: any = { lat: '', lng: '', loc: '' };
  constructor(private route: ActivatedRoute, private firebase: FirebaseService) { }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.getEventDetails(this.eventId);
  }

  getEventDetails(eventId) {
    this.firebase.getOne('events', eventId).valueChanges().subscribe((result) => {
      this.event = result;
      if (result && result['location'] && result['location'].indexOf(',') !== -1) {
        this.locationDetails.loc = result['location'];
        const location = result['location'].split(',');
        this.locationDetails.lat = Number(location[0]);
        this.locationDetails.lng = Number(location[1]);
        delete result['location']
      }
    })
  }
}
