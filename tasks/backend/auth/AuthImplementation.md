# Auth Implementation Details (AuthImplementation.md)

## Decisions Recap
- **Algorithm:** BCrypt (Standard & Reliable)
- **Flow:** Simple Registration (Email + Password)
- **Sessions:** Standard (15m Access, 7d Refresh)
- **Security:** HttpOnly Cookies for Refresh Tokens, JWT for Access.

## 1. API Endpoints

### `POST /api/auth/register`
- **Request:** `{ email, password }`
- **Logic:**
    - Check if email already exists.
    - Hash password with BCrypt (12 rounds).
    - Create user with default role `USER`.
- **Response:** `201 Created`

### `POST /api/auth/login`
- **Request:** `{ email, password }`
- **Logic:**
    - Find user by email.
    - Verify password.
    - Generate `AccessToken` (short-lived) and `RefreshToken` (long-lived).
    - Save `RefreshToken` hash to DB (optional but more secure).
    - Set `RefreshToken` in an **HttpOnly, Secure, SameSite=Strict** cookie.
- **Response:** `{ accessToken, user: { id, email, role, name } }`

### `POST /api/auth/refresh`
- **Request:** Cookie (automatic)
- **Logic:**
    - Verify Refresh Token from cookie.
    - Verify against DB hash.
    - Issue new `AccessToken`.
- **Response:** `{ accessToken }`

### `POST /api/auth/logout`
- **Logic:**
    - Clear the Refresh Token cookie.
    - Nullify Refresh Token in DB.
- **Response:** `200 OK`

## 2. Validation Rules (Zod)
- **Email:** Must be a valid email string.
- **Password:** Minimum 8 characters, at least 1 number, 1 special character (optional but recommended).

## 3. Middleware Security
- **`protect`:** Validates Access Token in headers.
- **`restrictTo('ADMIN')`:** Checks user role from JWT payload.

## Next Steps
1. [ ] Finalize these details and get user approval.
2. [ ] Begin **Node.js Express Server** setup.
3. [ ] Implement the Register & Login logic.
