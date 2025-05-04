import { Router } from "express";
import { ParishController } from "../controllers/parish.controller";

const router = Router();

router.get("/", ParishController.getAllParishes);
router.get("/:id", ParishController.getParishById);
router.post("/", ParishController.createParish);
router.put("/:id", ParishController.updateParish);
router.delete("/:id", ParishController.deleteParish);

export default router;