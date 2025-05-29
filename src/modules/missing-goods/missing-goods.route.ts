import { Router } from "express";
import { missingGoodsController } from "./missing-goods.controller";

const router = Router();

router.get("/", missingGoodsController.getAllMissingGoods);
router.get("/:id", missingGoodsController.getMissingGoodsById);
router.post("/", missingGoodsController.createMissingGoods);
router.put("/:id", missingGoodsController.updateMissingGoods);
router.delete("/:id", missingGoodsController.deleteMissingGoods);

export default router;