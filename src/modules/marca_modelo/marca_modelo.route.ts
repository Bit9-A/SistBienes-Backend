import { Router } from "express";
import { MarcaModeloController } from "./marca_modelo.controller";

const router = Router();

// Rutas para `marca`
// Obtener todas las marcas
router.get("/marcas", MarcaModeloController.getAllMarcas);
// Obtener una marca por ID
router.get("/marcas/:id", MarcaModeloController.getMarcaById);
// Crear una nueva marca
router.post("/marcas", MarcaModeloController.createMarca);
// Actualizar una marca existente
router.put("/marcas/:id", MarcaModeloController.updateMarca);
// Eliminar una marca por ID
router.delete("/marcas/:id", MarcaModeloController.deleteMarca);

// Rutas para `modelo`
// Obtener todos los modelos
router.get("/modelos", MarcaModeloController.getAllModelos);
// Obtener un modelo por ID
router.get("/modelos/:id", MarcaModeloController.getModeloById);
// Obtener modelos por marca
router.get("/modelos/marca/:idmarca", MarcaModeloController.getModelsByMarca);
// Crear un nuevo modelo
router.post("/modelos", MarcaModeloController.createModelo);
// Actualizar un modelo existente
router.put("/modelos/:id", MarcaModeloController.updateModelo);
// Eliminar un modelo por ID
router.delete("/modelos/:id", MarcaModeloController.deleteModelo);

export default router;