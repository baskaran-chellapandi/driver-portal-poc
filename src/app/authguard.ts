import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../app/services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private storage: StorageService) { }

    canActivate(): boolean {
        this.storage.get('disableSpalshScreen').then((value) => {
            let disableSpalshScreen = value;
            if (disableSpalshScreen) {
                this.router.navigateByUrl('/user/login');
            } else {
                this.router.navigateByUrl('/');
            }
        });
        return true;
    }
}