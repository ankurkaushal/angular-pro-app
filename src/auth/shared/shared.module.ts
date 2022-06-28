import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthFormComponent } from './components/auth-form/auth-form.components';
import { AuthService } from './services/auth/auth.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [AuthFormComponent],
  exports: [AuthFormComponent],
  providers: [AuthService, AuthGuard],
})
export class SharedModule {}
