import { Injectable } from '@angular/core';
//Import AngularFirestore to make Queries.
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  /* 
  * Add Data to firebase
  * Parrams: collection - mention the collection name
  * Parrams: document - document should in json format
  */
  add(collection,document){
    return this.firestore.collection('/'+collection+'/').add(document)
  }  

  /* 
  * Update Data to firebase
  * Parrams: id - unique identifier 
  * Parrams: collection - mention the collection name
  * Parrams: document - document should in json format
  */
  set(collection,id,document){
    return this.firestore.doc('/'+collection+'/'+id).update(document)
  }    

  /* 
  * Delete Data to firebase
  * Parrams: collection - mention the collection name
  * Parrams: id - unique identifier 
  */
  delete(collection,id){
   return this.firestore.doc('/'+collection+'/'+id).delete()
  }      
  
  /* 
  * Function to fetch all records
  * Parrams: collection - mention the collection name
  */
  getAll(collection){
    return this.firestore.collection('/'+collection+'/')
  }

  /* 
  * Function to fetch all records with order
  * Parrams: collection - mention the collection name
  */
  getAllWithOrderBy(collection, fieldName, order) {
    return this.firestore.collection('/' + collection + '/').ref.orderBy(fieldName, order)
  }  
  
  /* 
  * Function to fetch single records
  * Parrams: collection - mention the collection name
  */
  getOne(collection,id){
    return this.firestore.collection('/'+collection+'/').doc(id)
    
  } 
  
  /* 
  * Function to validate login
  * Parrams: collection - mention the collection name
  * Parrams: Email - User email
  * Parrams: Password - User password 
  */
  validateLoginInfo(collection,email,password){
    return this.firestore.collection(collection, ref => {
            return ref
                  .where('email', '==', email)
                  .where('password', '==', password)
    }).valueChanges();
  } 

}
