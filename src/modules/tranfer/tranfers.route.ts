
import { Router } from "express";
import { transfersController } from "./tranfers.controller"

const router = Router();

router.get("/", transfersController.getAllTransfers);
router.get("/:id", transfersController.getTransferById);
router.post("/", transfersController.createTransfer);
router.put("/:id", transfersController.updateTransfer);
router.delete("/:id", transfersController.deleteTransfer);

export default router;