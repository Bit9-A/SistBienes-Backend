import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import homeRoute from "./router/home.route";
import authRoute from "./router/auth.route";
import userRoute from "./router/user.route";
import subgroupRoute from "./router/subgroup.route";
import deptRoute from "./router/dept.route";
import incorpRoute from "./router/incorp.route";
import { config } from "dotenv";
import { db } from "./database/index";
import { verifyToken } from "./middlewares/jwt.middleware";

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

// Rutas
app.use(verifyToken)
app.use("/", homeRoute);
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/subgroup", subgroupRoute);
app.use("/subgroup", deptRoute);
app.use("/incorp", incorpRoute);


const PORT = process.env.PORT || 12546;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});