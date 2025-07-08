import { Router } from "express";
import { ConceptDesController } from "./concept-des.controllers";
const router = Router();

// Este router maneja las rutas relacionadas con los conceptos de desincorporación

// Esta ruta maneja la obtención de todos los conceptos de desincorporación
router.get("/", ConceptDesController.getAllConceptDes);
// Esta ruta maneja las operaciones CRUD para los conceptos de desincorporación
router.get("/:id", ConceptDesController.getConceptDesById);
// Esta ruta maneja la creación, actualización y eliminación de conceptos de desincorporación
router.post("/", ConceptDesController.createConceptDes);
// Esta ruta maneja la actualización y eliminación de un concepto de desincorporación por su ID
router.put("/:id", ConceptDesController.updateConceptDes);
// Esta ruta maneja la eliminación de un concepto de desincorporación por su ID
router.delete("/:id", ConceptDesController.deleteConceptDes);
export default router;