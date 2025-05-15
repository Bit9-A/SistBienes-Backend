import { Router } from "express";
import { IncorpController } from "./incorp.controller";

const router = Router();

// Ruta para crear un nuevo registro de Incorp
router.post("/createIncorp", IncorpController.createIncorp);

// Ruta para obtener un registro de Incorp por ID
router.get("/incorp/:id", IncorpController.getIncorpById);

// Ruta para actualizar un registro de Incorp por ID
router.put("/updateIncorp/:id", IncorpController.updateIncorp);

// Ruta para eliminar un registro de Incorp por ID
router.delete("/deleteIncorp/:id", IncorpController.deleteIncorp);

export default router;