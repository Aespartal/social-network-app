# AGENTS.md

Guidelines for agentic coding assistants working on this social network application.

## Project Overview

Full-stack Twitter-style social network with React + TypeScript + Vite + Material-UI (frontend) and Fastify + TypeScript + DDD (backend), PostgreSQL + Prisma ORM, JWT + Google OAuth authentication, and Vitest testing.

## Commands

### Development
```bash
npm run dev                    # Start frontend + backend
npm run dev:frontend          # Frontend only
npm run dev:backend           # Backend only
```

### Build
```bash
npm run build                 # Build all packages
npm run build:frontend        # Frontend only
npm run build:backend         # Backend only
npm run build:shared          # Shared types package
```

### Testing
```bash
npm run test                  # Run all tests
cd frontend; npm test       # Frontend tests
cd backend; npm test        # Backend tests
cd backend; dotenv -e .env.test -- vitest run tests/integration/posts.routes.test.ts  # Single test file
cd backend; dotenv -e .env.test -- vitest tests/integration/posts.routes.test.ts      # Watch single test
cd backend; npm run test:ui         # Test UI
cd backend; npm run test:coverage   # Coverage report
cd backend && npm run test:e2e        # E2E tests
```

### Linting & Formatting
```bash
npm run lint           # Lint all
npm run lint:fix       # Auto-fix all
npm run format         # Format all files
npm run typecheck      # Type check all
```

### Database (Backend)
```bash
cd backend
npm run prisma:generate          # Generate Prisma client
npm run prisma:migrate            # Run migrations (dev)
npm run prisma:migrate:test       # Run migrations (test env)
npm run prisma:studio             # Open Prisma Studio
npm run prisma:studio:test        # Open test database in Studio
```

## Code Style Guidelines

### Formatting (Prettier)
No semicolons, single quotes, trailing commas (ES5+), 80 char line width, 2 space indentation, arrow functions avoid parens (single param), JSX single quotes, no bracket same line, quote props as-needed.

### TypeScript
Strict mode enabled, no implicit any, no unused locals/parameters, no unchecked indexed access, no fallthrough cases, no implicit returns.

### Import Organization
External libraries → Internal modules (@ aliases) → Type imports (import type {...}) → Named before default exports:
```typescript
import React from 'react'
import axios from 'axios'
import type { FastifyInstance } from 'fastify'
import { API_ENDPOINTS } from '@/constants'
import { authService } from '@/services'
import type { User } from '@/types'
```

### Path Aliases
**Frontend** (@/): components, pages, hooks, services, types, utils, contexts
**Backend** (@/): routes, controllers, services, models, middleware, types, utils, config, schemas, plugins, shared, lib, modules, generated

### Naming Conventions
Variables/Functions: camelCase (getUserData)
Components/Types: PascalCase (UserCard, AuthService)
Constants: UPPER_SNAKE_CASE (API_BASE_URL)
Private: _ prefix (_internalState)
Files: PascalCase components, lowercase-with-hyphens utils, .test.ts/.spec.ts

### Backend Architecture (DDD)
```
src/modules/{module-name}/
├── domain/ (entities, value-objects, repositories, services, errors)
├── application/ (use-cases, queries, commands, dto)
└── infrastructure/ (controllers, repositories, services, schemas, mappers)
```

### Error Handling
**Frontend**: try-catch async ops, ApiError typing, ERROR_MESSAGES constants, set/clear error state
**Backend**: domain/errors/ custom errors, HTTP status codes, proper logging

### React/JSX
Functional components + hooks, explicit React import, TS interfaces for props, destructured props, MUI sx prop styling, explicit loading/error states

### Testing
tests/ directory (backend) or co-located (frontend), descriptive names "should do X when Y", describe blocks, beforeAll/afterAll setup, backend uses dotenv-cli .env.test, clean DB state

### ESLint
Unused vars error (prefix _ to ignore), @typescript-eslint/no-explicit-any warn, no-var, prefer-const, === eqeqeq, curly braces always, no-duplicate-imports

### Comments
Spanish language, JSDoc for complex functions, concise/relevant, no obvious code comments

### Constants
constants/index.ts grouped objects, `as const` immutables, named exports

### API Calls (Frontend)
services/axiosInstance.ts, async methods in exported objects, ApiResponse<T> wrapper, error handling

### Environment Variables
Frontend: import.meta.env.VITE_*, Backend: process.env with --env-file or dotenv-cli, config/env.ts types, no .env commits

### Prisma (Backend)
prisma:generate after schema changes, src/generated/prisma client, prisma/schema.prisma, @prisma/client types

### Material-UI (Frontend)
sx prop styling, MUI patterns, theme constants, responsive breakpoints

### Git Hooks
Husky pre-commit hooks, lint-staged on staged files, tests must pass

## Important Notes

Node.js >=18.0.0, npm >=9.0.0, PostgreSQL required, separate test DB (.env.test), shared package changes require rebuild all.

**Before committing**: npm run typecheck && npm run lint && npm run test && npm run format
