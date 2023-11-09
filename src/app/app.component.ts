import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'capital-compass';

    isAuthenticated$: Observable<boolean> | undefined;

    constructor(private authService: AuthService) {
        this.authService.runInitialLoginSequence().catch((error) => {
            console.error('Error during initial login sequence', error);
        });
        this.isAuthenticated$ = authService.isAuthenticated$;
    }

    public login() {
        return this.authService.login();
    }

    public logout() {
        return this.authService.logout();
    }
}
