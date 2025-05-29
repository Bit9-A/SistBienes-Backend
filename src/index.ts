import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import homeRoute from "./modules/home/home.route";
import authRoute from "./modules/auth/auth.route";
import userRoute from "./modules/users/user.route";
import subgroupRoute from "./modules/subgroup/subgroup.route";
import deptRoute from "./modules/dept/dept.route";
import incorpRoute from "./modules/incorp/incorp.route";
import goods_statusRoute from "./modules/goods-status/goods-status.router";
import userRoleRoute from "./modules/users-role/user_role.route";
import concepIncorpRoute from "./modules/concept-inc/concept-inc.route";
import concepDesRoute from "./modules/concept-des/concept-des.router";
import parishRoute from "./modules/parish/parish.route";
import auditRoute from "./modules/audit/audit.route";
import furnitureRoute from "./modules/furniture/furniture.route";
import transferRoute from "./modules/tranfer/tranfers.route";

import brandRoute from "./modules/marca_modelo/marca_modelo.route";
import notificationsRoute from "./modules/notifications/notifications.route";
import configRoute from "./modules/config/config.route";
import missingGoods from "./modules/missing-goods/missing-goods.route";
import desincorp from "./modules/desincorp/desincorp.route";

import { config } from "dotenv";
import { db } from "./database/index";
import { verifyToken } from "./middlewares/jwt.middleware";
import cors from "cors";


// Inicializar la conexión a la base de datos
db()
  .then((): void => console.log("Database connected successfully"))
  .catch((error: unknown): void => console.error("Database connection failed:", error));

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("Current directory:", __dirname);

const app = express();

// Middleware para manejar JSON
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: ["http://shuttle.proxy.rlwy.net:12546"], // Permitir solicitudes desde el frontend local
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Rutas


app.use("/",homeRoute);
app.use("/auth",authRoute);

app.use(verifyToken)
app.use("/user", userRoute);
app.use("/subgroup", subgroupRoute);
app.use("/subgroup", deptRoute);
app.use("/incorp", incorpRoute);
app.use("/goods-status", goods_statusRoute);
app.use("/user_role", userRoleRoute);
app.use("/concept-incorp", concepIncorpRoute);
app.use("/concept-desincorp", concepDesRoute);
app.use("/furniture", furnitureRoute);
app.use("/api", brandRoute);
app.use("/dept", deptRoute);
app.use("/parish", parishRoute);
app.use("/audit", auditRoute);
app.use("/trasfers", transferRoute);
app.use("/notifications", notificationsRoute);
app.use("/config",configRoute);
app.use("/missing-goods", missingGoods);
app.use("/desincorp", desincorp);


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});