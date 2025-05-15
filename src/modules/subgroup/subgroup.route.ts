import { Router } from "express";
import { SubGroupController } from "./subgroup.controller";

const router = Router();

// Rutas para SubGrupoMuebles
router.get("/muebles", SubGroupController.getAllSubGrupoMuebles);
router.get("/muebles/:id", SubGroupController.getSubGrupoMueblesById);
router.post("/muebles", SubGroupController.createSubGrupoMuebles);
router.put("/muebles/:id", SubGroupController.updateSubGrupoMuebles);
router.delete("/muebles/:id", SubGroupController.deleteSubGrupoMuebles);

// Rutas para SubGrupoInmuebles
router.get("/inmuebles", SubGroupController.getAllSubGrupoInmuebles);
router.get("/inmuebles/:id", SubGroupController.getSubGrupoInmueblesById);
router.post("/inmuebles", SubGroupController.createSubGrupoInmuebles);
router.put("/inmuebles/:id", SubGroupController.updateSubGrupoInmuebles);
router.delete("/inmuebles/:id", SubGroupController.deleteSubGrupoInmuebles);

export default router;