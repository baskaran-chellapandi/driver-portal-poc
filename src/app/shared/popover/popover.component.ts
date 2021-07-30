import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, NavParams } from '@ionic/angular';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  public data: any;
  constructor(private popover: PopoverController, private navParams: NavParams, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.data = this.navParams.get('data');
  }

  onLogout() {
    this.popover.dismiss();
    this.userService.logout();
    this.router.navigateByUrl("/user/login");
  }
}
