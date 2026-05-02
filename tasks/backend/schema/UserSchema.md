# User Schema & Identity Design (UserSchema.md)

## Objective
Define the data structure for users, admins, and their authentication states to support a secure login/register flow.

## 1. User Model Fields
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier. |
| `email` | String | Unique email address (indexed). |
| `password` | String | Hashed password storage. |
| `name` | String | Full name for personalization. |
| `phone` | String | For delivery contact. |
| `role` | Enum | `ADMIN` or `USER`. |
| `createdAt` | DateTime | Timestamp of registration. |
| `updatedAt` | DateTime | Timestamp of last profile update. |

## 2. Security Meta (Stored separately or as optional fields)
- `refreshToken`: String (Hashed, for persistent login sessions).
- `lastLogin`: DateTime.
- `isActive`: Boolean (For banning/deactivating accounts).

## 3. Relationships
- **User -> Orders:** One-to-Many (A user can have multiple orders).
- **User -> Addresses:** One-to-Many (A user can save multiple delivery addresses).

## 4. API Endpoints (Planned)
- `POST /api/auth/register`: Create a new `USER`.
- `POST /api/auth/login`: Validate credentials, issue tokens.
- `POST /api/auth/refresh`: Issue new access token using refresh token.
- `POST /api/auth/logout`: Invalidate tokens.

## Next Steps
1. [ ] Finalize these fields and get user approval.
2. [ ] Move to **Product & Ingredient Schema** planning.
