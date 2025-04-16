import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import homeRoute from "./router/home.route";
import { db } from "./database/index";

// Inicializar la conexión a la base de datos
db()
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.error("Database connection failed:", error));

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("Current directory:", __dirname);

const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Rutas
app.use("/", homeRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});