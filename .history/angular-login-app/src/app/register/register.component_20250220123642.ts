import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  user = { name: '', email: '', phonenum: '', address: '', password: '' };
  errorMessage = '';
  successMessage = '';
  loading = false; // ✅ Added loading state

  constructor(private userService: UserService) {}

  registerUser() {
    if (!this.user.name || !this.user.email || !this.user.phonenum || !this.user.address || !this.user.password) {
      alert('Please fill in all fields');
      return;
    }
  
    console.log('📤 Sending Data:', this.user); // ✅ Check if data is correct before sending
  
    this.userService.registerUser(this.user).subscribe(
      (response: any) => {
        console.log('✅ Registration successful:', response);
        alert(response.message || 'User Registered Successfully!');
        this.resetForm();
      },
      (error) => {
        console.error('❌ Registration failed:', error);
        this.errorMessage = error.error?.message || 'Registration failed. Try again.';
        alert(this.errorMessage);
      }
    );
  }
   // ✅ Disable button while submitting

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
        this.loading = false; // ✅ Re-enable button after request completes
      }
    });
  }

  private validateForm(): boolean {
    if (!this.user.name.trim() || !this.user.email.trim() || !this.user.phonenum.trim() ||
        !this.user.address.trim() || !this.user.password.trim()) {
      return false;
    }
    return true;
  }

  private resetForm() {
    this.user = { name: '', email: '', phonenum: '', address: '', password: '' };
    this.errorMessage = '';
    this.successMessage = '';
  }
}
