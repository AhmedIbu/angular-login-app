import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000';
  private adminEmail = 'ibrahim.offl24@gmail.com';
  private adminPassword = 'root123';

  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  // ✅ Regular User Login (via Flask API)
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // ✅ Admin Login (Local Verification)
  adminLogin(email: string, password: string): Observable<{ success: boolean }> {
    return new Observable((observer) => {
      if (email === this.adminEmail && password === this.adminPassword) {
        localStorage.setItem('admin', 'true');
        observer.next({ success: true }); // ✅ Return an object
        observer.complete();
      } else {
        observer.next({ success: false }); // ✅ Return an object
        observer.complete();
      }
    });
  }

  // ✅ Save JWT Token
  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.isAuthenticated.next(true);
  }

  // ✅ Retrieve JWT Token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Check if Admin is Logged In
  isAdmin(): boolean {
    return localStorage.getItem('admin') === 'true';
  }

  // ✅ Check if Token Exists
  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ Logout User/Admin
  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('admin');
    this.isAuthenticated.next(false);
  }

  // ✅ Observe Auth Status (for Guards)
  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
}
