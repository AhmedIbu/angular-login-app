import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { HttpClientModule, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, HttpClientModule]
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.redirectToLogin('Access Denied! Admins only.');
      return;
    }
    this.loadUsers();
  }

  fetchUsers() {
    const token = localStorage.getItem('admin_token'); // ✅ Retrieve token
  
    if (!token) {
      this.errorMessage = 'Unauthorized! Please login again.';
      return;
    }
  
    this.http.get<any[]>('http://127.0.0.1:5000/get-users-data', {
      headers: { Authorization: `Bearer ${token}` } // ✅ Send token
    }).subscribe({
      next: (data) => {
        console.log('✅ Users Fetched:', data);
        this.users = data;
      },
      error: (error) => {
        console.error('❌ Error fetching users:', error);
        this.errorMessage = 'Failed to load user data. Please login again.';
      },
    });
  }
  
  

loadUsers(): void {
  const token = this.authService.getToken();

  if (!token) {
    this.redirectToLogin('Session expired, please log in again.');
    return;
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}` // ✅ Include Bearer token
  });

  this.http.get<any[]>('http://127.0.0.1:5000/get-users-data', { headers }).subscribe(
    (data) => {
      if (Array.isArray(data) && data.length > 0) {
        this.users = data;
        console.log('✅ Users loaded:', this.users);
      } else {
        this.users = [];
        console.warn('⚠ No users found in response.');
      }
    },
    (error) => {
      console.error('❌ Error fetching users:', error);
      this.users = [];
    }
  );
}


  handleHttpError(error: HttpErrorResponse) {
    console.error('❌ Error fetching users:', error);
    if (error.status === 401) {
      this.redirectToLogin('Session expired, please log in again.');
    } else {
      this.errorMessage = 'An error occurred while fetching users. Please try again.';
    }
    return throwError(error);
  }

  redirectToLogin(message: string): void {
    alert(message);
    this.authService.logout();
    this.router.navigate(['/admin-login']);
  }
}
