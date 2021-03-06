import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from "@angular/forms";
import { Events } from '../../models/event'
import { FirebaseService } from '../../services/firebase.service'
import { ActivatedRoute, Router } from "@angular/router";
import { Constants } from "../../constants"
@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  id: any;
  EventEditForm: FormGroup;
  isSubmitted : Boolean = false;
  event_image:any;
  edit_data: Events;
  response: any;
  edit_event:any;  
  public locationDetails: any = { lat: '', lng: '', loc: '' };
  constructor(    
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private router : Router,
    public firebase: FirebaseService
    ) { }

  ngOnInit() {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.EventEditForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      desc: ['', [Validators.required, Validators.minLength(25)]],
      file: [''],
      status: ['', [Validators.required]]
    })

    this.edit_event = this.firebase.getOne("events",this.id).valueChanges().subscribe(response => { 
      
      
      if(response && !response["file"]){
        response["file"] = Constants.default_events_logo
      }
      
      if (response && response['location'] && response['location'].indexOf(',') !== -1) {
        this.locationDetails.loc = response['location'];
        const location = response['location'].split(',');
        this.locationDetails.lat = Number(location[0]);
        this.locationDetails.lng = Number(location[1]);
        delete response['location']
      }
      this.response = response
      console.log("====== Before Set Value =========")
      console.log(response)
      this.EventEditForm.setValue(response)
    })      
  }

  public updateLocation = () => {
    console.log('Update Location', this.locationDetails)
  }

  ngOnDestroy(){

  }

  get errorControl() {
    return this.EventEditForm.controls;
  }  

  on_select_file(event: Event){
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      this.event_image = fr.result.toString();
    };
    fr.readAsDataURL(pickedFile);
   }


  formSubmit(){
    this.isSubmitted = true;
    if (!this.EventEditForm.valid) {
      console.log('Please provide all the required values!')
      console.log(this.EventEditForm.value)
      // this.isSubmitted = false;
      return false;
    } else {
      this.edit_data = this.EventEditForm.value;
      this.edit_data["location"] = this.locationDetails.loc;
      if(this.event_image)
        this.edit_data["file"] = this.event_image
      
      // delete this.edit_data["file"]
      this.firebase.add("events",this.id,this.edit_data)
      .then(
        add_response => {
          console.log("======== Add Response ======")
          console.log(add_response);
            this.isSubmitted = false;
            this.router.navigateByUrl('/events');
      }); 
    }
  }


}
