import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../app/services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  errorMessage = '';
  registerError = false;
  submitted = false;
  @ViewChild('errorDiv') errorElement!: ElementRef;

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  // Définition du formulaire avec ses contraintes
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required, 
      Validators.minLength(12),
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*')
    ]],
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]]
  });

  onSubmit() {
    this.submitted = true;
    const formValues = this.registerForm.value;

    // Si invalide, on marque tous les champs comme touchés pour afficher les erreurs
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
    
      // On cherche le premier élément invalide pour donner le focus
      const firstInvalidControl = document.querySelector('input.ng-invalid') as HTMLElement;
      if (firstInvalidControl) {
        firstInvalidControl.focus();
      }
      return;
    }

    // Si le formulaire est valide, on tente de s'enregistrer
    if (this.registerForm.valid) {
      this.authService.register(
        formValues.email!,
        formValues.password!,
        {
          firstName: formValues.firstName!, 
          lastName: formValues.lastName!
        }
      )
      .then(() => {
        this.router.navigate(['']);
      })
      .catch((error) => {
        this.registerForm.markAllAsTouched();
        this.cdr.markForCheck();
        this.registerError = true;

        // Gestion du message d'erreur en fonction du code d'erreur
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'Cet email est déjà utilisé.';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
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
}
