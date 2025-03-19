import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule]
})
export class AdminDashboardComponent implements OnInit{
  users: any[] = [];

  constructor(private authService: AuthService,private userService: UserService,private http: HttpClient) {}

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