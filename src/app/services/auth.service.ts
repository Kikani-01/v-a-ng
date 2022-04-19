import { User } from '../models/user';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment, keycloakConfig } from '../../environments/environment';
import { Roles } from '../common/authentication/permissions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private USER = 'user';
  private ACCESS_TOKEN = 'access_token';
  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor() { }

  public getUser(): User {
    const userItem: string = localStorage.getItem(this.USER);
    if (userItem === null) return null;
    return JSON.parse(userItem);
  }

  public createUser(
    accessToken: string,
    idToken?: string,
    refreshToken?: string
  ): void {
    const decodedAccessToken: any = this.jwtHelper.decodeToken(accessToken);
    console.log('accessToken', decodedAccessToken);
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
    const user: User = new User();
    user.name = decodedAccessToken.given_name;
    user.surname = decodedAccessToken.family_name;
    user.fiscalcode = decodedAccessToken.preferred_fiscalcode;

    const localRoles = decodedAccessToken.roles;
    if (localRoles && localRoles.length) {
      for (let role of localRoles) {
        user.roles = [...role];
      }
    }

    let resource = keycloakConfig
      ? keycloakConfig.clientId
      : 'virtual-assistant-ng';

    if (
      resource &&
      decodedAccessToken.resource_access &&
      decodedAccessToken.resource_access[resource]
    ) {
      user.roles = [...decodedAccessToken.resource_access[resource].roles];
    }

    if (idToken) {
      const decodedIdToken = this.jwtHelper.decodeToken(idToken);
      console.log('decodedIdToken', decodedIdToken);

      const extraRoles = decodedIdToken.extraRoles;
      if (extraRoles && extraRoles.length) {
        for (let r = 0; r < extraRoles.length; r++) {
          const extraRole = '' + extraRoles[r];
          if (extraRole.startsWith(environment.rolesPrefix)) {
            user.roles = [
              ...extraRole.substring(environment.rolesPrefix.length),
            ];
          }
        }
      }
    }

    // Refresh token
    if (refreshToken) {
      const decodedRefreshToken = this.jwtHelper.decodeToken(refreshToken);
      console.log('decodedRefreshToken', decodedRefreshToken);
    }

    this.setupCustomProperties(user, decodedAccessToken);
    localStorage.setItem(this.USER, JSON.stringify(user));
  }

  public clearUser(): void {
    localStorage.removeItem(this.USER);
    localStorage.removeItem(this.ACCESS_TOKEN);
  }

  private setupCustomProperties(user: User, decodedToken?: any): void {
    if (user.roles && user.roles.indexOf(Roles.Admin) >= 0) user.admin = true;
  }
}
