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
  loading = false;  // ✅ Added loading state

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

      
      console.error('❌ Form is invalid:', this.loginForm.errors);
      console.log('🛑 Form Control States:', {
        email: this.loginForm.controls['email'].errors,
        password: this.loginForm.controls['password'].errors
      });
  
      this.loginForm.markAllAsTouched(); // ✅ Highlight invalid fields
      return;
    }
  
    this.loading = true;
    this.errorMessage = '';
  
    const loginData = this.loginForm.value;
    console.log('📨 Sending Login Data:', loginData);
  
    this.authService.login(loginData).subscribe({
      next: (response: any) => {
        console.log('✅ Login Successful:', response);
        alert('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('🔥 API Error:', error);
        this.errorMessage = error.error?.message || 'Login failed. Try again.';
        alert(this.errorMessage);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}  