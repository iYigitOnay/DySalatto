import { Router } from "express";
import { 
  getTraitGroups, 
  createTraitGroup, 
  updateTraitGroup,
  deleteTraitGroup,
  createTrait,
  deleteTrait
} from "../controllers/trait.controller";
import { protect, restrictToAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Groups
router.get("/groups", getTraitGroups);
router.post("/groups", protect, restrictToAdmin, createTraitGroup);
router.put("/groups/:id", protect, restrictToAdmin, updateTraitGroup);
router.delete("/groups/:id", protect, restrictToAdmin, deleteTraitGroup);

// Traits
router.post("/", protect, restrictToAdmin, createTrait);
router.delete("/:id", protect, restrictToAdmin, deleteTrait);

export default router;
