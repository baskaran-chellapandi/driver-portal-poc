import { Injectable } from '@angular/core';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(user: User) {
    return this.http.post('https://reqres.in/api/login', user);
  }
  signup(user: User) {
    return this.http.post('https://reqres.in/api/register', user);
  }
}
