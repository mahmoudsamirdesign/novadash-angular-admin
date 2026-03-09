import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./modules/marketing/pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./modules/auth/pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./modules/auth/pages/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./modules/auth/pages/forgot-password/forgot-password.component').then(
            m => m.ForgotPasswordComponent
          )
      }
    ]
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    canMatch: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/dashboard/pages/dashboard/dashboard.component').then(
            m => m.DashboardComponent
          ),
        data: {
          title: 'Dashboard',
          subtitle: 'Welcome back'
        }
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./modules/users/pages/users/users.component').then(m => m.UsersComponent),
        data: {
          title: 'Users',
          subtitle: 'Manage your team members'
        }
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./modules/analytics/pages/analytics/analytics.component').then(
            m => m.AnalyticsComponent
          ),
        data: {
          title: 'Analytics',
          subtitle: 'Track performance and growth'
        }
      },
      {
        path: 'billing',
        canMatch: [roleGuard(['owner', 'admin'])],
        loadComponent: () =>
          import('./modules/billing/pages/billing/billing.component').then(
            m => m.BillingComponent
          ),
        data: {
          title: 'Billing',
          subtitle: 'Manage subscription and invoices'
        }
      },
      {
        path: 'team',
        canMatch: [roleGuard(['owner', 'admin'])],
        loadComponent: () =>
          import('./modules/team/pages/team/team.component').then(m => m.TeamComponent),
        data: {
          title: 'Team',
          subtitle: 'Roles, invites, and access controls'
        }
      },
      {
        path: 'activity',
        loadComponent: () =>
          import('./modules/activity/pages/activity/activity.component').then(
            m => m.ActivityComponent
          ),
        data: {
          title: 'Activity',
          subtitle: 'Audit events and product changes'
        }
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./modules/settings/pages/settings/settings.component').then(
            m => m.SettingsComponent
          ),
        data: {
          title: 'Settings',
          subtitle: 'Manage your preferences'
        }
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
