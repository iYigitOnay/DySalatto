import { Router } from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";
import { protect, restrictToAdmin } from "../middlewares/auth.middleware";
import { upload } from "../utils/upload";

const router = Router();

router.get("/", getProducts);
router.post("/", protect, restrictToAdmin, upload.single("image"), createProduct);
router.put("/:id", protect, restrictToAdmin, upload.single("image"), updateProduct);
router.delete("/:id", protect, restrictToAdmin, deleteProduct);

export default router;
