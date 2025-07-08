import { Router } from "express";
import { reportController } from "./report.controller";

const router = Router();
// Este router maneja las rutas relacionadas con los reportes mensuales

// Esta ruta maneja la obtención del reporte mensual
router.post("/", reportController.getMonthlyReport);

export default router;