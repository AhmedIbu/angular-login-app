import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AdminLoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.adminService.getUsers().subscribe({
      next: (data) => {
        console.log('✅ Users Data:', data); // Print users in console
        this.users = data;  // Store in variable
      },
      error: (error) => {
        console.error('❌ Failed to fetch users:', error);
      }
    });
  }
  onAdminLogin() {
    console.log('Admin login clicked');
  
    this.authService.adminLogin(this.email, this.password).subscribe((response) => {
      if (response.success) {
        alert('Admin Login Successful!');
        localStorage.setItem('admin', 'true'); // ✅ Ensure localStorage is updated
  
        setTimeout(() => {  // ✅ Small delay to ensure admin status is set
          this.router.navigate(['/admin-dashboard']); 
        }, 100); 
      } else {
        this.errorMessage = 'Invalid admin credentials!';
      }
    });
  }
}
