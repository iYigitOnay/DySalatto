# Product & Ingredient Schema Design (ProductSchema.md)

## Objective
Define the data structure for the menu, including specialized logic for customizable (DIY) bowls and cakes with categorical ingredient rules.

## 1. Models

### A. Category
General menu categories.
- `id` (UUID)
- `name` (e.g., "Bowl", "Cake", "Drinks")
- `slug` (URL friendly name)

### B. Product
The actual items on the menu.
- `id` (UUID)
- `name`, `description`, `price` (Base price)
- `image` (URL)
- `categoryId` (Link to Category)
- `isCustomizable` (Boolean) - Trigger for DIY flow.
- `status` (Enum: `ACTIVE`, `OUT_OF_STOCK`, `HIDDEN`)

### C. IngredientCategory
Groups of ingredients for the DIY system.
- `id` (UUID)
- `name` (e.g., "Protein", "Base", "Sauce")
- `minSelect` (Int, default: 0) - e.g., 1 for "Base" means user MUST pick one.
- `maxSelect` (Int) - e.g., 2 for "Protein" limit.
- `categoryId` (Link to Category) - Links all "Bowl" ingredients together.

### D. Ingredient
The building blocks.
- `id` (UUID)
- `name`, `extraPrice` (Additional cost if selected)
- `stockStatus` (Boolean)
- `ingredientCategoryId` (Link to IngredientCategory)

## 2. Relationships
- **Category (1) <-> Product (N)**
- **Category (1) <-> IngredientCategory (N)**
- **IngredientCategory (1) <-> Ingredient (N)**

## 3. Business Logic
- When a user chooses a "Customizable" product, the system fetches all `IngredientCategories` for that product's main category.
- The Admin Panel can add a new `IngredientCategory` (e.g., "Crunchy Toppings") and it will automatically appear in the DIY UI.

## Next Steps
1. [x] Implement Product & Ingredient Prisma Models.
2. [ ] Plan the **Order & Transaction Schema** (The complex flow).
