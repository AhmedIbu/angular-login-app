import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000'; // ✅ Flask API URL
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  // ✅ Regular User Login (API)
  login(credentials: { email: string; password: string }): Observable<{ success: boolean; token?: string; isAdmin?: boolean }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ token: string; isAdmin: boolean }>(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      tap(response => console.log('✅ User Login API Response:', response)), // ✅ Log API response
      map(response => {
        if (response.token) {
          this.saveToken(response.token);
          localStorage.setItem('isAdmin', JSON.stringify(response.isAdmin));
          return { success: true, token: response.token, isAdmin: response.isAdmin };
        }
        return { success: false };
      }),
      catchError(error => {
        console.error('❌ Login Error:', error);
        return of({ success: false });
      })
    );
  }

  // ✅ Admin Login (API Call)
  adminLogin(email: string, password: string): Observable<{ success: boolean; token?: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ success: boolean; token?: string }>(`${this.apiUrl}/admin-login`, { email, password }, { headers }).pipe(
      tap(response => console.log('✅ Admin Login API Response:', response)), // ✅ Log API response
      map(response => {
        if (response.success && response.token) {
          this.saveToken(response.token);
          localStorage.setItem('admin', 'true'); // ✅ Save admin status
          return { success: true, token: response.token };
        }
        return { success: false };
      }),
      catchError(error => {
        console.error('❌ Admin Login Error:', error);
        return of({ success: false });
      })
    );
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

  // ✅ Check if Token Exists
  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ Check if Admin is Logged In
  isAdmin(): boolean {
    return localStorage.getItem('admin') === 'true' && this.hasToken();
  }

  // ✅ User Registration
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        console.log('✅ Registration successful', response);
        alert('Registration successful! You can now log in.');
      }),
      catchError(error => {
        console.error('❌ Registration failed', error);
        alert('Registration failed. Try again.');
        return of(null);
      })
    );
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
