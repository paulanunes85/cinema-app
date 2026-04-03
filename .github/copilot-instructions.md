# Production Bible App — Copilot Instructions

## Project Overview

This is a collaborative web and mobile platform for audiovisual pre-production management.
It works as an interactive production bible where departments track objectives, collaborate,
and maintain creative alignment with the director's vision.

## Tech Stack

- **Monorepo**: Turborepo with npm workspaces
- **Web**: React 19 + Vite + TypeScript (`apps/web/`)
- **Mobile**: React Native + Expo managed (`apps/mobile/`)
- **Backend**: NestJS + TypeScript (`server/`)
- **Database**: PostgreSQL + Prisma ORM (`server/prisma/`)
- **Real-time**: Socket.IO
- **Auth**: Google SSO + Apple ID via Passport.js
- **Shared packages**: `packages/shared/`, `packages/ui/`, `packages/api-client/`

## Code Conventions

- Use TypeScript for all code. No `any` types.
- Use functional React components with hooks. No class components.
- Use named exports, not default exports.
- Backend follows NestJS module pattern: `module → controller → service`
- Database types/enums are defined in `packages/shared/src/types/enums.ts`
- Shared constants (colors, departments) are in `packages/shared/src/constants/`

## Design System — Color Palette (Spec §15.2)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#FFFFFF` | Page background |
| `--bg-secondary` | `#F7F7F9` | Section/card background |
| `--color-primary` | `#4A6CF7` | Buttons, links, primary actions |
| `--color-in-progress` | `#F2C94C` | In Progress status |
| `--color-completed` | `#6FCF97` | Completed status |
| `--color-comments` | `#BDB2FF` | Comments, notes areas |
| `--text-primary` | `#1F2937` | Main text |
| `--text-secondary` | `#6B7280` | Secondary text, labels |

## Accessibility (CRITICAL)

- Status indicators must ALWAYS use icon + text + color, **never color alone** (FR-UI-05)
- All interactive elements must be keyboard accessible
- Color contrast must meet WCAG AA (4.5:1 minimum)
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<section>`)

## Key Domain Concepts

- **Project**: A single audiovisual production
- **Department**: Area of the production (Cinematography, Art, Sound, Costume, Production Design)
- **Objective**: A concrete pre-production deliverable (the core unit of the app)
- **Objective Status**: NOT_STARTED → IN_PROGRESS → COMPLETED
- **Supervision Mode**: Director and AD can see all departments and progress (FR-SM-01)

## Testing

- Use Vitest for unit tests
- Use Playwright for E2E web tests
- Use React Testing Library for component tests
- Test files use `.test.ts` or `.test.tsx` suffix
