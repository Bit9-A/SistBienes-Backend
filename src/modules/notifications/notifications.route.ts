import { Router } from "express";
import { notificationsController } from "./notifications.controller";

const router = Router();

router.get("/notifications", notificationsController.getAllNotifications);
router.get("/notifications/:id", notificationsController.getNotificationById);
router.post("/notifications", notificationsController.createNotification);
router.put("/notifications/:id", notificationsController.updateNotification);
router.delete("/notifications/:id", notificationsController.deleteNotification);

export default router;