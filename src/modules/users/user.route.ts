import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

// Ruta para obtener todos los usuarios
router.get("/", UserController.getAllUsers);

// Ruta para obtener un usuario por ID
router.get("/:id", UserController.getUserById);

// Ruta para obtener usuarios por ID de departamento
router.get("/department/:dept_id", UserController.getUsersByDeptId);

// Ruta para actualizar un usuario
router.put("/:id", UserController.updateUser);

// Ruta para eliminar un usuario
router.delete("/:id", UserController.deleteUser);

export default router;