import { Router } from "express";
import { logsController } from "./logs.controller";

const router = Router();

router.post("/", logsController.createLog);
router.get("/", logsController.getAllLogs);
router.get("/:id", logsController.getLogById);

export default router;