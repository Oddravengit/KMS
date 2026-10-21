# Day 01 frontend foundation

## Run locally

Use Node.js 22.12+ (or Node 24) and npm. From the repository root:

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
```

The frontend is in `apps/web`. Development opens at http://127.0.0.1:5173.
For network testing, override the host explicitly with `npm run dev -w @kms/web -- --host 0.0.0.0`.
A production host must rewrite non-asset routes to `index.html` for direct URL navigation.

## Approved reference

Figma: https://www.figma.com/design/7lRyfJUf0LMaQ0R9mvGPrv?node-id=1-7

The existing Figma file and root README are unchanged. Main contained only the README when work began, at `de4ec8e0531f21f73baa6c7d4cf24707487db3ea`.

- Desktop shell follows frame `1:7`: 256 px sidebar, 72 px topbar, violet selected route, 54 px navigation steps and 280 ms ease-out motion.
- Sidebar, topbar, icon renderer and theme provider are separate components.
- Eleven destinations use URL navigation, active indicators, history and direct links. Collapse keeps route state intact.
- Light/Dark/Glass use the approved semantic color collection. Preference persists locally, with a safe fallback if browser storage is unavailable.
- Approved icons were exported read-only from their source Figma nodes after temporary download URLs returned HTML error pages. Assets are local SVGs, not temporary remote URLs. Inter is bundled locally via Fontsource.
- Search filters workspace pages, with Ctrl/Cmd+K focus and Escape dismissal. Notification/profile popovers use native details/summary.
- Keyboard focus, skip link, accessible control names and reduced-motion support are included.

## Scope and handoff

This is an application shell preview. Business pages remain explicit placeholders matching the approved screen. No authentication, role authorization, order submission, backend calls, file transfers or live notifications are implemented. The visible Admin identity is demo content, not an authenticated session. New Order opens an orders placeholder and does not save an order.

Worker 2 can introduce backend services independently. Connect authenticated identity and server-authorized navigation later; hiding menu items must not substitute for server permission checks. Avoid changing shell component boundaries without coordinating with Worker 1.

The layout targets desktop; widths below 650 px use horizontal scrolling until a mobile design is approved. Glass uses a CSS gradient background; no wallpaper asset is visible in the approved light frame. The brand's plain purple square and low-opacity topbar subtitle follow that reference. Other modules and role variants remain future work.

## Validation

TypeScript strict checking, five interaction tests, and production build passed. Tests cover route preservation during collapse/expand, all themes and persistence, missing routes, New Order placeholder behavior, and keyboard search/navigation. CI repeats these checks on frontend changes.

All sixteen SVGs were validated as XML with SVG roots and expected dimensions. Browser screenshot verification was attempted, but Chromium is unavailable in this execution environment and its download returned an invalid archive. Visual rendering therefore still requires reviewer verification at 1440×900, including light/dark/glass, collapsed sidebar, scroll access at shorter heights, and asset geometry.
