import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000';
  private adminCredentials = { email: 'admin@example.com', password: 'admin123' };

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    if (credentials.email === this.adminCredentials.email && credentials.password === this.adminCredentials.password) {
      localStorage.setItem('token', 'admin-token');
      localStorage.setItem('role', 'admin');
      return new Observable(observer => {
        observer.next({ token: 'admin-token' });
        observer.complete();
      });
    } else {
      return this.http.post(`${this.apiUrl}/login`, credentials);
    }
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}
