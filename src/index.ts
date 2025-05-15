import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import homeRoute from "./router/home.route";
import authRoute from "./router/auth.route";
import userRoute from "./router/user.route";
import subgroupRoute from "./router/subgroup.route";
import deptRoute from "./router/dept.route";
import incorpRoute from "./router/incorp.route";
import goods_statusRoute from "./router/goods-status.router";
import userRoleRoute from "./router/user_role.route";
import concepIncorpRoute from "./router/concept-inc.route";
import concepDesRoute from "./router/concept-des.router";
import parishRoute from "./router/parish.route";
import auditRoute from "./router/audit.route";
import tranferRouter from "./router/tranfers.route";

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
app.use("/parishes", parishRoute);
app.use("/audit", auditRoute);
app.use("/tranfers", tranferRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});