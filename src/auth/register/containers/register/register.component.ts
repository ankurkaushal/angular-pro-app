import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/auth/shared/services/auth/auth.service';

@Component({
  selector: 'register',
  template: `
    <div>
      <auth-form (submitted)="registerUser($event)">
        <h1>Register</h1>
        <a routerLink="/auth/login">Already have an account?</a>
        <button type="submit">Create Account</button>
        <div class="error" *ngIf="error.length">
          {{ error }}
        </div>
      </auth-form>
    </div>
  `,
})
export class RegisterComponent {
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  registerUser(event: FormGroup) {
    const { email, password } = event.value;

    this.authService
      .createUser(email, password)
      .then(() => this.router.navigate(['/']))
      .catch((err) => {
        this.error = new Error(err).message;
        console.log(this.error);
      });
    // try {
    //   await this.authService.createUser(email, password);
    //   this.router.navigate(['/']);
    // } catch (err: any) {
    //   const newErr = new Error(err);
    //   this.error = newErr.message;

    //   console.log(this.error)
    // }
  }
}
