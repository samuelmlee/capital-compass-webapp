import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environment/environment.prod';

export const AUTHCONFIG: AuthConfig = {
    issuer: environment.auth0.domain,

    redirectUri: window.location.origin,

    clientId: environment.auth0.clientId,

    responseType: 'code',

    scope: 'openid profile email',
    // scope: 'openid profile email user_scope:read',

    showDebugInformation: true,
};
