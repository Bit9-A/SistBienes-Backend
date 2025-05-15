import { Router } from "express";
import { DeptController } from "../controllers/dept.controller";

const router = Router();

// Ruta para obtener todos los departamentos
router.get("/", DeptController.getAllDepartments);

// Ruta para obtener un departamento por ID
router.get("/:id", DeptController.getDepartmentById);

// Ruta para crear un nuevo departamento
router.post("/", DeptController.createDepartment);

// Ruta para actualizar un departamento por ID
router.put("/:id", DeptController.updateDepartment);

// Ruta para eliminar un departamento por ID
router.delete("/:id", DeptController.deleteDepartment);

export default router;