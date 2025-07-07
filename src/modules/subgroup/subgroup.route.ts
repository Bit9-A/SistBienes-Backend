import { Router } from "express";
import { SubGroupController } from "./subgroup.controller";

const router = Router();

// Rutas para SubGrupoActivos
router.get("/muebles", SubGroupController.getAllSubGrupoActivos);
router.get("/muebles/:id", SubGroupController.getSubGrupoActivosById);
router.post("/muebles", SubGroupController.createSubGrupoActivos);
router.put("/muebles/:id", SubGroupController.updateSubGrupoActivos);
router.delete("/muebles/:id", SubGroupController.deleteSubGrupoActivos);


export default router;