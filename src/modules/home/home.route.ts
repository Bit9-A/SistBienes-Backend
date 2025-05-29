import { Router } from "express";
import { mueblesController } from "./home.controller";
const router = Router();


router.get("/", mueblesController.getCounts);
export default router;

