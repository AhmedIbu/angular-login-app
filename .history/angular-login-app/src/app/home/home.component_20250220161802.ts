import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css','..']
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToAdminLogin() {
    console.log("Navigating to Admin Login...");
    this.router.navigate(['/admin-login']);
  }
}
