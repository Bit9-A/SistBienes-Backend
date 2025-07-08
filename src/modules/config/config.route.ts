import { Router } from "express";
import { configController } from "./config.controller";

const router = Router();
// Este router maneja las rutas relacionadas con la configuración general de la aplicación
router.get("/", configController.getConfig);
// Esta ruta maneja la obtención de la configuración general de la aplicación
router.post("/", configController.createConfig);
// Esta ruta maneja la creación de una nueva configuración general de la aplicación
router.put("/", configController.updateConfig);

export default router;