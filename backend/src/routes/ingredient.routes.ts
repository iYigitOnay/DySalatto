import { Router } from "express";
import { 
  getIngredients, 
  createIngredient, 
  updateIngredient,
  deleteIngredient,
  getSteps,
  createStep,
  updateStep,
  deleteStep,
  getIngredientCategories,
  createIngredientCategory,
  updateIngredientCategory,
  deleteIngredientCategory,
  reorderIngredientCategories
} from "../controllers/ingredient.controller";
import { protect, restrictToAdmin } from "../middlewares/auth.middleware";

const router = Router();

// --- INGREDIENT CATEGORIES ---
router.get("/categories", getIngredientCategories);
router.post("/categories", protect, restrictToAdmin, createIngredientCategory);
router.put("/categories/reorder", protect, restrictToAdmin, reorderIngredientCategories);
router.put("/categories/:id", protect, restrictToAdmin, updateIngredientCategory);
router.delete("/categories/:id", protect, restrictToAdmin, deleteIngredientCategory);

// --- INGREDIENTS ---
router.get("/", getIngredients);
router.post("/", protect, restrictToAdmin, createIngredient);
router.put("/:id", protect, restrictToAdmin, updateIngredient);
router.delete("/:id", protect, restrictToAdmin, deleteIngredient);

// --- DIY STEPS ---
router.get("/steps", getSteps);
router.post("/steps", protect, restrictToAdmin, createStep);
router.put("/steps/:id", protect, restrictToAdmin, updateStep);
router.delete("/steps/:id", protect, restrictToAdmin, deleteStep);

export default router;
