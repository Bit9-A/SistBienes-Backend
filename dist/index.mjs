import express, { Router } from 'express';
import pg from 'pg';

const router = Router();
router.get("/", (_, res) => {
  res.send("Hello World!");
});

const { Pool } = pg;
const connectionString = "postgresql://postgres:root@localhost:5434/dbtest";
const pool = new Pool({ connectionString });
const testConnection = async () => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    console.log("Postgres connected:", rows[0].now);
  } catch (error) {
    console.log(error);
  }
};

testConnection();
const __dirname = import.meta.dirname;
console.log(__dirname);
const app = express();
app.use("/", router);
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhot:${PORT}`);
});
