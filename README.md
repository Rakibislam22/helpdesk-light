# Helpdesk Lite

A lightweight helpdesk ticket management REST API built with [NestJS](https://nestjs.com/) (v12), TypeScript, and ESM.

## Tech Stack

- **Framework:** NestJS 12 (`@nestjs/platform-express`)
- **Language:** TypeScript (ESM, `nodenext` module resolution)
- **Validation:** `class-validator` & `class-transformer`
- **Testing:** Vitest & Supertest
- **Linting & Formatting:** Oxlint (`--type-aware`) & Prettier

## Project Structure

```text
helpdesk-lite/
├── api/
│   └── index.ts                           # Vercel serverless function entrypoint
├── src/
│   ├── common/
│   │   ├── request-logger.middleware.ts   # Logs incoming HTTP method and URL
│   │   └── response.interceptor.ts        # Wraps responses in { success: true, data }
│   ├── tickets/
│   │   ├── dto/
│   │   │   ├── create-ticket.dto.ts       # Validation for POST /api/tickets
│   │   │   ├── filter-ticket-query.dto.ts # Query validation for status & priority
│   │   │   └── update-ticket.dto.ts       # Validation for PATCH /api/tickets/:id
│   │   ├── guards/
│   │   │   └── staff.guard.ts             # Checks x-staff-key header for staff actions
│   │   ├── ticket.interface.ts            # Ticket TypeScript interface
│   │   ├── tickets.controller.ts          # /api/tickets route handlers
│   │   ├── tickets.module.ts              # Tickets module & middleware registration
│   │   └── tickets.service.ts             # In-memory ticket store and business logic
│   ├── app.controller.spec.ts             # Starter unit test file
│   ├── app.module.ts                      # Root application module
│   ├── app.setup.ts                       # Shared app configuration & Swagger setup
│   └── main.ts                            # Local server bootstrap
├── test/
│   └── app.e2e-spec.ts                    # Starter e2e test file
├── nest-cli.json                          # Nest CLI configuration
├── package.json                           # Dependencies and npm scripts
├── tsconfig.json                          # TypeScript configuration
├── tsconfig.build.json                    # TypeScript build configuration
├── vercel.json                            # Vercel routing configuration
├── vitest.config.ts                       # Vitest unit test configuration
└── vitest.config.e2e.ts                   # Vitest e2e test configuration
```

## Setup Guide

### Prerequisites

- **Node.js** (v20+ recommended; `@types/node` v24 is configured)
- **npm**

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables (Optional)

The application reads `PORT` from the environment and defaults to `3000` if not set.

```bash
PORT=3000
```

### 3. Run the Application

```bash
# Development
npm run start

# Watch mode (recommended for local development)
npm run start:dev

# Debug mode with watch
npm run start:debug

# Production build & run
npm run build
npm run start:prod
```

Once running, the API is available at `http://localhost:3000/api`, and interactive Swagger documentation is available at:

- **Swagger UI:** `http://localhost:3000/docs`
- **OpenAPI JSON:** `http://localhost:3000/docs-json`

### 4. Linting, Formatting & Testing

```bash
# Lint with oxlint
npm run lint

# Format with Prettier
npm run format

# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# Test coverage
npm run test:cov

# End-to-end tests
npm run test:e2e
```

## API Overview

All routes are prefixed with `/api` and validated globally using `ValidationPipe` (`whitelist: true`, `forbidNonWhitelisted: true`). Successful responses are wrapped by `ResponseInterceptor` as:

```json
{
  "success": true,
  "data": ...
}
```

### Ticket Endpoints

Tickets are stored in memory and seeded with 3 sample tickets on startup.

| Method | Endpoint | Description | Auth / Guard |
| --- | --- | --- | --- |
| `GET` | `/api/tickets` | List all tickets (optional `?status=open\|closed&priority=low\|medium\|high`) | Public |
| `GET` | `/api/tickets/:id` | Get a single ticket by numeric `id` | Public |
| `POST` | `/api/tickets` | Create a new ticket (`title`, `description`, `priority`) | Public |
| `PATCH` | `/api/tickets/:id` | Update an open ticket (`title`, `description`, `priority`) | Public |
| `PATCH` | `/api/tickets/:id/close` | Close an open ticket | `StaffGuard` |

### Staff Authorization

Closing a ticket (`PATCH /api/tickets/:id/close`) is protected by `StaffGuard`, which requires the following request header:

```text
x-staff-key: helpDesk-staff-key
```

### Example Request

```bash
# Create a ticket
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"title":"Login issue","description":"Cannot sign in","priority":"high"}'

# Close a ticket (staff only)
curl -X PATCH http://localhost:3000/api/tickets/1/close \
  -H "x-staff-key: helpDesk-staff-key"
```

## Deploying to Vercel

This project includes [api/index.ts](api/index.ts) and [vercel.json](vercel.json) for deploying as a Vercel Serverless Function:

1. Push the repository to GitHub and import it in [Vercel](https://vercel.com), or run `vercel --prod` with the Vercel CLI.
2. All routes are rewritten to `/api` via `vercel.json`, serving endpoints under `/api/tickets` and Swagger UI at `/docs` (loading Swagger UI assets from CDN when `VERCEL` is set).

> **Note:** `TicketsService` currently uses an in-memory array, so ticket data resets on serverless cold starts. For persistent storage in production, connect a database.
