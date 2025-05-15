import { transfersController } from "../controllers/tranfers.controller";
import { Router } from "express";

const router = Router();

router.get("/tranfers", transfersController.getAllTranfers);
router.get("/tranfers/:id", transfersController.getTranferById);
router.get("/goodtranfers", transfersController.getAllGoodTranfers);
router.get("/goodtranfers/:id", transfersController.getGoodTranfersId);
router.post("/tranfers", transfersController.createTranfer);
router.post("/goodtranfers", transfersController.createGoodTranfer);
router.put("/tranfers/:id", transfersController.updateTranfer);
router.put("/goodtranfers/:id", transfersController.updatedGoodTransfer);
router.delete("/tranfers/:id", transfersController.deleteTranfer);
router.delete("/goodtranfers/:id", transfersController.deleteGoodTransfer);

export default router;