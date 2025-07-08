import { Router } from "express";
import { FurnitureController } from "./furniture.controller";

const router = Router();
// Este router maneja las rutas relacionadas con los muebles

// Esta ruta maneja la obtención de todos los muebles
router.get("/", FurnitureController.getAllFurniture);
// Esta ruta maneja las operaciones CRUD para los muebles
router.get("/:id", FurnitureController.getFurnitureById);
// Esta ruta maneja la creación, actualización y eliminación de muebles
router.post("/", FurnitureController.createFurniture);
// Esta ruta maneja la actualización y eliminación de un mueble por su ID
router.put("/:id", FurnitureController.updateFurniture);
// Esta ruta maneja la eliminación de un mueble por su ID
router.delete("/:id", FurnitureController.deleteFurniture);
// Esta ruta maneja la obtención de muebles por departamento
router.get("/dept/:deptId", FurnitureController.getFurnitureByDepartment);

export default router;