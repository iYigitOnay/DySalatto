import { Router } from "express";
import { getMyOrders, getOrderById } from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

export default router;
