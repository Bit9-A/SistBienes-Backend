import { Router } from "express";
import { mueblesController } from "./home.controller";
const router = Router();


router.get("/piechart", mueblesController.getCounts);
router.get("/summary", mueblesController.getCountsEstadobien);
router.get("/total", mueblesController.getTotalMuebles);
router.get("/lastWeek", mueblesController.getMueblesUltimaSemana);
router.get("/totalValue", mueblesController.obtenerValorTotalBienesPorDepartamento);
router.get("/furnitureForMonth", mueblesController.contarMueblesPorMes);
export default router;

