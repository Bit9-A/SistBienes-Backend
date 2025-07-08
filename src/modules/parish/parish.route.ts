import { Router } from "express";
import { ParishController } from "./parish.controller";

const router = Router();
// Este router maneja las rutas relacionadas con las parroquias

// Esta ruta maneja la obtención de todas las parroquias
router.get("/", ParishController.getAllParishes);
// Esta ruta maneja la obtención de una parroquia por su ID
router.get("/:id", ParishController.getParishById);
// Esta ruta maneja la creación, actualización y eliminación de parroquias
router.post("/", ParishController.createParish);
// Esta ruta maneja la actualización y eliminación de una parroquia por su ID
router.put("/:id", ParishController.updateParish);
// Esta ruta maneja la eliminación de una parroquia por su ID
router.delete("/:id", ParishController.deleteParish);

export default router;