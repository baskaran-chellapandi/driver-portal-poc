import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from "@angular/forms";
@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  EventAddForm: FormGroup;
  isSubmitted = false;
  constructor(public fb: FormBuilder) { }

  ngOnInit() {
    this.EventAddForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      desc: ['', [Validators.required, Validators.minLength(25)]],
      location: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  get errorControl() {
    return this.EventAddForm.controls;
  }  

  formSubmit(){
    this.isSubmitted = true;
    if (!this.EventAddForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      console.log(this.EventAddForm.value)
    }
  }

}
