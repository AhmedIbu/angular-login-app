import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent // ✅ Declare AppComponent here
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, // ✅ Required for API calls
    RouterModule.forRoot([]) // ✅ Setup RouterModule properly
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
