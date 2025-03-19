import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule]  
})
export class LoginComponent {
    email = '';
    password = '';
    errorMessage = '';
    users: any[] = [];

    constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

    ngOnInit() {
      this.userService.getUsers().subscribe((data) => {
        this.users = data;
      });
    }

    onLogin() {
      if (!this.email || !this.password) {
        alert('Please enter email and password');
        return;
      }

      this.authService.login({ email: this.email, password: this.password }).subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          alert('Login successful!');
          this.router.navigate(['/admin-dashboard']); // ✅ Navigate after login
        },
        (error) => {
          this.errorMessage = 'Invalid credentials';
          alert('Invalid credentials');
        }
      );
    }
}
