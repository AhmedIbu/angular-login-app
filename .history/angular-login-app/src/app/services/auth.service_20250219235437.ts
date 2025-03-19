import { Injectable } from '@angular/core';
import { HttpClient,  } from '@angular/common/http';
import { Observable, BehaviorSubject ,of} from 'rxjs';
import { map, catchError} from 'rxjs/operators';

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
  login(credentials: { email: string; password: string }): Observable<{ success: boolean; token?: string; isAdmin?: boolean }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      map((response) => {
        console.log('✅ Login Response:', response); // Debugging API response
        if (response.token) {
          this.saveToken(response.token);

          // ✅ Check if admin is logging in
          const isAdmin = credentials.email === this.adminCredentials.email && credentials.password === this.adminCredentials.password;
          localStorage.setItem('isAdmin', JSON.stringify(isAdmin));

          return { success: true, token: response.token, isAdmin };
        } else {
          return { success: false };
        }
      }),
      catchError((error) => {
        console.error('❌ Login Error:', error);
        return of({ success: false });
      })
    );
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

  register(userData: any) {
    return this.http.post('http://127.0.0.1:5000/register', userData).subscribe(
      (response) => {
        console.log('Registration successful', response);
        alert('Registration successful! You can now log in.');
      },
      (error) => {
        console.error('Registration failed', error);
        alert('Registration failed. Try again.');
      }
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
