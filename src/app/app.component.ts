import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public title = 'Capital Compass';

    public isAuthenticated$ = this.authService.isAuthenticated$;
    public user$ = this.authService.user$;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.initAuthentication();
    }

    public logInClicked(): void {
        this.authService.login();
    }

    public logOutClicked() {
        this.authService.logout();
    }
}
