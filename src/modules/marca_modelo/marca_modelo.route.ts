import { Router } from "express";
import { MarcaModeloController } from "./marca_modelo.controller";

const router = Router();

// Rutas para `marca`
router.get("/marcas", MarcaModeloController.getAllMarcas);
router.get("/marcas/:id", MarcaModeloController.getMarcaById);
router.post("/marcas", MarcaModeloController.createMarca);
router.put("/marcas/:id", MarcaModeloController.updateMarca);
router.delete("/marcas/:id", MarcaModeloController.deleteMarca);

// Rutas para `modelo`
router.get("/modelos", MarcaModeloController.getAllModelos);
router.get("/modelos/:id", MarcaModeloController.getModeloById);
router.get("/modelos/marca/:idmarca", MarcaModeloController.getModelsByMarca);
router.post("/modelos", MarcaModeloController.createModelo);
router.put("/modelos/:id", MarcaModeloController.updateModelo);
router.delete("/modelos/:id", MarcaModeloController.deleteModelo);

export default router;