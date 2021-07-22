import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPagePageRoutingModule } from './forgot-page-routing.module';

import { ForgotPagePage } from './forgot-page.page';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPagePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ForgotPagePage, ResetPasswordComponent]
})
export class ForgotPagePageModule {}
