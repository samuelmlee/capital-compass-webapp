import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';

export const AUTHCONFIG: AuthConfig = {
    issuer: environment.auth0.domain,

    redirectUri: window.location.origin,

    clientId: environment.auth0.clientId,

    responseType: 'code',

    scope: 'openid profile email offline_access',
    // scope: 'openid profile email offline_access user_scope:read',

    showDebugInformation: true,

    clearHashAfterLogin: true,
};
