import { Router } from "express";
import { desincorpController } from "./desincorp.controller";

const router = Router();

router.get("/", desincorpController.getAllDesincorp);
router.get("/:id", desincorpController.getDesincorpById);
router.post("/", desincorpController.createDesincorp);
router.put("/:id", desincorpController.updateDesincorp);
router.delete("/:id", desincorpController.deleteDesincorp);

export default router;