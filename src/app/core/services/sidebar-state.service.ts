import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {
  private readonly storageKey = 'sidebar-collapsed';
  private readonly collapsedSubject = new BehaviorSubject<boolean>(false);
  readonly collapsed$ = this.collapsedSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.initState();
  }

  get collapsed() {
    return this.collapsedSubject.value;
  }

  setCollapsed(value: boolean) {
    this.collapsedSubject.next(value);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, String(value));
    }
  }

  toggle() {
    this.setCollapsed(!this.collapsedSubject.value);
  }

  private initState() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const stored = localStorage.getItem(this.storageKey);
    if (stored !== null) {
      this.collapsedSubject.next(stored === 'true');
    }
  }
}
