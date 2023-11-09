import { Injectable } from '@angular/core';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
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

    private registerOAuthEventHandlers() {
        const eventsToFilter = [
            'token_received',
            'session_terminated',
            'session_error',
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
            .then(() =>
                this.oauthService.hasValidAccessToken()
                    ? Promise.resolve()
                    : this.handleSilentRefresh()
            )
            .then(() => this.isLoadedSubject$.next(true));
    }

    private handleSilentRefresh(): Promise<OAuthEvent | void> {
        return this.oauthService.silentRefresh().catch((result) => {
            const errorsRequiringInteraction = [
                'interaction_required',
                'login_required',
                'account_selection_required',
                'consent_required',
            ];
            if (
                result &&
                result.reason &&
                errorsRequiringInteraction.includes(result.reason.error)
            ) {
                console.warn('User interaction is needed to log in.');
                return Promise.resolve();
            }
            return Promise.reject(result);
        });
    }

    public async login() {
        await this.oauthService.loadDiscoveryDocument();
        const loginResult = await this.oauthService.tryLogin();

        if (!loginResult) {
            await this.oauthService.initCodeFlow();
        }

        this.isAuthenticatedSubject$.next(
            this.oauthService.hasValidAccessToken()
        );
    }

    public logout(): void {
        this.oauthService.logOut();
    }
}
