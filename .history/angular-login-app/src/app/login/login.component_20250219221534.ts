import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule , FormBuilder,  ReactiveFormsModule} from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule,]  
})
export class LoginComponent {

  loginForm: FormGroup;

    email = '';
    password = '';
    errorMessage = '';
    users: any[] = [];

    constructor(private fb: FormBuilder,private authService: AuthService, private userService: UserService, private router: Router) {}

    ngOnInit() {
      this.userService.getUsers().subscribe((data) => {
        this.users = data;
      });
    }

    onLogin() {
      this.authService.login(this.loginForm.value).subscribe(
        (response: any) => {
          if (response.token) {  // ✅ Ensure token is defined before storing
            localStorage.setItem('token', response.token);
            this.router.navigate(['/dashboard']);  // Redirect after login
          } else {
            console.error('Login failed: No token received');
            alert('Login failed. Please try again.');
          }
        },
        (error) => {
          console.error('Login error:', error);
          alert('Invalid credentials. Please try again.');
        }
      );
    }
  }
