import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UiFieldComponent } from '../../../../shared/ui/field/ui-field.component';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, UiFieldComponent, UiButtonComponent, UiCardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isSubmitting = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true]
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    setTimeout(() => {
      const { email, remember } = this.form.value;
      if (!email) {
        this.isSubmitting = false;
        return;
      }
      this.authService.login(email, remember ?? true);
      this.isSubmitting = false;
      this.form.reset({ remember: true });
      this.router.navigate(['/app']);
    }, 500);
  }

  loginAsDemo() {
    if (this.isSubmitting) {
      return;
    }
    this.form.setValue({
      email: 'demo@saaskit.com',
      password: 'password',
      remember: true
    });
    this.submit();
  }
}
