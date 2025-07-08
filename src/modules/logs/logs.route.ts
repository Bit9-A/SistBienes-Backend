import { Router } from "express";
import { logsController } from "./logs.controller";

const router = Router();
// Este router maneja las rutas relacionadas con los logs del sistema

// Esta ruta maneja la creación de un nuevo log
router.post("/", logsController.createLog);
// Esta ruta maneja la obtención de todos los logs
router.get("/", logsController.getAllLogs);
// Esta ruta maneja la obtención de un log por su ID
router.get("/:id", logsController.getLogById);

export default router;