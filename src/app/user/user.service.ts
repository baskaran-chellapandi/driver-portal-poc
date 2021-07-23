import { Injectable } from '@angular/core';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userData: any;
  constructor(
    private http: HttpClient,
    private firebaseService : FirebaseService
    ) { }
  
  login(user: User) {
    return this.firebaseService.validateLoginInfo("User",user.email,user.password);
  }
  signup(user: User) {
    return this.firebaseService.add("User",user);
  }


  updateProfile (user : User){

  }

  /**
   * This method for send reset link API
   * @param resetLinkParam 
   * @returns 
   */
  public sendResetPasswordLink = (resetLinkParam) => {
    return this.firebaseService.checkUserData("User", resetLinkParam);
  }
  

  /**
 * This method for send reset link API
 * @param userData 
 * @returns 
 */
  public updatePassword = (userData: any) => {
    return this.firebaseService.set("User", userData.email, userData);
  }
}
