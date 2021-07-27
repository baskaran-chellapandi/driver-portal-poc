import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViewPageRoutingModule } from './view-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { ViewPage } from './view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ViewPageRoutingModule
  ],
  declarations: [ViewPage]
})
export class ViewPageModule {}
