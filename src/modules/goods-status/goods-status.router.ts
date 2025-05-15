import { Router } from "express";
import {statusGoodsController} from "./goods-status.controller";

const router = Router();

router.get("/", statusGoodsController.getAllStatusGoods);
router.get("/:id", statusGoodsController.getStatusGoodsById);
router.post("/", statusGoodsController.createStatusGoods);
router.put("/:id", statusGoodsController.updateStatusGoods);
router.delete("/:id", statusGoodsController.deleteStatusGoods);

export default router;