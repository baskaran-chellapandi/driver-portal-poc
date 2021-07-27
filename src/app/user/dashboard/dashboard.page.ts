import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  constructor(private firebase: FirebaseService, private storage: StorageService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getEvents();
    this.storage.get('token').then((email) => {
      this.email = email;
      this.getUserDetails();
    })
  }

  getUserDetails() {
    this.firebase.getOne('User', this.email).valueChanges().subscribe((result) => {
      this.userDetails = result;
    })
  }

  getEvents() {
    this.firebase.getAll('events').valueChanges().subscribe((result) => {
      this.eventList = result;
    })
  }
}
