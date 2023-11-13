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

    isAuthenticated$ = new BehaviorSubject<boolean>(false);
    user$ = new BehaviorSubject<User | undefined>(undefined);

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.authenticate().subscribe((user) => {
            if (user) {
                this.isAuthenticated$.next(true);
                this.user$.next(user);
            }
        });
    }

    logInClicked(): void {
        this.authService.login();
    }

    logOutClicked() {
        this.authService.logout().subscribe(() => {
            this.isAuthenticated$.next(false);
            this.user$.next(undefined);
        });
    }
}
