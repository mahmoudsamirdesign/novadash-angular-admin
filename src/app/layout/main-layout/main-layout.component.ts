import { Component, DestroyRef, HostListener, OnInit, inject } from '@angular/core';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PLATFORM_ID } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [NgIf, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  isSidebarOpen = true;
  isMobile = false;

  pageTitle = 'Dashboard';
  pageSubtitle = 'Welcome back';

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit() {
    this.checkScreenSize();
    this.updateHeaderTexts();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.updateHeaderTexts();
      });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isMobile = window.innerWidth <= 900;
    this.isSidebarOpen = !this.isMobile;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  private updateHeaderTexts() {
    let currentRoute = this.route.firstChild;
    while (currentRoute?.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    const data = currentRoute?.snapshot.data as { title?: string; subtitle?: string } | undefined;
    this.pageTitle = data?.title ?? 'Dashboard';
    this.pageSubtitle = data?.subtitle ?? 'Welcome back';
  }
}
