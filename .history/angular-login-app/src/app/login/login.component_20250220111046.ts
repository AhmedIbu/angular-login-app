import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  
  loginForm!: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // ✅ Initialize the login form with validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Email validation
      password: ['', [Validators.required, Validators.minLength(6)]]  // Password min length: 6
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      console.error('❌ Form is invalid');
      return;
    }
  
    this.authService.login(this.loginForm.value).subscribe(response => {
      if (response.success) {
        console.log('✅ Login Successful:', response);
        this.router.navigate(['/dashboard']); // Adjust navigation
      } else {
        console.error('❌ Login Failed');
      }
    }, error => {
      console.error('🔥 API Error:', error);
    });
  }
  
}
