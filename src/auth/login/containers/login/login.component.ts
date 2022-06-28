import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/auth/shared/services/auth/auth.service';

@Component({
  selector: 'login',
  template: `
    <div>
      <auth-form (submitted)="loginUser($event)">
        <h1>Login</h1>
        <a routerLink="/auth/register">Not Registered?</a>
        <button type="submit">Login</button>
        <div class="error" *ngIf="error.length">
          {{ error }}
        </div>
      </auth-form>
    </div>
  `,
})
export class LoginComponent {
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  loginUser(event: FormGroup) {
    const { email, password } = event.value;

    this.authService
      .loginUser(email, password)
      .then(() => this.router.navigate(['/']))
      .catch((err) => {
        this.error = new Error(err).message;
        console.log(this.error);
      });
  }
}
