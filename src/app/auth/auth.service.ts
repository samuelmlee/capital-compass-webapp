import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, combineLatest, filter, map } from 'rxjs';
import { AUTHCONFIG } from './auth-config';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

    private isLoadedSubject$ = new BehaviorSubject<boolean>(false);
    public isLoaded$ = this.isLoadedSubject$.asObservable();

    public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
        this.isAuthenticated$,
        this.isLoaded$,
    ]).pipe(map((values) => values.every((v) => v == true)));

    constructor(private oauthService: OAuthService) {
        this.oauthService.configure(AUTHCONFIG);
        this.registerOAuthEventHandlers();
    }

    public getAccessToken(): string {
        return this.oauthService.getAccessToken();
    }

    private registerOAuthEventHandlers() {
        const eventsToFilter = [
            'token_received',
            'session_terminated',
            'session_error',
            'logout',
        ];

        this.oauthService.events
            .pipe(filter((e) => eventsToFilter.includes(e.type)))
            .subscribe((event) => {
                if (event.type === 'token_received') {
                    this.handleTokenReceived();
                } else {
                    this.isAuthenticatedSubject$.next(false);
                }
            });

        this.oauthService.events.subscribe((event) => {
            if (event instanceof ErrorEvent) {
                console.error(event);
            } else {
                console.warn(event);
            }
        });
    }

    private handleTokenReceived() {
        this.isAuthenticatedSubject$.next(
            this.oauthService.hasValidAccessToken()
        );
    }

    public runInitialLoginSequence(): Promise<void> {
        return this.oauthService
            .loadDiscoveryDocument()
            .then(() => this.oauthService.tryLogin())
            .then(async () =>
                this.oauthService.hasValidAccessToken()
                    ? Promise.resolve()
                    : await this.oauthService.silentRefresh()
            )
            .then(() => this.isLoadedSubject$.next(true));
    }

    async loginCode() {
        await this.oauthService.loadDiscoveryDocument();
        sessionStorage.setItem('flow', 'code');

        this.oauthService.initLoginFlow();
    }

    public logout(): void {
        this.oauthService.logOut();
    }
}
