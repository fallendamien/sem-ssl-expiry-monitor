# S.E.M Phase 1 Scaffold Plan

## Goal
Bootstrap S.E.M as a Vue 3 + TypeScript + Vite app with Tailwind CSS v4, PrimeVue 4, Pinia, and Vue Router, without overwriting the existing AI/workflow setup files already present in the repo.

## Tasks
- [ ] Scaffold a fresh Vue 3 + TypeScript + Vite app in a temporary folder (for example `.tmp/vite-scaffold`) and copy only the app/runtime files into the project root. Verify: existing files like `AGENTS.md`, `CLAUDE.md`, `NEXT.md`, `ROADMAP.md`, `STATE.json`, `.agents/`, and `.claude/` remain intact.
- [ ] Install and configure the app dependencies for Vue 3, Tailwind CSS v4, PrimeVue 4, Pinia, and Vue Router. Verify: `package.json` contains the expected dependencies and scripts for `dev`, `build`, `preview`, `type-check`, and `lint`.
- [ ] Configure the app entrypoint so `src/main.ts` wires up Tailwind, PrimeVue, Pinia, and Vue Router. Verify: app bootstraps cleanly and imports the global CSS entry correctly.
- [ ] Add the initial router setup with a dashboard route at `/` and create a starter dashboard shell for SSL expiry monitoring. Verify: the default route renders the dashboard view instead of the Vite starter screen.
- [ ] Add a typed Pinia store placeholder for domain list state and future SSL monitoring logic. Verify: the store exposes clear starter state/actions and is used or ready to be used by the dashboard.
- [ ] Keep Vite dev server on port `3000`. Verify: `vite.config.ts` is configured for port `3000`.
- [ ] Run verification in this order: `npm install`, `npm run type-check`, `npm run lint`, `npm run build`, `npm run dev`. Verify: type-check, lint, and build pass before claiming completion.
- [ ] After implementation, ask the user whether they want browser verification or will test manually, and ask before updating `NEXT.md` or `STATE.json`. Verify: no silent breadcrumb update happens.

## Done When
- [ ] The repo contains a working Vue 3 + TS + Vite scaffold with Tailwind v4, PrimeVue 4, Pinia, and Vue Router.
- [ ] The app runs on `localhost:3000`.
- [ ] Existing Antigravity/Codex/Claude bootstrap files and symlinks are preserved.
- [ ] Verification commands pass and the UI is ready for the next phase of SSL monitoring work.

## Notes
- Firebase is optional and should not be added in this phase.
- Keep the existing `.agents/*` legacy symlinks because they are still useful for Codex/agent visibility.
- Keep Claude slash commands symlinked to Antigravity TSOT global workflows.
