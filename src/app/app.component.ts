import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'Capital Compass';
    accesssToken = '';

    isAuthenticated$: Observable<boolean> | undefined;

    constructor(private authService: AuthService) {
        this.authService.runInitialLoginSequence().catch((error) => {
            console.error('Error during initial login sequence', error);
        });
        this.isAuthenticated$ = authService.isAuthenticated$;
    }

    public login() {
        return this.authService.loginCode();
    }

    public logout() {
        return this.authService.logout();
    }

    public getAccessToken() {
        this.accesssToken = this.authService.getAccessToken();
    }
}
