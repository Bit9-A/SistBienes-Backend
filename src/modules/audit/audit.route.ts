import { Router } from "express";
import { auditController } from "./audit.controller";
const router = Router();

// Auditoría de bienes
router.get("/", auditController.getAllAudit);
// Auditoría de bienes por ID
router.get("/:id", auditController.getAuditById);
// CRUD de auditoría 
router.post("/", auditController.createAudit);
// Actualizar auditoría por ID
router.put("/:id", auditController.updateAudit);
// Eliminar auditoría por ID
router.delete("/:id", auditController.deleteAudit);


// Auditoría de sesión
router.post("/in/r", auditController.registerIn);
// Registrar salida de sesión
router.post("/out/r", auditController.registerOut);


export default router;