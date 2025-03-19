import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000';
  private adminEmail = 'ibrahim.offl24@gmail.com';
  private adminPassword = 'admin123';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  adminLogin(email: string, password: string): boolean {
    if (email === this.adminEmail && password === this.adminPassword) {
      localStorage.setItem('admin', 'true');
      return true;
    }
    return false;
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return localStorage.getItem('admin') === 'true';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  }
}
