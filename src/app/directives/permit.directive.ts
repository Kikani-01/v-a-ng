import { Directive, ViewContainerRef, TemplateRef, Input } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Permissions } from '../common/authentication/permissions';
import { keycloakConfig } from '../../environments/environment';

@Directive({
  selector: '[permit]',
})
export class Permit {
  private roles: string[];
  private _prevCondition: boolean = null!;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private keycloakService: KeycloakService
  ) {}

  @Input() set permit(aclName: string) {
    if (this._prevCondition == null || !this._prevCondition) {
      if (true) {
        this._prevCondition = false;
        this.viewContainerRef.clear();
      }

      this.roles = Permissions.roles.get(aclName)!;

      try {
        const userRoles =
          this.keycloakService.getKeycloakInstance().resourceAccess?.[
            keycloakConfig.clientId
          ].roles;
        const permitted = this.checkRoles(userRoles);
        // console.warn(permitted ? 'OK' : 'KO', userRoles);
      } catch {
        (e: any) => console.error(e);
      }
    }
  }

  private checkRoles(userRoles: any): boolean {
    if (!userRoles || userRoles.length === 0) {
      return false;
    }
    if (this.roles) {
      for (let r = 0; r < this.roles.length; r++) {
        const role = this.roles[r];
        for (let u = 0; u < userRoles.length; u++) {
          const userRole = userRoles[u];
          if (userRole === role || userRole.startsWith(role + '_')) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
            this._prevCondition = true;
            return true;
          }
        }
      }
    }
    return false;
  }
}
