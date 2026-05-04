import { Router } from "express";
import { getCategories, createCategory, deleteCategory } from "../controllers/category.controller";
import { protect, restrictToAdmin } from "../middlewares/auth.middleware";

const router = Router();

// GET tüm kullanıcılara (veya adminlere) açık olabilir
router.get("/", getCategories);

// POST ve DELETE işlemleri sadece ADMIN yetkisiyle yapılabilir
router.post("/", protect, restrictToAdmin, createCategory);
router.delete("/:id", protect, restrictToAdmin, deleteCategory);

export default router;
