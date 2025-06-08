import { Router } from "express";
import { ComponentsController } from "./components.controller";

const router = Router();

router.get("/", ComponentsController.getAllComponents);
router.get("/:id", ComponentsController.getComponentById);
router.get("/bien/:bien_id", ComponentsController.getComponentsByBienId); // <--- nueva ruta
router.post("/", ComponentsController.createComponent);
router.put("/:id", ComponentsController.updateComponent);
router.delete("/:id", ComponentsController.deleteComponent);

export default router;