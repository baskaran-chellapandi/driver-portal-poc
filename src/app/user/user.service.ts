import { Injectable } from '@angular/core';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { FirebaseService } from '../services/firebase.service';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public defaultLocation: any = {
    addr: '1 Independence Way',
    city: 'Princeton',
    state: 'NJ',
    zip: '08540',
    region: 'NA'
  };
  public userData: any;
  constructor(
    private http: HttpClient,
    private firebaseService: FirebaseService,
    private storageService: StorageService
  ) { }
  login(user: User) {
    this.storageService.set('token', user.email);
    return this.firebaseService.validateLoginInfo('User', user.email, user.password);
  }
  signup(user: User) {
    this.storageService.set('token', user.email);
    this.storageService.set('role', user.role);
    return this.firebaseService.add('User', user.email, user);
  }

  logout() {
    this.storageService.remove('token');
    this.storageService.remove('role');
  }

  getUserData = () => {
    const localVar = this;
    return new Promise((myResolve, myReject) => {
      localVar.storageService.get('token').then(token => {
        console.log(token);
        localVar.firebaseService.getOne('User', token).valueChanges().subscribe(response => {
          myResolve(response);
        });
      });
    });
  };

  updateProfile = (user: User) => this.firebaseService.set('User', user.email, user);

  /**
   * This method for send reset link API
   *
   * @param resetLinkParam
   * @returns
   */
  public sendResetPasswordLink = (resetLinkParam) => this.firebaseService.checkUserData('User', resetLinkParam);

/**
 * This method for send reset link API
 *
 * @param userData
 * @returns
 */
  public updatePassword = (userData: any) => this.firebaseService.set('User', userData.email, userData);
}
