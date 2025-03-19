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
    if (this.authService.adminLogin(this.email, this.password)) {
      alert('Admin Login Successful!');
      timport { Component } from '@angular/core';
      import { Router } from '@angular/router';
      import { CommonModule } from '@angular/common';
      import { FormsModule } from '@angular/forms';
      import { AuthService } from '../services/auth.service';
      
      @Component({
        selector: 'app-admin-login',
        standalone: true,
        templateUrl: './admin-login.component.html',
        styleUrls: ['./admin-login.component.css'],
        imports: [CommonModule, FormsModule]
      })
      export class AdminLoginComponent {
        email = '';
        password = '';
        errorMessage = '';
      
        constructor(private authService: AuthService, private router: Router) {}
      
        onAdminLogin() {
          this.authService.login({ email: this.email, password: this.password }).subscribe(
            (response) => {
              if (this.authService.isAdmin()) {
                alert('Admin Login Successful!');
                this.router.navigate(['/admin-dashboard']); // ✅ Redirect to admin dashboard
              } else {
                this.errorMessage = 'Invalid Admin Credentials!';
              }
            },
            () => {
              this.errorMessage = 'Invalid credentials!';
            }
          );
        }
      }
      thishis.router.navigate(['/admin-dashboard']); // Redirect to admin dashboard
    } else {
      this.errorMessage = 'Invalid admin credentials!';
    }
  }
}
