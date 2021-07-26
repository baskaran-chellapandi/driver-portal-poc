import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service'
import { DragulaService } from 'ng2-dragula';
import { StorageService } from '../services/storage.service';
@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  events:any
  user_info:any
  email:string
  constructor(
    public firebase: FirebaseService,
    private dragulaService: DragulaService,
    public storageService:StorageService
  ) { 
    this.storageService.get("token").then(token =>{
      this.email = token
    })
    this.dragulaService.dropModel("Events").subscribe(args => {
      this.process_order(args)
    });

  }

  ngOnInit() {
    this.firebase.getAll("events").snapshotChanges().subscribe(response => {
      this.events = response.map(e=>{
        return{
          id: e.payload.doc.id,
          name: e.payload.doc.data()['name'],
          file: e.payload.doc.data()['file'],
          desc: e.payload.doc.data()['desc'],
          location: e.payload.doc.data()['location'],
          status: e.payload.doc.data()['status'],
        }
      })   
    })
  }

  async process_order(data) {
    const result = [];
    const length = data.targetModel.length

    for(var i=0;i<length;i++){
      var each_data = data.targetModel[i]
      result.push(each_data.id)
    }

    this.user_info = this.firebase.getOne("User",this.email).valueChanges().subscribe(response => { 
      let user = response      
      user["event_order"] = result
      this.firebase.set("User",this.email,user).then( response => {
        this.user_info.unsubscribe()
      })
    })

  }  


}
