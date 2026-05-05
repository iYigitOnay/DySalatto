import { Router } from "express";
import { getMyAddresses, createAddress, updateAddress, deleteAddress } from "../controllers/address.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.get("/", getMyAddresses);
router.post("/", createAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;
