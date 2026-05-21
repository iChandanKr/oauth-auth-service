# Google OAuth2 Integration Plan (oauth-auth-service)

This document defines the implementation plan for adding Google OAuth2 authentication to this project.

## 1) Current Project Snapshot

- `server`: Express + TypeScript + Sequelize + Postgres
- `client`: Vite + React (currently boilerplate UI)
- Current auth API:
  - `POST /api/auth/register`
  - `POST /api/auth/login`

## 2) Target Outcome

Add "Sign in with Google" so users can authenticate with Google and receive a server-issued session token (JWT).

Primary flow for this project:
- Frontend receives Google `id_token` using Google Identity Services (GIS)
- Frontend sends `id_token` to backend
- Backend verifies token with Google
- Backend finds or creates user
- Backend issues app JWT and returns normalized user payload

## 3) Architecture Changes

### Backend

1. Add Google token verification service
- Use `google-auth-library`
- Validate:
  - token signature
  - token audience (`GOOGLE_CLIENT_ID`)
  - issuer (`accounts.google.com`)
  - expiry

2. Add JWT issuance
- Use `jsonwebtoken`
- Sign app token with `JWT_SECRET`
- Include claims: `sub` (internal user id), `email`, `provider`

3. Extend user model
- Add columns:
  - `provider` (`local` or `google`)
  - `providerId` (Google `sub`)
  - `avatarUrl` (optional)
- Keep `email` unique
- Make password nullable for Google-only users

4. Add repository methods
- `findUserByProvider(provider, providerId)`
- `findUserByEmail(email)`
- `createGoogleUser(payload)`
- `linkProviderToExistingUser(...)` (optional, phase-2)

5. Add service/controller endpoints
- `POST /api/auth/google`
  - body: `{ idToken: string }`
  - response: `{ accessToken, user }`

6. Improve error handling
- Replace generic `Error` with `AppError` in auth service
- Map expected failures to 4xx codes

### Frontend

1. Add Google Identity Services script
- Render Google Sign-In button in `client/src/App.tsx` (or a dedicated auth page)

2. On Google success
- Capture credential (`id_token`)
- POST to backend `/api/auth/google`
- Store returned JWT (prefer HttpOnly cookie in production; localStorage only for quick dev)

3. Add minimal auth state
- Logged-in user rendering
- Logout behavior (clear token)

## 4) Environment Variables

Add/update the following:

### Root `.env` (for docker compose/server)
- `GOOGLE_CLIENT_ID=<google-web-client-id>`
- `JWT_SECRET=<strong-random-secret>`
- `JWT_EXPIRES_IN=1d`
- `CLIENT_URL=http://localhost:5173`

### Client `.env` (if using Vite env)
- `VITE_GOOGLE_CLIENT_ID=<google-web-client-id>`
- `VITE_API_BASE_URL=http://localhost:3000/api`

## 5) API Contract (Planned)

### `POST /api/auth/google`

Request:
```json
{
  "idToken": "<google-id-token>"
}
```

Success `200`:
```json
{
  "accessToken": "<jwt>",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "User Name",
    "provider": "google",
    "avatarUrl": "https://..."
  }
}
```

Failure examples:
- `400`: missing/invalid token payload
- `401`: Google token verification failed
- `409`: account conflict/linking required

## 6) Concrete File-Level Plan

### Server changes
- `server/package.json`
  - add deps: `google-auth-library`, `jsonwebtoken`
  - add types: `@types/jsonwebtoken`

- `server/src/models/User.ts`
  - add provider-related fields
  - allow nullable `password` for oauth users

- `server/src/repositories/AuthRepo.ts`
  - add provider lookup/create methods

- `server/src/services/AuthService.ts`
  - add `googleLogin(idToken)`
  - issue app JWT

- `server/src/controllers/AuthController.ts`
  - add `googleLogin` controller

- `server/src/api/auth.api.ts`
  - register `google` endpoint

- `server/src/utils/AppError.ts`
  - keep as standard operational error source

### Client changes
- `client/src/App.tsx`
  - add Google button and callback handling
  - call backend `/api/auth/google`

## 7) Security Checklist

- Never trust client profile data directly; trust only verified token payload
- Validate Google token `aud`, `iss`, `exp`
- Use strong `JWT_SECRET`
- Prefer HttpOnly + Secure cookies in production
- Add CORS policy for exact client origin
- Do not log raw tokens

## 8) Testing Plan

1. Unit tests (server)
- token verification wrapper
- user upsert flow
- JWT issuance

2. Integration tests
- `POST /api/auth/google` happy path
- invalid token
- existing email with local account

3. Manual checks
- first-time Google sign-in creates user
- repeated sign-in reuses same user
- app token works with protected route (phase-2)

## 9) Rollout Phases

1. Phase 1 (now)
- Backend Google login endpoint + frontend Google sign-in button
- Return JWT and user payload

2. Phase 2
- Protected routes + auth middleware (`Bearer` JWT)
- Account linking strategy (`local` <-> `google`)

3. Phase 3
- Refresh tokens, revocation, HttpOnly cookie strategy, CSRF protection

## 10) Definition of Done

- Google sign-in works locally via Docker
- `POST /api/auth/google` implemented with verification + JWT issue
- User record persisted/reused correctly
- Error responses are consistent and typed
- Basic frontend auth UX works end-to-end
