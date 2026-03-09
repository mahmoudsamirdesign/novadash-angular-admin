# Packaging Notes

Use this checklist when preparing the template for resale or delivery.

## Packaging Checklist

- Run `npm install` and `npm run build` to verify the build.
- Remove `node_modules/` before shipping.
- Keep `package.json`, `package-lock.json`, `angular.json`, and `src/`.
- Include `docs/` and `LICENSE.md`.
- Optionally include the `dist/` build output if you want to provide a compiled preview.

## Demo Content Cleanup

Mock data lives in `src/app/core/services/`. Replace or remove demo entries to align with your buyer's brand. The landing page and theme tokens are the most visible branding touch points.

## License Placeholder

Update `LICENSE.md` with your final license terms before distribution.

## Role-Based Access

Access control is implemented with `authGuard` and `roleGuard`. These should be kept as scaffolding until a real auth system is connected.
