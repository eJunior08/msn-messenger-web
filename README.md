# Messenger

**A little nostalgia. A lot of connection.**

A responsive reimagining of MSN / Windows Live Messenger, built with React, TypeScript and Vite. Soft blue gradients, presence indicators, personal messages, familiar sounds and the irresistible nudge — together in one browser window.

[Leia em português](README.pt-BR.md)

## Run locally

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite (normally `http://127.0.0.1:5173`). The app starts with a populated demo. Use **Sign out** to see the sign-in screen; no password is collected.

## What you can do

- Open multiple conversations in tabs and keep a separate draft in each.
- Send messages with Enter, add a line with Shift+Enter, and use bold text.
- Choose emoticons, send an animated wink, or shake the conversation with a nudge.
- Hear synthesized message and nudge sounds, or mute them.
- Share and download local attachments up to 2 MB each.
- Search contacts by name, email or personal message; collapse contact sections.
- Add local contacts, manage favorites, block/unblock, and remove contacts.
- Change your display name, avatar, personal message and presence.
- Choose sky, mint or rose themes.
- Play tic-tac-toe against a local computer opponent.
- Return to saved conversations and preferences after refreshing.
- Use the contact-first mobile layout with a dedicated conversation view.

Dialogs support Escape, focus containment and focus restoration. Controls have accessible names; motion respects `prefers-reduced-motion`.

## Demo boundaries

This version is a working local demo, **not a live messaging service**. Contacts are fictional and replies/typing indicators are simulated. Added contacts do not receive invitations. The sign-in screen is a local profile selector, not authentication.

Messages, attachments and preferences are stored under `messenger-web:v1` in localStorage. Nothing is uploaded. Drafts last for the current page session. Browser storage quotas can reject a save; the interface reports the failure and retains the last saved state. Tabs/devices do not synchronize.

The music row is nostalgic sample profile content; it does not play or detect music. Voice/video calling, remote file transfers, real accounts and multiplayer games are not implemented. Clearing this site's browser data resets the demo.

## Architecture

```text
src/
  domain/          Models, repository contract, validation and game rules
  application/     Messenger use cases and serialized state persistence
  infrastructure/  Local storage, demo data, attachments and browser audio
  hooks/           React subscriptions and simulated replies
  components/      Focused UI components and dialogs
  styles/          Layout, component styles and responsive rules
  __tests__/       Jest unit and component tests
```

The dependency direction is UI → application → domain. Infrastructure implements the domain's `MessengerRepository` interface and is injected in `src/main.tsx`. Domain and application code do not import React, browser storage or a backend SDK.

Both repository operations are asynchronous. `StateStore` queues mutations, reads the latest committed snapshot for each operation, and only publishes changes after persistence succeeds. A failed write does not corrupt the snapshot or stop future writes.

Small interfaces, focused modules and dependency injection keep responsibilities separate. Every authored text file must stay within **150 lines**; the generated dependency lockfile is exempt. `AGENTS.md` and the CI line checker enforce this rule.

## Connecting a backend later

See [the backend integration guide](docs/backend-integration.md). Supabase is a possible adapter, not a dependency of this project. The current snapshot repository is suitable for the demo; a real chat backend also needs authenticated sessions, per-record writes, subscriptions and conflict handling.

## Tests and production build

```sh
npm test
npm run test:coverage
npm run check:lines
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
```

Jest covers message validation, contact rules, storage recovery, asynchronous write ordering, failure rollback, attachments, game logic and composer interaction. Playwright runs end-to-end flows in desktop Chromium and a mobile Chromium viewport. Mobile tests emulate a device; they do not claim native iOS Safari coverage.

GitHub Actions runs the line limit check, unit coverage, production build and both e2e projects. Coverage thresholds apply to domain, application and infrastructure: 80% lines/statements/functions and 70% branches. Use `npm run check` for the line check, unit tests and build together.

Production files are emitted to `dist/` and can be served by any static host. No environment variables are needed for the demo. An explicit YAML dependency override keeps the test toolchain on a patched parser.

## Contributing

Use English for code, UI copy and commits. Follow Conventional Commits, for example `feat: add contact groups` or `fix: preserve message drafts`. Add tests for behavior changes and keep backend details outside components.

This is an independent nostalgia project, not affiliated with Microsoft. MSN and Windows Live Messenger belong to their respective owners. The UI uses CSS artwork and emoji, with no extracted proprietary assets or original sound files.
