import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginRequest } from '../../../../core/models/auth.model';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  login() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.form.value as LoginRequest).subscribe({
      next: res => {
        this.loading.set(false);
        console.log('LOGIN SUCCESS', res);

        this.router.navigate(['/products'])
      },
      error: () => {
        this.error.set('Invalid username or password');
        this.loading.set(false);
      }
    })
  }
}
