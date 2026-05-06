import { Router } from "express";
import { getMyOrders, getOrderById, createOrder, getAdminOrders, updateSubOrderStatus } from "../controllers/order.controller";
import { protect, restrictToAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.post("/", createOrder);
router.get("/me", getMyOrders);
router.get("/admin", restrictToAdmin, getAdminOrders);
router.put("/admin/:id/status", restrictToAdmin, updateSubOrderStatus);
router.get("/:id", getOrderById);

export default router;
