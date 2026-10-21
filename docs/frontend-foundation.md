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

The layout targets desktop; widths below 650 px use horizontal scrolling until a mobile design is approved. Glass uses the approved local Figma wallpaper with a dim overlay and translucent, blurred surfaces. The wallpaper stays hidden in Light and Dark. The brand's plain purple square and low-opacity topbar subtitle follow that reference. Other modules and role variants remain future work.

## Validation

TypeScript strict checking, five interaction tests, and production build passed. Tests cover route preservation during collapse/expand, all themes and persistence, missing routes, New Order placeholder behavior, and keyboard search/navigation. CI repeats these checks on frontend changes.

All sixteen SVGs were validated as XML with SVG roots and expected dimensions. The original foundation could not be browser-verified. The follow-up verification below supersedes that limitation for the sidebar/Glass fixes.


## Sidebar and Glass restoration — 2026-10-21

Commit `7c54245` was absent from the available history; only the missing fixes were reproduced on `feat/day01-frontend-foundation`.

- Read-only Figma reference: desktop `1:7`, sidebar variants under `34:259`, Glass sidebar instance `178:460`, wallpaper `178:432`. Expanded/collapsed widths are 256/72 px; motion remains 280 ms ease-out.
- Brand mark, wordmark and toggle retain their DOM identity and animate position/transform without switching header layouts. Collapsed text is aria-hidden; reduced motion disables transitions.
- Wallpaper recovered as `apps/web/public/assets/figma/glass-wallpaper.png` (1672 × 941). Glass sidebar/topbar/card use translucent surfaces, blur, borders/highlights; popovers use a darker translucent background. Production contains no temporary asset URLs.
- Chromium at 1440 × 900 verified Light, Dark, expanded/collapsed Glass, wallpaper decoding, loaded image assets, intermediate logo geometry, Customers route preservation, and rapid reversals. At 1440 × 600, keyboard focus scrolled Settings into view; theme activation and Ctrl+K/Escape worked. Reduced-motion transition duration was zero. No browser page errors occurred.
- TypeScript, all five interaction tests (including stable header/toggle identity), production build and whitespace checks pass.
- Existing Dark inactive navigation remains muted; unchanged for this focused task. Business pages remain placeholders. Final visual acceptance against the approved Figma remains with the user before new screens begin.

Review workspace: https://redesigned-spoon-pgj99v5jg9wc6p9r.github.dev

Private frontend preview (port 5173): https://redesigned-spoon-pgj99v5jg9wc6p9r-5173.app.github.dev

Frontend PR: https://github.com/Oddravengit/KMS/pull/1

## Dashboard overview — 2026-10-21

The Dashboard route now includes a static overview slice from the roadmap's KPI/Statistics and Charts/Analytics areas: four KPI cards, an order-volume chart, production status bars, and a recent activity table. It is labeled `DEMO DATA` and uses local presentation data only; no backend endpoint, live metric, order action, or authentication behavior is implied.

Validation: six interaction tests, TypeScript check, production build, whitespace check, and Chromium rendering at 1440 × 900 passed. The remaining routes intentionally keep their approved placeholders until their page designs are approved.

## Route title presentation — 2026-10-21

Removed the duplicated in-page route title and description from every destination. Route context now appears only in the persistent top header; page content begins directly below it. The Dashboard overview and all placeholder routes retain their content and route behavior.

The approved Figma file was synchronized on 2026-10-21 by hiding the Page Title and Page Description layers in all 11 route preview frames. The topbar title and subtitle remain visible. Figma structural validation confirmed 22 route title/description layers hidden, followed by a 1440 × 900 screenshot check.

The Dashboard overview was then created in Figma before the matching folder styling was updated. Figma now contains reusable `Dashboard / Overview Header`, `Dashboard / KPI Card`, `Dashboard / Order Volume Panel`, `Dashboard / Production Status Panel`, `Dashboard / Activity Row`, and `Dashboard / Recent Activity Panel` component masters. The Dashboard route uses their instances for the overview header, four KPI cards, two analytics panels, and recent activity rows. The folder mirrors this composition with the same demo data and fixed panel geometry.

## Semantic variable bindings — 2026-10-21

The Dashboard Figma masters and their instances use the existing `ODD RAVEN / SEMANTIC COLORS` variables for surfaces, borders, primary/secondary text, actions, selected backgrounds, and success/info/warning states. Existing variables now include WEB code syntax mappings such as `var(--bg-surface)`, `var(--action-primary)`, and `var(--status-success)`. The frontend CSS exposes the same semantic aliases so token corrections can flow through the design and code consistently.

## Design-first workflow

For every future design update, use the approved Figma file as the first implementation surface:

1. Create or update the Figma components, variants, prototype interactions, and animations.
2. Validate the Figma structure and visual result against the approved screen.
3. Reflect the validated design in `apps/web` using the existing component and token boundaries.
4. Run frontend checks and record the Figma and code changes together in the handoff.

Do not implement a new visual or interaction in the frontend first and backfill Figma later.
