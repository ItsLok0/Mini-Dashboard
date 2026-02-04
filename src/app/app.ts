import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { ThemeSwitcherComponent } from "./theme-switcher/theme-switcher";
import { AuthService } from './services/auth';
import { CommonModule } from '@angular/common';
import { onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterLink, RouterOutlet, ThemeSwitcherComponent, CommonModule]
})

export class App {
  constructor(private router: Router) {}

  isMenuOpen = false;
  public authService = inject(AuthService);

  isActive(path: string) {
    return this.router.url === path;
  }

  toggleMenu() {
    const nav = document.querySelector('nav');
    if (nav) {
      this.isMenuOpen = true;
      nav.classList.toggle('open');
    }
  }

  closeMenu() {
    const nav = document.querySelector('nav');
    if (nav && this.isMenuOpen) {
      this.isMenuOpen = false;
      nav.classList.remove('open');
    }
  }

  @HostListener('window:keydown.esc', ['$event'])
  handleKeyDown(event: Event) {
    this.closeMenu();
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
    console.log('Déconnexion');
  }
}
