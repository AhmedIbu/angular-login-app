import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

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
    // ✅ Ensure only admins can access the dashboard
    if (!this.authService.isAdmin()) {
      alert('Access Denied! Admins only.');
      this.authService.logout(); // Ensure proper logout
      this.router.navigate(['/admin-login']); 
      return;
    }
    
    this.loadUsers();
  }

  loadUsers(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.handleSessionExpired();
      return;
    }

    this.http.get('http://127.0.0.1:5000/get-users-data', { 
      headers: { Authorization: `Bearer ${token}` } 
    }).subscribe(
      (data: any) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users', error);

        if (error.status === 401) {  // ✅ Handle expired token
          this.handleSessionExpired();
        }
      }
    );
  }

  handleSessionExpired(): void {
    alert('Session expired, please log in again.');
    this.authService.logout();
    this.router.navigate(['/admin-login']);
  }
}
