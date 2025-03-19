import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true, // ✅ Ensure standalone component
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // ✅ Fixed typo (was styleUrl)
})
export class RegisterComponent {
  user = { name: '', email: '', phone: '', address: '', password: '' }; // ✅ Added password field
  errorMessage = '';

  constructor(private userService: UserService) {}

  registerUser() {
    if (!this.user.name || !this.user.email || !this.user.phone || !this.user.address || !this.user.password) {
      alert('Please fill in all fields');
      return;
    }

    this.userService.registerUser(this.user).subscribe(
      (response) => {
        alert('User Registered Successfully!');
        this.user = { name: '', email: '', phone: '', address: '', password: '' }; // ✅ Reset form
      },
      (error) => {
        this.errorMessage = 'Registration failed. Try again.';
        alert('Error registering user');
      }
    );
  }
}
