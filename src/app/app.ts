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

  isActive(path: string) {
    return this.router.url === path;
  }
}
