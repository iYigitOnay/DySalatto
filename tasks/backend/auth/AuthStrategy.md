# Authentication & Role Strategy (AuthStrategy.md)

## Decisions
- **User Scope:** Full Membership (Admins + Customers)
- **Roles:** Simple (`ADMIN`, `USER`)
- **Method:** JWT (High Security)

## Requirements

### 1. Security Enhancements
- **Password Hashing:** Use `Argon2` or `Bcrypt` with high salt rounds.
- **Refresh Token Logic:** Access tokens will be short-lived (15 mins), Refresh tokens will be stored in an `HttpOnly` cookie to prevent XSS attacks.
- **Payload Privacy:** JWT payload will contain minimum data (`userId`, `role`). No sensitive info.

### 2. User Roles
- **ADMIN:** Full access to Admin Panel, Menu CRUD, Order Management, Analytics, Logistics.
- **USER:** Access to order history, profile management, and active order tracking.

### 3. Workflow
1. **Register:** User creates an account (default role: `USER`).
2. **Login:** Server validates credentials and issues a JWT pair.
3. **Guard:** Every sensitive API endpoint will have a middleware check (`isAdmin` or `isAuthenticated`).

## Next Steps
1. [ ] Define the `User` model in `tasks/backend/schema/DatabaseSchema.md`.
2. [ ] Plan the Login/Register API endpoints.
