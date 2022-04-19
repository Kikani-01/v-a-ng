export enum Roles {
  Admin = 'Admin',
  User = 'User',
}

export const ADMIN_ROLE = 'Admin';
export const USER_ROLE = 'User';
export const ANY_ROLE = 'Any';

export class Permissions {
  public static get roles(): Map<string, string[]> {
    return new Map<string, string[]>()
      .set(ADMIN_ROLE, [Roles.Admin])
      .set(USER_ROLE, [Roles.Admin])
      .set(ANY_ROLE, [Roles.Admin, Roles.User]);
  }
}
