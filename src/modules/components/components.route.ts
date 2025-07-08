import { Router } from "express";
import { ComponentsController } from "./components.controller";

const router = Router();
// Rutas para manejar los componentes
// Ruta para obtener todos los componentes
router.get("/", ComponentsController.getAllComponents);
// Ruta para obtener un componente por su ID
router.get("/:id", ComponentsController.getComponentById);
// Ruta para obtener componentes por el ID del bien asociado
router.get("/bien/:bien_id", ComponentsController.getComponentsByBienId);
// Rutas para crear, actualizar y eliminar componentes
router.post("/", ComponentsController.createComponent);
// Ruta para actualizar un componente por su ID
router.put("/:id", ComponentsController.updateComponent);
// Ruta para eliminar un componente por su ID
router.delete("/:id", ComponentsController.deleteComponent);

export default router;