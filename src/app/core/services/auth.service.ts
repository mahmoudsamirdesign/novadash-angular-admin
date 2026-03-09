import { Inject, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthUser, UserRole } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'saas_auth_user';
  private readonly tokenKey = 'saas_auth_token';
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(null);

  readonly user$ = this.userSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.loadStoredUser();
  }

  get user() {
    return this.userSubject.value;
  }

  isAuthenticated() {
    return !!this.userSubject.value?.id;
  }

  hasRole(roles: UserRole[]) {
    const user = this.userSubject.value;
    return user ? roles.includes(user.role) : false;
  }

  setRole(role: UserRole) {
    const user = this.userSubject.value;
    if (!user) {
      return;
    }
    const updated = { ...user, role };
    this.userSubject.next(updated);
    this.persistAuth(updated, this.getStorage());
  }

  login(email: string, remember = true) {
    const name = this.formatName(email);
    const user: AuthUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      role: 'owner'
    };
    this.userSubject.next(user);
    const storage = this.getStorage(remember);
    this.persistAuth(user, storage);
    return user;
  }

  logout() {
    this.userSubject.next(null);
    this.clearStorage();
  }

  private loadStoredUser() {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }
    const raw = storage.getItem(this.storageKey);
    if (!raw) {
      return;
    }
    try {
      const user = JSON.parse(raw) as AuthUser;
      if (user?.id) {
        this.userSubject.next(user);
      }
    } catch {
      storage.removeItem(this.storageKey);
    }
  }

  private persistAuth(user: AuthUser, storage: Storage | null) {
    if (!storage) {
      return;
    }
    storage.setItem(this.storageKey, JSON.stringify(user));
    storage.setItem(this.tokenKey, `mock_${Date.now()}`);
  }

  private clearStorage() {
    const local = this.getStorage(true);
    const session = this.getStorage(false);
    local?.removeItem(this.storageKey);
    local?.removeItem(this.tokenKey);
    session?.removeItem(this.storageKey);
    session?.removeItem(this.tokenKey);
  }

  private getStorage(preferLocal?: boolean) {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    if (preferLocal === true) {
      return localStorage;
    }
    if (preferLocal === false) {
      return sessionStorage;
    }
    return localStorage.getItem(this.storageKey) ? localStorage : sessionStorage;
  }

  private formatName(email: string) {
    const prefix = email.split('@')[0] || 'User';
    return prefix
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
