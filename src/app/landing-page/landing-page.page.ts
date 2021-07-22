import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {
  public slideData: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  constructor(private firebase: FirebaseService) { }

  ngOnInit() {
    this.firebase.getAllWithOrderBy('images', 'position', 'asc').get().then(data => {
      this.slideData = data.docs.map(slide => slide.data());
    });
  }
}
