import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { StorageService } from '../services/storage.service';

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
  constructor(private firebase: FirebaseService, private storage: StorageService, private router: Router) { }

  ngOnInit() {
    this.firebase.getAllWithOrderBy('images', 'position', 'asc').get().then(data => {
      this.slideData = data.docs.map(slide => slide.data());
    });
  }

  goLogin() {
    this.storage.set('disableSpalshScreen', true);
    this.router.navigateByUrl('/user/login');
  }
}
