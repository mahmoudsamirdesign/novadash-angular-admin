# NovaDash — Angular 19 SaaS Admin Dashboard Template

Premium Angular 19 standalone admin dashboard template for resale. Includes landing, auth flows, reusable UI, and data-rich admin pages with consistent light/dark theming.

## Quick Start

Requirements
- Node.js 18+ (recommended 20+)
- npm 9+

Install and run
```bash
npm install
npm run start
```

Open in the browser
```text
http://localhost:4200/
```

Production build
```bash
npm run build
```

## What You Get

- Standalone Angular 19 architecture with lazy-loaded pages
- Responsive layout with sidebar and mobile drawer
- Theme tokens with polished dark mode support
- Dashboard with Chart.js integration
- Auth flows: login, register, forgot password
- Reusable UI components: buttons, cards, badges, toggles, tables, modals, toasts, empty/loading/error states
- Buyers-ready pages: dashboard, users, analytics, billing, team, activity, settings

## Project Structure

High-level map
```text
src/
  app/
    core/
      guards/        route guards and access checks
      models/        typed data models
      services/      mock data services and UI services
      utils/         shared utilities (table query)
    layout/          header, sidebar, and layout shell
    modules/         feature pages (marketing, auth, dashboard, users, billing, etc.)
    shared/          reusable UI components
  styles.scss        theme tokens and global styles
  index.html         app shell
```

Full structure guide: `docs/STRUCTURE.md`

## Theming and Customization

Theme tokens live in `src/styles.scss`. Dark mode is driven by `data-theme="dark"` on the root element (via `ThemeService`).

Customization guide: `docs/THEMING.md`

## Component Usage Examples

Common patterns and UI examples: `docs/COMPONENTS.md`

## Mock Data and Services

This template is front-end only. Mock data is centralized in `src/app/core/services/` and typed in `src/app/core/models/`. Replace those services with API calls when you connect a backend.

## Route Guards and Role-Based UX

- `authGuard` blocks access to `/app/*` when not authenticated.
- `roleGuard` restricts routes like `/app/billing` and `/app/team` to `owner` and `admin`.
- `AuthService` provides the current user and role; update the role to validate guard behavior.
- UI buttons are also role-aware (disabled or hidden) for defense-in-depth.

## Packaging and License

- Packaging checklist: `docs/PACKAGING.md`
- License placeholder: `LICENSE.md`

## Notes for Buyers

- Front-end only (no backend).
- Replace mock data and action handlers with real integrations.
- Branding can be updated from the marketing page and theme tokens.
