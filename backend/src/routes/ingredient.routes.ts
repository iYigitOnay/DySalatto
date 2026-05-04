import { Router } from "express";
import { 
  getIngredients, 
  createIngredient, 
  updateIngredient,
  deleteIngredient,
  getSteps,
  createStep,
  updateStep,
  deleteStep
} from "../controllers/ingredient.controller";
import { protect, restrictToAdmin } from "../middlewares/auth.middleware";

const router = Router();

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
