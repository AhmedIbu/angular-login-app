import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  templateUrl: './admin-login.component.html',

  imports: [CommonModule, FormsModule],
})
export class AdminLoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onAdminLogin() {
    if (this.authService.adminLogin(this.email, this.password)) {
      alert('Admin Login Successful!');
      this.router.navigate(['/admin-dashboard']); // Redirect to admin dashboard
    } else {
      this.errorMessage = 'Invalid admin credentials!';
    }
  }
}
