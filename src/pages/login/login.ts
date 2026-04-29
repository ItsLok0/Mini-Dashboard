import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../app/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  loginError = false;
  submitted = false;
  @ViewChild('errorDiv') errorElement!: ElementRef;

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  // Définition du formulaire avec ses contraintes
  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onLogin() {
    this.submitted = true;
    const formValues = this.loginForm.value;

    // Si invalide, on marque tous les champs comme touchés pour afficher les erreurs
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    
      // On cherche le premier élément invalide pour donner le focus
      const firstInvalidControl = document.querySelector('input.ng-invalid') as HTMLElement;
      if (firstInvalidControl) {
        firstInvalidControl.focus();
      }
      return;
    }

    // Si le formulaire est valide, on tente de se connecter
    if (this.loginForm.valid) {
      this.authService.login(
        formValues.email!,
        formValues.password!
      )
      .then(() => {
        this.router.navigate(['']);
      })
      .catch((error) => {
        this.loginForm.markAllAsTouched();
        this.cdr.markForCheck();
        this.loginError = true;

        // Gestion des erreurs spécifiques + message d'erreur
        if (
          error.code === 'auth/invalid-credential' || 
          error.code === 'auth/user-not-found' || 
          error.code === 'auth/invalid-email' ||
          error.code === 'auth/wrong-password') {
          this.errorMessage = "L'adresse e-mail ou le mot de passe est incorrect.";
        } else if (error.code === 'auth/too-many-requests') {
          this.errorMessage = "Trop de tentatives. Veuillez réessayer plus tard.";
        }

        // Donner le focus au message d'erreur
        setTimeout(() => {
          const firstInvalidControl = document.querySelector('.error-div') as HTMLElement;
          if (firstInvalidControl) {
            firstInvalidControl.focus();
          }  
        }, 0);
      });
    }
  }

  onGuestLogin(event: Event) {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      this.authService.loginAsGuest();
    }
  }
}
