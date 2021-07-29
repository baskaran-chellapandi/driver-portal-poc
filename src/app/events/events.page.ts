import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service'
import { DragulaService } from 'ng2-dragula';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';

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
  admin:Boolean = false
  driver:Boolean = false
  constructor(
    public firebase: FirebaseService,
    private dragulaService: DragulaService,
    public storageService:StorageService,
    private route: Router,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController
  ) { 
    this.storageService.get("token").then(token =>{
      this.email = token
      this.get_user_info()
    })

    this.storageService.get("role").then(role =>{ 
      if(role == "admin"){
        this.admin = true
      }
      if(role == "driver"){
        this.driver = true
      }      
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
        //  Do sorting 
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

  gotoedit(event){
    console.log("====== Event =======")
    console.log(event)
    this.route.navigate(['/events/edit/'+event.id]);
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

  gotoadd(){
    this.route.navigate(['/events/add']);
  }


  removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    this.events = arr
    return arr;
}

update_status(status,event){
  event["status"] = status
  this.firebase.add("events",event.id,event)
  .then(
    add_response => {
      console.log("======== Status Updated ======")
      console.log(add_response);

  }); 
}

async setstatus(event){
    const actionSheet = await this.actionSheetController.create({
      header: 'Set Event Status',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Started',
        role: 'destructive',
        icon: 'cloud-outline',
        handler: () => {
          console.log('Delete clicked');
          this.update_status("started",event)
        }
      }, {
        text: 'Inprocess',
        icon: 'cloud-upload',
        handler: () => {
          console.log('Share clicked');
          this.update_status("inprocess",event)
        }
      }, {
        text: 'Done',
        icon: 'cloud-done',
        handler: () => {
          this.update_status("done",event)
          console.log('Play clicked');
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    console.log(event)
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);    
  }

  async delete(event){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure to delete ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            
            this.firebase.delete("events",event.id).then(response => {
              this.removeByAttr(this.events,"id",event.id)
            })            
          }
        }
      ]
    });

    await alert.present();    

  }


}
