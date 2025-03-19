import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { name: '', email: '', phone: '', address: '', password: '' };
  errorMessage = '';
  successMessage = '';
  loading = false; // ✅ Added loading state

  constructor(private userService: UserService) {}

  registerUser() {
    // ✅ Prevent duplicate submissions
    if (this.loading) return;

    // ✅ Validate form fields
    if (!this.validateForm()) {
      this.errorMessage = "All fields are required"; 
      return;
    }

    // ✅ Show loading state
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('📤 Sending Data:', this.user); // Debugging

    this.userService.registerUser(this.user).subscribe({
      next: (response: any) => {
        console.log('✅ Registration successful:', response);
        this.successMessage = response.message || 'User Registered Successfully!';
        alert(this.successMessage);
        this.resetForm();
      },
      error: (error) => {
        console.error('❌ Registration failed:', error);
        this.errorMessage = error.error?.message || 'Registration failed. Try again.';
        alert(this.errorMessage);
      },
      complete: () => {
        this.loading = false; // ✅ Re-enable form after request completes
      }
    });
  }

  private validateForm(): boolean {
    return Object.values(this.user).every(value => value.trim() !== '');
  }

  private resetForm() {
    this.user = { name: '', email: '', phone: '', address: '', password: '' };
    this.errorMessage = '';
    this.successMessage = '';
  }
}
