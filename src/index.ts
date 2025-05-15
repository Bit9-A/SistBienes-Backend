import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import homeRoute from "./home/home.route";
import authRoute from "./auth/auth.route";
import userRoute from "./users/user.route";
import subgroupRoute from "./subgroup/subgroup.route";
import deptRoute from "./dept/dept.route";
import incorpRoute from "./incorp/incorp.route";
import goods_statusRoute from "./goods-status/goods-status.router";
import userRoleRoute from "./users-role/user_role.route";
import concepIncorpRoute from "./concept-inc/concept-inc.route";
import concepDesRoute from "./concept-des/concept-des.router";
import parishRoute from "./parish/parish.route";
import auditRoute from "./audit/audit.route";

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
//app.use(verifyToken)

app.use("/",homeRoute);
app.use("/auth",authRoute);
app.use("/user", userRoute);
app.use("/subgroup", subgroupRoute);
app.use("/subgroup", deptRoute);
app.use("/incorp", incorpRoute);
app.use("/goods-status", goods_statusRoute);
app.use("/user_role", userRoleRoute);
app.use("/concept-incorp", concepIncorpRoute);
app.use("/concept-desincorp", concepDesRoute);
app.use("/dept", deptRoute);
app.use("/parish", parishRoute);
app.use("/audit", auditRoute);


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});