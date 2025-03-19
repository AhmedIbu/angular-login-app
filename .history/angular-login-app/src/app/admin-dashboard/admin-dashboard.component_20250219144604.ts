import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

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
  userService = inject(UserService);
  http = inject(HttpClient);

  ngOnInit(): void {
    this.loadUsers(); // Fetch users when admin logs in
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
