import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from "@angular/forms";
import { Events } from '../../models/event'
import { FirebaseService } from '../../services/firebase.service'
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  EventAddForm: FormGroup;
  isSubmitted : Boolean = false;
  event_image:any;
  add_data: Events;
  add_event:any;
  get_events:any
  constructor(
    public fb: FormBuilder,
    private router : Router,
    public firebase: FirebaseService
    ) { }

  ngOnInit() {

    this.EventAddForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      desc: ['', [Validators.required, Validators.minLength(25)]],
      location: ['', [Validators.required, Validators.minLength(5)]],
      file: ['', [Validators.required]],
      status: ['', [Validators.required]]
    })

  }

  ngOnDestroy(){

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

  formSubmit(){
    this.isSubmitted = true;
    if (!this.EventAddForm.valid) {
      console.log('Please provide all the required values!')
      console.log(this.EventAddForm.value)
      this.isSubmitted = false;
      return false;
    } else {
      this.add_data = this.EventAddForm.value
      this.add_data["file"] = this.event_image
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
