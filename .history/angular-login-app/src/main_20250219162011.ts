import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  ...appConfig, // ✅ Spread existing config
  providers: [
    ...appConfig.providers, // ✅ Keep existing providers
    provideHttpClient() // ✅ Ensure HTTP client is provided
  ]
}).catch(err => console.error(err));
