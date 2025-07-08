
import { Router } from "express";
import { transfersController } from "./tranfers.controller"

const router = Router();
// Este router maneja las rutas relacionadas con los traslados de bienes

// Esta ruta maneja la obtención de todos los traslados
router.get("/", transfersController.getAllTransfers);
// Esta ruta maneja la obtención de un traslado por su ID
router.get("/:id", transfersController.getTransferById);
// Esta ruta maneja la creación, actualización y eliminación de traslados
router.post("/", transfersController.createTransfer);
// Esta ruta maneja la actualización y eliminación de un traslado por su ID
router.put("/:id", transfersController.updateTransfer);
// Esta ruta maneja la eliminación de un traslado por su ID
router.delete("/:id", transfersController.deleteTransfer);

export default router;