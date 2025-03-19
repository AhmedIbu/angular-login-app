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
  user = { name: '', email: '', phone: '', address: '', password: '' };
  errorMessage = '';

  constructor(private userService: UserService) {}

  registerUser() {
    if (!this.user.name || !this.user.email || !this.user.phone || !this.user.address || !this.user.password) {
      alert('Please fill in all fields');
      return;
    }

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

  private resetForm() {
    this.user = { name: '', email: '', phone: '', address: '', password: '' };
  }
}
