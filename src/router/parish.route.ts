import { Router } from "express";
import { ParroquiaController } from "../controllers/parish.controller";

const router = Router();

router.post("/createParish", ParroquiaController.createParroquia);
router.get("/parish/:id", ParroquiaController.getParroquiaById);
router.get("/parishAll", ParroquiaController.getAllParroquias);
router.put("/updateParish/:id", ParroquiaController.updateParroquia);
router.delete("/deleteParish/:id", ParroquiaController.deleteParroquia);

export default router;