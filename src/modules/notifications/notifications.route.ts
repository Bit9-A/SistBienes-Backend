import { Router } from "express";
import { notificationsController } from "./notifications.controller";

const router = Router();

router.get("/", notificationsController.getAllNotifications);
router.get("/:id", notificationsController.getNotificationById);
router.post("/", notificationsController.createNotification);
router.put("/:id", notificationsController.updateNotification);
router.delete("/:id", notificationsController.deleteNotification);
router.get("/dept/:dept_id", notificationsController.getNotificationsByDeptId);

export default router;
