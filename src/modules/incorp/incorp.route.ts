import { Router } from "express";
import { IncorpController } from "./incorp.controller";

const router = Router();

//Ruta para obtener todos los registros de Incorp
router.get("/", IncorpController.getAllIncorps);
// Ruta para crear un nuevo registro de Incorp
router.post("/", IncorpController.createIncorp);

// Ruta para obtener un registro de Incorp por ID
router.get("/:id", IncorpController.getIncorpById);

// Ruta para actualizar un registro de Incorp por ID
router.put("/:id", IncorpController.updateIncorp);

// Ruta para eliminar un registro de Incorp por ID
router.delete("/:id", IncorpController.deleteIncorp);

export default router;