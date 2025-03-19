import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,  // ✅ Standalone component
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule,CommonModule]  // ✅ Add FormsModule here
})
export class LoginComponent implements OnInit{
    email = '';
    password = '' ;
    errorMessage = '';
    users: any[] = [] ;

    constructor(private authService: AuthService,private userService: UserService,private router: Router) {}
    
    ngOnInit() {
      this.userService.getUsers().subscribe((data) => {
        this.users = data;
      });
    }
    Login() {
      this.authService.login({email: this.email, password:this.password})
      .subscribe(response => {
        localStorage.setItem('token',response.token);
        alert('Login successfull!');
      }, error => {
        alert('Invalid credentials');
      });
      
    }
}
