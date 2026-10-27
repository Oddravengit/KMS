# Day 01 frontend foundation

## Run locally

Use Node.js 22.13+ (or Node 24) and npm. From the repository root:

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

The Dashboard overview was then created in Figma before the matching folder styling was updated. Figma now contains reusable `Dashboard / Overview Header`, `Dashboard / KPI Card`, `Dashboard / Order Volume Panel`, `Dashboard / Production Status Panel`, `Dashboard / Activity Row`, and `Dashboard / Recent Activity Panel` component masters. The Dashboard route uses their instances for the overview header, four KPI cards, two analytics panels, and recent activity rows. The folder mirrors this composition with the same demo data and responsive full-width geometry; metric cards, analytics panels, and activity content expand to the available workspace width while preserving their gaps.

## Semantic variable bindings — 2026-10-21

The Dashboard Figma masters and their instances use the existing `ODD RAVEN / SEMANTIC COLORS` variables for surfaces, borders, primary/secondary text, actions, selected backgrounds, and success/info/warning states. Existing variables now include WEB code syntax mappings such as `var(--bg-surface)`, `var(--action-primary)`, and `var(--status-success)`. The frontend CSS exposes the same semantic aliases so token corrections can flow through the design and code consistently.

The Dashboard masters also use auto-layout shells: vertical KPI/panel structures and a horizontal activity-row structure. Chart internals remain intentionally positioned inside their responsive panel shells, while repeated activity rows remain instances of the Activity Row master. Fixed component slots were restored after enabling auto-layout, and the composed Dashboard passed a final 1440 × 900 Figma screenshot check.

## Design-first workflow

For every future design update, use the approved Figma file as the first implementation surface:

1. Create or update the Figma components, variants, prototype interactions, and animations.
2. Validate the Figma structure and visual result against the approved screen.
3. Reflect the validated design in `apps/web` using the existing component and token boundaries.
4. Run frontend checks and record the Figma and code changes together in the handoff.

Do not implement a new visual or interaction in the frontend first and backfill Figma later.

## V1 component implementation rules — 2026-10-23

The frontend worker follows the ODD RAVEN ERP V1 component specification. Work is scoped to the active business role, with Super Admin foundations first. Presentational components remain typed and reusable; feature API calls, permission checks, and business state stay at the feature boundary. Each delivered component must cover its required states, keyboard and screen-reader behavior, responsive layout, reduced-motion behavior, theme contrast, tests, and production validation. Demo content and Figma interactions remain explicitly non-backend functionality until an agreed API contract exists.

The current audit confirms Component 001 — Master Sidebar (`34:259`) is implemented in `apps/web/src/components/Sidebar.tsx` with the approved 280ms indicator, expanded/collapsed behavior, route awareness, and Light/Dark/Glass themes. Component 002 — Desktop Topbar now has reusable `Navigation / Topbar Icon Button` variants in Figma (`465:1831`) for Quick Action (`465:1824`) and Messages (`465:1827`), using the existing semantic surface, border, and action variables across Light, Dark, and Glass modes. Instances were placed in both approved topbar variants. The frontend mirror is `apps/web/src/components/TopbarIconButton.tsx`; the controls remain demo navigation/status behavior until backend contracts exist.

Components 005–007 are now mirrored in the web component library after Figma validation: `Breadcrumb` (`Breadcrumb.tsx`), `PageHeader` (`PageHeader.tsx`), and `DashboardSectionContainer` (`DashboardSectionContainer.tsx`). They provide typed props, responsive layout, accessible navigation and headings, and loading/empty/error section states. `LibraryComponents.test.tsx` covers the business-facing rendering states; no API dependencies are connected.


## Day 02 frontend bootstrap — 2026-10-27

Assignment: [ODD RAVEN Frontend Daily — Day 2](https://chatgpt.com/share/6ae0729e-7778-83e8-8c9d-adbe64d4d304).
Continue in day order. Day 6 route guards and authentication are outside this delivery.

The repository already had React, TypeScript, Vite, React Router, Vitest and the approved Super Admin shell. `develop` contained the backend foundation; frontend integration remained in open PR #3 and newer visual work in open PR #1. Branch `feat/day02-frontend-bootstrap` includes both existing frontend histories, with the newer shell, Dashboard and reusable components preserved. No `services/api/` files were changed. The PR targets `develop` and includes those unmerged frontend dependencies.

Missing Day 2 deliverables are now supplied:

- `/login` renders a clearly labeled placeholder, with no credential form or authentication behavior.
- `/dashboard` renders the existing demo Dashboard and selects its sidebar destination; `/` remains supported.
- Unknown paths render a Not Found heading and a Dashboard return link.
- `src/pages/` holds the route-level components, and `src/services/api.ts` holds the API URL configuration. Existing component/theme boundaries remain intact; empty abstraction directories were not introduced.
- ESLint checks JavaScript, TypeScript and React hook rules. Root and web workspace scripts expose `lint` and `typecheck`; `check` remains compatible. CI runs lint, type checking, tests and build.
- `apps/web/.env.example` documents `VITE_API_BASE_URL`. Default `/api/v1` uses the existing Vite `/api` proxy to `http://127.0.0.1:8000`. An explicit backend origin requires backend CORS configuration. Environment values are public build-time configuration, never secrets.
- Existing connection diagnostics use the configured API prefix for `health` and `ready`. No fake endpoints or successful connection states were added.
- Vitest was upgraded to 5.0.5 or later to resolve the installed test tooling advisories. Node.js 22.13+ or Node 24 is required for the current tooling.

Run from the repository root:

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run dev
```

For a forwarded Codespaces preview, use `npm run dev -w @kms/web -- --host 0.0.0.0`. The Vite configuration preserves the configured Codespaces host allowlist. A production server must rewrite `/login`, `/dashboard`, and other application routes to `index.html`.

The backend source already defines `/api/v1/health` and `/api/v1/ready`; live connectivity is not claimed because no backend was running for this verification. Authentication remains unimplemented and the Super Admin identity remains demo content. Existing Light/Dark/Glass styling and 280ms sidebar motion are preserved; the placeholder routes reuse the established workspace-card pattern.

Validation: `npm ci`, `npm run lint` (zero warnings), `npm run typecheck`, all 16 tests across four files, production build, and whitespace checks passed. npm audit reported zero vulnerabilities. Chromium verified `/login`, `/dashboard` with its active navigation link, and an unknown route; Light/Dark/Glass switched correctly with no page errors. Additional Login captures were checked at 1440 × 600 and 390 × 844. The existing desktop minimum width of 650 px still requires horizontal scrolling on narrow screens, as documented above. Screenshots from this run are in `/tmp/kms-day02-preview/` in the working environment.

npm's install policy prints an advisory that esbuild's postinstall script is not listed in `allowScripts`; the build passed without changing that policy. This advisory is separate from ESLint, which passed with zero warnings.

## Day 03 frontend–backend smoke checks — 2026-10-27

Continues Day 2 in schedule order, using the Day 3 assignment in the shared frontend daily plan. Branch `feat/day03-frontend-health-smoke` is stacked on `feat/day02-frontend-bootstrap` (PR #5), which already combines the integration and newer design histories from PR #3 and PR #1. Its PR targets the Day 2 branch so the integration corrections can be reviewed separately. No backend-owned source files changed.

Restored the integration branch's development-only `ConnectionStatus` display below the Appearance controls, including its collapsed-sidebar hiding behavior. During Day 2 reconciliation the component remained available but was not mounted in the newer sidebar. Existing shell styling, theme controls and 280ms selection motion are preserved. On shorter viewports, the sidebar scrolls to reach Appearance and diagnostics.

API health now verifies `status`, `service` and `version`; database readiness requires both `status: ok` and `database: ok`. Invalid responses cannot imply success. The checks update independently, time out after four seconds, refresh every 15 seconds, and abort pending requests on unmount. Offline API yields Unavailable; database reachability that cannot be verified yields Unknown. A reachable readiness endpoint reporting a failed database yields Unavailable. These are development diagnostics; the production bundle excludes the component and its polling.

Added malformed-response, service-identity, contradictory-readiness, pending-database, timeout, recovery and polling-cleanup tests. Shell tests explicitly mock offline connections to stay independent of running services.

### Repeatable API smoke command

Start the existing backend on loopback port 8000 and Vite on port 5173, then run from the root:

```sh
npm run smoke:api
```

The command checks HTTP status and the exact existing response contract for health and readiness directly and through Vite. `KMS_SMOKE_BACKEND_URL` and `KMS_SMOKE_FRONTEND_URL` can override the two origins. To verify the negative readiness contract, stop only your disposable development database and run:

```sh
npm run smoke:api -- --database-unavailable
```

Restart the disposable database afterward. Never run outage tests against a shared or production database. The smoke command does not start, stop or mock any service and intentionally requires a running backend.

### Verified evidence

- Clean `npm ci`, ESLint, TypeScript, 23 tests in four files, production build and whitespace checks passed. npm audit reported zero vulnerabilities. The existing esbuild install-policy advisory remains as recorded under Day 2.
- Used the existing FastAPI implementation unchanged with dependencies from `backend/requirements-dev.lock` in `/tmp/kms-day03-venv`.
- Used a dedicated PostgreSQL 16 container, `kms-day03-smoke-db`, bound only to `127.0.0.1:55433`, with a disposable database and the existing Alembic baseline. No shared database was stopped. No port-visibility settings were changed.
- Online: direct API and Vite proxy health/readiness both returned HTTP 200 with their expected JSON contracts. `npm run smoke:api` passed all four assertions.
- Database stopped: health stayed HTTP 200 and readiness returned HTTP 503, both directly and through Vite. The negative smoke command passed all four assertions. Browser diagnostics independently displayed API Connected and Database Unavailable, then automatically recovered after restart.
- Backend stopped: browser displayed API Unavailable and Database Unknown while the Dashboard remained usable. Restarting FastAPI recovered both indicators on the next poll. Expected HTTP failures during this deliberate outage did not cause page exceptions.
- Chromium checked all 11 navigation destinations and active states, collapse/expand, Light/Dark/Glass at 1440 × 900, and keyboard access to Settings at 1440 × 600. No page errors occurred. Screenshots are in `/tmp/kms-day03-preview/`, including online themes, database outage, full backend outage, recovery and short-desktop captures.
- Production JavaScript was checked to confirm the diagnostic label and API health service marker are absent, so production does not run this development polling.

These checks verify local development integration, not authentication or business workflows. The Dashboard still displays demo data. Day 4 remains separate work.
