import {Router } from "express";
import {getGoodHistory} from "./history.controller";

const router = Router();

router.get("/:goodId", getGoodHistory);

export default router;