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

  // ✅ Regular User Login
  login(credentials: any): Observable<{ success: boolean; token?: string }> {
    return new Observable((observer) => {
      this.http.post(`${this.apiUrl}/login`, credentials).subscribe(
        (response: any) => {
          console.log('Login Response:', response); // ✅ Debugging: Check if we receive a token
          if (response.token) {
            this.saveToken(response.token);
            observer.next({ success: true, token: response.token });
          } else {
            observer.next({ success: false });
          }
          observer.complete();
        },
        (error) => {
          console.error('Login Error:', error); // ✅ Debugging: Check for errors
          observer.next({ success: false });
          observer.complete();
        }
      );
    });
  }
  

  // ✅ Admin Login (Manual Check)
  adminLogin(email: string, password: string): Observable<{ success: boolean }> {
    return new Observable((observer) => {
      if (email === this.adminEmail && password === this.adminPassword) {
        localStorage.setItem('admin', 'true'); 
        observer.next({ success: true });
      } else {
        observer.next({ success: false });
      }
      observer.complete();
    });
  }

  // ✅ Save Token
  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.isAuthenticated.next(true);
  }

  // ✅ Retrieve Token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Check if Token Exists (🔹 **Fix: Missing Method Added!**)
  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ Check if Admin is Logged In
  isAdmin(): boolean {
    return localStorage.getItem('admin') === 'true' && this.hasToken();
  }

  // ✅ Logout & Clear Everything
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    this.isAuthenticated.next(false);
    window.location.reload(); // 🔹 Force refresh to clear session issues
  }

  // ✅ Observe Auth Status (for Guards)
  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
}
