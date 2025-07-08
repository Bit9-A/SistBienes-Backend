import { Router } from "express";
import { mueblesController } from "./home.controller";
const router = Router();

// Este router maneja las rutas relacionadas con los muebles

// Esta ruta maneja la obtención de todos los muebles
router.get("/piechart", mueblesController.getCounts);
// Esta ruta maneja las operaciones CRUD para los muebles
router.get("/summary", mueblesController.getCountsEstadobien);
// Esta ruta maneja la creación, actualización y eliminación de muebles
router.get("/total", mueblesController.getTotalMuebles);
// Esta ruta maneja la actualización y eliminación de un mueble por su ID
router.get("/lastWeek", mueblesController.getMueblesUltimaSemana);
// Esta ruta maneja la eliminación de un mueble por su ID
router.get("/totalValue", mueblesController.obtenerValorTotalBienesPorDepartamento);
// Esta ruta maneja la obtención de muebles por departamento
router.get("/furnitureForMonth", mueblesController.contarMueblesPorMes);
// Esta ruta maneja la obtención de muebles por departamento
export default router;

