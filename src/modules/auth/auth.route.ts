import { Router } from "express";
import { AuthController } from "./auth.controller";
import { verifyToken } from "../../middlewares/jwt.middleware";

const router = Router();

// Ruta para registrar un nuevo usuario
router.post("/register", AuthController.register);

// Ruta para iniciar sesión
router.post("/login", AuthController.login);

// Ruta para cerrar sesión
router.post("/logout", AuthController.logout);

// Ruta para restablecer la contraseña
router.post("/change-password", verifyToken, AuthController.changePassword);

// Ruta para obtener el perfil del usuario autenticado
router.get("/profile", verifyToken, AuthController.profile);

export default router;