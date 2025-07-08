import { Router } from "express";
import { statusGoodsController } from "./goods-status.controller";

const router = Router();
// Este router maneja las rutas relacionadas con los estados de los bienes

// Esta ruta maneja la obtención de todos los estados de los bienes
router.get("/", statusGoodsController.getAllStatusGoods);
// Esta ruta maneja las operaciones CRUD para los estados de los bienes
router.get("/:id", statusGoodsController.getStatusGoodsById);
// Esta ruta maneja la creación, actualización y eliminación de estados de los bienes
router.post("/", statusGoodsController.createStatusGoods);
// Esta ruta maneja la actualización y eliminación de un estado de los bienes por su ID
router.put("/:id", statusGoodsController.updateStatusGoods);
// Esta ruta maneja la eliminación de un estado de los bienes por su ID
router.delete("/:id", statusGoodsController.deleteStatusGoods);

export default router;