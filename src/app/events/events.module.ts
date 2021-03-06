import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsPageRoutingModule } from './events-routing.module';
import { DragulaModule } from 'ng2-dragula';
import { EventsPage } from './events.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    EventsPageRoutingModule,
    DragulaModule.forRoot()
  ],
  declarations: [EventsPage]
})
export class EventsPageModule {}
