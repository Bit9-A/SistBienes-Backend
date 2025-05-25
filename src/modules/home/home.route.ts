import { Router } from "express";
import {mueblesController} from "./home.controller";

const router = Router();

// router.get("/", (_, res) => {
//   res.send("Hello World!");
// });

router.get("/", mueblesController.getCounts);

export default router;
