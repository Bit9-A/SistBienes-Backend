import mysql from "mysql2/promise";

const connectionConfig = {
  host: "localhost",
  user: "root",
  password: "1234",
  database: "sistbienes",
  port: 3306, // Cambia el puerto si es necesario
};

export const pool = mysql.createPool(connectionConfig);

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