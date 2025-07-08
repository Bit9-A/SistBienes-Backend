import { Router } from "express";
import { TransferComponentController } from "./transferComponent.controller";

const router = Router();
// Este router maneja las rutas relacionadas con los componentes de traslado

// Esta ruta maneja la obtención de todos los componentes de traslado
router.get("/", TransferComponentController.getAllTransferComponents);
// Esta ruta maneja la obtención de un componente de traslado por su ID
router.get("/:id", TransferComponentController.getTransferComponentById);
// Esta ruta maneja la creación, actualización y eliminación de componentes de traslado
router.post("/", TransferComponentController.createTransferComponent);
// Esta ruta maneja la actualización y eliminación de un componente de traslado por su ID
router.put("/:id", TransferComponentController.updateTransferComponent);
// Esta ruta maneja la eliminación de un componente de traslado por su ID
router.delete("/:id", TransferComponentController.deleteTransferComponent);

export default router;