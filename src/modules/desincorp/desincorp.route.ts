import { Router } from "express";
import { desincorpController } from "./desincorp.controller";

const router = Router();
// Este router maneja las rutas relacionadas con las desincorporaciones

// Esta ruta maneja la obtención de todas las desincorporaciones
router.get("/", desincorpController.getAllDesincorp);
// Esta ruta maneja las operaciones CRUD para las desincorporaciones
router.get("/:id", desincorpController.getDesincorpById);
// Esta ruta maneja la creación, actualización y eliminación de desincorporaciones
router.post("/", desincorpController.createDesincorp);
// Esta ruta maneja la actualización y eliminación de una desincorporación por su ID
router.put("/:id", desincorpController.updateDesincorp);
// Esta ruta maneja la eliminación de una desincorporación por su ID
router.delete("/:id", desincorpController.deleteDesincorp);

export default router;