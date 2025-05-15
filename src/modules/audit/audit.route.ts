import { Router } from "express";
import { auditController } from "./audit.controller";
const router = Router();

router.get("/", auditController.getAllAudit);
router.get("/:id", auditController.getAuditById);   
router.post("/", auditController.createAudit);
router.put("/:id", auditController.updateAudit);
router.delete("/:id", auditController.deleteAudit);

export default router;