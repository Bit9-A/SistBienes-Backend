import { Router } from "express";
import { notificationsController } from "./notifications.controller";

const router = Router();
// Este router maneja las rutas relacionadas con las notificaciones
// Esta ruta maneja la obtención de todas las notificaciones
router.get("/", notificationsController.getAllNotifications);
// Esta ruta maneja las operaciones CRUD para las notificaciones
router.get("/:id", notificationsController.getNotificationById);
// Esta ruta maneja la creación, actualización y eliminación de notificaciones
router.post("/", notificationsController.createNotification);
// Esta ruta maneja la actualización y eliminación de una notificación por su ID
router.put("/:id", notificationsController.updateNotification);
// Esta ruta maneja la eliminación de una notificación por su ID
router.delete("/:id", notificationsController.deleteNotification);
// Esta ruta maneja la obtención de notificaciones por ID de departamento
router.get("/dept/:dept_id", notificationsController.getNotificationsByDeptId);

export default router;
