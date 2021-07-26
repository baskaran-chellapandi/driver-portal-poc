import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../app/services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private storage: StorageService) { }
    isAuthorised : boolean = false;

    canActivate(): boolean {
        // this.storage.get('disableSpalshScreen').then((value) => {
        //     let disableSpalshScreen = value;
        //     if (disableSpalshScreen) {
        //         this.router.navigateByUrl('/user/login');
        //     } else {
        //         this.router.navigateByUrl('/');
        //     }
        // });
     
        this.storage.get("token").then(email => {
            console.log(email);
            if (email) {
                // authorised so return true
                this.isAuthorised = true;
            } else {
                // not logged in so redirect to login page with the return url
            this.router.navigate(['/user/login']);
            this.isAuthorised = false;
            }
        });
        return this.isAuthorised;
    }
}