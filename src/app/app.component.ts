import { HttpXsrfTokenExtractor } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { User } from './users/user';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'Capital Compass';
    accesssToken = '';

    isAuthenticated$ = new BehaviorSubject<boolean>(false);
    user: User | undefined;

    constructor(
        private authService: AuthService,
        private httpXsrfTokenExtractor: HttpXsrfTokenExtractor
    ) {}

    ngOnInit(): void {
        this.authService.authenticate().subscribe((user) => {
            if (user) {
                console.log('authenticated user :', user);
                this.isAuthenticated$.next(true);
                this.user = user;
            }
        });
    }

    logInClicked(): void {
        this.authService.login();
    }

    logout() {
        this.authService.logout();
    }

    csrfToken(): string | null {
        return this.httpXsrfTokenExtractor.getToken();
    }
}
