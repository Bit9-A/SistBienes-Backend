import { Router } from "express";
import {ConceptDesController} from "./concept-des.controllers";
const router = Router();

router.get("/", ConceptDesController.getAllConceptDes);
router.get("/:id", ConceptDesController.getConceptDesById); 
router.post("/", ConceptDesController.createConceptDes);
router.put("/:id", ConceptDesController.updateConceptDes); 
router.delete("/:id", ConceptDesController.deleteConceptDes);
export default router;