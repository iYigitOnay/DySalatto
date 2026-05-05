import { Router } from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";
import { protect, restrictToAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getProducts);
router.post("/", protect, restrictToAdmin, createProduct);
router.put("/:id", protect, restrictToAdmin, updateProduct);
router.delete("/:id", protect, restrictToAdmin, deleteProduct);

export default router;
