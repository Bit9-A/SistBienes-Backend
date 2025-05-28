import { Router } from "express";
import { logsController } from "./logs.controller";

const router = Router();

router.post("/logs", logsController.createLog);
router.get("/logs", logsController.getAllLogs);
router.get("/logs/:id", logsController.getLogById);

export default router;