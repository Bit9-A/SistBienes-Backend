import { Router } from "express";
import { reportController } from "./report.controller";

const router = Router();

router.post("/", reportController.getMonthlyReport);

export default router;