import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { Store } from 'store';

// feature modules
import { AuthModule } from 'src/auth/auth.module';

// containers
import { AppComponent } from './containers/app/app.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppNavComponent } from './components/app-nav/app-nav.component';
import { HealthModule } from 'src/health/health.module';

// components

// routes
export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'schedule' },
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    AuthModule,
    HealthModule,
  ],
  declarations: [AppComponent, AppHeaderComponent, AppNavComponent],
  providers: [Store],
  bootstrap: [AppComponent],
})
export class AppModule {}
