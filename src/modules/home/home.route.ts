import { Router } from "express";
import { mueblesController } from "./home.controller";
const router = Router();


router.get("/piechart", mueblesController.getCounts);
router.get("/summary", mueblesController.getCountsEstadobien);
router.get("/total", mueblesController.getTotalMuebles);
router.get("/lastWeek", mueblesController.getMueblesUltimaSemana);
export default router;

