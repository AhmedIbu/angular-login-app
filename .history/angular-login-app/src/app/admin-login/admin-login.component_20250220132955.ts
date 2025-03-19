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
  loading = false; // ✅ Added loading state

  constructor(private authService: AuthService, private router: Router) {}

  onAdminLogin() {
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'All fields are required!';
      return;
    }

    this.loading = true; // ✅ Disable button while loading
    console.log('🟡 Admin login clicked:', { email: this.email, password: this.password });

    this.authService.adminLogin(this.email, this.password).subscribe({
      next: (response) => {
        console.log('✅ Admin Login Successful:', response);

        if (response.success) {
          alert('Admin Login Successful!');
          localStorage.setItem('admin_token', response.token);
          localStorage.setItem('admin', 'true'); // ✅ Ensure localStorage is updated

          setTimeout(() => {
            this.router.navigate(['/admin-dashboard']);
          }, 100);
        } else {
          this.errorMessage = 'Invalid admin credentials!';
        }
      },
      error: (error) => {
        console.error('❌ Admin Login Failed:', error);
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      },
      complete: () => {
        this.loading = false; // ✅ Re-enable button
      },
    });
  }
}
