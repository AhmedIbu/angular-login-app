import { Routes, CanActivateFn } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './home/home.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

// Admin guard function
const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  if (authService.isAdmin()) {
    return true;
  } else {
    alert('Access Denied! Admins only.');
    return ['/admin-login']; // Redirect unauthorized users
  }
};

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-login', component: AdminLoginComponent }, // Separate Admin Login Page
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] }, // ✅ Protected Admin Route
];
