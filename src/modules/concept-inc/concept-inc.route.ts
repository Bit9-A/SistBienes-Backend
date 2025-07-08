import { Router } from "express";
import { ConceptIncController } from "./concept-inc.controllers";
const router = Router();

// Este router maneja las rutas relacionadas con los conceptos de incorporación

// Esta ruta maneja la obtención de todos los conceptos de incorporación
router.get("/", ConceptIncController.getAllConceptInc);
// Esta ruta maneja las operaciones CRUD para los conceptos de incorporación
router.get("/:id", ConceptIncController.getConceptIncById);
// Esta ruta maneja la creación, actualización y eliminación de conceptos de incorporación
router.post("/", ConceptIncController.createConceptInc);
// Esta ruta maneja la actualización y eliminación de un concepto de incorporación por su ID
router.put("/:id", ConceptIncController.updateConceptInc);
// Esta ruta maneja la eliminación de un concepto de incorporación por su ID
router.delete("/:id", ConceptIncController.deleteConceptInc);
// Exportamos el router para que pueda ser utilizado en la aplicación principal
export default router;