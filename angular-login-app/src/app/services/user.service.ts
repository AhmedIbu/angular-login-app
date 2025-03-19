import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:5000/get-users'; // Flask backend base URL

  constructor(private http: HttpClient) {}

  registerUser(userData: any) {
    return this.http.post('http://127.0.0.1:5000/register', userData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  loginUser(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  getUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<any>(this.apiUrl, { headers });
  }

  
  addUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-user`, userData);
  }
}
