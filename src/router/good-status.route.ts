import { Router } from "express";
import { EstadoBienController } from "../controllers/goods-status.controller";

const router = Router();

// Ruta para crear un nuevo registro de EstadoBien
router.post("/createEstadoBien", EstadoBienController.createEstadoBien);

// Ruta para obtener un registro de EstadoBien por ID
router.get("/estadoBien/:id", EstadoBienController.getEstadoBienById);

// Ruta para actualizar un registro de EstadoBien por ID
router.put("/updateEstadoBien/:id", EstadoBienController.updateEstadoBien);

// Ruta para eliminar un registro de EstadoBien por ID
router.delete("/deleteEstadoBien/:id", EstadoBienController.deleteEstadoBien);

export default router;