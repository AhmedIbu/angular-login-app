import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, HttpClientModule] // Import HttpClientModule here
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];

  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      alert('Access Denied! Admins only.');
      this.router.navigate(['/login']); // Redirect non-admin users
      return;
    }
    this.loadUsers(); // Fetch users if admin logs in
  }

  loadUsers(): void {
    const token = localStorage.getItem('token'); // Get token from login
    this.http.get('http://127.0.0.1:5000/get-users', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (data: any) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }
}
