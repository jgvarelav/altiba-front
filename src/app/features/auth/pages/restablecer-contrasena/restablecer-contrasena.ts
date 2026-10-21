import { Component, inject, input, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const { password, confirmacion } = group.value as { password: string; confirmacion: string };
  return password === confirmacion ? null : { mismatch: true };
}

@Component({
  selector: 'app-restablecer-contrasena',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './restablecer-contrasena.html',
})
export class RestablecerContrasena {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /** `?code=` query param from the link in the reset email. */
  readonly code = input<string>();

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmacion: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );

  submit(): void {
    const code = this.code();
    if (!code || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.resetPassword(code, this.form.getRawValue().password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set(
          'El enlace no es válido o ya fue usado. Solicita uno nuevo para restablecer tu contraseña.',
        );
      },
    });
  }
}
