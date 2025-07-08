import { Router } from "express";
import { SubGroupController } from "./subgroup.controller";

const router = Router();

// Rutas para SubGrupoActivos

// Esta ruta maneja la obtención de todos los subgrupos de muebles activos
router.get("/muebles", SubGroupController.getAllSubGrupoActivos);
// Esta ruta maneja la obtención de un subgrupo de muebles activos por su ID
router.get("/muebles/:id", SubGroupController.getSubGrupoActivosById);
// Esta ruta maneja la creación, actualización y eliminación de subgrupos de muebles activos
router.post("/muebles", SubGroupController.createSubGrupoActivos);
// Esta ruta maneja la actualización y eliminación de un subgrupo de muebles activos por su ID
router.put("/muebles/:id", SubGroupController.updateSubGrupoActivos);
// Esta ruta maneja la eliminación de un subgrupo de muebles activos por su ID
router.delete("/muebles/:id", SubGroupController.deleteSubGrupoActivos);


export default router;