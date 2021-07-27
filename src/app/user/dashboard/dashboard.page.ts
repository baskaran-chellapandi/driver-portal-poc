import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, AfterViewInit {
  public eventList: any;
  public userDetails: any = [];
  public email: string;
  public user: any;
  constructor(private firebase: FirebaseService, private storage: StorageService, private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter () {
    this.storage.get('token').then((email) => {
      this.getUserDetails(email);
      this.getEvents(email);
    })
  }

  getUserDetails(email) {
    this.firebase.getOne('User', email).valueChanges().subscribe((result) => {
      this.userDetails = result;
    })
  }

  getEvents(email) {
    const curObj = this;
    this.firebase.getOne("User", email).valueChanges().subscribe(response => {
      this.user = response;
      this.firebase.getAll("events").snapshotChanges().subscribe(response => {
        let temp_events = response.map(e => {
          return {
            id: e.payload.doc.id,
            name: e.payload.doc.data()['name'],
            file: e.payload.doc.data()['file'],
            desc: e.payload.doc.data()['desc'],
            location: e.payload.doc.data()['location'],
            status: e.payload.doc.data()['status'],
          }
        })
        //  Do sorting 
        if (this.user && this.user["event_order"]) {
          temp_events = temp_events.sort(function (a, b) {
            return curObj.user["event_order"].indexOf(a.id) - curObj.user["event_order"].indexOf(b.id);
          });
        }
        this.eventList = temp_events;
      })
    })
  }
}
