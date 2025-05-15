import { Router } from "express";
import { ConceptIncController } from "./concept-inc.controllers";
const router = Router();
router.get("/", ConceptIncController.getAllConceptInc);
router.get("/:id", ConceptIncController.getConceptIncById);
router.post("/", ConceptIncController.createConceptInc);
router.put("/:id", ConceptIncController.updateConceptInc);
router.delete("/:id", ConceptIncController.deleteConceptInc);
export default router;