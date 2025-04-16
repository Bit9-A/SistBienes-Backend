import express, { Router } from 'express';
import mysql from 'mysql2/promise';

const router = Router();
router.get("/", (_, res) => {
  res.send("Hello World!");
});

const connectionConfig = {
  host: "localhost",
  user: "root",
  password: "1234",
  database: "sistbienes",
  port: 3306
  // Cambia el puerto si es necesario
};
const pool = mysql.createPool(connectionConfig);
const testConnection = async () => {
  try {
    const [rows] = await pool.query("SELECT NOW()");
    console.log("MySQL connected:", rows[0]["NOW()"]);
  } catch (error) {
    console.error("Error connecting to MySQL:", error);
  }
};

testConnection();
const __dirname = import.meta.dirname;
console.log(__dirname);
const app = express();
app.use("/", router);
const PORT = process.env.PORT || 5e3;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhot:${PORT}`);
});
