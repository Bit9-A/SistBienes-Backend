import pg from "pg";

const { Pool } = pg;
const connectionString = "postgresql://postgres:root@localhost:5434/dbtest";

export const pool = new Pool({ connectionString });

export const testConnection = async () => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    console.log("Postgres connected:", rows[0].now);
  } catch (error) {
    console.log(error);
  }
};
