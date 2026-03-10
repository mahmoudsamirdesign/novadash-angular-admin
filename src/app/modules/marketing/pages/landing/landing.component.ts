import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiCardComponent } from '../../../../shared/ui/card/ui-card.component';
import { UiBadgeComponent } from '../../../../shared/ui/badge/ui-badge.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NgFor, RouterLink, UiButtonComponent, UiCardComponent, UiBadgeComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  features = [
    {
      title: 'Standalone Angular 19',
      description: 'Future-proof architecture with lazy loaded pages and a clean component model.'
    },
    {
      title: 'Premium UI System',
      description: 'Reusable cards, buttons, badges, and tables with consistent theming.'
    },
    {
      title: 'Dark Mode Ready',
      description: 'Theme tokens and a global toggle that keep every surface consistent.'
    }
  ];

  highlights = [
    'Responsive sidebar + mobile drawer',
    'Auth screens + marketing landing',
    'Reusable data table component',
    'Polished dashboard layout',
    'SCSS tokens for fast theming'
  ];

  pricing = [
    {
      name: 'Starter',
      price: '$49',
      description: 'For solo founders and MVP launches.',
      badge: 'Popular'
    },
    {
      name: 'Team',
      price: '$79',
      description: 'Best for product teams scaling fast.'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'White-label and dedicated support.'
    }
  ];
}
