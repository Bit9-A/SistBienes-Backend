import { Router } from "express";
import { FurnitureController } from "../controllers/furniture.controller";

const router = Router();

router.get("/", FurnitureController.getAllFurniture);
router.get("/:id", FurnitureController.getFurnitureById);
router.post("/", FurnitureController.createFurniture);
router.put("/:id", FurnitureController.updateFurniture);
router.delete("/:id", FurnitureController.deleteFurniture);

export default router;