import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { ThemeSwitcherComponent } from "./theme-switcher/theme-switcher";
import { AuthService } from './services/auth';
import { CommonModule } from '@angular/common';

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
    const body = document.body;

    if (nav) {
      this.isMenuOpen = !this.isMenuOpen;
      nav.classList.toggle('open');
      body.classList.toggle('no-scroll');
    }
  }

  @HostListener('window:keydown.esc', ['$event'])
  handleKeyDown(event: Event) {
    this.toggleMenu();
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
