import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddPage } from './add.page';

const routes: Routes = [
  {
    path: '',
    component: AddPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [RouterModule],
})
export class AddPageRoutingModule {}
