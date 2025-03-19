import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

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
    setTimeout(() => {  // ✅ Small delay to allow localStorage update
      if (!this.authService.isAdmin()) {
        alert('Access Denied! Admins only.');
        this.router.navigate(['/admin-login']); 
        return;
      }
      this.loadUsers();
    }, 100);
  }

  loadUsers(): void {
    const token = this.authService.getToken();
    
    if (!token) {
      alert('Session Expired. Please login again.');
      this.authService.logout();
      this.router.navigate(['/admin-login']); // 🚨 Redirect if no token
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('http://127.0.0.1:5000/get-users', { headers })
      .subscribe(
        (data: any) => {
          this.users = data;
        },
        (error) => {
          console.error('Error fetching users:', error);
          if (error.status === 401 || error.status === 403) {
            alert('Unauthorized Access! Please login again.');
            this.authService.logout();
            this.router.navigate(['/admin-login']); // 🚨 Redirect on auth failure
          } else {
            alert('Failed to load users. Please try again later.');
          }
        }
      );
  }
}
