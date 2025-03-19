import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
im

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule],
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = []; // ✅ Store user data
  errorMessage = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<any[]>('http://127.0.0.1:5000/users').subscribe({
      next: (data) => {
        console.log('✅ Users Fetched:', data);
        this.users = data; // ✅ Assign to users array
      },
      error: (error) => {
        console.error('❌ Error fetching users:', error);
        this.errorMessage = 'Failed to load user data.';
      },
    });
  }
}
