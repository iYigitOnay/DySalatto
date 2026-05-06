import { Router } from "express";
import { getMyOrders, getOrderById, createOrder } from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.post("/", createOrder);
router.get("/me", getMyOrders);
router.get("/:id", getOrderById);

export default router;
