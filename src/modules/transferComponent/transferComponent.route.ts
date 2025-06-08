import { Router } from "express";
import { TransferComponentController } from "./transferComponent.controller";

const router = Router();

router.get("/", TransferComponentController.getAllTransferComponents);
router.get("/:id", TransferComponentController.getTransferComponentById);
router.post("/", TransferComponentController.createTransferComponent);
router.put("/:id", TransferComponentController.updateTransferComponent);
router.delete("/:id", TransferComponentController.deleteTransferComponent);

export default router;