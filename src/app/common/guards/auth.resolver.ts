import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthResolveGuard implements Resolve<boolean> {
  constructor(private userService: AuthService) {}

  resolve(): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.getUser() != null;
  }
}
