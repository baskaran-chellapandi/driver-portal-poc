import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from "@angular/forms";
import { Events } from '../../models/event'
import { FirebaseService } from '../../services/firebase.service'
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  EventAddForm: FormGroup;
  isSubmitted : Boolean = false;
  event_image:any;
  public locationDetails: any = { lat: '', lng: '', loc: '' };
  add_data: Events;
  add_event:any;
  get_events:any
  constructor(
    public fb: FormBuilder,
    private router : Router,
    public firebase: FirebaseService,
    public toastController: ToastController
    ) { }

  ngOnInit() {
    this.EventAddForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      desc: ['', [Validators.required, Validators.minLength(25)]],
      file: ['', [Validators.required]],
      status: ['', [Validators.required]]
    })
  }

  public updateLocation = () => {
    console.log('Update Location', this.locationDetails)
  }

  get errorControl() {
    return this.EventAddForm.controls;
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


   convertToSlug(Text)
   {
       return Text
           .toLowerCase()
           .replace(/ /g,'-')
           .replace(/[^\w-]+/g,'')
           ;
   }   

  async formSubmit(){
    this.isSubmitted = true;
    if (!this.EventAddForm.valid) {
      console.log('Please provide all the required values!')
      console.log(this.EventAddForm.value)
      console.log(this.errorControl)
      // this.isSubmitted = false;
      return false;
    } else {
      if (this.locationDetails.loc === '') {
        const toast = await this.toastController.create({
          message: 'Please choose location.',
          duration: 2000
        });
        toast.present();
        return;
      }
      this.add_data = this.EventAddForm.value
      this.add_data["file"] = this.event_image
      this.add_data["location"] = this.locationDetails.loc;
      var slug = this.convertToSlug(this.add_data["name"])
      // delete this.add_data["file"]
      this.get_events = this.firebase.getOne("events",slug).valueChanges().subscribe(response => { 
        if(response){
          slug = slug+new Date().getTime()
        }
        console.log("======== Before Add Response ======")
        console.log(response)
        this.get_events.unsubscribe()
        this.firebase.add("events",slug,this.add_data)
        .then(
          add_response => {
            console.log("======== Add Response ======")
            console.log(add_response);
              this.isSubmitted = false;
              this.router.navigateByUrl('/events');
        });        
      })
    }
  }


}
