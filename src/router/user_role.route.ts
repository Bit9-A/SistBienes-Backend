import { Router } from "express";
import { UserRoleController } from "../controllers/user_role.controller";

const router = Router();

router.get("/", UserRoleController.getAllUserRoles);
router.get("/:id", UserRoleController.getUserRoleById);
router.post("/", UserRoleController.createUserRole);
router.put("/:id", UserRoleController.updateUserRole);
router.delete("/:id", UserRoleController.deleteUserRole);

export default router;