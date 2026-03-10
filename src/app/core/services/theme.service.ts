import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';
export type ThemePreset = 'blue' | 'purple' | 'emerald' | 'rose' | 'amber';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'theme';
  private readonly presetStorageKey = 'theme-preset';
  private readonly themeSubject = new BehaviorSubject<ThemeMode>('light');
  readonly theme$ = this.themeSubject.asObservable();
  private readonly presetSubject = new BehaviorSubject<ThemePreset>('blue');
  readonly preset$ = this.presetSubject.asObservable();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.initTheme();
    this.initPreset();
  }

  toggleTheme() {
    const next = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(mode: ThemeMode) {
    this.themeSubject.next(mode);
    if (isPlatformBrowser(this.platformId)) {
      this.document.documentElement.setAttribute('data-theme', mode);
      this.document.documentElement.style.colorScheme = mode;
      localStorage.setItem(this.storageKey, mode);
    }
  }

  setPreset(preset: ThemePreset) {
    this.presetSubject.next(preset);
    if (isPlatformBrowser(this.platformId)) {
      this.document.documentElement.setAttribute('data-accent', preset);
      localStorage.setItem(this.presetStorageKey, preset);
    }
  }

  getCssVar(name: string) {
    if (!isPlatformBrowser(this.platformId)) {
      return '';
    }
    return getComputedStyle(this.document.documentElement).getPropertyValue(name).trim();
  }

  private initTheme() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const stored = localStorage.getItem(this.storageKey) as ThemeMode | null;
    if (stored) {
      this.setTheme(stored);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme(prefersDark ? 'dark' : 'light');
  }

  private initPreset() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const stored = localStorage.getItem(this.presetStorageKey) as ThemePreset | null;
    if (stored) {
      this.setPreset(stored);
      return;
    }

    this.setPreset('blue');
  }
}
