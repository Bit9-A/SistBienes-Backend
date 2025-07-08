import { Router } from "express";
import { missingGoodsController } from "./missing-goods.controller";

const router = Router();
// Este router maneja las rutas relacionadas con los bienes perdidos
// Esta ruta maneja la obtención de todos los bienes perdidos
router.get("/", missingGoodsController.getAllMissingGoods);
// Esta ruta maneja las operaciones CRUD para los bienes perdidos
router.get("/:id", missingGoodsController.getMissingGoodsById);
// Esta ruta maneja la creación, actualización y eliminación de bienes perdidos
router.post("/", missingGoodsController.createMissingGoods);
// Esta ruta maneja la actualización y eliminación de un bien perdido por su ID
router.put("/:id", missingGoodsController.updateMissingGoods);
// Esta ruta maneja la eliminación de un bien perdido por su ID
router.delete("/:id", missingGoodsController.deleteMissingGoods);

export default router;