import { Router } from "express";
import { getGoodHistory } from "./history.controller";

const router = Router();

// Este router maneja las rutas relacionadas con el historial de bienes
router.get("/:goodId", getGoodHistory);

export default router;