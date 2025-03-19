import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AdminDashboardComponent } from './app/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './app/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent }, // Default route
  { path: 'admin-dashboard', component: AdminDashboardComponent }
];

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()]
}).catch(err => console.error(err));