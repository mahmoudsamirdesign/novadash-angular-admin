# Theming and Customization

This template uses CSS variables in `src/styles.scss` for consistent theming across light and dark modes.

## Theme Tokens

Primary tokens used across UI components
- `--color-bg`, `--color-surface`, `--color-surface-2`
- `--color-text`, `--color-muted`
- `--color-primary`, `--color-success`, `--color-warning`, `--color-danger`
- `--color-border`, `--color-border-subtle`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- `--font-display`, `--font-body`

## Light and Dark Mode

Dark mode is enabled by setting `data-theme="dark"` on the root element. The `ThemeService` toggles this state.

Example toggle usage
```ts
constructor(private themeService: ThemeService) {}

toggleTheme() {
  this.themeService.toggle();
}
```

## Typography

Fonts are defined in `src/styles.scss` using `--font-display` and `--font-body`. Update these variables to change the entire template typography in one place.

## Component Overrides

Component-level overrides are best placed in the component SCSS files.

Example
```scss
.billing-page .plan-card {
  border-radius: 18px;
}
```

## Brand Customization Checklist

- Update primary color tokens in `src/styles.scss`.
- Replace brand name and logo in `src/app/modules/marketing/pages/landing/landing.component.html`.
- Review mock data in `src/app/core/services/` for brand references.
