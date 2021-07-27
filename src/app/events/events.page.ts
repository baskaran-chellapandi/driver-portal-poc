import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service'
import { DragulaService } from 'ng2-dragula';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  events:any
  user:any
  user_info:any
  email:string
  constructor(
    public firebase: FirebaseService,
    private dragulaService: DragulaService,
    public storageService:StorageService,
    private route: Router
  ) { 
    this.storageService.get("token").then(token =>{
      this.email = token
      this.get_user_info()
    })
    this.dragulaService.dropModel("Events").subscribe(args => {
      this.process_order(args)
    });

  }

  ngOnInit() {

  }

  get_user_info(){
    const curObj = this
    this.user_info = this.firebase.getOne("User",this.email).valueChanges().subscribe(response => { 
      this.user = response      

      this.firebase.getAll("events").snapshotChanges().subscribe(response => {
        let temp_events = response.map(e=>{
          return{
            id: e.payload.doc.id,
            name: e.payload.doc.data()['name'],
            file: e.payload.doc.data()['file'],
            desc: e.payload.doc.data()['desc'],
            location: e.payload.doc.data()['location'],
            status: e.payload.doc.data()['status'],
          }
        })  
        console.log("====== This User =======")
        console.log(this.user)
        
        if(this.user && this.user["event_order"]){
          temp_events = temp_events.sort(function(a, b){  
            return curObj.user["event_order"].indexOf(a.id) - curObj.user["event_order"].indexOf(b.id);
          });   
        }
        console.log(temp_events)
        this.events = temp_events
  
      })    

      this.user_info.unsubscribe()

    })    
  }

  async process_order(data) {
    const result = [];
    const length = data.targetModel.length

    for(var i=0;i<length;i++){
      var each_data = data.targetModel[i]
      result.push(each_data.id)
    }

    this.user["event_order"] = result

    this.firebase.set("User",this.email,this.user).then( response => {
      console.log("=========== Status Updated in User ========")
    })
  }  

  gotodashboard(){
    this.route.navigate(['/events/add']);
  }


}
