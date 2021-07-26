import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../app/services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private storage: StorageService) { }
    isAuthorised: boolean = false;

    canActivate(): boolean {
        this.storage.get("token").then(email => {
            if (email) {
                // authorised so return true
                this.router.navigateByUrl('/user/dashboard');
                this.isAuthorised = true;
            } else {
                // not logged in so redirect to splash or login page based on storage
                this.storage.get('disableSpalshScreen').then((disableSpalshScreen) => {
                    if (disableSpalshScreen) {
                        this.router.navigateByUrl('/user/login');
                    } else {
                        this.router.navigateByUrl('/');
                    }
                });
                this.isAuthorised = false;
            }
        });
        return this.isAuthorised;
    }
}
