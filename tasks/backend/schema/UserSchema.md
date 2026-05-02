# User & Address Schema Design (UserSchema.md)

## Objective
Define the data structure for users, admins, and their delivery addresses to support a professional restaurant ecosystem.

## 1. User Model
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier. |
| `email` | String | Unique email address (indexed). |
| `password` | String | Argon2/Bcrypt hashed password. |
| `name` | String | Full name. |
| `phone` | String? | Primary contact number. |
| `role` | Enum | `ADMIN` or `USER`. |
| `isActive` | Boolean | Account status toggle. |

## 2. Address Model (Detailed)
| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Label (e.g., "Home", "Office"). |
| `city` | String | City of delivery. |
| `district` | String | District/County. |
| `neighborhood` | String | Local neighborhood name. |
| `street` | String | Street and avenue details. |
| `buildingNo` | String | Building number. |
| `floor` | String? | Floor number. |
| `apartmentNo` | String? | Apartment/Flat number. |
| `directions` | String? | Courier instructions (e.g., "Don't ring bell"). |

## 3. Relationships
- **User (1) <-> Address (N):** A user can save multiple addresses.
- **User (1) <-> Order (N):** Linkage for order history and tracking.

## 4. Key Logic Decisions
- **OnDelete Cascade:** If a User is deleted, their associated addresses are automatically removed.
- **Timestamping:** Every entry tracks `createdAt` and `updatedAt` for auditing.

## Next Steps
1. [x] Implement User & Address Prisma Models.
2. [ ] Plan the **Product & Ingredient Schema** (The core of the menu).
