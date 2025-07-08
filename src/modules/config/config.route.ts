import { Router } from "express";
import { configController } from "./config.controller";

const router = Router();

router.get("/", configController.getConfig);

router.post("/", configController.createConfig);

router.put("/", configController.updateConfig);

export default router;