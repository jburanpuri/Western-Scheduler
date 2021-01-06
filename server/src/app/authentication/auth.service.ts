import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/AuthData.model';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

import { environment } from '../../environments/environment';

const API_URL = `${environment.apiUrl}`;
const IS_USER_ADMIN_KEY = 'isUserAdmin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private isAdmin: boolean = false;
  private token: string = '';
  private authStatusListener = new Subject<boolean>();
  private adminStatusListener = new BehaviorSubject<boolean>(
    localStorage.getItem(IS_USER_ADMIN_KEY) == 'true'
  );

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsAdmin() {
    return this.isAdmin;
  }

  getAuthStatus() {
    return this.authStatusListener.asObservable();
  }

  getAdminStatus() {
    return this.adminStatusListener.asObservable();
  }

  registerUser(name: string, email: string, password: string) {
    this.http
      .post<{ token: string; isAdmin: boolean }>(`${API_URL}/users`, {
        name,
        email,
        password,
      })
      .subscribe(
        (t) => {
          this.token = t.token;
          if (this.token) {
            this.isAuthenticated = true;
            this.isAdmin = t.isAdmin;
            this.authStatusListener.next(true);
            this.adminStatusListener.next(t.isAdmin);
            this.saveAuthData(this.token, t.isAdmin);
            this.router.navigate(['/schedules']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  loginUser(email: string, password: string) {
    this.http
      .post<{ token: string; isAdmin: boolean }>(`${API_URL}/auth`, {
        email,
        password,
      })
      .subscribe(
        (t) => {
          this.token = t.token;
          if (this.token) {
            this.isAuthenticated = true;
            this.isAdmin = t.isAdmin;
            this.saveAuthData(t.token, t.isAdmin === true);
            this.authStatusListener.next(true);
            this.adminStatusListener.next(t.isAdmin);
            this.router.navigate(['/schedules']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    this.http
      .post(`${API_URL}/auth/changePassword`, {
        currentPassword,
        newPassword,
        confirmPassword,
      })
      .subscribe(
        () => {
          this.token = '';
          this.isAuthenticated = false;
          this.authStatusListener.next(false);
          this.clearAuthData();
          this.router.navigate(['/login']);
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  logoutUser() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    if (!authData.token) {
      return;
    }
    this.token = authData.token;
    this.isAdmin = authData.isAdmin;
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
  }

  private saveAuthData(token: string, isAdmin: boolean) {
    localStorage.setItem('token', token);
    localStorage.setItem('isUserAdmin', String(isAdmin));
  }

  private clearAuthData() {
    localStorage.removeItem('token');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem(IS_USER_ADMIN_KEY) == "true";
    return {
      token,
      isAdmin,
    };
  }
}
