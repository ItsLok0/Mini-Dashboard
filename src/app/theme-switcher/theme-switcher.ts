import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  inject,
  Renderer2,
  Inject,
  PLATFORM_ID,
  OnInit,
  signal
} from '@angular/core';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss',
})
export class ThemeSwitcherComponent implements OnInit {

  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);

  protected readonly currentTheme = signal<Theme>('light');

  // Vérification d'être sur le navigateur
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Appliquer le thème sauvegardé
    const saved = (localStorage.getItem('theme') as Theme) || 'light';
    this.setTheme(saved);
  }

  // Appliquer/changer le thème
  private setTheme(theme: Theme) {
    this.currentTheme.set(theme);

    this.renderer.setAttribute(
      this.document.documentElement,
      'data-theme',
      theme
    );

    localStorage.setItem('theme', theme);
  }

  // Appel changement du thème au clic
  protected toggleTheme(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const theme: Theme = checked ? 'dark' : 'light';
    this.setTheme(theme);
  }
}
