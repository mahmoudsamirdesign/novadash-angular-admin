import { Component, EventEmitter, Input, Output, DestroyRef, HostListener, inject, ElementRef, ViewChild } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { UiModalComponent } from '../../shared/ui/modal/ui-modal.component';
import { UiButtonComponent } from '../../shared/ui/button/ui-button.component';
import { AuthUser } from '../../core/models/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, UiModalComponent, UiButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() isMobile = false;
  @Input() pageTitle = 'Dashboard';
  @Input() pageSubtitle = 'Welcome back';
  @Output() menuClick = new EventEmitter<void>();

  @ViewChild('notificationsMenu') notificationsMenu?: ElementRef<HTMLElement>;
  @ViewChild('profileMenu') profileMenu?: ElementRef<HTMLElement>;

  isDarkMode = false;
  notificationsOpen = false;
  profileOpen = false;
  searchOpen = false;
  searchQuery = '';
  userName = 'User';
  userRole = 'Member';
  userInitials = 'U';
  userEmail = '';

  notifications = [
    {
      title: 'Invoice INV-3241 was paid',
      meta: '1 hour ago · Billing',
      icon: 'receipt_long',
      type: 'billing'
    },
    {
      title: 'Maya accepted the team invite',
      meta: 'Today · Team',
      icon: 'group_add',
      type: 'team'
    },
    {
      title: 'New device sign-in detected',
      meta: 'Yesterday · Security',
      icon: 'security',
      type: 'security'
    },
    {
      title: 'Usage report is ready',
      meta: 'Yesterday · Analytics',
      icon: 'insights',
      type: 'insights'
    },
    {
      title: 'New feature rollout completed',
      meta: 'Mar 6 · Product',
      icon: 'rocket_launch',
      type: 'product'
    }
  ];

  searchSuggestions = [
    { label: 'Dashboard', description: 'Overview and key performance metrics', route: '/app', icon: 'dashboard' },
    { label: 'Users', description: 'Team directory and user activity', route: '/app/users', icon: 'group' },
    { label: 'Billing', description: 'Plans, invoices, and usage limits', route: '/app/billing', icon: 'credit_card' },
    { label: 'Team', description: 'Roles, invites, and access controls', route: '/app/team', icon: 'groups' },
    { label: 'Settings', description: 'Workspace preferences and security', route: '/app/settings', icon: 'settings' }
  ];

  private readonly themeService = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  constructor() {
    this.themeService.theme$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(theme => {
        this.isDarkMode = theme === 'dark';
      });

    this.authService.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => this.setUser(user));
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

  get filteredSuggestions() {
    const term = this.searchQuery.trim().toLowerCase();
    if (!term) {
      return this.searchSuggestions;
    }
    return this.searchSuggestions.filter(item =>
      `${item.label} ${item.description}`.toLowerCase().includes(term)
    );
  }

  toggleNotifications(event: MouseEvent) {
    event.stopPropagation();
    this.notificationsOpen = !this.notificationsOpen;
    if (this.notificationsOpen) {
      this.profileOpen = false;
      this.searchOpen = false;
    }
  }

  toggleProfile(event: MouseEvent) {
    event.stopPropagation();
    this.profileOpen = !this.profileOpen;
    if (this.profileOpen) {
      this.notificationsOpen = false;
      this.searchOpen = false;
    }
  }

  openSearch(event: MouseEvent) {
    event.stopPropagation();
    this.searchOpen = true;
    this.notificationsOpen = false;
    this.profileOpen = false;
  }

  closeSearch() {
    this.searchOpen = false;
    this.searchQuery = '';
  }

  navigate(route: string) {
    this.router.navigateByUrl(route);
    this.notificationsOpen = false;
    this.profileOpen = false;
    this.closeSearch();
  }

  viewAllNotifications() {
    this.navigate('/app/activity');
  }

  onProfileAction(action: 'profile' | 'settings' | 'logout') {
    this.profileOpen = false;
    if (action === 'profile') {
      this.navigate('/app/users');
      return;
    }
    if (action === 'settings') {
      this.navigate('/app/settings');
      return;
    }
    if (action === 'logout') {
      this.authService.logout();
      this.router.navigateByUrl('/');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as Node;
    if (this.notificationsOpen && !this.notificationsMenu?.nativeElement.contains(target)) {
      this.notificationsOpen = false;
    }
    if (this.profileOpen && !this.profileMenu?.nativeElement.contains(target)) {
      this.profileOpen = false;
    }
  }

  private setUser(user: AuthUser | null) {
    if (!user) {
      this.userName = 'User';
      this.userRole = 'Member';
      this.userInitials = 'U';
      this.userEmail = '';
      return;
    }
    this.userName = user.name;
    this.userRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    this.userInitials = user.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
    this.userEmail = user.email;
  }
}
