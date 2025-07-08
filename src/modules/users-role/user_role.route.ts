import { Router } from "express";
import { UserRoleController } from "./user_role.controller";

const router = Router();
// Este router maneja las rutas relacionadas con los roles de usuario

// Esta ruta maneja la obtención de todos los roles de usuario
router.get("/", UserRoleController.getAllUserRoles);
// Esta ruta maneja la obtención de un rol de usuario por su ID
router.get("/:id", UserRoleController.getUserRoleById);
// Esta ruta maneja la creación, actualización y eliminación de roles de usuario
router.post("/", UserRoleController.createUserRole);
// Esta ruta maneja la actualización y eliminación de un rol de usuario por su ID
router.put("/:id", UserRoleController.updateUserRole);
// Esta ruta maneja la eliminación de un rol de usuario por su ID
router.delete("/:id", UserRoleController.deleteUserRole);

export default router;