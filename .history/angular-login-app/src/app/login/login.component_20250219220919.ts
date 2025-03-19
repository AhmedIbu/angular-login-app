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
      this.authService.login({ email: this.email, password: this.password }).subscribe(
        response => {
          if(response.token)
          localStorage.setItem('token', response.token);
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin-dashboard']); // Redirect admin to dashboard
          } else {
            this.router.navigate(['/']); // Redirect normal users elsewhere
          }
        },
        error => {
          alert('Invalid credentials');
        }
      );
    }
  }
