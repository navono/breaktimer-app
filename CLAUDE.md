# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cross-platform Electron desktop app (BreakTimer) for managing periodic breaks. Runs as a system tray application with notifications and fullscreen overlays. Licensed GPL-3.0.

## Common Commands

```bash
npm run dev                          # Start dev (concurrently: Vite renderer + Electron main)
START_MINIMIZED=true npm run dev     # Start dev without auto-focus on reload
npm run build                        # Build both main (Webpack) and renderer (Vite)
npm run build-main                   # Build main process only
npm run build-renderer               # Build renderer process only
npm run start                        # Run production build
DEBUG_PROD=true npm run start        # Run production with DevTools open
npm run format && npm run lint && npm run typecheck  # Always run after non-trivial changes
npm run package                      # Package for current platform
```

Note: There are no automated tests in this project (`npm test` has no test files).

**Makefile**: A `Makefile` is also available with `help` target for self-documented commands (install, dev, build, package, clean, etc.).

## Architecture

Two-process Electron app with a typed IPC bridge.

### Main Process (`app/main/`)

Entry: `index.ts` → `index.dev.js` (development hot-reload wrapper)

Core modules in `lib/`:

- **`breaks.ts`** — Central break scheduler. Runs a 1-second `tick()` interval that checks working hours, system idle/lock state, and break timing. Key state: `breakTime` (next scheduled break), `havingBreak`, `postponedCount`, `idleStart`, `lockStart`, `lastCompletedBreakTime`, `currentBreakStartTime`. Idle/lock detection resets the countdown. Postpone system has a configurable limit. Break tracking measures actual break duration and resets `lastCompletedBreakTime` when a break is sufficiently long (≥ 50% of configured length).
- **`windows.ts`** — Manages two window types: regular (settings, sounds) and break windows. Break windows are created per-display (`screen.getAllDisplays()`), frameless, always-on-top. Platform-specific: macOS hides dock icon during breaks.
- **`ipc.ts`** — All IPC handlers in one file. `sendIpc()` broadcasts to all windows. Settings changes automatically rebuild the tray menu.
- **`store.ts`** — Settings via `electron-store` with a **migration system** (versioned migrations in `store.ts`). Deep-merges with defaults. `resetBreaks` flag prevents scheduling churn when settings update.
- **`tray.ts`** — Dynamic tray menu and title (macOS). Shows time until next break or time since last break (configurable via `trayTextMode`), status indicators (disabled, outside hours, idle). Supports temporary disable with timeout (e.g., 30 min, 1 hour, rest of day).
- **`notifications.ts`** — Native OS notifications.
- **`i18n.ts`** — Simple translation system. `t(key, params?)` looks up translations by key and current language. Translations are inline in this file (not separate JSON files). Supports `Language.En` and `Language.Zh`. Params use `{paramName}` placeholders.
- **`auto-launch.ts`** — OS auto-startup integration.

### Renderer Process (`app/renderer/`)

Entry: `index.tsx`

**Routing**: URL query parameter `?page=` selects the view (`settings`, `break`, `sounds`). Single `Main` component switches between them — not a router library.

Key components:

- **Break** — Notification/break UI with progress tracking. Reports actual break duration back to main via `BreakTrackingComplete`.
- **Settings** — Complex tabbed form with sub-components in `components/settings/` (one card per section: `breaks-card`, `snooze-card`, `skip-card`, `smart-breaks-card`, `working-hours`, `audio-card`, `theme-card`, `backdrop-card`, `tray-card`, `startup-card`, `language-card`, `advanced-card`). Settings changes flow: renderer → IPC → main store → tray rebuild.
- **WelcomeModal** — First-run experience.
- **Sounds** — Sound preview/playback UI.

UI stack: React 19, shadcn/ui (Radix UI primitives), Tailwind CSS v4, Framer Motion, Lucide icons.

### Preload Bridge (`app/renderer/preload.js`)

`contextBridge` exposes a minimal API — no direct `ipcRenderer` access. Methods like `invokeGetSettings`, `onBreakStart` map to specific IPC channels.

### Shared Types (`app/types/`)

- **`ipc.ts`** — 18 IPC channel string constants (no complex interfaces, just enum-like strings)
- **`settings.ts`** — 32-property settings interface with per-day working hours, enums for `NotificationType`, `SoundType`, `TrayTextMode`, and default values
- **`breaks.ts`** — `BreakTime = Moment | null`

## Key Patterns

**Break scheduling flow**: `scheduleNextBreak()` → `tick()` (1s interval) → `checkShouldHaveBreak()` → `doBreak()`. The scheduler respects working hours (per-day time ranges), system idle/lock state, and postpone limits.

**State split**: Main process owns scheduling state (when breaks happen). Renderer owns UI state (progress animation, break duration tracking). They sync via IPC events.

**Settings migration**: `store.ts` has versioned migration functions. When adding/removing/renaming settings fields, add a new migration to handle the transition.

**Sound coordination**: All audio playback goes through IPC to main process for synchronization across windows.

**Multi-display**: Break windows appear on every connected display simultaneously, positioned at the top of each screen.

## Build System

- **Main process**: Webpack 5 (`webpack.main.config.js`)
- **Renderer process**: Vite (`vite.config.ts`) with `@tailwindcss/vite` plugin
- TypeScript `skipLibCheck: true`
- Packaging: electron-builder, outputs to `release/`
- macOS packaging requires signing/notarization env vars (`APPLE_API_KEY`, `APPLE_API_KEY_ID`, `APPLE_API_ISSUER`)

## Packaging & Publishing

See `DEVELOPMENT.md` for detailed platform-specific packaging and publishing instructions.
