# ShuttleTrack AI Coding Instructions

- This is an Expo React Native app. The root entry is `index.js` → `App.js`, but most of the source code lives under `src/`.
- Use the `package.json` scripts: `npm install`, `npm start`, `npm run android`, `npm run ios`, and `npm run web`.
- The current codebase is partially wired: `App.js` is still a placeholder and the real screens and service logic are in `src/`.

## Key source layout
- `src/screens/driver/` contains the driver app screens that are currently present:
  - `DriverLoginScreen.tsx` — mock login flow, currently any non-empty email/password works.
  - `DriverStatusScreen.tsx` — status toggle with `GPSIndicator` and logout.
- `src/components/GPSIndicator.tsx` is a reusable UI component for the GPS status banner.
- `src/lib/api.ts` is the shared Axios client and endpoint map for auth, tracking, and notifications.
- `src/lib/tokenStorage.ts` manages secure JWT storage via `expo-secure-store`.
- `src/lib/auth.ts` defines startup auth routing logic (`checkLoginState()` / `isLoggedIn()`).
- `src/theme/colours.ts` supplies shared `colors`, `spacing`, and `radius` design tokens.

## Project-specific patterns
- Comments with owner/ticket metadata and mock integration markers are intentionally used to show planned changes.
  - Example: in `DriverLoginScreen.tsx`, the real backend call is commented with `authApi.driverLogin(...)`.
  - Example: in `src/lib/api.ts`, the `BASE_URL` block is annotated for local/dev/production use.
- Keep API integration inside `src/lib/api.ts` and preserve the request interceptor pattern that attaches `Authorization: Bearer <token>`.
- Use `saveSession(token, role)` and `clearSession()` from `src/lib/tokenStorage.ts` for auth state.
- Use the shared theme constants from `src/theme/colours.ts` instead of hard-coded style values.

## Important implementation notes
- `src/lib/api.ts` currently points to `http://localhost:8080`; for real device testing, replace localhost with the host machine WiFi IP.
- The driver flow expects navigation keys `DriverLogin` and `DriverStatus` in the navigator.
- There is no discovered navigator or `App.tsx` wiring in the repo, so avoid assuming the app is already fully connected.
- The driver screens are TypeScript (`.tsx`), while the root Expo entry is JavaScript (`App.js` and `index.js`).

## What to avoid
- Don’t add a new auth storage mechanism; preserve `expo-secure-store` usage.
- Don’t replace the mock auth block without preserving the existing comment markers for backend integration.
- Don’t invent an unrelated app structure; follow the current `src/` folder organization.

## If you extend this codebase
- Add new screens under `src/screens/` and keep driver-specific screens in `src/screens/driver/`.
- Add shared UI pieces to `src/components/`.
- Keep API definitions and auth helpers in `src/lib/`.
- Maintain the design token usage in `src/theme/colours.ts`.

> Ask for clarification if any flow is incomplete or if you need the expected navigator structure before wiring the app.
