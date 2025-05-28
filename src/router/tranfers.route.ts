import { Router } from "express";
import { transfersController } from "./tranfers.controller"

const router = Router();

router.get("/transfers", transfersController.getAllTransfers);
router.get("/transfers/:id", transfersController.getTransferById);
router.post("/transfers", transfersController.createTransfer);
router.put("/transfers/:id", transfersController.updateTransfer);
router.delete("/transfers/:id", transfersController.deleteTransfer);

export default router;