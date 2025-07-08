import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
// El siguiente código establece una conexión a una base de datos MySQL utilizando el paquete mysql2/promise.
export const connectionConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test",
  port: Number(process.env.DB_PORT) || 3306,
};
// Crear un pool de conexiones para manejar múltiples conexiones a la base de datos
export const pool = mysql.createPool(connectionConfig);

// Función para probar la conexión a la base de datos
export const db = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query("SELECT 1 + 1 AS solution");
    console.log("MySQL connected: Perfectamente:", connection.threadId);
    connection.release();
  } catch (error) {
    console.log(error);
  }
};