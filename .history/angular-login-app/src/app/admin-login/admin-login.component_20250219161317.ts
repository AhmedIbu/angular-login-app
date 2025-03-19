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

  onAdminLogin() {
      console.log('Ami')

    this.authService.adminLogin(this.email, this.password).subscribe(
      (response) => {
        if (response.success) {
          alert('Admin Login Successful!');
          this.router.navigate(['/admin-dashboard']); // Redirect to admin dashboard
        } else {
          this.errorMessage = 'Invalid admin credentials!';
        }
      },
      () => {
        this.errorMessage = 'Invalid admin credentials!';
      }
    );
  }
}
