import express from "express";
import homeRoute from "./router/home.route";

import { testConnection } from "./database/index";

testConnection();

const __dirname = import.meta.dirname;
console.log(__dirname);

const app = express();

app.use("/", homeRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhot:${PORT}`);
});
