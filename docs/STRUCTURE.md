# Project Structure

This template is organized around standalone components and feature modules (page groups). Mock data and shared UI live in core and shared respectively.

## Tree
```text
.
├─ angular.json
├─ package.json
├─ src/
│  ├─ app/
│  │  ├─ app.routes.ts
│  │  ├─ app.config.ts
│  │  ├─ core/
│  │  │  ├─ guards/        auth and role guards
│  │  │  ├─ models/        typed entities and table models
│  │  │  ├─ services/      mock data services, theme, toasts
│  │  │  └─ utils/         shared table query utilities
│  │  ├─ layout/           header, sidebar, layout shell
│  │  ├─ modules/
│  │  │  ├─ marketing/     landing page
│  │  │  ├─ auth/          login, register, forgot password
│  │  │  ├─ dashboard/     dashboard view
│  │  │  ├─ users/         users table and filters
│  │  │  ├─ analytics/     analytics charts and insights
│  │  │  ├─ billing/       subscription and invoices
│  │  │  ├─ team/          member management and invites
│  │  │  ├─ activity/      audit log feed
│  │  │  └─ settings/      preferences and security toggles
│  │  └─ shared/
│  │     └─ ui/            reusable UI components
│  ├─ styles.scss          theme tokens and global styles
│  └─ index.html           app shell
└─ docs/
   ├─ STRUCTURE.md
   ├─ THEMING.md
   ├─ COMPONENTS.md
   └─ PACKAGING.md
```

## Key Conventions

- Standalone components are used for pages and shared UI.
- Page data is mocked in `src/app/core/services/` and typed in `src/app/core/models/`.
- Route metadata (title/subtitle) is defined in `src/app/app.routes.ts`.
- Shared UI components live in `src/app/shared/ui/` and are designed to be reused across pages.
