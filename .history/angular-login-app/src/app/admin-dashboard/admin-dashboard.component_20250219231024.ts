import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.redirectToLogin('Access Denied! Admins only.');
      return;
    }
    this.loadUsers();
  }

  loadUsers(): void {
    const token = this.authService.getToken();
  
    if (!token) {
      alert('Session expired, please log in again.');
      this.router.navigate(['/login']); // Redirect to login page
    }
  
    this.http.get<any[]>('http://127.0.0.1:5000/get-users-data', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (data) => {
        this.users = data;
        console.log('Users loaded successfully:', this.users);
      },
      (error) => {
        console.error('Error fetching users:', error);
        alert('An error occurred while fetching user data.');
      }
    );
  }
  

  handleHttpError(error: HttpErrorResponse) {
    console.error('❌ Error fetching users:', error);
    if (error.status === 401) {
      this.redirectToLogin('Session expired, please log in again.');
    } else {
      alert('An error occurred while fetching users. Please try again.');
    }
    return throwError(error);
  }

  redirectToLogin(message: string): void {
    alert(message);
    this.authService.logout();
    this.router.navigate(['/admin-login']);
  }
}
