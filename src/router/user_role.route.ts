import { Router } from "express";
import { TipoUsuarioController } from "../controllers/user_role.controller";

const router = Router();

// Ruta para crear un nuevo TipoUsuario
router.post("/createUser_role", TipoUsuarioController.createTipoUsuario);

// Ruta para obtener un TipoUsuario por ID
router.get("/User_role/:id", TipoUsuarioController.getTipoUsuarioById);

// Ruta para actualizar un TipoUsuario por ID
router.put("/updateUser_role/:id", TipoUsuarioController.updateTipoUsuario);

// Ruta para eliminar un TipoUsuario por ID
router.delete("/deleteUser_role/:id", TipoUsuarioController.deleteTipoUsuario);

export default router;