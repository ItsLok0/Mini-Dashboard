import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { ThemeSwitcherComponent } from "./theme-switcher/theme-switcher";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterLink, RouterOutlet, ThemeSwitcherComponent]
})

export class App {
  constructor(private router: Router) {}

  isMenuOpen = false;

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
}
