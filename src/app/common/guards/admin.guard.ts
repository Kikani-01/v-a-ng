import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { ADMIN_ROLE } from '../authentication/permissions';

@Injectable({
    providedIn: 'root',
})
export class AdminGuard extends KeycloakAuthGuard {
    constructor(
        protected readonly router: Router,
        protected readonly keycloak: KeycloakService
    ) {
        super(router, keycloak);
    }

    public async isAccessAllowed(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        // Force the user to log in if currently unauthenticated.
        if (!this.authenticated) {
            await this.keycloak.login({
                redirectUri: window.location.origin + state.url,
            });
        }
        // Get the roles required from the route.
        const requiredRoles = ADMIN_ROLE;
        // Allow the user to proceed if all the required roles are present.
        return this.roles.includes(requiredRoles);
    }
}
