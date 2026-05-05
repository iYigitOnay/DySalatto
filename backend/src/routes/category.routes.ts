import { Router } from "express";
import { getCategories, createCategory, deleteCategory, reorderCategories } from "../controllers/category.controller";
import { protect, restrictToAdmin } from "../middlewares/auth.middleware";

const router = Router();

// GET tüm kullanıcılara (veya adminlere) açık olabilir
router.get("/", getCategories);

// POST, PUT ve DELETE işlemleri sadece ADMIN yetkisiyle yapılabilir
router.post("/", protect, restrictToAdmin, createCategory);
router.put("/reorder", protect, restrictToAdmin, reorderCategories);
router.delete("/:id", protect, restrictToAdmin, deleteCategory);

export default router;
