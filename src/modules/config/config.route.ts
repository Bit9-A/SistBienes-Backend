import { Router } from "express";
import { configController } from "./config.controller";

const router = Router();

router.get("/config", configController.getConfig);
router.put("/config/:id", configController.updateConfig);

router.post("/config", configController.createConfig);


export default router;