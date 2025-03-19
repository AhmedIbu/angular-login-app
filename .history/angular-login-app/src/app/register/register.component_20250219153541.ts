import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-register',
  imports: [CommonModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = { name: '', email: '', number: '', address: '' }; // ✅ Declare user object

  constructor(private userService: UserService) {}
  registerUser() {
    this.userService.addUser(this.user).subscribe((response) => {
      alert('User Registered Successfully!');
      this.user = { name: '', email: '', number: '', address: '' }; // Reset form
    });
}
}