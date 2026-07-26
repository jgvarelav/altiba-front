# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Angular 21 application for "Altiba Conecta Lab", backed by a Strapi 5 project at the sibling path `../altiba-back`. The base architecture is in place: responsive layout (navbar/sidebar), routing per module, brand color tokens, and a fully built `home` page. `emprendimientos` is the first fully real module (auth + product CRUD against Strapi). The rest (`marketplace`, `mentorias`, `recursos`, `eventos`, `noticias`, `comunidad`, `perfil`) are still placeholder "coming soon" pages awaiting real design/content per module — check with the user before assuming a module's scope beyond its placeholder.

## Backend (Strapi)

- `environments/environment.ts` holds `apiUrl` (`http://localhost:1337` in dev). The Strapi project lives in `../altiba-back` — run it with `npm run develop` there (Postgres must be reachable per its `.env`).
- Auth is Strapi's built-in Users & Permissions plugin (`/api/auth/local`, `/api/auth/local/register` — no custom auth code on the backend). `core/services/auth.ts` wraps it, persists `jwt`/`user` in `localStorage`, and exposes `currentUser`/`isAuthenticated` signals. `core/interceptors/auth.interceptor.ts` attaches the bearer token to every request; `core/guards/auth.guard.ts` protects create/edit routes.
- The `Producto` content-type (`altiba-back/src/api/producto/`) has an `owner` relation to the Strapi user; its controller auto-sets `owner` on create and 403s update/delete for non-owners — this is backend-enforced, the Angular side doesn't need to re-check ownership beyond hiding edit/delete buttons for non-owned items.
- **Backend permissions gotcha**: Strapi requires the caller's role to have `find` permission on the *target* content-type of any relation it sets — the `owner` relation setter requires `plugin::users-permissions.user.find`, and the image upload requires `plugin::upload.content-api.upload`. Both are granted (alongside the Producto CRUD permissions) in `altiba-back/src/index.ts`'s `bootstrap()` idempotently on every boot — if you add another relation field or another upload flow, extend that bootstrap rather than clicking through the admin panel, or a fresh/reset database won't have the right permissions.
- Strapi v5 uses `documentId` (string), not the numeric `id`, for REST update/delete/detail routes — `Producto.documentId` is what route params and API calls use, matching the pattern in `features/emprendimientos/emprendimientos.routes.ts` (`:documentId/editar`).

## Commands

- `npm start` / `ng serve` — run the dev server at http://localhost:4200.
- `ng build` — production build, output to `dist/`. `npm run watch` builds in watch mode with the development configuration.
- `ng test` — run unit tests via the Vitest-based Angular test runner (`@angular/build:unit-test`).
  - Run a single spec file: `ng test -- src/app/features/home/home.component.spec.ts` (Vitest CLI args pass through after `--`).
  - There is no e2e test setup.

There is no lint script configured in `package.json` (no ESLint/`ng lint` set up). Prettier is configured (`.prettierrc`): 100 char print width, single quotes, and the Angular parser for `.html` files.

## Architecture

- **Standalone components, no NgModules, signals for local state.** Follow the existing pattern (`imports: [...]` on `@Component`, `signal`/`computed`, `input()`/`output()`) rather than NgModules or `@Input()`/`@Output()` decorators.
- **App-wide providers** live in `src/app/app.config.ts`: `provideRouter(routes, withComponentInputBinding())` (route `data`/params auto-bind to component inputs — this is how the placeholder pages get their title/icon, see below), `provideHttpClient`, `provideAnimations` (required by PrimeNG's Drawer transitions — **`@angular/animations` is a real dependency, don't remove it**), and PrimeNG with the Aura theme preset.
- **Layout** (`src/app/layout/`): `nav-items.ts` is the single source of truth for the primary nav (label/icon/route), consumed by both `layout/components/navbar` and `layout/components/sidebar`. `main-layout/main-layout.ts` is the shell (`<app-navbar/>` + `<router-outlet/>`), mounted at the root of `app.routes.ts`.
  - **Desktop (`lg:` / 1024px+)**: `Navbar` shows a horizontal menu + search + notification/mail icons + a custom profile dropdown (signal-based, closed via `shared/utils/click-outside.directive.ts`, not Angular CDK).
  - **Mobile (< `lg`)**: the horizontal menu is hidden; a hamburger button opens `Sidebar`, a PrimeNG `p-drawer` in headless mode (`layout/components/sidebar/sidebar.html`) styled with the dark-green brand tokens. `Sidebar` is instantiated inside `Navbar`'s template and opened via `@ViewChild(Sidebar)` — there's no shared "drawer open" service.
  - The navbar layout is intentionally tight (icon-only search/avatar-name below `2xl`, `text-xs`/`2xl:text-sm` nav labels) to fit all 8 menu items without horizontal scroll at common laptop widths (1280–1440px). Removing the icon-only fallbacks or widening padding will reintroduce nav overflow — verify at 1280–1440px before changing.
- **Feature/routing organization**: each module under `src/app/features/<feature>/` owns a `<feature>.routes.ts` exporting `<FEATURE>_ROUTES: Routes`, lazy-loaded from `app.routes.ts` via `loadChildren`. `home` and `auth` are the exceptions — `home` is mounted directly (not lazy) since it's the default route, and `auth.routes.ts` (`login`, `registro`) is mounted at the same `''` level as `home` rather than under its own path segment.
  - Placeholder modules all route to the shared `shared/components/coming-soon/coming-soon.ts` component, with `data: { title, icon }` supplying its `input.required` fields via `withComponentInputBinding()`. When building out a real module, replace the route's `component`/`data` with real page component(s) under that feature's own folder — don't keep piggybacking on `ComingSoon`. `emprendimientos` already did this: see `emprendimientos.routes.ts`, `services/producto-api.ts`, and `pages/{emprendimientos-list,emprendimiento-form}` for the reference pattern to copy when building out the next real module.
- **Colors**: brand tokens are defined once as Tailwind v4 `@theme` variables in `src/styles.css` (`--color-altiba-dark`, `-green`, `-gold`, `-forest`, `-cyan`, `-purple`, etc.), giving utilities like `bg-altiba-dark`/`text-altiba-green` project-wide. Add new brand colors there rather than hardcoding hex values in components.
- **Icons**: Font Awesome via `@fortawesome/angular-fontawesome`'s `<fa-icon [icon]="...">` component, importing individual icons from `@fortawesome/free-solid-svg-icons` / `free-brands-svg-icons`. There is no `fontawesome-free` CSS package installed — don't use `fa-solid fa-*` CSS classes, they won't resolve.
- **TypeScript strictness**: `tsconfig.json` enables `strict`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, plus Angular's `strictTemplates`, `strictInjectionParameters`, and `strictInputAccessModifiers`.
- **Testing**: specs use `TestBed`/`ComponentFixture` with Vitest globals. Any standalone component that imports `RouterLink`/`RouterOutlet` needs `provideRouter([])` (or real routes) in the test's `providers` array or `ActivatedRoute`/`Router` injection fails at runtime.
