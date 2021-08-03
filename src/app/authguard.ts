import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { StorageService } from '../app/services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private storage: StorageService, private platform: Platform) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.storage.get("token").then(email => {
            if (email) {
                // authorised so return true
                if (state.url == '/') {
                    this.router.navigateByUrl('/user/dashboard');
                } else {
                    this.router.navigateByUrl(state.url);
                }
            } else {
                // not logged in so redirect to splash or login page based on storage
                if (this.platform.is('desktop') == false) {
                    this.storage.get('disableSpalshScreen').then((disableSpalshScreen) => {
                        if (disableSpalshScreen) {
                            this.router.navigateByUrl('/user/login');
                        } else {
                            this.router.navigateByUrl('/');
                        }
                    });
                } else {
                    this.router.navigateByUrl('/user/login');
                }
            }
        });
        return true;
    }
}
