import express, { Router } from 'express';
import * as path from 'path';
import path__default from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import * as fs from 'fs';
import fs__default from 'fs';
import ExcelJS from 'exceljs';
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';
import QRCode from 'qrcode';
import cron from 'node-cron';
import cors from 'cors';

var __async$V = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
dotenv.config();
const connectionConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test",
  port: Number(process.env.DB_PORT) || 3306
};
const pool = mysql.createPool(connectionConfig);
const db = () => __async$V(void 0, null, function* () {
  try {
    const connection = yield pool.getConnection();
    yield connection.query("SELECT 1 + 1 AS solution");
    console.log("MySQL connected: Perfectamente:", connection.threadId);
    connection.release();
  } catch (error) {
    console.log(error);
  }
});

var __async$U = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getSubgruposConConteo = () => __async$U(void 0, null, function* () {
  const query = `
        SELECT sg.id, sg.nombre, sg.codigo, COALESCE(SUM(a.cantidad), 0) AS total
        FROM SubgrupoActivos sg
        LEFT JOIN Activos a ON sg.id = a.subgrupo_id
        GROUP BY sg.id, sg.nombre, sg.codigo
    `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const getGoodStatusConConteo = () => __async$U(void 0, null, function* () {
  const query = `
        SELECT ea.id, ea.nombre, COALESCE(SUM(a.cantidad), 0) AS total
        FROM EstadoActivo ea
        LEFT JOIN Activos a ON ea.id = a.estado_id
        GROUP BY ea.id, ea.nombre
    `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const contarMuebles = () => __async$U(void 0, null, function* () {
  const query = `
        SELECT COUNT(*) AS total_muebles, COALESCE(SUM(a.cantidad), 0) AS suma_cantidad
        FROM Activos a;
    `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const contarMueblesUltimaSemana = () => __async$U(void 0, null, function* () {
  var _a;
  const ahora = /* @__PURE__ */ new Date();
  const hace7Dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1e3);
  const query = `
    SELECT SUM(cantidad) AS total_bienes
    FROM Activos
    WHERE fecha >= ? AND fecha <= ?;
  `;
  const [rows] = yield pool.execute(query, [hace7Dias, ahora]);
  return (_a = rows[0].total_bienes) != null ? _a : 0;
});
const obtenerValorTotalBienesPorDepartamento$1 = () => __async$U(void 0, null, function* () {
  const query = `
        SELECT a.dept_id, d.nombre AS dept_nombre, COALESCE(SUM(a.valor_unitario * a.cantidad), 0) AS total_valor
        FROM Activos a
        LEFT JOIN Departamento d ON a.dept_id = d.id
        GROUP BY a.dept_id, d.nombre
    `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const contarMueblesPorMes$1 = () => __async$U(void 0, null, function* () {
  const query = `
        SELECT 
            YEAR(fecha) AS anio, 
            MONTH(fecha) AS mes, 
            COALESCE(SUM(cantidad), 0) AS total_muebles
        FROM Activos
        WHERE fecha IS NOT NULL
        GROUP BY anio, mes
        ORDER BY anio ASC, mes ASC;
    `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const HomeModel = {
  getSubgruposConConteo,
  getGoodStatusConConteo,
  contarMuebles,
  contarMueblesUltimaSemana,
  obtenerValorTotalBienesPorDepartamento: obtenerValorTotalBienesPorDepartamento$1,
  contarMueblesPorMes: contarMueblesPorMes$1
};

var __async$T = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getCounts = (req, res) => __async$T(void 0, null, function* () {
  try {
    const counts = yield HomeModel.getSubgruposConConteo();
    res.status(200).json({ ok: true, counts });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? "Error al obtener los conteos de subgrupos: " + error.message : "Error desconocido"
    });
  }
});
const getCountsEstadobien = (req, res) => __async$T(void 0, null, function* () {
  try {
    const countsEstadobien = yield HomeModel.getGoodStatusConConteo();
    res.status(200).json({ ok: true, countsEstadobien });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? "Error al obtener los conteos de estado de bienes: " + error.message : "Error desconocido"
    });
  }
});
const getTotalMuebles = (req, res) => __async$T(void 0, null, function* () {
  try {
    const total = yield HomeModel.contarMuebles();
    res.status(200).json({ ok: true, total });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? "Error al contar los muebles: " + error.message : "Error desconocido"
    });
  }
});
const getMueblesUltimaSemana = (req, res) => __async$T(void 0, null, function* () {
  try {
    const ultimaSemana = yield HomeModel.contarMueblesUltimaSemana();
    res.status(200).json({ ok: true, ultimaSemana });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? "Error al contar los muebles de la \xFAltima semana: " + error.message : "Error desconocido"
    });
  }
});
const obtenerValorTotalBienesPorDepartamento = (req, res) => __async$T(void 0, null, function* () {
  try {
    const valortotal = yield HomeModel.obtenerValorTotalBienesPorDepartamento();
    res.status(200).json({ ok: true, valortotal });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? "Error al obtener el valor total de bienes por departamento: " + error.message : "Error desconocido"
    });
  }
});
const contarMueblesPorMes = (req, res) => __async$T(void 0, null, function* () {
  try {
    const mublesPorMes = yield HomeModel.contarMueblesPorMes();
    res.status(200).json({ ok: true, mublesPorMes });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? "Error al contar los muebles por mes: " + error.message : "Error desconocido"
    });
  }
});
const mueblesController = {
  getCounts,
  getCountsEstadobien,
  getTotalMuebles,
  getMueblesUltimaSemana,
  obtenerValorTotalBienesPorDepartamento,
  contarMueblesPorMes
};

const router$p = Router();
router$p.get("/piechart", mueblesController.getCounts);
router$p.get("/summary", mueblesController.getCountsEstadobien);
router$p.get("/total", mueblesController.getTotalMuebles);
router$p.get("/lastWeek", mueblesController.getMueblesUltimaSemana);
router$p.get("/totalValue", mueblesController.obtenerValorTotalBienesPorDepartamento);
router$p.get("/furnitureForMonth", mueblesController.contarMueblesPorMes);

var __async$S = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const createUser = (_0) => __async$S(void 0, [_0], function* ({
  tipo_usuario,
  email,
  password,
  nombre,
  apellido,
  telefono,
  dept_id,
  cedula,
  username,
  isActive
}) {
  const query = `
      INSERT INTO Usuarios (tipo_usuario, email, password, nombre, apellido, telefono, dept_id, cedula, username, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  const [result] = yield pool.execute(query, [
    tipo_usuario,
    email,
    password,
    nombre,
    apellido,
    telefono || null,
    dept_id || null,
    cedula,
    username,
    isActive !== void 0 ? isActive : true
  ]);
  const userQuery = `
      SELECT id, tipo_usuario, email, nombre, apellido, telefono, dept_id, cedula, username, isActive
      FROM Usuarios
      WHERE id = ?
    `;
  const [rows] = yield pool.execute(userQuery, [result.insertId]);
  return rows[0];
});
const findUserByEmail = (email) => __async$S(void 0, null, function* () {
  const query = `
    SELECT id, tipo_usuario, email, password, nombre, apellido, telefono, dept_id, cedula, username, isActive
    FROM Usuarios
    WHERE email = ?
  `;
  const [rows] = yield pool.execute(query, [email]);
  return rows[0];
});
const saveLoginToken = (id, token, expiration) => __async$S(void 0, null, function* () {
  const query = `
    UPDATE Usuarios
    SET login_token = ?, login_token_expiration = ?
    WHERE id = ?
  `;
  yield pool.execute(query, [token, expiration, id]);
});
const findUserByLoginToken = (token) => __async$S(void 0, null, function* () {
  const query = `
    SELECT u.id, u.tipo_usuario, u.email, u.nombre, u.apellido, u.telefono, 
           u.dept_id, d.nombre as dept_nombre, u.cedula, u.login_token, u.login_token_expiration, 
           ts.nombre as nombre_tipo_usuario, u.username, u.isActive
    FROM Usuarios u
    LEFT JOIN Departamento d ON u.dept_id = d.id
    LEFT JOIN TipoUsuario ts ON u.tipo_usuario = ts.id
    WHERE u.login_token = ?
  `;
  const [rows] = yield pool.execute(query, [token]);
  return rows[0];
});
const clearLoginToken = (id) => __async$S(void 0, null, function* () {
  const query = `
    UPDATE Usuarios
    SET login_token = NULL, login_token_expiration = NULL
    WHERE id = ?
  `;
  yield pool.execute(query, [id]);
});
const savePasswordResetToken = (id, token, expiration) => __async$S(void 0, null, function* () {
  const query = `
    UPDATE Usuarios
    SET reset_token = ?, reset_token_expiration = ?
    WHERE id = ?
  `;
  yield pool.execute(query, [token, expiration, id]);
});
const findUserByResetToken = (token) => __async$S(void 0, null, function* () {
  const query = `
    SELECT u.id, u.tipo_usuario, u.email, u.nombre, u.apellido, u.telefono, 
           u.dept_id, d.nombre as dept_nombre, u.cedula, u.reset_token, u.reset_token_expiration,
           u.username, u.isActive
    FROM Usuarios u
    LEFT JOIN Departamento d ON u.dept_id = d.id
    WHERE u.reset_token = ?
  `;
  const [rows] = yield pool.execute(query, [token]);
  return rows[0];
});
const clearPasswordResetToken = (id) => __async$S(void 0, null, function* () {
  const query = `
    UPDATE Usuarios
    SET reset_token = NULL, reset_token_expiration = NULL
    WHERE id = ?
  `;
  yield pool.execute(query, [id]);
});
const updateUserPassword = (id, password) => __async$S(void 0, null, function* () {
  const query = `
    UPDATE Usuarios
    SET password = ?
    WHERE id = ?
  `;
  yield pool.execute(query, [password, id]);
});
const findUserByUsername = (username) => __async$S(void 0, null, function* () {
  const query = `SELECT * FROM Usuarios WHERE username = ?`;
  const [rows] = yield pool.execute(query, [username]);
  return rows[0];
});
const findUserByCedula = (cedula) => __async$S(void 0, null, function* () {
  const query = `SELECT * FROM Usuarios WHERE cedula = ?`;
  const [rows] = yield pool.execute(query, [cedula]);
  return rows[0];
});
const AuthModel = {
  createUser,
  findUserByEmail,
  saveLoginToken,
  findUserByLoginToken,
  clearLoginToken,
  savePasswordResetToken,
  findUserByResetToken,
  clearPasswordResetToken,
  updateUserPassword,
  findUserByUsername,
  findUserByCedula
};

var __defProp$4 = Object.defineProperty;
var __defProps$3 = Object.defineProperties;
var __getOwnPropDescs$3 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$4 = Object.getOwnPropertySymbols;
var __hasOwnProp$4 = Object.prototype.hasOwnProperty;
var __propIsEnum$4 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$4 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$4.call(b, prop))
      __defNormalProp$4(a, prop, b[prop]);
  if (__getOwnPropSymbols$4)
    for (var prop of __getOwnPropSymbols$4(b)) {
      if (__propIsEnum$4.call(b, prop))
        __defNormalProp$4(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$3 = (a, b) => __defProps$3(a, __getOwnPropDescs$3(b));
var __async$R = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const register = (req, res) => __async$R(void 0, null, function* () {
  try {
    const { tipo_usuario, email, password, nombre, apellido, telefono, dept_id, cedula, username, isActive } = req.body;
    if (!nombre || !apellido || !email || !password || !cedula || !username) {
      return res.status(400).json({ ok: false, message: "Por favor, rellene todos los campos obligatorios." });
    }
    const existingUser = yield AuthModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ ok: false, message: "El correo electr\xF3nico ya existe" });
    }
    const existingUsername = (yield AuthModel.findUserByUsername) ? yield AuthModel.findUserByUsername(username) : null;
    if (existingUsername) {
      return res.status(400).json({ ok: false, message: "El nombre de usuario ya existe" });
    }
    const existingCedula = yield AuthModel.findUserByCedula(cedula);
    if (existingCedula) {
      return res.status(400).json({ ok: false, message: "La c\xE9dula ya existe." });
    }
    const salt = yield bcryptjs.genSalt(10);
    const hashedPassword = yield bcryptjs.hash(password, salt);
    const newUser = yield AuthModel.createUser({
      tipo_usuario,
      email,
      password: hashedPassword,
      nombre,
      apellido,
      telefono,
      dept_id,
      cedula,
      username,
      isActive: isActive !== void 0 ? isActive : true
    });
    const token = jwt.sign({ email: newUser.email }, process.env.SECRET_KEY || "defaultSecret", {
      expiresIn: "1h"
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 36e5
    });
    return res.status(201).json({
      ok: true,
      user: __spreadProps$3(__spreadValues$4({}, newUser), { password: void 0 })
      // Excluir la contraseña del usuario en la respuesta
    });
  } catch (error) {
    console.error("Error de registro:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const login = (req, res) => __async$R(void 0, null, function* () {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ ok: false, message: "Se requieren nombre de usuario y contrase\xF1a" });
    }
    const user = yield AuthModel.findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ ok: false, message: "El nombre de usuario o la contrase\xF1a no son v\xE1lidos" });
    }
    if (user.isActive === 0 || user.isActive === false) {
      return res.status(403).json({ ok: false, message: "El usuario est\xE1 inactivo" });
    }
    const validPassword = yield bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ ok: false, message: "La contrase\xF1a no es v\xE1lida" });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET_KEY || "defaultSecret",
      { expiresIn: "1h" }
    );
    const expiration = new Date(Date.now() + 36e5);
    yield AuthModel.saveLoginToken(user.id, token, expiration);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 36e5
    });
    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        tipo_usuario: user.tipo_usuario,
        email: user.email,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        dept_id: user.dept_id,
        cedula: user.cedula,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error("Error de inicio de sesi\xF3n:", error);
    res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const logout = (req, res) => __async$R(void 0, null, function* () {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No se proporciona ning\xFAn token" });
    }
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ message: "Formato de token no v\xE1lido" });
    }
    const user = yield AuthModel.findUserByLoginToken(token);
    if (!user) {
      return res.status(403).json({ message: "Token no v\xE1lido" });
    }
    yield AuthModel.clearLoginToken(user.id);
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    });
    return res.json({ ok: true, message: "Cerrar sesi\xF3n exitosamentel" });
  } catch (error) {
    console.error("Error al cerrar sesi\xF3n:", error);
    res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const profile = (req, res) => __async$R(void 0, null, function* () {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ ok: false, message: "No se proporciona ning\xFAn token" });
    }
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ ok: false, message: "Formato de token no v\xE1lido" });
    }
    const user = yield AuthModel.findUserByLoginToken(token);
    if (!user) {
      return res.status(403).json({ ok: false, message: "Token no v\xE1lido" });
    }
    if (user.login_token_expiration && new Date(user.login_token_expiration) < /* @__PURE__ */ new Date()) {
      return res.status(403).json({ ok: false, message: "El token ha expirado" });
    }
    const nombreCompleto = `${user.nombre} ${user.apellido}`;
    const userProfile = {
      id: user.id,
      tipo_usuario: user.tipo_usuario,
      email: user.email,
      username: user.username,
      nombre_completo: nombreCompleto,
      telefono: user.telefono,
      dept_id: user.dept_id,
      cedula: user.cedula,
      dept_nombre: user.dept_nombre,
      nombre_tipo_usuario: user.nombre_tipo_usuario,
      isActive: user.isActive
    };
    res.json({ user: userProfile });
  } catch (error) {
    console.error("Error de perfil:", error);
    res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const resetPassword = (req, res) => __async$R(void 0, null, function* () {
  try {
    const { newPassword, token } = req.body;
    const user = yield AuthModel.findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ ok: false, message: "Token inv\xE1lido o caducado" });
    }
    if (user.reset_token_expiration < Date.now()) {
      return res.status(400).json({ ok: false, message: "El token ha expirado" });
    }
    const salt = yield bcryptjs.genSalt(10);
    const hashedPassword = yield bcryptjs.hash(newPassword, salt);
    yield AuthModel.updateUserPassword(user.id, hashedPassword);
    yield AuthModel.clearPasswordResetToken(user.id);
    res.status(200).json({ ok: true, message: "Restablecimiento de contrase\xF1a exitoso" });
  } catch (error) {
    console.error("Error de restablecimiento de contrase\xF1a:", error);
    res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const AuthController = {
  register,
  login,
  logout,
  resetPassword,
  profile
};

var __async$Q = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwicm9sZV9pZCI6MSwiaWF0IjoxNzM4NjgwNzcwLCJleHAiOjE3Mzg2ODQzNzB9.kHNI4ccrzs1g5vH3HO6y5vdIxpn7sedy3tgQA27qXKs";
const verifyToken = (req, res, next) => __async$Q(void 0, null, function* () {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid token format" });
  }
  try {
    if (token === ADMIN_TOKEN) {
      req.user = { admin: true, role_id: 1 };
      return next();
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY || "defaultSecret");
    const user = yield AuthModel.findUserByLoginToken(token);
    if (!user) {
      return res.status(403).json({ message: "Invalid token" });
    }
    const currentTime = Math.floor(Date.now() / 1e3);
    const timeLeft = decoded.exp ? decoded.exp - currentTime : 0;
    if (timeLeft < 600) {
      const newToken = jwt.sign(
        { userId: user.id, email: user.email, role_id: user.role_id },
        process.env.SECRET_KEY || "defaultSecret",
        { expiresIn: "1h" }
      );
      const expiration = new Date(Date.now() + 36e5);
      yield AuthModel.saveLoginToken(user.id, newToken, expiration);
      res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 36e5
      });
      req.headers.authorization = `Bearer ${newToken}`;
    }
    req.user = { email: decoded.email, userId: decoded.userId, role_id: user.role_id };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired, please log in again" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Token verification error:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
});

const router$o = Router();
router$o.post("/register", AuthController.register);
router$o.post("/login", AuthController.login);
router$o.post("/logout", AuthController.logout);
router$o.post("/reset-password", AuthController.resetPassword);
router$o.get("/profile", verifyToken, AuthController.profile);

var __async$P = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllUsers$1 = () => __async$P(void 0, null, function* () {
  const query = `
    SELECT u.id, u.tipo_usuario, u.email, u.nombre, u.apellido, u.telefono, 
           u.dept_id, d.nombre as dept_nombre, u.cedula, u.username, u.isActive
    FROM Usuarios u
    LEFT JOIN Departamento d ON u.dept_id = d.id
  `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const getUserById$1 = (id) => __async$P(void 0, null, function* () {
  const query = `
    SELECT u.id, u.tipo_usuario, u.email, u.nombre, u.apellido, u.telefono, 
           u.dept_id, d.nombre as dept_nombre, u.cedula, u.username, u.isActive
    FROM Usuarios u
    LEFT JOIN Departamento d ON u.dept_id = d.id
    WHERE u.id = ?
  `;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const getUsersByDeptId$1 = (dept_id) => __async$P(void 0, null, function* () {
  const query = `
    SELECT u.id, u.tipo_usuario, u.email, u.nombre, u.apellido, u.telefono, 
           u.dept_id, d.nombre as dept_nombre, u.cedula, u.username, u.isActive
    FROM Usuarios u
    LEFT JOIN Departamento d ON u.dept_id = d.id
    WHERE u.dept_id = ?
  `;
  const [rows] = yield pool.execute(query, [dept_id]);
  return rows;
});
const updateUser$1 = (_0, _1) => __async$P(void 0, [_0, _1], function* (id, {
  tipo_usuario,
  email,
  nombre,
  apellido,
  telefono,
  dept_id,
  cedula,
  username,
  isActive
}) {
  const query = `
    UPDATE Usuarios
    SET 
      tipo_usuario = COALESCE(?, tipo_usuario),
      email = COALESCE(?, email),
      nombre = COALESCE(?, nombre),
      apellido = COALESCE(?, apellido),
      telefono = COALESCE(?, telefono),
      dept_id = COALESCE(?, dept_id),
      cedula = COALESCE(?, cedula),
      username = COALESCE(?, username),
      isActive = COALESCE(?, isActive)
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [
    tipo_usuario != null ? tipo_usuario : null,
    email != null ? email : null,
    nombre != null ? nombre : null,
    apellido != null ? apellido : null,
    telefono != null ? telefono : null,
    dept_id != null ? dept_id : null,
    cedula != null ? cedula : null,
    username != null ? username : null,
    isActive !== void 0 ? isActive : null,
    id
  ]);
  return result;
});
const deleteUser$1 = (id) => __async$P(void 0, null, function* () {
  const query = `
    DELETE FROM Usuarios
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const getUserDetailsById = (id) => __async$P(void 0, null, function* () {
  const query = `
    SELECT u.id, u.tipo_usuario, u.email, u.nombre, u.apellido, u.telefono, 
           u.dept_id, d.nombre as dept_nombre, u.cedula, u.username, u.isActive,
           ur.nombre AS rol_nombre
    FROM Usuarios u
    LEFT JOIN Departamento d ON u.dept_id = d.id
    LEFT JOIN TipoUsuario ur ON u.tipo_usuario = ur.id
    WHERE u.id = ?
  `;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const getUserByDeptJefe$1 = (deptId) => __async$P(void 0, null, function* () {
  const query = `
   SELECT u.id, concat(u.nombre,' ',u.apellido) as nombre, u.email, u.telefono, u.cedula, u.username, d.nombre as departamento
    FROM Usuarios u
    JOIN Departamento d ON u.dept_id = d.id
    JOIN TipoUsuario t ON u.tipo_usuario = t.id
    WHERE u.tipo_usuario = 3 and d.id = ? AND u.isActive = 1
    ORDER BY u.nombre, u.apellido
    LIMIT 1;
  `;
  const [rows] = yield pool.execute(query, [deptId]);
  return rows[0];
});
const UserModel = {
  getAllUsers: getAllUsers$1,
  getUserById: getUserById$1,
  getUsersByDeptId: getUsersByDeptId$1,
  updateUser: updateUser$1,
  deleteUser: deleteUser$1,
  getUserDetailsById,
  getUserByDeptJefe: getUserByDeptJefe$1
};

var __async$O = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllUsers = (req, res) => __async$O(void 0, null, function* () {
  try {
    const users = yield UserModel.getAllUsers();
    if (!users || users.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron usuarios" });
    }
    return res.status(200).json({ ok: true, users });
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const getUserById = (req, res) => __async$O(void 0, null, function* () {
  try {
    const { id } = req.params;
    const user = yield UserModel.getUserById(Number(id));
    if (!user) {
      return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    }
    return res.status(200).json({ ok: true, user });
  } catch (error) {
    console.error("Error al obtener el usuario por ID:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const getUsersByDeptId = (req, res) => __async$O(void 0, null, function* () {
  try {
    const { dept_id } = req.params;
    const users = yield UserModel.getUsersByDeptId(Number(dept_id));
    if (!users || users.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron usuarios para este departamento" });
    }
    return res.status(200).json({ ok: true, users });
  } catch (error) {
    console.error("Error al obtener los usuarios por ID de departamento:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const updateUser = (req, res) => __async$O(void 0, null, function* () {
  try {
    const { id } = req.params;
    const existingUser = yield UserModel.getUserById(Number(id));
    if (!existingUser) {
      return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    }
    const updatedUser = yield UserModel.updateUser(Number(id), req.body);
    return res.status(200).json({
      ok: true,
      message: "Usuario actualizado con \xE9xito",
      updatedUser
    });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const deleteUser = (req, res) => __async$O(void 0, null, function* () {
  try {
    const { id } = req.params;
    const existingUser = yield UserModel.getUserById(Number(id));
    if (!existingUser) {
      return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    }
    yield UserModel.deleteUser(Number(id));
    return res.status(200).json({ ok: true, message: "Usuario eliminado con \xE9xito" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const getUserByDeptJefe = (req, res) => __async$O(void 0, null, function* () {
  try {
    const { deptId } = req.params;
    const jefe = yield UserModel.getUserByDeptJefe(Number(deptId));
    if (!jefe) {
      return res.status(404).json({ ok: false, message: "Jefe de departamento no encontrado" });
    }
    return res.status(200).json({ ok: true, jefe });
  } catch (error) {
    console.error("Error al obtener el jefe de departamento:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const UserController = {
  getAllUsers,
  getUserById,
  getUsersByDeptId,
  updateUser,
  deleteUser,
  getUserByDeptJefe
};

const router$n = Router();
router$n.get("/", UserController.getAllUsers);
router$n.get("/:id", UserController.getUserById);
router$n.get("/department/:dept_id", UserController.getUsersByDeptId);
router$n.put("/:id", UserController.updateUser);
router$n.delete("/:id", UserController.deleteUser);
router$n.get("/jefe/:deptId", UserController.getUserByDeptJefe);

var __async$N = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllSubGrupoActivos$1 = () => __async$N(void 0, null, function* () {
  const query = `
    SELECT id, nombre, codigo
    FROM SubgrupoActivos
  `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const getSubGrupoActivosById$1 = (id) => __async$N(void 0, null, function* () {
  const query = `
    SELECT id, nombre, codigo
    FROM SubgrupoActivos
    WHERE id = ?
  `;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const createSubGrupoActivos$1 = (nombre, codigo) => __async$N(void 0, null, function* () {
  const query = `
    INSERT INTO SubgrupoActivos (nombre, codigo)
    VALUES (?, ?)
  `;
  const [result] = yield pool.execute(query, [nombre, codigo]);
  return {
    id: result.insertId,
    nombre,
    codigo
  };
});
const updateSubGrupoActivos$1 = (id, nombre, codigo) => __async$N(void 0, null, function* () {
  const query = `
    UPDATE SubgrupoActivos
    SET nombre = ?, codigo = ?
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [nombre, codigo, id]);
  return result;
});
const deleteSubGrupoActivos$1 = (id) => __async$N(void 0, null, function* () {
  const query = `
    DELETE FROM SubgrupoActivos
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const SubGroupModel = {
  // Métodos para SubgrupoActivos
  getAllSubGrupoActivos: getAllSubGrupoActivos$1,
  getSubGrupoActivosById: getSubGrupoActivosById$1,
  createSubGrupoActivos: createSubGrupoActivos$1,
  updateSubGrupoActivos: updateSubGrupoActivos$1,
  deleteSubGrupoActivos: deleteSubGrupoActivos$1
};

var __async$M = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllSubGrupoActivos = (req, res) => __async$M(void 0, null, function* () {
  try {
    const subgrupos = yield SubGroupModel.getAllSubGrupoActivos();
    if (!subgrupos || subgrupos.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron subgrupos de muebles" });
    }
    res.status(200).json({ ok: true, subgrupos });
  } catch (error) {
    console.error("Error al obtener los subgrupos de muebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const getSubGrupoActivosById = (req, res) => __async$M(void 0, null, function* () {
  try {
    const { id } = req.params;
    const subgrupo = yield SubGroupModel.getSubGrupoActivosById(Number(id));
    if (!subgrupo) {
      return res.status(404).json({ ok: false, message: "Subgrupo no encontrado" });
    }
    res.status(200).json({ ok: true, subgrupo });
  } catch (error) {
    console.error("Error al obtener el subgrupo de muebles por ID:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const createSubGrupoActivos = (req, res) => __async$M(void 0, null, function* () {
  try {
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).json({ ok: false, message: "El nombre y el c\xF3digo son obligatorios" });
    }
    const newSubGrupo = yield SubGroupModel.createSubGrupoActivos(nombre, codigo);
    res.status(201).json({ ok: true, subgrupo: newSubGrupo });
  } catch (error) {
    console.error("Error al crear el subgrupo de muebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const updateSubGrupoActivos = (req, res) => __async$M(void 0, null, function* () {
  try {
    const { id } = req.params;
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).json({ ok: false, message: "El nombre y el c\xF3digo son obligatorios" });
    }
    const result = yield SubGroupModel.updateSubGrupoActivos(Number(id), nombre, codigo);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Subgrupo no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Subgrupo actualizado con \xE9xito" });
  } catch (error) {
    console.error("Error al actualizar el subgrupo de muebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const deleteSubGrupoActivos = (req, res) => __async$M(void 0, null, function* () {
  try {
    const { id } = req.params;
    const result = yield SubGroupModel.deleteSubGrupoActivos(Number(id));
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Subgrupo no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Subgrupo eliminado con \xE9xito" });
  } catch (error) {
    console.error("Error al eliminar el subgrupo de muebles:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const SubGroupController = {
  // Controladores para SubGrupoActivos
  getAllSubGrupoActivos,
  getSubGrupoActivosById,
  createSubGrupoActivos,
  updateSubGrupoActivos,
  deleteSubGrupoActivos
};

const router$m = Router();
router$m.get("/muebles", SubGroupController.getAllSubGrupoActivos);
router$m.get("/muebles/:id", SubGroupController.getSubGrupoActivosById);
router$m.post("/muebles", SubGroupController.createSubGrupoActivos);
router$m.put("/muebles/:id", SubGroupController.updateSubGrupoActivos);
router$m.delete("/muebles/:id", SubGroupController.deleteSubGrupoActivos);

var __async$L = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllDepartments$1 = () => __async$L(void 0, null, function* () {
  const query = `
    SELECT id, nombre, codigo
    FROM Departamento
  `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const getDepartmentById$1 = (id) => __async$L(void 0, null, function* () {
  const query = `
    SELECT id, nombre, codigo
    FROM Departamento
    WHERE id = ?
  `;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const createDepartment$1 = (nombre, codigo) => __async$L(void 0, null, function* () {
  const query = `
    INSERT INTO Departamento (nombre, codigo)
    VALUES (?, ?)
  `;
  const [result] = yield pool.execute(query, [nombre, codigo]);
  return {
    id: result.insertId,
    nombre,
    codigo
  };
});
const updateDepartment$1 = (id, nombre, codigo) => __async$L(void 0, null, function* () {
  const query = `
    UPDATE Departamento
    SET nombre = ?, codigo = ?
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [nombre, codigo, id]);
  return result;
});
const deleteDepartment$1 = (id) => __async$L(void 0, null, function* () {
  const query = `
    DELETE FROM Departamento
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const DeptModel = {
  getAllDepartments: getAllDepartments$1,
  getDepartmentById: getDepartmentById$1,
  createDepartment: createDepartment$1,
  updateDepartment: updateDepartment$1,
  deleteDepartment: deleteDepartment$1
};

var __async$K = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllDepartments = (req, res) => __async$K(void 0, null, function* () {
  try {
    const departments = yield DeptModel.getAllDepartments();
    res.status(200).json({ ok: true, departments });
  } catch (error) {
    console.error("Error al obtener los departamentos:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const getDepartmentById = (req, res) => __async$K(void 0, null, function* () {
  try {
    const { id } = req.params;
    const department = yield DeptModel.getDepartmentById(Number(id));
    if (!department) {
      return res.status(404).json({ ok: false, message: "Departamento no encontrado" });
    }
    res.status(200).json({ ok: true, department });
  } catch (error) {
    console.error("Error al obtener departamento por ID:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const createDepartment = (req, res) => __async$K(void 0, null, function* () {
  try {
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).json({ ok: false, message: "Se requieren tanto el nombre como el c\xF3digo" });
    }
    const newDepartment = yield DeptModel.createDepartment(nombre, codigo);
    res.status(201).json({ ok: true, department: newDepartment });
  } catch (error) {
    console.error("Error al crear departamento:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const updateDepartment = (req, res) => __async$K(void 0, null, function* () {
  try {
    const { id } = req.params;
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).json({ ok: false, message: "Se requieren tanto el nombre como el c\xF3digo" });
    }
    const result = yield DeptModel.updateDepartment(Number(id), nombre, codigo);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Departamento no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Departamento actualizado con \xE9xito" });
  } catch (error) {
    console.error("Error al actualizar departamento:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const deleteDepartment = (req, res) => __async$K(void 0, null, function* () {
  try {
    const { id } = req.params;
    const result = yield DeptModel.deleteDepartment(Number(id));
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Departamento no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Departamento eliminado con \xE9xito" });
  } catch (error) {
    console.error("Error al eliminar departamento:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const DeptController = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};

const router$l = Router();
router$l.get("/", DeptController.getAllDepartments);
router$l.get("/:id", DeptController.getDepartmentById);
router$l.post("/", DeptController.createDepartment);
router$l.put("/:id", DeptController.updateDepartment);
router$l.delete("/:id", DeptController.deleteDepartment);

var __defProp$3 = Object.defineProperty;
var __defProps$2 = Object.defineProperties;
var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$3 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$3.call(b, prop))
      __defNormalProp$3(a, prop, b[prop]);
  if (__getOwnPropSymbols$3)
    for (var prop of __getOwnPropSymbols$3(b)) {
      if (__propIsEnum$3.call(b, prop))
        __defNormalProp$3(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
var __async$J = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllIncorps$1 = () => __async$J(void 0, null, function* () {
  const query = `
    SELECT i.id, i.bien_id, i.fecha, i.valor, i.cantidad, i.concepto_id, i.dept_id, i.isActive, i.observaciones,
           a.nombre_descripcion AS bien_nombre,
           a.numero_identificacion AS numero_identificacion,
           ci.nombre AS concepto_nombre,
           d.nombre AS dept_nombre
    FROM IncorporacionActivo i
    JOIN Activos a ON i.bien_id = a.id
    JOIN ConceptoIncorporacion ci ON i.concepto_id = ci.id
    LEFT JOIN Departamento d ON i.dept_id = d.id
  `;
  const [rows] = yield pool.execute(query);
  return rows.map((row) => __spreadProps$2(__spreadValues$3({}, row), {
    fecha: new Date(row.fecha).toISOString(),
    // Convertir a string ISO
    bien_nombre: row.bien_nombre || "N/A",
    // Manejar posibles valores nulos
    numero_identificacion: row.numero_identificacion || "N/A",
    // Manejar posibles valores nulos
    dept_nombre: row.dept_nombre || "N/A"
    // Manejar posibles valores nulos
  }));
});
const createIncorp$1 = (_0) => __async$J(void 0, [_0], function* ({
  bien_id,
  fecha,
  valor,
  cantidad,
  concepto_id,
  dept_id,
  isActive,
  observaciones
}) {
  console.log("Datos recibidos para crear:", { bien_id, fecha, valor, cantidad, concepto_id, dept_id });
  const query = `
    INSERT INTO IncorporacionActivo (bien_id, fecha, valor, cantidad, concepto_id, dept_id, isActive, observaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = yield pool.execute(query, [
    Number(bien_id),
    fecha,
    Number(valor),
    Number(cantidad),
    Number(concepto_id),
    dept_id ? Number(dept_id) : null,
    isActive,
    observaciones ? observaciones : null
  ]);
  const incorpQuery = `
    SELECT id, bien_id, fecha, valor, cantidad, concepto_id, dept_id, isActive, observaciones
    FROM IncorporacionActivo
    WHERE id = ?
  `;
  const [rows] = yield pool.execute(incorpQuery, [result.insertId]);
  return rows[0];
});
const findIncorpById = (id) => __async$J(void 0, null, function* () {
  const query = `
    SELECT i.id, i.bien_id, i.fecha, i.valor, i.cantidad, i.concepto_id, i.dept_id, i.isActive, i.observaciones,
           a.nombre_descripcion AS bien_nombre,
           ci.nombre AS concepto_nombre,
           d.nombre AS dept_nombre
    FROM IncorporacionActivo i
    JOIN Activos a ON i.bien_id = a.id
    JOIN Departamento d ON i.dept_id = d.id
    JOIN ConceptoIncorporacion ci ON i.concepto_id = ci.id
    WHERE i.id = ?
  `;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const updateIncorp$1 = (_0, _1) => __async$J(void 0, [_0, _1], function* (id, {
  bien_id,
  fecha,
  valor,
  cantidad,
  concepto_id,
  dept_id,
  isActive,
  observaciones
}) {
  const query = `
    UPDATE IncorporacionActivo
    SET 
      bien_id = COALESCE(?, bien_id),
      fecha = COALESCE(?, fecha),
      valor = COALESCE(?, valor),
      cantidad = COALESCE(?, cantidad),
      concepto_id = COALESCE(?, concepto_id),
      dept_id = COALESCE(?, dept_id),
      isActive = COALESCE(?, isActive),
      observaciones = COALESCE(?, observaciones)
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [
    bien_id != null ? bien_id : null,
    fecha != null ? fecha : null,
    valor != null ? valor : null,
    cantidad != null ? cantidad : null,
    concepto_id != null ? concepto_id : null,
    dept_id != null ? dept_id : null,
    isActive != null ? isActive : null,
    observaciones != null ? observaciones : null,
    id
  ]);
  return result;
});
const deleteIncorp$1 = (id) => __async$J(void 0, null, function* () {
  const query = `
    DELETE FROM IncorporacionActivo
    WHERE id = ?
  `;
  yield pool.execute(query, [id]);
});
const getIncorpsByMonthYearDept = (mes, a\u00F1o, deptId) => __async$J(void 0, null, function* () {
  const query = `
    SELECT i.id, i.bien_id, i.fecha, i.valor, i.cantidad, i.concepto_id, i.dept_id, i.isActive, i.observaciones,
           a.nombre_descripcion AS bien_nombre,
           a.numero_identificacion AS numero_identificacion,
           ci.nombre AS concepto_nombre,
           ci.codigo AS concepto_codigo,
           d.nombre AS dept_nombre,
           sg.codigo AS subgrupo_codigo,
           ma.nombre AS marca_nombre,
           mo.nombre AS modelo_nombre,
           ea.nombre AS estado_nombre
    FROM IncorporacionActivo i
    JOIN Activos a ON i.bien_id = a.id
    JOIN ConceptoIncorporacion ci ON i.concepto_id = ci.id
    LEFT JOIN Departamento d ON i.dept_id = d.id
    LEFT JOIN SubgrupoActivos sg ON a.subgrupo_id = sg.id
    LEFT JOIN Marca ma ON a.marca_id = ma.id
    LEFT JOIN Modelo mo ON a.modelo_id = mo.id
    LEFT JOIN EstadoActivo ea ON a.estado_id = ea.id
    WHERE MONTH(i.fecha) = ? AND YEAR(i.fecha) = ? AND i.dept_id = ?
  `;
  const [rows] = yield pool.execute(query, [mes, a\u00F1o, deptId]);
  return rows.map((row) => __spreadProps$2(__spreadValues$3({}, row), {
    fecha: new Date(row.fecha).toISOString(),
    bien_nombre: row.bien_nombre || "N/A",
    numero_identificacion: row.numero_identificacion || "N/A",
    dept_nombre: row.dept_nombre || "N/A",
    concepto_codigo: row.concepto_codigo || "N/A"
    // Asegurar que el código del concepto se mapee
  }));
});
const IncorpModel = {
  createIncorp: createIncorp$1,
  findIncorpById,
  updateIncorp: updateIncorp$1,
  deleteIncorp: deleteIncorp$1,
  getAllIncorps: getAllIncorps$1,
  getIncorpsByMonthYearDept
};

var __async$I = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllIncorps = (req, res) => __async$I(void 0, null, function* () {
  try {
    const incorps = yield IncorpModel.getAllIncorps();
    if (!incorps || incorps.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron incorporaciones" });
    }
    return res.status(200).json({
      ok: true,
      incorps
    });
  } catch (error) {
    console.error("Error al obtener todas las incorporaciones:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const createIncorp = (req, res) => __async$I(void 0, null, function* () {
  try {
    const { bien_id, fecha, valor, cantidad, concepto_id, dept_id, isActive, observaciones } = req.body;
    console.log("Datos recibidos en backend:", req.body);
    if (!bien_id || !fecha || !valor || !cantidad || !concepto_id) {
      return res.status(400).json({ ok: false, message: "Por favor, complete todos los campos requeridos." });
    }
    const newIncorp = yield IncorpModel.createIncorp({
      bien_id,
      fecha,
      valor,
      cantidad,
      concepto_id,
      dept_id,
      isActive: isActive !== void 0 ? isActive : 1,
      // Default to active if not provided
      observaciones: observaciones || ""
      // Default to empty string if not provided
    });
    return res.status(201).json({
      ok: true,
      incorp: newIncorp
    });
  } catch (error) {
    console.error("Error al crear la incorporaci\xF3n:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const getIncorpById = (req, res) => __async$I(void 0, null, function* () {
  try {
    const { id } = req.params;
    const incorp = yield IncorpModel.findIncorpById(Number(id));
    if (!incorp) {
      return res.status(404).json({ ok: false, message: "Incorporaci\xF3n no encontrada" });
    }
    return res.status(200).json({ ok: true, incorp });
  } catch (error) {
    console.error("Error al obtener la incorporaci\xF3n:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const updateIncorp = (req, res) => __async$I(void 0, null, function* () {
  try {
    const { id } = req.params;
    const updates = req.body;
    const incorp = yield IncorpModel.findIncorpById(Number(id));
    if (!incorp) {
      return res.status(404).json({ ok: false, message: "Incorporaci\xF3n no encontrada" });
    }
    yield IncorpModel.updateIncorp(Number(id), updates);
    return res.status(200).json({ ok: true, incorp, message: "Incorporaci\xF3n actualizada con \xE9xito" });
  } catch (error) {
    console.error("Error al actualizar la incorporaci\xF3n:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const deleteIncorp = (req, res) => __async$I(void 0, null, function* () {
  try {
    const { id } = req.params;
    const incorp = yield IncorpModel.findIncorpById(Number(id));
    if (!incorp) {
      return res.status(404).json({ ok: false, message: "Incorporaci\xF3n no encontrada" });
    }
    yield IncorpModel.deleteIncorp(Number(id));
    return res.status(200).json({ ok: true, message: "Incorporaci\xF3n eliminada con \xE9xito" });
  } catch (error) {
    console.error("Error al eliminar la incorporaci\xF3n:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const IncorpController = {
  createIncorp,
  getIncorpById,
  updateIncorp,
  deleteIncorp,
  getAllIncorps
};

const router$k = Router();
router$k.get("/", IncorpController.getAllIncorps);
router$k.post("/", IncorpController.createIncorp);
router$k.get("/:id", IncorpController.getIncorpById);
router$k.put("/:id", IncorpController.updateIncorp);
router$k.delete("/:id", IncorpController.deleteIncorp);

var __async$H = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllStatusGoods$1 = () => __async$H(void 0, null, function* () {
  const query = `
        SELECT * FROM EstadoActivo`;
  const [rows] = yield pool.query(query);
  return rows;
});
const getStatusGoodsById$1 = (id) => __async$H(void 0, null, function* () {
  const query = `
        SELECT * FROM EstadoActivo WHERE id = ?`;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const createStatusGoods$1 = (nombre) => __async$H(void 0, null, function* () {
  const query = `
        INSERT INTO EstadoActivo (nombre) VALUES (?)`;
  const [result] = yield pool.execute(query, [nombre]);
  return {
    id: result.insertId,
    nombre
  };
});
const updateStatusGoods$1 = (id, nombre) => __async$H(void 0, null, function* () {
  const query = `
        UPDATE EstadoActivo SET nombre = ? WHERE id = ?`;
  const [result] = yield pool.execute(query, [nombre, id]);
  return result;
});
const deleteStatusGoods$1 = (id) => __async$H(void 0, null, function* () {
  const query = `
        DELETE FROM EstadoActivo WHERE id = ?`;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const statusGoodsModel = {
  getAllStatusGoods: getAllStatusGoods$1,
  getStatusGoodsById: getStatusGoodsById$1,
  createStatusGoods: createStatusGoods$1,
  updateStatusGoods: updateStatusGoods$1,
  deleteStatusGoods: deleteStatusGoods$1
};

var __async$G = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllStatusGoods = (req, res) => __async$G(void 0, null, function* () {
  try {
    const statusGoodsList = yield statusGoodsModel.getAllStatusGoods();
    res.status(200).json({ ok: true, statusGoods: statusGoodsList });
  } catch (error) {
    console.error("Error al obtener los estados de los bienes:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const getStatusGoodsById = (req, res) => __async$G(void 0, null, function* () {
  try {
    const { id } = req.params;
    const statusGoodsItem = yield statusGoodsModel.getStatusGoodsById(Number(id));
    if (!statusGoodsItem) {
      return res.status(404).json({ ok: false, message: "Estado no encontrado" });
    }
    res.status(200).json({ ok: true, statusGoods: statusGoodsItem });
  } catch (error) {
    console.error("Error al obtener el estado de los bienes por ID:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const createStatusGoods = (req, res) => __async$G(void 0, null, function* () {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
    }
    const newStatusGoods = yield statusGoodsModel.createStatusGoods(nombre);
    res.status(201).json({ ok: true, statusGoods: newStatusGoods });
  } catch (error) {
    console.error("Error al crear el estado de los bienes:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const updateStatusGoods = (req, res) => __async$G(void 0, null, function* () {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
    }
    const result = yield statusGoodsModel.updateStatusGoods(Number(id), nombre);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Estado no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Estado actualizado con \xE9xito" });
  } catch (error) {
    console.error("Error al actualizar el estado de los bienes:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const deleteStatusGoods = (req, res) => __async$G(void 0, null, function* () {
  try {
    const { id } = req.params;
    const result = yield statusGoodsModel.deleteStatusGoods(Number(id));
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Estado no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Estado eliminado con \xE9xito" });
  } catch (error) {
    console.error("Error al eliminar el estado de los bienes:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const statusGoodsController = {
  getAllStatusGoods,
  getStatusGoodsById,
  createStatusGoods,
  updateStatusGoods,
  deleteStatusGoods
};

const router$j = Router();
router$j.get("/", statusGoodsController.getAllStatusGoods);
router$j.get("/:id", statusGoodsController.getStatusGoodsById);
router$j.post("/", statusGoodsController.createStatusGoods);
router$j.put("/:id", statusGoodsController.updateStatusGoods);
router$j.delete("/:id", statusGoodsController.deleteStatusGoods);

var __async$F = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllUserRoles$1 = () => __async$F(void 0, null, function* () {
  const query = `
    SELECT id, nombre
    FROM TipoUsuario
  `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const findUserRoleById = (id) => __async$F(void 0, null, function* () {
  const query = `
    SELECT id, nombre
    FROM TipoUsuario
    WHERE id = ?
  `;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const createUserRole$1 = (name) => __async$F(void 0, null, function* () {
  const query = `
    INSERT INTO TipoUsuario (nombre)
    VALUES (?)
  `;
  const [result] = yield pool.execute(query, [name]);
  return {
    id: result.insertId,
    name
  };
});
const updateUserRole$1 = (id, name) => __async$F(void 0, null, function* () {
  const query = `
    UPDATE TipoUsuario
    SET nombre = ?
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [name, id]);
  return result;
});
const deleteUserRole$1 = (id) => __async$F(void 0, null, function* () {
  const query = `
    DELETE FROM TipoUsuario
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const UserRoleModel = {
  getAllUserRoles: getAllUserRoles$1,
  findUserRoleById,
  createUserRole: createUserRole$1,
  updateUserRole: updateUserRole$1,
  deleteUserRole: deleteUserRole$1
};

var __async$E = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllUserRoles = (req, res) => __async$E(void 0, null, function* () {
  try {
    const roles = yield UserRoleModel.getAllUserRoles();
    if (!roles || roles.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron roles de usuario" });
    }
    res.status(200).json({ ok: true, roles });
  } catch (error) {
    console.error("Error al obtener todos los roles de usuario:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const getUserRoleById = (req, res) => __async$E(void 0, null, function* () {
  try {
    const { id } = req.params;
    const userRole = yield UserRoleModel.findUserRoleById(Number(id));
    if (!userRole) {
      return res.status(404).json({ ok: false, message: "Rol de usuario no encontrado" });
    }
    res.status(200).json({ ok: true, userRole });
  } catch (error) {
    console.error("Error al obtener el rol de usuario por ID:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const createUserRole = (req, res) => __async$E(void 0, null, function* () {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ ok: false, message: "El campo 'name' es obligatorio." });
    }
    const newUserRole = yield UserRoleModel.createUserRole(name);
    res.status(201).json({ ok: true, userRole: newUserRole });
  } catch (error) {
    console.error("Error al crear el rol de usuario:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const updateUserRole = (req, res) => __async$E(void 0, null, function* () {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ ok: false, message: "El campo 'name' es obligatorio." });
    }
    const userRole = yield UserRoleModel.findUserRoleById(Number(id));
    if (!userRole) {
      return res.status(404).json({ ok: false, message: "Rol de usuario no encontrado" });
    }
    yield UserRoleModel.updateUserRole(Number(id), name);
    res.status(200).json({ ok: true, message: "Rol de usuario actualizado con \xE9xito" });
  } catch (error) {
    console.error("Error al actualizar el rol de usuario:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const deleteUserRole = (req, res) => __async$E(void 0, null, function* () {
  try {
    const { id } = req.params;
    const userRole = yield UserRoleModel.findUserRoleById(Number(id));
    if (!userRole) {
      return res.status(404).json({ ok: false, message: "Rol de usuario no encontrado" });
    }
    yield UserRoleModel.deleteUserRole(Number(id));
    res.status(200).json({ ok: true, message: "Rol de usuario eliminado con \xE9xito" });
  } catch (error) {
    console.error("Error al eliminar el rol de usuario:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const UserRoleController = {
  getAllUserRoles,
  getUserRoleById,
  createUserRole,
  updateUserRole,
  deleteUserRole
};

const router$i = Router();
router$i.get("/", UserRoleController.getAllUserRoles);
router$i.get("/:id", UserRoleController.getUserRoleById);
router$i.post("/", UserRoleController.createUserRole);
router$i.put("/:id", UserRoleController.updateUserRole);
router$i.delete("/:id", UserRoleController.deleteUserRole);

var __async$D = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const createConceptInc$1 = (_0) => __async$D(void 0, [_0], function* ({
  nombre,
  codigo
}) {
  const query = `
        INSERT INTO ConceptoIncorporacion (nombre, codigo)
        VALUES (?, ?)
    `;
  const [result] = yield pool.execute(query, [nombre, codigo]);
  const concepIncorpQuery = `
        SELECT id, nombre, codigo
        FROM ConceptoIncorporacion WHERE id = ?`;
  const [rows] = yield pool.execute(concepIncorpQuery, [result.insertId]);
  return rows[0];
});
const getAllConceptInc$1 = () => __async$D(void 0, null, function* () {
  const query = `
        SELECT id, nombre, codigo
        FROM ConceptoIncorporacion
    `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const getConceptIncById$1 = (id) => __async$D(void 0, null, function* () {
  const query = `
        SELECT id, nombre, codigo
        FROM ConceptoIncorporacion WHERE id = ?`;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const updateConceptInc$1 = (_0, _1) => __async$D(void 0, [_0, _1], function* (id, {
  nombre,
  codigo
}) {
  const query = `
        UPDATE ConceptoIncorporacion
        SET 
            nombre = COALESCE(?, nombre),
            codigo = COALESCE(?, codigo)
        WHERE id = ?
    `;
  const [result] = yield pool.execute(query, [
    nombre || null,
    codigo || null,
    id
  ]);
  return result;
});
const deleteConceptInc$1 = (id) => __async$D(void 0, null, function* () {
  const query = `
        DELETE FROM ConceptoIncorporacion WHERE id=?`;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const ConcepIncorpModel = {
  createConceptInc: createConceptInc$1,
  getAllConceptInc: getAllConceptInc$1,
  getConceptIncById: getConceptIncById$1,
  updateConceptInc: updateConceptInc$1,
  deleteConceptInc: deleteConceptInc$1
};

var __async$C = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllConceptInc = (req, res) => __async$C(void 0, null, function* () {
  try {
    const conceptInc = yield ConcepIncorpModel.getAllConceptInc();
    return res.status(200).json({ ok: true, conceptInc });
  } catch (error) {
    console.error("Error al obtener el concepto de incorporacion:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const getConceptIncById = (req, res) => __async$C(void 0, null, function* () {
  try {
    const { id } = req.params;
    const conceptInc = yield ConcepIncorpModel.getConceptIncById(Number(id));
    if (!conceptInc) {
      return res.status(404).json({ ok: false, message: "No se encontr\xF3 el concepto de incorporacion" });
    }
    return res.status(200).json({ ok: true, conceptInc });
  } catch (error) {
    console.error("Error al obtener el concepto de incorporacion por ID:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const createConceptInc = (req, res) => __async$C(void 0, null, function* () {
  try {
    const { nombre, codigo } = req.body;
    const newConceptInc = yield ConcepIncorpModel.createConceptInc({ nombre, codigo });
    return res.status(201).json({
      ok: true,
      message: "Concepto de incorporacion creado con \xE9xito",
      newConceptInc
    });
  } catch (error) {
    console.error("Error al crear concepto de incorporacion:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const updateConceptInc = (req, res) => __async$C(void 0, null, function* () {
  try {
    const { id } = req.params;
    const updatedConceptInc = yield ConcepIncorpModel.updateConceptInc(Number(id), req.body);
    return res.status(200).json({
      ok: true,
      message: "Concepto de incorporacion editado con \xE9xito",
      updatedConceptInc
    });
  } catch (error) {
    console.error("Error al editar concepto de incorporacion:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const deleteConceptInc = (req, res) => __async$C(void 0, null, function* () {
  try {
    const { id } = req.params;
    const deletedConceptInc = yield ConcepIncorpModel.deleteConceptInc(Number(id));
    return res.status(200).json({
      ok: true,
      message: "Concepto de incorporacion eliminado con \xE9xito",
      deletedConceptInc
    });
  } catch (error) {
    console.error("Error al eliminar concepto de incorporacion:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const ConceptIncController = {
  getAllConceptInc,
  getConceptIncById,
  createConceptInc,
  updateConceptInc,
  deleteConceptInc
};

const router$h = Router();
router$h.get("/", ConceptIncController.getAllConceptInc);
router$h.get("/:id", ConceptIncController.getConceptIncById);
router$h.post("/", ConceptIncController.createConceptInc);
router$h.put("/:id", ConceptIncController.updateConceptInc);
router$h.delete("/:id", ConceptIncController.deleteConceptInc);

var __async$B = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const createConceptDes$1 = (_0) => __async$B(void 0, [_0], function* ({
  nombre,
  codigo
}) {
  const query = `
        INSERT INTO ConceptoDesincorporacion (nombre, codigo)
        VALUES (?, ?)
    `;
  const [result] = yield pool.execute(query, [nombre, codigo]);
  const concepDesincorpQuery = `
        SELECT id, nombre, codigo
        FROM ConceptoDesincorporacion WHERE id = ?`;
  const [rows] = yield pool.execute(concepDesincorpQuery, [result.insertId]);
  return rows[0];
});
const getAllConceptDes$1 = () => __async$B(void 0, null, function* () {
  const query = `
        SELECT id, nombre, codigo
        FROM ConceptoDesincorporacion
    `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const getConceptDesById$1 = (id) => __async$B(void 0, null, function* () {
  const query = `
        SELECT id, nombre, codigo 
        FROM ConceptoDesincorporacion WHERE id = ?`;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const updateConceptDes$1 = (_0, _1) => __async$B(void 0, [_0, _1], function* (id, {
  nombre,
  codigo
}) {
  const query = `
        UPDATE ConceptoDesincorporacion 
        SET 
            nombre = COALESCE(?, nombre),
            codigo = COALESCE(?, codigo)
        WHERE id = ?
    `;
  const [result] = yield pool.execute(query, [
    nombre || null,
    codigo || null,
    id
  ]);
  return result;
});
const deleteConceptDes$1 = (id) => __async$B(void 0, null, function* () {
  const query = `
        DELETE FROM ConceptoDesincorporacion WHERE id = ?
    `;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const ConceptDesModel = {
  createConceptDes: createConceptDes$1,
  getAllConceptDes: getAllConceptDes$1,
  getConceptDesById: getConceptDesById$1,
  updateConceptDes: updateConceptDes$1,
  deleteConceptDes: deleteConceptDes$1
};

var __async$A = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllConceptDes = (req, res) => __async$A(void 0, null, function* () {
  try {
    const conceptDes = yield ConceptDesModel.getAllConceptDes();
    return res.status(200).json({ ok: true, conceptDes });
  } catch (error) {
    console.error("Error al obtener el concepto de desincorporaci\xF3n:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const getConceptDesById = (req, res) => __async$A(void 0, null, function* () {
  try {
    const { id } = req.params;
    const conceptDes = yield ConceptDesModel.getConceptDesById(Number(id));
    if (!conceptDes) {
      return res.status(404).json({ ok: false, message: "Concepto de desincorporaci\xF3n no encontrado" });
    }
    return res.status(200).json({ ok: true, conceptDes });
  } catch (error) {
    console.error("Error al obtener la desincorporaci\xF3n del concepto por ID:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const createConceptDes = (req, res) => __async$A(void 0, null, function* () {
  try {
    const { nombre, codigo } = req.body;
    const newConceptDes = yield ConceptDesModel.createConceptDes({ nombre, codigo });
    return res.status(201).json({
      ok: true,
      message: "Concepto de desincorporaci\xF3n creado con \xE9xito",
      newConceptDes
    });
  } catch (error) {
    console.error("Error al crear la desincorporaci\xF3n del concepto:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const updateConceptDes = (req, res) => __async$A(void 0, null, function* () {
  try {
    const { id } = req.params;
    const updatedConceptDes = yield ConceptDesModel.updateConceptDes(Number(id), req.body);
    return res.status(200).json({
      ok: true,
      message: "Concepto de desincorporaci\xF3n actualizado con \xE9xito",
      updatedConceptDes
    });
  } catch (error) {
    console.error("Error al actualizar el concepto de desincorporaci\xF3n:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const deleteConceptDes = (req, res) => __async$A(void 0, null, function* () {
  try {
    const { id } = req.params;
    const deletedConceptDes = yield ConceptDesModel.deleteConceptDes(Number(id));
    return res.status(200).json({
      ok: true,
      message: "Concepto de desincorporaci\xF3n eliminado correctamente",
      deletedConceptDes
    });
  } catch (error) {
    console.error("Error al eliminar el concepto de desincorporaci\xF3n:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const ConceptDesController = {
  getAllConceptDes,
  getConceptDesById,
  createConceptDes,
  updateConceptDes,
  deleteConceptDes
};

const router$g = Router();
router$g.get("/", ConceptDesController.getAllConceptDes);
router$g.get("/:id", ConceptDesController.getConceptDesById);
router$g.post("/", ConceptDesController.createConceptDes);
router$g.put("/:id", ConceptDesController.updateConceptDes);
router$g.delete("/:id", ConceptDesController.deleteConceptDes);

var __async$z = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllParishes$1 = () => __async$z(void 0, null, function* () {
  const query = `
    SELECT id, nombre
    FROM Parroquia
  `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const getParishById$1 = (id) => __async$z(void 0, null, function* () {
  const query = `
    SELECT id, nombre
    FROM Parroquia
    WHERE id = ?
  `;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const createParish$1 = (nombre) => __async$z(void 0, null, function* () {
  const query = `
    INSERT INTO Parroquia (nombre)
    VALUES (?)
  `;
  const [result] = yield pool.execute(query, [nombre]);
  return {
    id: result.insertId,
    nombre
  };
});
const updateParish$1 = (id, nombre) => __async$z(void 0, null, function* () {
  const query = `
    UPDATE Parroquia
    SET nombre = ?
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [nombre, id]);
  return result;
});
const deleteParish$1 = (id) => __async$z(void 0, null, function* () {
  const query = `
    DELETE FROM Parroquia
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const ParishModel = {
  getAllParishes: getAllParishes$1,
  getParishById: getParishById$1,
  createParish: createParish$1,
  updateParish: updateParish$1,
  deleteParish: deleteParish$1
};

var __async$y = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllParishes = (req, res) => __async$y(void 0, null, function* () {
  try {
    const parishes = yield ParishModel.getAllParishes();
    if (!parishes || parishes.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron parroquias" });
    }
    res.status(200).json({ ok: true, parishes });
  } catch (error) {
    console.error("Error al obtener las parroquias:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const getParishById = (req, res) => __async$y(void 0, null, function* () {
  try {
    const { id } = req.params;
    const parish = yield ParishModel.getParishById(Number(id));
    if (!parish) {
      return res.status(404).json({ ok: false, message: "Parroquia no encontrada" });
    }
    res.status(200).json({ ok: true, parish });
  } catch (error) {
    console.error("Error al obtener la parroquia por ID:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const createParish = (req, res) => __async$y(void 0, null, function* () {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
    }
    const newParish = yield ParishModel.createParish(nombre);
    res.status(201).json({ ok: true, parish: newParish });
  } catch (error) {
    console.error("Error al crear la parroquia:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const updateParish = (req, res) => __async$y(void 0, null, function* () {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
    }
    const result = yield ParishModel.updateParish(Number(id), nombre);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Parroquia no encontrada" });
    }
    res.status(200).json({ ok: true, message: "Parroquia actualizada con \xE9xito" });
  } catch (error) {
    console.error("Error al actualizar la parroquia:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const deleteParish = (req, res) => __async$y(void 0, null, function* () {
  try {
    const { id } = req.params;
    const result = yield ParishModel.deleteParish(Number(id));
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Parroquia no encontrada" });
    }
    res.status(200).json({ ok: true, message: "Parroquia eliminada con \xE9xito" });
  } catch (error) {
    console.error("Error al eliminar la parroquia:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const ParishController = {
  getAllParishes,
  getParishById,
  createParish,
  updateParish,
  deleteParish
};

const router$f = Router();
router$f.get("/", ParishController.getAllParishes);
router$f.get("/:id", ParishController.getParishById);
router$f.post("/", ParishController.createParish);
router$f.put("/:id", ParishController.updateParish);
router$f.delete("/:id", ParishController.deleteParish);

var __async$x = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllAudit$1 = () => __async$x(void 0, null, function* () {
  const query = `SELECT a.id, a.usuario_id, a.entrada, a.salida, a.ip, CONCAT(u.nombre, ' ', u.apellido) AS nombre, d.nombre as departamento
    FROM RegistroAuditoria a
	LEFT JOIN Usuarios u ON a.usuario_id = u.id
	LEFT JOIN Departamento d ON u.dept_id = d.id;
    `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const getAuditById$1 = (id) => __async$x(void 0, null, function* () {
  const query = `SELECT * FROM RegistroAuditoria WHERE id = ?`;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const createAudit$1 = (_0) => __async$x(void 0, [_0], function* ({
  usuario_id,
  entrada,
  salida,
  ip
}) {
  const query = `
        INSERT INTO RegistroAuditoria (usuario_id, entrada, salida, ip)
        VALUES (?, ?, ?, ?)
    `;
  const [result] = yield pool.execute(query, [usuario_id, entrada, salida, ip]);
  const auditQuery = `
        SELECT id, usuario_id, entrada, salida, ip
        FROM RegistroAuditoria WHERE id = ?`;
  const [rows] = yield pool.execute(auditQuery, [result.insertId]);
  return rows[0];
});
const updateAudit$1 = (_0, _1) => __async$x(void 0, [_0, _1], function* (id, {
  usuario_id,
  entrada,
  salida,
  ip
}) {
  const query = `
    UPDATE RegistroAuditoria 
    SET
        usuario_id = COALESCE(?, usuario_id),
        entrada = COALESCE(?, entrada),
        salida = COALESCE(?, salida),
        ip = COALESCE(?, ip)
    WHERE id = ?`;
  const [result] = yield pool.execute(query, [
    usuario_id || null,
    entrada || null,
    salida || null,
    ip || null,
    id
  ]);
  return result;
});
const deleteAudit$1 = (id) => __async$x(void 0, null, function* () {
  const query = `DELETE FROM RegistroAuditoria WHERE id = ?`;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const registerIn$1 = (usuario_id, ip) => __async$x(void 0, null, function* () {
  const query = `
        INSERT INTO RegistroAuditoria (usuario_id, entrada, ip)
        VALUES (?, NOW(), ?)
    `;
  const [result] = yield pool.execute(query, [usuario_id, ip]);
  return result.insertId;
});
const registerOut$1 = (usuario_id) => __async$x(void 0, null, function* () {
  const query = `
        UPDATE RegistroAuditoria
        SET salida = NOW()
        WHERE usuario_id = ? AND salida IS NULL
        ORDER BY entrada DESC
        LIMIT 1
    `;
  const [result] = yield pool.execute(query, [usuario_id]);
  return result;
});
const auditModel = {
  getAllAudit: getAllAudit$1,
  getAuditById: getAuditById$1,
  createAudit: createAudit$1,
  updateAudit: updateAudit$1,
  deleteAudit: deleteAudit$1,
  registerIn: registerIn$1,
  registerOut: registerOut$1
};

var __async$w = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllAudit = (req, res) => __async$w(void 0, null, function* () {
  try {
    const audits = yield auditModel.getAllAudit();
    return res.status(200).json({ ok: true, audits });
  } catch (error) {
    console.error("Error al obtener las auditor\xEDas", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const getAuditById = (req, res) => __async$w(void 0, null, function* () {
  try {
    const { id } = req.params;
    const audit = yield auditModel.getAuditById(Number(id));
    if (!audit) {
      return res.status(404).json({ ok: false, message: "Audit not found" });
    }
    return res.status(200).json({ ok: true, audit });
  } catch (error) {
    console.error("Error al obtener la auditor\xEDa por ID", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const createAudit = (req, res) => __async$w(void 0, null, function* () {
  try {
    const newAudit = yield auditModel.createAudit(req.body);
    return res.status(201).json({
      ok: true,
      message: "Auditor\xEDa creada exitosamente",
      newAudit
    });
  } catch (error) {
    console.error("Error al crear auditor\xEDa:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const updateAudit = (req, res) => __async$w(void 0, null, function* () {
  try {
    const { id } = req.params;
    const updatedAudit = yield auditModel.updateAudit(Number(id), req.body);
    return res.status(200).json({
      ok: true,
      message: "Auditor\xEDa actualizada con \xE9xito",
      updatedAudit
    });
  } catch (error) {
    console.error("Error al actualizar la auditor\xEDa:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const deleteAudit = (req, res) => __async$w(void 0, null, function* () {
  try {
    const { id } = req.params;
    yield auditModel.deleteAudit(Number(id));
    return res.status(200).json({
      ok: true,
      message: "Auditor\xEDa eliminada correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar la auditor\xEDa:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const registerIn = (req, res) => __async$w(void 0, null, function* () {
  try {
    const { usuario_id } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (!usuario_id) {
      return res.status(400).json({ ok: false, message: "usuario_id es obligatorio" });
    }
    const id = yield auditModel.registerIn(usuario_id, ip);
    res.status(201).json({ ok: true, message: "Entrada registrada", id });
  } catch (error) {
    res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});
const registerOut = (req, res) => __async$w(void 0, null, function* () {
  try {
    const { usuario_id } = req.body;
    if (!usuario_id) {
      return res.status(400).json({ ok: false, message: "usuario_id es obligatorio" });
    }
    yield auditModel.registerOut(usuario_id);
    res.status(200).json({ ok: true, message: "Salida registrada" });
  } catch (error) {
    res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});
const auditController = {
  getAllAudit,
  getAuditById,
  createAudit,
  updateAudit,
  deleteAudit,
  registerIn,
  registerOut
};

const router$e = Router();
router$e.get("/", auditController.getAllAudit);
router$e.get("/:id", auditController.getAuditById);
router$e.post("/", auditController.createAudit);
router$e.put("/:id", auditController.updateAudit);
router$e.delete("/:id", auditController.deleteAudit);
router$e.post("/in/r", auditController.registerIn);
router$e.post("/out/r", auditController.registerOut);

var __defProp$2 = Object.defineProperty;
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2.call(b, prop))
      __defNormalProp$2(a, prop, b[prop]);
  if (__getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(b)) {
      if (__propIsEnum$2.call(b, prop))
        __defNormalProp$2(a, prop, b[prop]);
    }
  return a;
};
var __async$v = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllFurniture$1 = () => __async$v(void 0, null, function* () {
  const query = `
    SELECT a.*, sg.nombre AS subgrupo_nombre, d.nombre AS dept_nombre,
    p.nombre AS parroquia_nombre, e.nombre AS estado_nombre, ma.nombre AS marca_nombre, mo.nombre AS modelo_nombre, sg.codigo AS subgrupo_codigo
    FROM Activos a
    LEFT JOIN SubgrupoActivos sg ON a.subgrupo_id = sg.id
    LEFT JOIN Departamento d ON a.dept_id = d.id
    LEFT JOIN Parroquia p ON a.parroquia_id = p.id
    LEFT JOIN EstadoActivo e ON a.estado_id = e.id
    LEFT JOIN Marca ma ON a.marca_id = ma.id
    LEFT JOIN Modelo mo ON a.modelo_id = mo.id
  `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const getFurnitureByDepartment$1 = (deptId) => __async$v(void 0, null, function* () {
  const query = `
    SELECT a.*, sg.nombre AS subgrupo_nombre, d.nombre AS dept_nombre,
    p.nombre AS parroquia_nombre, e.nombre AS estado_nombre, ma.nombre AS marca_nombre, mo.nombre AS modelo_nombre, sg.codigo AS subgrupo_codigo
    FROM Activos a
    LEFT JOIN SubgrupoActivos sg ON a.subgrupo_id = sg.id
    LEFT JOIN Departamento d ON a.dept_id = d.id
    LEFT JOIN Parroquia p ON a.parroquia_id = p.id
    LEFT JOIN EstadoActivo e ON a.estado_id = e.id
    LEFT JOIN Marca ma ON a.marca_id = ma.id
    LEFT JOIN Modelo mo ON a.modelo_id = mo.id
    WHERE a.dept_id = ?
  `;
  const [rows] = yield pool.execute(query, [deptId]);
  return rows;
});
const getFurnitureById$1 = (id) => __async$v(void 0, null, function* () {
  const query = `
    SELECT a.*, sg.nombre AS subgrupo_nombre, d.nombre AS dept_nombre,
    p.nombre AS parroquia_nombre, e.nombre AS estado_nombre, ma.nombre AS marca_nombre, mo.nombre AS modelo_nombre, sg.codigo AS subgrupo_codigo
    FROM Activos a
    LEFT JOIN SubgrupoActivos sg ON a.subgrupo_id = sg.id
    LEFT JOIN Departamento d ON a.dept_id = d.id
    LEFT JOIN Parroquia p ON a.parroquia_id = p.id
    LEFT JOIN EstadoActivo e ON a.estado_id = e.id
    LEFT JOIN Marca ma ON a.marca_id = ma.id
    LEFT JOIN Modelo mo ON a.modelo_id = mo.id
    WHERE a.id = ?
  `;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const createFurniture$1 = (data) => __async$v(void 0, null, function* () {
  var _a, _b;
  const query = `
    INSERT INTO Activos (
      subgrupo_id, cantidad, nombre_descripcion, marca_id, modelo_id, numero_serial,
      valor_unitario, valor_total, fecha, dept_id, estado_id, parroquia_id, numero_identificacion, isComputer, isActive
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = yield pool.execute(query, [
    data.subgrupo_id,
    data.cantidad,
    data.nombre_descripcion,
    data.marca_id || null,
    data.modelo_id || null,
    data.numero_serial || null,
    data.valor_unitario || null,
    data.valor_total || null,
    data.fecha || null,
    data.dept_id || null,
    data.estado_id || null,
    data.parroquia_id || null,
    data.numero_identificacion,
    (_a = data.isComputer) != null ? _a : 0,
    (_b = data.isActive) != null ? _b : 1
  ]);
  return __spreadValues$2({
    id: result.insertId
  }, data);
});
const updateFurniture$1 = (id, data) => __async$v(void 0, null, function* () {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
  const query = `
    UPDATE Activos
    SET 
      subgrupo_id = COALESCE(?, subgrupo_id),
      cantidad = COALESCE(?, cantidad),
      nombre_descripcion = COALESCE(?, nombre_descripcion),
      marca_id = COALESCE(?, marca_id),
      modelo_id = COALESCE(?, modelo_id),
      numero_serial = COALESCE(?, numero_serial),
      valor_unitario = COALESCE(?, valor_unitario),
      valor_total = COALESCE(?, valor_total),
      fecha = COALESCE(?, fecha),
      dept_id = COALESCE(?, dept_id),
      estado_id = COALESCE(?, estado_id),
      parroquia_id = COALESCE(?, parroquia_id),
      numero_identificacion = COALESCE(?, numero_identificacion),
      isComputer = COALESCE(?, isComputer),
      isActive = COALESCE(?, isActive)
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [
    (_a = data.subgrupo_id) != null ? _a : null,
    (_b = data.cantidad) != null ? _b : null,
    (_c = data.nombre_descripcion) != null ? _c : null,
    (_d = data.marca_id) != null ? _d : null,
    (_e = data.modelo_id) != null ? _e : null,
    (_f = data.numero_serial) != null ? _f : null,
    (_g = data.valor_unitario) != null ? _g : null,
    (_h = data.valor_total) != null ? _h : null,
    (_i = data.fecha) != null ? _i : null,
    (_j = data.dept_id) != null ? _j : null,
    (_k = data.estado_id) != null ? _k : null,
    (_l = data.parroquia_id) != null ? _l : null,
    (_m = data.numero_identificacion) != null ? _m : null,
    (_n = data.isComputer) != null ? _n : null,
    (_o = data.isActive) != null ? _o : null,
    id
  ]);
  return result;
});
const deleteFurniture$1 = (id) => __async$v(void 0, null, function* () {
  const query = `
    DELETE FROM Activos
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const FurnitureModel = {
  getAllFurniture: getAllFurniture$1,
  getFurnitureById: getFurnitureById$1,
  createFurniture: createFurniture$1,
  updateFurniture: updateFurniture$1,
  deleteFurniture: deleteFurniture$1,
  getFurnitureByDepartment: getFurnitureByDepartment$1
};

var __async$u = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllFurniture = (req, res) => __async$u(void 0, null, function* () {
  try {
    const furniture = yield FurnitureModel.getAllFurniture();
    if (!furniture || furniture.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron muebles" });
    }
    res.status(200).json({ ok: true, furniture });
  } catch (error) {
    console.error("Error al obtener los muebles:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const getFurnitureById = (req, res) => __async$u(void 0, null, function* () {
  try {
    const { id } = req.params;
    const furniture = yield FurnitureModel.getFurnitureById(Number(id));
    if (!furniture) {
      return res.status(404).json({ ok: false, message: "Mueble no encontrado" });
    }
    res.status(200).json({ ok: true, furniture });
  } catch (error) {
    console.error("Error al obtener el mueble por ID:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const createFurniture = (req, res) => __async$u(void 0, null, function* () {
  try {
    const data = req.body;
    if (!data.nombre_descripcion || !data.cantidad || !data.numero_identificacion) {
      return res.status(400).json({
        ok: false,
        message: "La descripci\xF3n, la cantidad y el n\xFAmero de identificaci\xF3n son obligatorios"
      });
    }
    if (typeof data.isComputer === "undefined") data.isComputer = 0;
    if (typeof data.isActive === "undefined") data.isActive = 1;
    const newFurniture = yield FurnitureModel.createFurniture(data);
    res.status(201).json({ ok: true, furniture: newFurniture });
  } catch (error) {
    console.error("Error al crear el mueble:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const updateFurniture = (req, res) => __async$u(void 0, null, function* () {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = yield FurnitureModel.updateFurniture(Number(id), data);
    if (!result) {
      return res.status(404).json({ ok: false, message: "Mueble no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Mueble actualizado con \xE9xito" });
  } catch (error) {
    console.error("Error al actualizar el mueble:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const deleteFurniture = (req, res) => __async$u(void 0, null, function* () {
  try {
    const { id } = req.params;
    const result = yield FurnitureModel.deleteFurniture(Number(id));
    if (!result) {
      return res.status(404).json({ ok: false, message: "Mueble no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Mueble eliminado con \xE9xito" });
  } catch (error) {
    console.error("Error al eliminar el mueble:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const getFurnitureByDepartment = (req, res) => __async$u(void 0, null, function* () {
  try {
    const { deptId } = req.params;
    const furniture = yield FurnitureModel.getFurnitureByDepartment(Number(deptId));
    if (!furniture || furniture.length === 0) {
      return res.status(404).json({ ok: false, message: "No furniture found for this department" });
    }
    res.status(200).json({ ok: true, furniture });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
});
const FurnitureController = {
  getFurnitureByDepartment,
  getAllFurniture,
  getFurnitureById,
  createFurniture,
  updateFurniture,
  deleteFurniture
};

const router$d = Router();
router$d.get("/", FurnitureController.getAllFurniture);
router$d.get("/:id", FurnitureController.getFurnitureById);
router$d.post("/", FurnitureController.createFurniture);
router$d.put("/:id", FurnitureController.updateFurniture);
router$d.delete("/:id", FurnitureController.deleteFurniture);
router$d.get("/dept/:deptId", FurnitureController.getFurnitureByDepartment);

var __defProp$1 = Object.defineProperty;
var __defProps$1 = Object.defineProperties;
var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
var __async$t = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllTransfers$1 = () => __async$t(void 0, null, function* () {
  const query = `
        SELECT t.*, CONCAT(u.nombre,' ',u.apellido) as responsable, 
               d.nombre as origen_nombre, d2.nombre as destino_nombre,
               COUNT(ta.id) AS cantidad
        FROM Traslado t
        LEFT JOIN TransferenciaActivo ta ON t.id = ta.id_traslado
        LEFT JOIN Departamento d ON t.origen_id = d.id
        LEFT JOIN Departamento d2 ON t.destino_id = d2.id
        LEFT JOIN Usuarios u ON t.responsable_id = u.id
        GROUP BY t.id
    `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const getTransferById$1 = (id) => __async$t(void 0, null, function* () {
  const trasladoQuery = `
        SELECT t.*, CONCAT(u.nombre,' ',u.apellido) as responsable,
               d.nombre as origen_nombre, d2.nombre as destino_nombre
        FROM Traslado t
        LEFT JOIN Usuarios u ON t.responsable_id = u.id
        LEFT JOIN Departamento d ON t.origen_id = d.id
        LEFT JOIN Departamento d2 ON t.destino_id = d2.id
        WHERE t.id = ?
    `;
  const bienesQuery = `
        SELECT ta.*, a.nombre_descripcion, a.numero_identificacion, ea.nombre as estado
        FROM TransferenciaActivo ta
        LEFT JOIN Activos a ON ta.id_mueble = a.id
        LEFT JOIN EstadoActivo ea ON a.estado_id = ea.id
        WHERE ta.id_traslado = ?
    `;
  const [trasladoRows] = yield pool.execute(trasladoQuery, [id]);
  if (trasladoRows.length === 0) return null;
  const [bienesRows] = yield pool.execute(bienesQuery, [id]);
  return __spreadProps$1(__spreadValues$1({}, trasladoRows[0]), {
    cantidad: bienesRows.length,
    bienes: bienesRows
  });
});
const createTransfer$1 = (_0) => __async$t(void 0, [_0], function* ({
  fecha,
  cantidad,
  origen_id,
  destino_id,
  bienes,
  // array de IDs de bienes
  responsable_id,
  // Cambiar a number
  observaciones
}) {
  const query = `
        INSERT INTO Traslado (fecha, cantidad, origen_id, destino_id, responsable_id, observaciones)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
  const [result] = yield pool.execute(query, [
    fecha,
    cantidad,
    origen_id,
    destino_id,
    responsable_id,
    // Asegúrate de que este valor no sea undefined
    observaciones || null
    // Si observaciones es undefined, se pasará null
  ]);
  const trasladoId = result.insertId;
  for (const mueble_id of bienes) {
    yield pool.execute(
      `INSERT INTO TransferenciaActivo (id_traslado, id_mueble) VALUES (?, ?)`,
      [trasladoId, mueble_id]
    );
  }
  return trasladoId;
});
const updateTransfer$1 = (_0, _1) => __async$t(void 0, [_0, _1], function* (id, {
  fecha,
  cantidad,
  origen_id,
  destino_id
}) {
  const query = `
        UPDATE Traslado
        SET 
            fecha = COALESCE(?, fecha),
            cantidad = COALESCE(?, cantidad),
            origen_id = COALESCE(?, origen_id),
            destino_id = COALESCE(?, destino_id)
        WHERE id = ?
    `;
  const [result] = yield pool.execute(query, [
    fecha || null,
    cantidad || null,
    origen_id || null,
    destino_id || null,
    id
  ]);
  return result;
});
const deleteTransfer$1 = (id) => __async$t(void 0, null, function* () {
  yield pool.execute(`DELETE FROM TransferenciaActivo WHERE id_traslado = ?`, [id]);
  const [result] = yield pool.execute(`DELETE FROM Traslado WHERE id = ?`, [id]);
  return result;
});
const transfersModel = {
  getAllTransfers: getAllTransfers$1,
  getTransferById: getTransferById$1,
  createTransfer: createTransfer$1,
  updateTransfer: updateTransfer$1,
  deleteTransfer: deleteTransfer$1
};

var __async$s = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllTransfers = (req, res) => __async$s(void 0, null, function* () {
  try {
    const transfers = yield transfersModel.getAllTransfers();
    if (!transfers || transfers.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron traslados" });
    }
    res.status(200).json({ ok: true, transfers });
  } catch (error) {
    console.error("Error al obtener los traslados:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: errorMessage });
  }
});
const getTransferById = (req, res) => __async$s(void 0, null, function* () {
  try {
    const { id } = req.params;
    const transfer = yield transfersModel.getTransferById(Number(id));
    if (!transfer) {
      return res.status(404).json({ ok: false, message: "Traslado no encontrado" });
    }
    res.status(200).json({ ok: true, transfer });
  } catch (error) {
    console.error("Error al obtener el traslado por ID:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: errorMessage });
  }
});
const createTransfer = (req, res) => __async$s(void 0, null, function* () {
  try {
    const { fecha, cantidad, origen_id, destino_id, responsable_id, observaciones, bienes } = req.body;
    if (!fecha || !cantidad || !origen_id || !destino_id || !Array.isArray(bienes) || bienes.length === 0) {
      return res.status(400).json({ ok: false, message: "Datos incompletos o bienes no seleccionados" });
    }
    const trasladoId = yield transfersModel.createTransfer({ fecha, cantidad, origen_id, destino_id, responsable_id, observaciones, bienes });
    res.status(201).json({ ok: true, message: "Traslado creado", trasladoId });
  } catch (error) {
    console.error("Error al crear el traslado:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: errorMessage });
  }
});
const updateTransfer = (req, res) => __async$s(void 0, null, function* () {
  try {
    const { id } = req.params;
    const result = yield transfersModel.updateTransfer(Number(id), req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Traslado no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Traslado actualizado", result });
  } catch (error) {
    console.error("Error al actualizar el traslado:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: errorMessage });
  }
});
const deleteTransfer = (req, res) => __async$s(void 0, null, function* () {
  try {
    const { id } = req.params;
    const result = yield transfersModel.deleteTransfer(Number(id));
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Traslado no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Traslado eliminado", result });
  } catch (error) {
    console.error("Error al eliminar el traslado:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: errorMessage });
  }
});
const transfersController = {
  getAllTransfers,
  getTransferById,
  createTransfer,
  updateTransfer,
  deleteTransfer
};

const router$c = Router();
router$c.get("/", transfersController.getAllTransfers);
router$c.get("/:id", transfersController.getTransferById);
router$c.post("/", transfersController.createTransfer);
router$c.put("/:id", transfersController.updateTransfer);
router$c.delete("/:id", transfersController.deleteTransfer);

var __async$r = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllMarcas$1 = () => __async$r(void 0, null, function* () {
  const query = `
    SELECT id, nombre
    FROM Marca
  `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const getMarcaById$1 = (id) => __async$r(void 0, null, function* () {
  const query = `
    SELECT id, nombre
    FROM Marca
    WHERE id = ?
  `;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const createMarca$1 = (nombre) => __async$r(void 0, null, function* () {
  const query = `
    INSERT INTO Marca (nombre)
    VALUES (?)
  `;
  const [result] = yield pool.execute(query, [nombre]);
  return {
    id: result.insertId,
    nombre
  };
});
const updateMarca$1 = (id, nombre) => __async$r(void 0, null, function* () {
  const query = `
    UPDATE Marca
    SET nombre = ?
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [nombre, id]);
  return result;
});
const deleteMarca$1 = (id) => __async$r(void 0, null, function* () {
  const query = `
    DELETE FROM Marca
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const getAllModelos$1 = () => __async$r(void 0, null, function* () {
  const query = `
    SELECT id, nombre, idmarca
    FROM Modelo
  `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const getModeloById$1 = (id) => __async$r(void 0, null, function* () {
  const query = `
    SELECT id, nombre, idmarca
    FROM Modelo
    WHERE id = ?
  `;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const createModelo$1 = (nombre, idmarca) => __async$r(void 0, null, function* () {
  const query = `
    INSERT INTO Modelo (nombre, idmarca)
    VALUES (?, ?)
  `;
  const [result] = yield pool.execute(query, [nombre, idmarca]);
  return {
    id: result.insertId,
    nombre,
    idmarca
  };
});
const updateModelo$1 = (id, nombre, idmarca) => __async$r(void 0, null, function* () {
  const query = `
    UPDATE Modelo
    SET nombre = ?, idmarca = ?
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [nombre, idmarca, id]);
  return result;
});
const deleteModelo$1 = (id) => __async$r(void 0, null, function* () {
  const query = `
    DELETE FROM Modelo
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const getModelsByMarca$1 = (idmarca) => __async$r(void 0, null, function* () {
  const query = `
    SELECT id, nombre
    FROM Modelo
    WHERE idmarca = ?
  `;
  const [rows] = yield pool.execute(query, [idmarca]);
  return rows;
});
const MarcaModeloModel = {
  // Métodos para `Marca`
  getAllMarcas: getAllMarcas$1,
  getMarcaById: getMarcaById$1,
  createMarca: createMarca$1,
  updateMarca: updateMarca$1,
  deleteMarca: deleteMarca$1,
  // Métodos para `Modelo`
  getAllModelos: getAllModelos$1,
  getModeloById: getModeloById$1,
  createModelo: createModelo$1,
  updateModelo: updateModelo$1,
  getModelsByMarca: getModelsByMarca$1,
  deleteModelo: deleteModelo$1
};

var __async$q = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllMarcas = (req, res) => __async$q(void 0, null, function* () {
  try {
    const marcas = yield MarcaModeloModel.getAllMarcas();
    res.status(200).json({ ok: true, marcas });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const getMarcaById = (req, res) => __async$q(void 0, null, function* () {
  try {
    const { id } = req.params;
    const marca = yield MarcaModeloModel.getMarcaById(Number(id));
    if (!marca) {
      return res.status(404).json({ ok: false, message: "Marca no encontrada" });
    }
    res.status(200).json({ ok: true, marca });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const createMarca = (req, res) => __async$q(void 0, null, function* () {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "El campo 'nombre' es obligatorio." });
    }
    const newMarca = yield MarcaModeloModel.createMarca(nombre);
    res.status(201).json({ ok: true, marca: newMarca });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ ok: false, message: "La marca ya existe" });
    }
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const updateMarca = (req, res) => __async$q(void 0, null, function* () {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ ok: false, message: "El campo 'nombre' es obligatorio." });
    }
    const result = yield MarcaModeloModel.updateMarca(Number(id), nombre);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Marca no encontrada" });
    }
    res.status(200).json({ ok: true, message: "Marca actualizada con \xE9xito" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const deleteMarca = (req, res) => __async$q(void 0, null, function* () {
  try {
    const { id } = req.params;
    const result = yield MarcaModeloModel.deleteMarca(Number(id));
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Marca no encontrada" });
    }
    res.status(200).json({ ok: true, message: "Marca eliminada con \xE9xito" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const getAllModelos = (req, res) => __async$q(void 0, null, function* () {
  try {
    const modelos = yield MarcaModeloModel.getAllModelos();
    res.status(200).json({ ok: true, modelos });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const getModeloById = (req, res) => __async$q(void 0, null, function* () {
  try {
    const { id } = req.params;
    const modelo = yield MarcaModeloModel.getModeloById(Number(id));
    if (!modelo) {
      return res.status(404).json({ ok: false, message: "Modelo no encontrado" });
    }
    res.status(200).json({ ok: true, modelo });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const createModelo = (req, res) => __async$q(void 0, null, function* () {
  try {
    const { nombre, idmarca } = req.body;
    if (!nombre || !idmarca) {
      return res.status(400).json({ ok: false, message: "Los campos 'nombre' e 'idmarca' son obligatorios." });
    }
    const newModelo = yield MarcaModeloModel.createModelo(nombre, idmarca);
    res.status(201).json({ ok: true, modelo: newModelo });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const updateModelo = (req, res) => __async$q(void 0, null, function* () {
  try {
    const { id } = req.params;
    const { nombre, idmarca } = req.body;
    if (!nombre || !idmarca) {
      return res.status(400).json({ ok: false, message: "Los campos 'nombre' e 'idmarca' son obligatorios." });
    }
    const result = yield MarcaModeloModel.updateModelo(Number(id), nombre, idmarca);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Modelo no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Modelo actualizado con \xE9xito" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const deleteModelo = (req, res) => __async$q(void 0, null, function* () {
  try {
    const { id } = req.params;
    const result = yield MarcaModeloModel.deleteModelo(Number(id));
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Modelo no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Modelo eliminado con \xE9xito" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const getModelsByMarca = (req, res) => __async$q(void 0, null, function* () {
  try {
    const { idmarca } = req.params;
    const modelos = yield MarcaModeloModel.getModelsByMarca(Number(idmarca));
    if (!modelos) {
      return res.status(404).json({ ok: false, message: "No se encontraron modelos para esta marca" });
    }
    res.status(200).json({ ok: true, modelos });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const MarcaModeloController = {
  // Controladores para `marca`
  getAllMarcas,
  getMarcaById,
  createMarca,
  updateMarca,
  deleteMarca,
  // Controladores para `modelo`
  getAllModelos,
  getModeloById,
  createModelo,
  updateModelo,
  getModelsByMarca,
  deleteModelo
};

const router$b = Router();
router$b.get("/marcas", MarcaModeloController.getAllMarcas);
router$b.get("/marcas/:id", MarcaModeloController.getMarcaById);
router$b.post("/marcas", MarcaModeloController.createMarca);
router$b.put("/marcas/:id", MarcaModeloController.updateMarca);
router$b.delete("/marcas/:id", MarcaModeloController.deleteMarca);
router$b.get("/modelos", MarcaModeloController.getAllModelos);
router$b.get("/modelos/:id", MarcaModeloController.getModeloById);
router$b.get("/modelos/marca/:idmarca", MarcaModeloController.getModelsByMarca);
router$b.post("/modelos", MarcaModeloController.createModelo);
router$b.put("/modelos/:id", MarcaModeloController.updateModelo);
router$b.delete("/modelos/:id", MarcaModeloController.deleteModelo);

var __async$p = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllNotifications$1 = () => __async$p(void 0, null, function* () {
  const [rows] = yield pool.execute(`
        SELECT 
            n.*,
            d.nombre AS departamento
        FROM Notificaciones n
        JOIN Departamento d ON n.dept_id = d.id
    `);
  return rows;
});
const getNotificationsByDeptId$1 = (dept_id) => __async$p(void 0, null, function* () {
  const [rows] = yield pool.execute(`
        SELECT 
            n.*,
            d.nombre AS departamento
        FROM Notificaciones n
        JOIN Departamento d ON n.dept_id = d.id
        WHERE n.dept_id = ?
    `, [dept_id]);
  return rows;
});
const getNotificationById$1 = (id) => __async$p(void 0, null, function* () {
  const [rows] = yield pool.execute("SELECT * FROM Notificaciones WHERE id = ?", [id]);
  return rows[0] || null;
});
const createNotification$1 = (_0) => __async$p(void 0, [_0], function* ({ dept_id, descripcion, fecha, isRead }) {
  const [result] = yield pool.execute(
    "INSERT INTO Notificaciones (dept_id, descripcion, fecha, isRead) VALUES (?, ?, ?, ?)",
    [dept_id, descripcion, fecha || null, isRead]
  );
  return result.insertId;
});
const updateNotification$1 = (_0, _1) => __async$p(void 0, [_0, _1], function* (id, { dept_id, descripcion, isRead, fecha }) {
  const [result] = yield pool.execute(
    `UPDATE Notificaciones SET 
            dept_id = COALESCE(?, dept_id), 
            descripcion = COALESCE(?, descripcion),
            isRead = COALESCE(?, isRead),
            fecha = COALESCE(?, fecha)
         WHERE id = ?`,
    [dept_id || null, descripcion || null, isRead || null, fecha || null, id]
  );
  return result;
});
const deleteNotification$1 = (id) => __async$p(void 0, null, function* () {
  const [result] = yield pool.execute("DELETE FROM Notificaciones WHERE id = ?", [id]);
  return result;
});
const notificationsModel = {
  getAllNotifications: getAllNotifications$1,
  getNotificationById: getNotificationById$1,
  createNotification: createNotification$1,
  updateNotification: updateNotification$1,
  deleteNotification: deleteNotification$1,
  getNotificationsByDeptId: getNotificationsByDeptId$1
};

var __async$o = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllNotifications = (req, res) => __async$o(void 0, null, function* () {
  try {
    const notifications = yield notificationsModel.getAllNotifications();
    res.status(200).json({ ok: true, notifications });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ ok: false, error: errorMessage });
  }
});
const getNotificationById = (req, res) => __async$o(void 0, null, function* () {
  try {
    const { id } = req.params;
    const notification = yield notificationsModel.getNotificationById(Number(id));
    if (!notification) {
      return res.status(404).json({ ok: false, message: "Notificaci\xF3n no encontrada" });
    }
    res.status(200).json({ ok: true, notification });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ ok: false, error: errorMessage });
  }
});
const createNotification = (req, res) => __async$o(void 0, null, function* () {
  try {
    const { dept_id, descripcion, fecha, isRead } = req.body;
    if (!dept_id || !descripcion || !fecha || isRead === void 0) {
      return res.status(400).json({ ok: false, message: "Datos incompletos" });
    }
    const id = yield notificationsModel.createNotification({ dept_id, descripcion, fecha, isRead: Number(isRead) });
    res.status(201).json({ ok: true, message: "Notificaci\xF3n creada", id });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ ok: false, error: errorMessage });
  }
});
const updateNotification = (req, res) => __async$o(void 0, null, function* () {
  try {
    const { id } = req.params;
    const { dept_id, descripcion, isRead, fecha } = req.body;
    const result = yield notificationsModel.updateNotification(Number(id), { dept_id, descripcion, isRead, fecha });
    res.status(200).json({ ok: true, message: "Notificaci\xF3n actualizada", result });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ ok: false, error: errorMessage });
  }
});
const deleteNotification = (req, res) => __async$o(void 0, null, function* () {
  try {
    const { id } = req.params;
    const result = yield notificationsModel.deleteNotification(Number(id));
    res.status(200).json({ ok: true, message: "Notificaci\xF3n eliminada", result });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ ok: false, error: errorMessage });
  }
});
const getNotificationsByDeptId = (req, res) => __async$o(void 0, null, function* () {
  try {
    const { dept_id } = req.params;
    const notifications = yield notificationsModel.getNotificationsByDeptId(Number(dept_id));
    res.status(200).json({ ok: true, notifications });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ ok: false, error: errorMessage });
  }
});
const notificationsController = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  getNotificationsByDeptId
};

const router$a = Router();
router$a.get("/", notificationsController.getAllNotifications);
router$a.get("/:id", notificationsController.getNotificationById);
router$a.post("/", notificationsController.createNotification);
router$a.put("/:id", notificationsController.updateNotification);
router$a.delete("/:id", notificationsController.deleteNotification);
router$a.get("/dept/:dept_id", notificationsController.getNotificationsByDeptId);

var __async$n = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getConfig$1 = () => __async$n(void 0, null, function* () {
  const [rows] = yield pool.execute("SELECT * FROM Configuracion LIMIT 1");
  return rows[0] || null;
});
const createConfig$1 = (_0) => __async$n(void 0, [_0], function* ({
  fecha,
  colorprimario,
  colorsecundario,
  nombre_institucion,
  url_banner,
  url_logo,
  url_favicon
}) {
  const fechaFinal = fecha || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const [result] = yield pool.execute(
    `INSERT INTO Configuracion (
            id,
            fecha,
            colorprimario,
            colorsecundario,
            nombre_institucion,
            url_banner,
            url_logo,
            url_favicon
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      1,
      fechaFinal,
      colorprimario != null ? colorprimario : null,
      colorsecundario != null ? colorsecundario : null,
      nombre_institucion != null ? nombre_institucion : null,
      url_banner != null ? url_banner : null,
      url_logo != null ? url_logo : null,
      url_favicon != null ? url_favicon : null
    ]
  );
  return result.insertId;
});
const updateGeneralConfig = (_0) => __async$n(void 0, [_0], function* ({
  fecha,
  colorprimario,
  colorsecundario,
  nombre_institucion,
  url_banner,
  url_logo,
  url_favicon
}) {
  const [result] = yield pool.execute(
    `UPDATE Configuracion SET
            fecha = COALESCE(?, fecha),
            colorprimario = COALESCE(?, colorprimario),
            colorsecundario = COALESCE(?, colorsecundario),
            nombre_institucion = COALESCE(?, nombre_institucion),
            url_banner = COALESCE(?, url_banner),
            url_logo = COALESCE(?, url_logo),
            url_favicon = COALESCE(?, url_favicon)
        WHERE id = 1`,
    [
      fecha || null,
      colorprimario != null ? colorprimario : null,
      colorsecundario != null ? colorsecundario : null,
      nombre_institucion != null ? nombre_institucion : null,
      url_banner != null ? url_banner : null,
      url_logo != null ? url_logo : null,
      url_favicon != null ? url_favicon : null
    ]
  );
  return result;
});
const configModel = {
  getConfig: getConfig$1,
  createConfig: createConfig$1,
  updateGeneralConfig
};

var __async$m = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const __filename$8 = fileURLToPath(import.meta.url);
const __dirname$8 = path__default.dirname(__filename$8);
const diskStorage = multer.diskStorage({
  destination: path__default.join(__dirname$8, "../../../images"),
  filename: (req, file, cb) => {
    const ext = path__default.extname(file.originalname);
    let baseName = file.fieldname;
    cb(null, `${baseName}${ext}`);
  }
});
const getConfig = (req, res) => __async$m(void 0, null, function* () {
  try {
    const config = yield configModel.getConfig();
    res.status(200).json({ ok: true, config });
  } catch (error) {
    console.error("Error al obtener la configuraci\xF3n:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});
const createConfig = (req, res) => {
  const upload = multer({
    storage: diskStorage
  }).fields([
    { name: "favicon", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "logo", maxCount: 1 }
  ]);
  upload(req, res, function(err) {
    return __async$m(this, null, function* () {
      var _a, _b, _c, _d, _e, _f;
      if (err) {
        return res.status(500).json({ ok: false, message: "Error al subir la imagen", error: err.message });
      }
      const files = req.files;
      const pathBase = path__default.join(__dirname$8, "../../../images");
      const bannerFilename = (_b = (_a = files == null ? void 0 : files.banner) == null ? void 0 : _a[0]) == null ? void 0 : _b.filename;
      const logoFilename = (_d = (_c = files == null ? void 0 : files.logo) == null ? void 0 : _c[0]) == null ? void 0 : _d.filename;
      const faviconFilename = (_f = (_e = files == null ? void 0 : files.favicon) == null ? void 0 : _e[0]) == null ? void 0 : _f.filename;
      const url_banner = bannerFilename ? fs__default.readFileSync(path__default.join(pathBase, bannerFilename)) : null;
      const url_logo = logoFilename ? fs__default.readFileSync(path__default.join(pathBase, logoFilename)) : null;
      const url_favicon = faviconFilename ? fs__default.readFileSync(path__default.join(pathBase, faviconFilename)) : null;
      const { colorprimario, colorsecundario, nombre_institucion } = req.body;
      yield configModel.createConfig({
        fecha: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        colorprimario: colorprimario || null,
        colorsecundario: colorsecundario || null,
        nombre_institucion: nombre_institucion || null,
        url_banner,
        url_logo,
        url_favicon
      });
      res.status(200).json({
        ok: true,
        message: "Configuraci\xF3n actualizada correctamente"
      });
    });
  });
};
const updateConfig = (req, res) => {
  const upload = multer({
    storage: diskStorage
  }).fields([
    { name: "favicon", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "logo", maxCount: 1 }
  ]);
  upload(req, res, function(err) {
    return __async$m(this, null, function* () {
      var _a, _b, _c, _d, _e, _f;
      if (err) {
        return res.status(500).json({ ok: false, message: "Error al subir la imagen", error: err.message });
      }
      const files = req.files;
      const pathBase = path__default.join(__dirname$8, "../../../images");
      const bannerFilename = (_b = (_a = files == null ? void 0 : files.banner) == null ? void 0 : _a[0]) == null ? void 0 : _b.filename;
      const logoFilename = (_d = (_c = files == null ? void 0 : files.logo) == null ? void 0 : _c[0]) == null ? void 0 : _d.filename;
      const faviconFilename = (_f = (_e = files == null ? void 0 : files.favicon) == null ? void 0 : _e[0]) == null ? void 0 : _f.filename;
      const url_banner = bannerFilename ? fs__default.readFileSync(path__default.join(pathBase, bannerFilename)) : null;
      const url_logo = logoFilename ? fs__default.readFileSync(path__default.join(pathBase, logoFilename)) : null;
      const url_favicon = faviconFilename ? fs__default.readFileSync(path__default.join(pathBase, faviconFilename)) : null;
      const { colorprimario, colorsecundario, nombre_institucion } = req.body;
      yield configModel.updateGeneralConfig({
        fecha: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        colorprimario: colorprimario || null,
        colorsecundario: colorsecundario || null,
        nombre_institucion: nombre_institucion || null,
        url_banner,
        url_logo,
        url_favicon
      });
      res.status(200).json({
        ok: true,
        message: "Configuraci\xF3n actualizada correctamente"
      });
    });
  });
};
const configController = {
  getConfig,
  createConfig,
  updateConfig
};

const router$9 = Router();
router$9.get("/", configController.getConfig);
router$9.post("/", configController.createConfig);
router$9.put("/", configController.updateConfig);

var __async$l = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllMissingGoods$1 = () => __async$l(void 0, null, function* () {
  const query = `
    SELECT af.*, 
           CONCAT(u.nombre, ' ', u.apellido) AS funcionario_nombre,
           CONCAT(j.nombre, ' ', j.apellido) AS jefe_nombre,
           d.nombre AS departamento,
           a.numero_identificacion AS numero_identificacion
    FROM ActivosFaltantes af
    JOIN Usuarios u ON af.funcionario_id = u.id
    JOIN Usuarios j ON af.jefe_id = j.id
    LEFT JOIN Departamento d ON af.unidad = d.id
    LEFT JOIN Activos a ON af.bien_id = a.id
  `;
  const [rows] = yield pool.query(query);
  return rows;
});
const getMissingGoodsById$1 = (id) => __async$l(void 0, null, function* () {
  const query = `
    SELECT af.*, 
           CONCAT(u.nombre, ' ', u.apellido) AS funcionario_nombre,
           CONCAT(j.nombre, ' ', j.apellido) AS jefe_nombre,
           d.nombre AS departamento,
           a.numero_identificacion AS numero_identificacion
    FROM ActivosFaltantes af
    JOIN Usuarios u ON af.funcionario_id = u.id
    JOIN Usuarios j ON af.jefe_id = j.id
    LEFT JOIN Departamento d ON af.unidad = d.id
    LEFT JOIN Activos a ON af.bien_id = a.id
    WHERE af.id = ?`;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const createMissingGoods$1 = (_0) => __async$l(void 0, [_0], function* ({
  unidad,
  existencias,
  diferencia_cantidad,
  diferencia_valor,
  funcionario_id,
  jefe_id,
  observaciones,
  fecha,
  bien_id
}) {
  const query = `
        INSERT INTO ActivosFaltantes (unidad, existencias, diferencia_cantidad, diferencia_valor, funcionario_id, jefe_id, observaciones, fecha, bien_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const [result] = yield pool.execute(query, [
    unidad,
    existencias,
    diferencia_cantidad,
    diferencia_valor,
    funcionario_id,
    jefe_id,
    observaciones,
    fecha,
    bien_id
  ]);
  return {
    id: result.insertId,
    unidad,
    existencias,
    diferencia_cantidad,
    diferencia_valor,
    funcionario_id,
    jefe_id,
    observaciones,
    fecha,
    bien_id
  };
});
const updateMissingGoods$1 = (id, unidad, existencias, diferencia_cantidad, diferencia_valor, funcionario_id, jefe_id, observaciones, fecha, bien_id) => __async$l(void 0, null, function* () {
  const query = `
        UPDATE ActivosFaltantes 
        SET unidad = ?, existencias = ?, diferencia_cantidad = ?, diferencia_valor = ?, funcionario_id = ?, jefe_id = ?, observaciones = ?, fecha = ?, bien_id = ? 
        WHERE id = ?`;
  const [result] = yield pool.execute(query, [
    unidad,
    existencias,
    diferencia_cantidad,
    diferencia_valor,
    funcionario_id,
    jefe_id,
    observaciones,
    fecha,
    bien_id,
    id
  ]);
  return result;
});
const deleteMissingGoods$1 = (id) => __async$l(void 0, null, function* () {
  const query = `
        DELETE FROM ActivosFaltantes WHERE id = ?`;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const getMissingGoodsByDeptAndResponsible = (deptId, responsableId) => __async$l(void 0, null, function* () {
  const query = `
        SELECT af.id, af.unidad AS dept_id, af.existencias, af.diferencia_cantidad, af.diferencia_valor,
               af.funcionario_id, af.jefe_id, af.observaciones, af.fecha, af.bien_id,
               a.nombre_descripcion AS bien_nombre,
               a.numero_identificacion AS numero_identificacion,
               a.numero_serial, a.valor_unitario,
               ma.nombre AS marca_nombre,
               mo.nombre AS modelo_nombre,
               ea.nombre AS estado_nombre,
               d.nombre AS departamento
        FROM ActivosFaltantes af
        JOIN Activos a ON af.bien_id = a.id
        LEFT JOIN Departamento d ON af.unidad = d.id
        LEFT JOIN Marca ma ON a.marca_id = ma.id
        LEFT JOIN Modelo mo ON a.modelo_id = mo.id
        LEFT JOIN EstadoActivo ea ON a.estado_id = ea.id
        WHERE af.unidad = ? AND af.funcionario_id = ?
    `;
  const [rows] = yield pool.execute(query, [deptId, responsableId]);
  return rows;
});
const getMissingGoodsByIdWithDetails = (id) => __async$l(void 0, null, function* () {
  const query = `
        SELECT af.id, af.unidad AS dept_id, af.existencias, af.diferencia_cantidad, af.diferencia_valor,
               af.funcionario_id, af.jefe_id, af.observaciones, af.fecha, af.bien_id,
               a.nombre_descripcion AS bien_nombre,
               a.numero_identificacion AS numero_identificacion,
               a.numero_serial, a.valor_unitario,
               sg.codigo AS subgrupo_codigo,
               ma.nombre AS marca_nombre,
               mo.nombre AS modelo_nombre,
               ea.nombre AS estado_nombre,
               d.nombre AS departamento,
               CONCAT(u.nombre, ' ', u.apellido) AS funcionario_nombre,
               CONCAT(j.nombre, ' ', j.apellido) AS jefe_nombre
        FROM ActivosFaltantes af
        JOIN Activos a ON af.bien_id = a.id
        LEFT JOIN Departamento d ON af.unidad = d.id
        LEFT JOIN SubgrupoActivos sg ON a.subgrupo_id = sg.id
        LEFT JOIN Marca ma ON a.marca_id = ma.id
        LEFT JOIN Modelo mo ON a.modelo_id = mo.id
        LEFT JOIN EstadoActivo ea ON a.estado_id = ea.id
        LEFT JOIN Usuarios u ON af.funcionario_id = u.id
        LEFT JOIN Usuarios j ON af.jefe_id = j.id
        WHERE af.id = ?
    `;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const missingGoodsModel = {
  getAllMissingGoods: getAllMissingGoods$1,
  getMissingGoodsById: getMissingGoodsById$1,
  createMissingGoods: createMissingGoods$1,
  updateMissingGoods: updateMissingGoods$1,
  deleteMissingGoods: deleteMissingGoods$1,
  getMissingGoodsByDeptAndResponsible,
  getMissingGoodsByIdWithDetails
};

var __async$k = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllMissingGoods = (req, res) => __async$k(void 0, null, function* () {
  try {
    const missingGoodsList = yield missingGoodsModel.getAllMissingGoods();
    res.status(200).json({ ok: true, missingGoods: missingGoodsList });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
});
const getMissingGoodsById = (req, res) => __async$k(void 0, null, function* () {
  try {
    const { id } = req.params;
    const missingGoodsItem = yield missingGoodsModel.getMissingGoodsById(Number(id));
    if (!missingGoodsItem) {
      return res.status(404).json({ ok: false, message: "Missing goods not found" });
    }
    res.status(200).json({ ok: true, missingGoods: missingGoodsItem });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
});
const createMissingGoods = (req, res) => __async$k(void 0, null, function* () {
  try {
    const {
      unidad,
      existencias,
      diferencia_cantidad,
      diferencia_valor,
      funcionario_id,
      jefe_id,
      observaciones,
      fecha,
      bien_id
    } = req.body;
    if (unidad === void 0 || existencias === void 0 || diferencia_cantidad === void 0 || diferencia_valor === void 0 || funcionario_id === void 0 || jefe_id === void 0 || !fecha || bien_id === void 0) {
      return res.status(400).json({ ok: false, message: "Todos los campos son requeridos" });
    }
    const newMissingGoods = yield missingGoodsModel.createMissingGoods({
      unidad,
      existencias,
      diferencia_cantidad,
      diferencia_valor,
      funcionario_id,
      jefe_id,
      observaciones,
      fecha,
      bien_id
    });
    res.status(201).json({ ok: true, missingGoods: newMissingGoods });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
});
const updateMissingGoods = (req, res) => __async$k(void 0, null, function* () {
  try {
    const { id } = req.params;
    const {
      unidad,
      existencias,
      diferencia_cantidad,
      diferencia_valor,
      funcionario_id,
      jefe_id,
      observaciones,
      fecha,
      bien_id
    } = req.body;
    if (unidad === void 0 || existencias === void 0 || diferencia_cantidad === void 0 || diferencia_valor === void 0 || funcionario_id === void 0 || jefe_id === void 0 || !fecha || bien_id === void 0) {
      return res.status(400).json({ ok: false, message: "Todos los campos son requeridos" });
    }
    const result = yield missingGoodsModel.updateMissingGoods(
      Number(id),
      unidad,
      existencias,
      diferencia_cantidad,
      diferencia_valor,
      funcionario_id,
      jefe_id,
      observaciones,
      fecha,
      bien_id
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Missing goods not found" });
    }
    res.status(200).json({ ok: true, message: "Missing goods updated successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
});
const deleteMissingGoods = (req, res) => __async$k(void 0, null, function* () {
  try {
    const { id } = req.params;
    const result = yield missingGoodsModel.deleteMissingGoods(Number(id));
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Missing goods not found" });
    }
    res.status(200).json({ ok: true, message: "Missing goods deleted successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
});
const missingGoodsController = {
  getAllMissingGoods,
  getMissingGoodsById,
  createMissingGoods,
  updateMissingGoods,
  deleteMissingGoods
};

const router$8 = Router();
router$8.get("/", missingGoodsController.getAllMissingGoods);
router$8.get("/:id", missingGoodsController.getMissingGoodsById);
router$8.post("/", missingGoodsController.createMissingGoods);
router$8.put("/:id", missingGoodsController.updateMissingGoods);
router$8.delete("/:id", missingGoodsController.deleteMissingGoods);

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async$j = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllDesincorp$1 = () => __async$j(void 0, null, function* () {
  const query = `
        SELECT d.id, d.bien_id, d.fecha, d.valor, d.cantidad, d.concepto_id, d.dept_id, d.observaciones,
               a.nombre_descripcion AS bien_nombre,
               a.numero_identificacion AS numero_identificacion,
               cd.nombre AS concepto_nombre,
               dept.nombre AS dept_nombre
        FROM DesincorporacionActivo d
        JOIN Activos a ON d.bien_id = a.id
        JOIN ConceptoDesincorporacion cd ON d.concepto_id = cd.id
        LEFT JOIN Departamento dept ON d.dept_id = dept.id
    `;
  const [rows] = yield pool.execute(query);
  return rows.map((row) => __spreadProps(__spreadValues({}, row), {
    fecha: new Date(row.fecha).toISOString(),
    bien_nombre: row.bien_nombre || "N/A",
    numero_identificacion: row.numero_identificacion || "N/A",
    dept_nombre: row.dept_nombre || "N/A"
  }));
});
const getDesincorpById$1 = (id) => __async$j(void 0, null, function* () {
  const query = `
        SELECT d.id, d.bien_id, d.fecha, d.valor, d.cantidad, d.concepto_id, d.dept_id, d.observaciones,
               a.nombre_descripcion AS bien_nombre,
               a.numero_identificacion AS numero_identificacion,
               cd.nombre AS concepto_nombre,
               dept.nombre AS dept_nombre
        FROM DesincorporacionActivo d
        JOIN Activos a ON d.bien_id = a.id
        JOIN ConceptoDesincorporacion cd ON d.concepto_id = cd.id
        LEFT JOIN Departamento dept ON d.dept_id = dept.id
        WHERE d.id = ?
    `;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const createDesincorp$1 = (_0) => __async$j(void 0, [_0], function* ({
  bien_id,
  fecha,
  valor,
  cantidad,
  concepto_id,
  dept_id,
  observaciones
}) {
  const query = `
        INSERT INTO DesincorporacionActivo (bien_id, fecha, valor, cantidad, concepto_id, dept_id, observaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  const [result] = yield pool.execute(query, [
    Number(bien_id),
    fecha,
    Number(valor),
    Number(cantidad),
    Number(concepto_id),
    dept_id ? Number(dept_id) : null,
    observaciones || null
  ]);
  const desincorpQuery = `
        SELECT id, bien_id, fecha, valor, cantidad, concepto_id, dept_id, observaciones
        FROM DesincorporacionActivo
        WHERE id = ?
    `;
  const [rows] = yield pool.execute(desincorpQuery, [result.insertId]);
  return rows[0];
});
const updateDesincorp$1 = (id, updates) => __async$j(void 0, null, function* () {
  const validFields = ["bien_id", "fecha", "valor", "cantidad", "concepto_id", "dept_id", "observaciones"];
  const fieldsToUpdate = Object.keys(updates).filter((key) => validFields.includes(key));
  if (fieldsToUpdate.length === 0) return;
  const fields = fieldsToUpdate.map((key) => `${key} = ?`).join(", ");
  const values = fieldsToUpdate.map((key) => updates[key]);
  const query = `
        UPDATE DesincorporacionActivo
        SET ${fields}
        WHERE id = ?
    `;
  yield pool.execute(query, [...values, id]);
});
const deleteDesincorp$1 = (id) => __async$j(void 0, null, function* () {
  const query = `
        DELETE FROM DesincorporacionActivo
        WHERE id = ?
    `;
  yield pool.execute(query, [id]);
});
const getDesincorpsByMonthYearDept = (mes, a\u00F1o, deptId) => __async$j(void 0, null, function* () {
  console.log(`[desincorp.model] getDesincorpsByMonthYearDept - Mes: ${mes}, A\xF1o: ${a\u00F1o}, DeptId: ${deptId}`);
  const query = `
        SELECT d.id, d.bien_id, d.fecha, d.valor, d.cantidad, d.concepto_id, d.dept_id, d.observaciones,
               a.nombre_descripcion AS bien_nombre,
               a.numero_identificacion AS numero_identificacion,
               cd.nombre AS concepto_nombre,
               cd.codigo AS concepto_codigo,
               dept.nombre AS dept_nombre,
               sg.codigo AS subgrupo_codigo,
               ma.nombre AS marca_nombre,
               mo.nombre AS modelo_nombre,
               ea.nombre AS estado_nombre
        FROM DesincorporacionActivo d
        JOIN Activos a ON d.bien_id = a.id
        JOIN ConceptoDesincorporacion cd ON d.concepto_id = cd.id
        LEFT JOIN Departamento dept ON d.dept_id = dept.id
        LEFT JOIN SubgrupoActivos sg ON a.subgrupo_id = sg.id
        LEFT JOIN Marca ma ON a.marca_id = ma.id
        LEFT JOIN Modelo mo ON a.modelo_id = mo.id
        LEFT JOIN EstadoActivo ea ON a.estado_id = ea.id
        WHERE MONTH(d.fecha) = ? AND YEAR(d.fecha) = ? AND d.dept_id = ?
    `;
  const [rows] = yield pool.execute(query, [mes, a\u00F1o, deptId]);
  console.log(`[desincorp.model] getDesincorpsByMonthYearDept - Activos recuperados: ${rows.length}`);
  return rows.map((row) => __spreadProps(__spreadValues({}, row), {
    fecha: new Date(row.fecha).toISOString(),
    bien_nombre: row.bien_nombre || "N/A",
    numero_identificacion: row.numero_identificacion || "N/A",
    dept_nombre: row.dept_nombre || "N/A",
    concepto_codigo: row.concepto_codigo || "N/A"
    // Asegurar que el código del concepto se mapee
  }));
});
const desincorpModel = {
  getAllDesincorp: getAllDesincorp$1,
  getDesincorpById: getDesincorpById$1,
  createDesincorp: createDesincorp$1,
  updateDesincorp: updateDesincorp$1,
  deleteDesincorp: deleteDesincorp$1,
  getDesincorpsByMonthYearDept
};

var __async$i = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllDesincorp = (req, res) => __async$i(void 0, null, function* () {
  try {
    const desincorps = yield desincorpModel.getAllDesincorp();
    return res.status(200).json({ ok: true, desincorps });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const getDesincorpById = (req, res) => __async$i(void 0, null, function* () {
  try {
    const { id } = req.params;
    const desincorp = yield desincorpModel.getDesincorpById(Number(id));
    if (!desincorp) {
      return res.status(404).json({ ok: false, message: "Desincorporacion no encontrado" });
    }
    return res.status(200).json({ ok: true, desincorp });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const createDesincorp = (req, res) => __async$i(void 0, null, function* () {
  try {
    const { bien_id, fecha, valor, cantidad, concepto_id, dept_id, observaciones } = req.body;
    if (!bien_id || !fecha || !valor || !cantidad || !concepto_id) {
      return res.status(400).json({ ok: false, message: "Por favor, complete todos los campos requeridos." });
    }
    const newDesincorp = yield desincorpModel.createDesincorp({
      bien_id,
      fecha,
      valor,
      cantidad,
      concepto_id,
      dept_id,
      observaciones
    });
    return res.status(201).json({ ok: true, desincorp: newDesincorp });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const updateDesincorp = (req, res) => __async$i(void 0, null, function* () {
  try {
    const { id } = req.params;
    const updates = req.body;
    const desincorp = yield desincorpModel.getDesincorpById(Number(id));
    if (!desincorp) {
      return res.status(404).json({ ok: false, message: "Desincorporacion no encontrado" });
    }
    yield desincorpModel.updateDesincorp(Number(id), updates);
    return res.status(200).json({ ok: true, desincorp, message: "Desincorporacion actualizado con \xE9xito" });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const deleteDesincorp = (req, res) => __async$i(void 0, null, function* () {
  try {
    const { id } = req.params;
    const desincorp = yield desincorpModel.getDesincorpById(Number(id));
    if (!desincorp) {
      return res.status(404).json({ ok: false, message: "Desincorporacion no encontrado" });
    }
    yield desincorpModel.deleteDesincorp(Number(id));
    return res.status(200).json({ ok: true, message: "Desincorporacion eliminado con \xE9xito" });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const desincorpController = {
  getAllDesincorp,
  getDesincorpById,
  createDesincorp,
  updateDesincorp,
  deleteDesincorp
};

const router$7 = Router();
router$7.get("/", desincorpController.getAllDesincorp);
router$7.get("/:id", desincorpController.getDesincorpById);
router$7.post("/", desincorpController.createDesincorp);
router$7.put("/:id", desincorpController.updateDesincorp);
router$7.delete("/:id", desincorpController.deleteDesincorp);

var __async$h = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getGoodHistoryById = (goodId) => __async$h(void 0, null, function* () {
  const query = `
    SELECT
    A.id AS bien_id,
    A.nombre_descripcion AS bien_nombre, 
    CD.nombre AS estado_desincorporacion,
    D.nombre AS dept_actual,
    I.fecha AS fecha_incorporacion,
    D1.nombre AS dept_origen,
    D2.nombre AS dept_destino,
    T.fecha AS fecha_traslado,
    DES.fecha AS fecha_desincorporacion,
    DES.valor AS valor_desincorporacion,
    DES.cantidad AS cantidad_desincorporacion,
    DDES.nombre AS dept_desincorporacion
    FROM Activos A
    LEFT JOIN Departamento D ON A.dept_id = D.id
    LEFT JOIN IncorporacionActivo I ON A.id = I.bien_id
    LEFT JOIN TransferenciaActivo BT ON BT.id_mueble = A.id  
    LEFT JOIN Traslado T ON BT.id_traslado = T.id 
    LEFT JOIN Departamento D1 ON T.origen_id = D1.id
    LEFT JOIN Departamento D2 ON T.destino_id = D2.id
    LEFT JOIN DesincorporacionActivo DES ON A.id = DES.bien_id
    LEFT JOIN ConceptoDesincorporacion CD ON DES.concepto_id = CD.id
    LEFT JOIN Departamento DDES ON DES.dept_id = DDES.id
    WHERE A.id = ?
    ORDER BY 
    I.fecha ASC,
    T.fecha ASC,
    DES.fecha ASC;
  `;
  const [rows] = yield pool.execute(query, [goodId]);
  return rows;
});
const goodHistoryModel = {
  getGoodHistoryById
};

var __async$g = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getGoodHistory = (req, res) => __async$g(void 0, null, function* () {
  try {
    const { goodId } = req.params;
    if (!goodId) {
      return res.status(400).json({ ok: false, message: "El ID del bien es obligatorio" });
    }
    const history = yield goodHistoryModel.getGoodHistoryById(Number(goodId));
    if (history.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontr\xF3 historial para este ID de bien" });
    }
    const hasTransfersOrDecompositions = history.some((item) => item.fecha_traslado || item.fecha_desincorporacion);
    if (!hasTransfersOrDecompositions) {
      return res.status(200).json({ ok: true, message: "No se encontraron traslados o desincorporaciones para este ID de bien", history });
    }
    res.status(200).json({ ok: true, history });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});

const router$6 = Router();
router$6.get("/:goodId", getGoodHistory);

var __async$f = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const createLog$1 = (usuario_id, accion, detalles) => __async$f(void 0, null, function* () {
  const query = `
        INSERT INTO RegistroLogs (usuario_id, fecha, accion, detalles) 
        VALUES (?, NOW(), ?, ?)`;
  const [result] = yield pool.execute(query, [usuario_id, accion, detalles]);
  return {
    id: result.insertId,
    usuario_id,
    accion,
    detalles
  };
});
const getAllLogs$1 = () => __async$f(void 0, null, function* () {
  const query = `
        SELECT rl.*, u.username AS usuario_nombre, d.nombre AS departamento
        FROM RegistroLogs rl 
        LEFT JOIN Usuarios u ON rl.usuario_id = u.id
        LEFT JOIN Departamento d ON u.dept_id = d.id
        ORDER BY rl.fecha DESC`;
  const [rows] = yield pool.query(query);
  return rows;
});
const getLogById$1 = (id) => __async$f(void 0, null, function* () {
  const query = `
        SELECT * FROM RegistroLogs WHERE id = ?`;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const logsModel = {
  createLog: createLog$1,
  getAllLogs: getAllLogs$1,
  getLogById: getLogById$1
};

var __async$e = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const createLog = (req, res) => __async$e(void 0, null, function* () {
  try {
    const { usuario_id, accion, detalles } = req.body;
    if (!usuario_id || !accion) {
      return res.status(400).json({ ok: false, message: "usuario_id y acci\xF3n son obligatorios" });
    }
    const log = yield logsModel.createLog(usuario_id, accion, detalles);
    res.status(201).json({ ok: true, log });
  } catch (error) {
    console.error("Error al crear el log:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : String(error) });
  }
});
const getAllLogs = (req, res) => __async$e(void 0, null, function* () {
  try {
    const logs = yield logsModel.getAllLogs();
    res.status(200).json({ ok: true, logs });
  } catch (error) {
    console.error("Error al obtener todos los logs:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : String(error) });
  }
});
const getLogById = (req, res) => __async$e(void 0, null, function* () {
  try {
    const { id } = req.params;
    const log = yield logsModel.getLogById(Number(id));
    if (!log) {
      return res.status(404).json({ ok: false, message: "Log no encontrado" });
    }
    res.status(200).json({ ok: true, log });
  } catch (error) {
    console.error("Error al obtener el log por ID:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : String(error) });
  }
});
const logsController = {
  createLog,
  getAllLogs,
  getLogById
};

const router$5 = Router();
router$5.post("/", logsController.createLog);
router$5.get("/", logsController.getAllLogs);
router$5.get("/:id", logsController.getLogById);

var __async$d = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getIncorporationsByMonthAndDepartment = (month, year, deptId) => __async$d(void 0, null, function* () {
  const query = `
    SELECT COUNT(*) AS total_incorporations
    FROM IncorporacionActivo
    WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? AND dept_id = ? AND isActive = 1
  `;
  const [rows] = yield pool.execute(query, [month, year, deptId]);
  return rows[0];
});
const getDisincorporationsConcept60ByMonthAndDepartment = (month, year, deptId) => __async$d(void 0, null, function* () {
  const query = `
    SELECT COUNT(*) AS total_disincorporations
    FROM DesincorporacionActivo
    WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? AND dept_id = ?
      AND concepto_id = (SELECT id FROM ConceptoDesincorporacion WHERE codigo = '60')
  `;
  const [rows] = yield pool.execute(query, [month, year, deptId]);
  return rows[0];
});
const getDisincorporationsExceptConcept60ByMonthAndDepartment = (month, year, deptId) => __async$d(void 0, null, function* () {
  const query = `
    SELECT COUNT(*) AS total_disincorporations
    FROM DesincorporacionActivo
    WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? AND dept_id = ?
      AND concepto_id != (SELECT id FROM ConceptoDesincorporacion WHERE codigo = '60')
  `;
  const [rows] = yield pool.execute(query, [month, year, deptId]);
  return rows[0];
});
const getActiveAssetsPreviousMonthByDepartment = (month, year, deptId) => __async$d(void 0, null, function* () {
  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;
  const query = `
    SELECT COUNT(*) AS existencia_anterior
    FROM Activos
    WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? AND dept_id = ? AND isActive = 1
  `;
  const [rows] = yield pool.execute(query, [previousMonth, previousYear, deptId]);
  return rows[0];
});
const getFinalAssetsCountByMonth = (month, year, deptId) => __async$d(void 0, null, function* () {
  const [existenciaAnterior, incorporaciones, desincorporaciones60, desincorporacionesNo60] = yield Promise.all([
    getActiveAssetsPreviousMonthByDepartment(month, year, deptId),
    getIncorporationsByMonthAndDepartment(month, year, deptId),
    getDisincorporationsConcept60ByMonthAndDepartment(month, year, deptId),
    getDisincorporationsExceptConcept60ByMonthAndDepartment(month, year, deptId)
  ]);
  const existenciaFinal = existenciaAnterior.existencia_anterior + incorporaciones.total_incorporations - (desincorporaciones60.total_disincorporations + desincorporacionesNo60.total_disincorporations);
  return { existencia_final: existenciaFinal };
});
const reportModel = {
  getIncorporationsByMonthAndDepartment,
  getDisincorporationsConcept60ByMonthAndDepartment,
  getDisincorporationsExceptConcept60ByMonthAndDepartment,
  getActiveAssetsPreviousMonthByDepartment,
  getFinalAssetsCountByMonth,
  // Nueva función para obtener todos los datos del reporte mensual
  getMonthlyReportData: (month, year, deptId) => __async$d(void 0, null, function* () {
    const [
      totalIncorporations,
      totalDisincorporationsConcept60,
      totalDisincorporationsExceptConcept60,
      previousExistence,
      finalAssets
    ] = yield Promise.all([
      reportModel.getIncorporationsByMonthAndDepartment(month, year, deptId),
      reportModel.getDisincorporationsConcept60ByMonthAndDepartment(month, year, deptId),
      reportModel.getDisincorporationsExceptConcept60ByMonthAndDepartment(month, year, deptId),
      reportModel.getActiveAssetsPreviousMonthByDepartment(month, year, deptId),
      reportModel.getFinalAssetsCountByMonth(month, year, deptId)
    ]);
    return {
      total_incorporations: totalIncorporations.total_incorporations,
      total_disincorporations_concept_60: totalDisincorporationsConcept60.total_disincorporations,
      total_disincorporations_except_concept_60: totalDisincorporationsExceptConcept60.total_disincorporations,
      previous_existence: previousExistence.existencia_anterior,
      final_existence: finalAssets.existencia_final
    };
  })
};

var __async$c = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getMonthlyReport = (req, res) => __async$c(void 0, null, function* () {
  try {
    const { month, year, deptId } = req.body;
    if (month === void 0 || year === void 0 || deptId === void 0) {
      return res.status(400).json({
        ok: false,
        message: "El mes, a\xF1o y departamento son obligatorios en el body"
      });
    }
    const monthNumber = Number(month);
    const yearNumber = Number(year);
    const deptIdNumber = Number(deptId);
    if (isNaN(monthNumber) || isNaN(yearNumber) || isNaN(deptIdNumber)) {
      return res.status(400).json({
        ok: false,
        message: "El mes, a\xF1o y departamento deben ser n\xFAmeros v\xE1lidos"
      });
    }
    const totalIncorporations = yield reportModel.getIncorporationsByMonthAndDepartment(monthNumber, yearNumber, deptIdNumber);
    const totalDisincorporationsConcept60 = yield reportModel.getDisincorporationsConcept60ByMonthAndDepartment(monthNumber, yearNumber, deptIdNumber);
    const totalDisincorporationsExceptConcept60 = yield reportModel.getDisincorporationsExceptConcept60ByMonthAndDepartment(monthNumber, yearNumber, deptIdNumber);
    const previousExistence = yield reportModel.getActiveAssetsPreviousMonthByDepartment(monthNumber, yearNumber, deptIdNumber);
    const finalAssets = yield reportModel.getFinalAssetsCountByMonth(monthNumber, yearNumber, deptIdNumber);
    res.status(200).json({
      ok: true,
      totalIncorporations,
      totalDisincorporationsConcept60,
      totalDisincorporationsExceptConcept60,
      previousExistence,
      finalAssets
    });
  } catch (error) {
    console.error("Error al obtener el reporte mensual:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});
const reportController = {
  getMonthlyReport
};

const router$4 = Router();
router$4.post("/", reportController.getMonthlyReport);

var __async$b = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllComponents$1 = () => __async$b(void 0, null, function* () {
  const query = `
    SELECT c.id, c.bien_id, c.nombre, c.numero_serial
    FROM Componentes c
  `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const getComponentById$1 = (id) => __async$b(void 0, null, function* () {
  const query = `
    SELECT c.id, c.bien_id, c.nombre, c.numero_serial
    FROM Componentes c
    WHERE c.id = ?
  `;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const getComponentsByBienId$1 = (bien_id) => __async$b(void 0, null, function* () {
  const query = `
    SELECT c.id, c.bien_id, c.nombre, c.numero_serial
    FROM Componentes c
    WHERE c.bien_id = ?
  `;
  const [rows] = yield pool.execute(query, [bien_id]);
  return rows;
});
const createComponent$1 = (_0) => __async$b(void 0, [_0], function* ({
  bien_id,
  nombre,
  numero_serial
}) {
  const query = `
    INSERT INTO Componentes (bien_id, nombre, numero_serial)
    VALUES (?, ?, ?)
  `;
  const [result] = yield pool.execute(query, [
    bien_id,
    nombre,
    numero_serial || null
  ]);
  return {
    id: result.insertId,
    bien_id,
    nombre,
    numero_serial: numero_serial || null
  };
});
const updateComponent$1 = (_0, _1) => __async$b(void 0, [_0, _1], function* (id, {
  bien_id,
  nombre,
  numero_serial
}) {
  const query = `
    UPDATE Componentes
    SET 
      bien_id = COALESCE(?, bien_id),
      nombre = COALESCE(?, nombre),
      numero_serial = COALESCE(?, numero_serial)
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [
    bien_id != null ? bien_id : null,
    nombre != null ? nombre : null,
    numero_serial != null ? numero_serial : null,
    id
  ]);
  return result;
});
const deleteComponent$1 = (id) => __async$b(void 0, null, function* () {
  const query = `
    DELETE FROM Componentes
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const ComponentsModel = {
  getAllComponents: getAllComponents$1,
  getComponentsByBienId: getComponentsByBienId$1,
  getComponentById: getComponentById$1,
  createComponent: createComponent$1,
  updateComponent: updateComponent$1,
  deleteComponent: deleteComponent$1
};

var __async$a = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllComponents = (req, res) => __async$a(void 0, null, function* () {
  try {
    const components = yield ComponentsModel.getAllComponents();
    if (!components) {
      return res.status(404).json({ ok: false, message: "Componentes no encontrados" });
    }
    res.status(200).json({ ok: true, components });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servido", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const getComponentById = (req, res) => __async$a(void 0, null, function* () {
  try {
    const { id } = req.params;
    const component = yield ComponentsModel.getComponentById(Number(id));
    if (!component) {
      return res.status(404).json({ ok: false, message: "Componente no encontrado" });
    }
    res.status(200).json({ ok: true, component });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servido", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const createComponent = (req, res) => __async$a(void 0, null, function* () {
  try {
    const { bien_id, nombre, numero_serial } = req.body;
    if (!bien_id || !nombre) {
      return res.status(400).json({ ok: false, message: "Id y nombre son obligatorios" });
    }
    const newComponent = yield ComponentsModel.createComponent({ bien_id, nombre, numero_serial });
    res.status(201).json({ ok: true, component: newComponent });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servido", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const updateComponent = (req, res) => __async$a(void 0, null, function* () {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = yield ComponentsModel.updateComponent(Number(id), data);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Componente no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Componente actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servido", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const deleteComponent = (req, res) => __async$a(void 0, null, function* () {
  try {
    const { id } = req.params;
    const result = yield ComponentsModel.deleteComponent(Number(id));
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Componente no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Componente eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servido", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const getComponentsByBienId = (req, res) => __async$a(void 0, null, function* () {
  try {
    const { bien_id } = req.params;
    if (!bien_id) {
      return res.status(400).json({ ok: false, message: "Id es requerido" });
    }
    const components = yield ComponentsModel.getComponentsByBienId(Number(bien_id));
    res.status(200).json({ ok: true, components });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error del servido", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const ComponentsController = {
  getAllComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
  getComponentsByBienId
};

const router$3 = Router();
router$3.get("/", ComponentsController.getAllComponents);
router$3.get("/:id", ComponentsController.getComponentById);
router$3.get("/bien/:bien_id", ComponentsController.getComponentsByBienId);
router$3.post("/", ComponentsController.createComponent);
router$3.put("/:id", ComponentsController.updateComponent);
router$3.delete("/:id", ComponentsController.deleteComponent);

var __async$9 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllTransferComponents$1 = () => __async$9(void 0, null, function* () {
  const query = `
    SELECT tc.id, tc.componente_id, tc.bien_origen_id, tc.bien_destino_id, tc.fecha,
           c.nombre as componente_nombre, c.numero_serial
    FROM ComponentesTraslado tc
    JOIN Componentes c ON tc.componente_id = c.id
  `;
  const [rows] = yield pool.execute(query);
  return rows;
});
const getTransferComponentById$1 = (id) => __async$9(void 0, null, function* () {
  const query = `
    SELECT tc.id, tc.componente_id, tc.bien_origen_id, tc.bien_destino_id, tc.fecha,
           c.nombre as componente_nombre, c.numero_serial
    FROM ComponentesTraslado tc
    JOIN Componentes c ON tc.componente_id = c.id
    WHERE tc.id = ?
  `;
  const [rows] = yield pool.execute(query, [id]);
  return rows[0];
});
const createTransferComponent$1 = (_0) => __async$9(void 0, [_0], function* ({
  componente_id,
  bien_origen_id,
  bien_destino_id,
  fecha
}) {
  const query = `
    INSERT INTO ComponentesTraslado (componente_id, bien_origen_id, bien_destino_id, fecha)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = yield pool.execute(query, [
    componente_id,
    bien_origen_id,
    bien_destino_id,
    fecha
  ]);
  return {
    id: result.insertId,
    componente_id,
    bien_origen_id,
    bien_destino_id,
    fecha
  };
});
const updateTransferComponent$1 = (_0, _1) => __async$9(void 0, [_0, _1], function* (id, {
  componente_id,
  bien_origen_id,
  bien_destino_id,
  fecha
}) {
  const query = `
    UPDATE ComponentesTraslado
    SET 
      componente_id = COALESCE(?, componente_id),
      bien_origen_id = COALESCE(?, bien_origen_id),
      bien_destino_id = COALESCE(?, bien_destino_id),
      fecha = COALESCE(?, fecha)
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [
    componente_id != null ? componente_id : null,
    bien_origen_id != null ? bien_origen_id : null,
    bien_destino_id != null ? bien_destino_id : null,
    fecha != null ? fecha : null,
    id
  ]);
  return result;
});
const deleteTransferComponent$1 = (id) => __async$9(void 0, null, function* () {
  const query = `
    DELETE FROM ComponentesTraslado
    WHERE id = ?
  `;
  const [result] = yield pool.execute(query, [id]);
  return result;
});
const TransferComponentModel = {
  getAllTransferComponents: getAllTransferComponents$1,
  getTransferComponentById: getTransferComponentById$1,
  createTransferComponent: createTransferComponent$1,
  updateTransferComponent: updateTransferComponent$1,
  deleteTransferComponent: deleteTransferComponent$1
};

var __async$8 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const getAllTransferComponents = (req, res) => __async$8(void 0, null, function* () {
  try {
    const transfers = yield TransferComponentModel.getAllTransferComponents();
    if (!transfers || transfers.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron componentes de traslado" });
    }
    res.status(200).json({ ok: true, transfers });
  } catch (error) {
    console.error("Error al obtener los componentes de traslado:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const getTransferComponentById = (req, res) => __async$8(void 0, null, function* () {
  try {
    const { id } = req.params;
    const transfer = yield TransferComponentModel.getTransferComponentById(Number(id));
    if (!transfer) {
      return res.status(404).json({ ok: false, message: "Componente de traslado no encontrado" });
    }
    res.status(200).json({ ok: true, transfer });
  } catch (error) {
    console.error("Error al obtener el componente de traslado por ID:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const createTransferComponent = (req, res) => __async$8(void 0, null, function* () {
  try {
    const { componente_id, bien_origen_id, bien_destino_id, fecha } = req.body;
    if (!componente_id || !bien_origen_id || !bien_destino_id || !fecha) {
      return res.status(400).json({ ok: false, message: "Todos los campos son requeridos" });
    }
    const newTransfer = yield TransferComponentModel.createTransferComponent({
      componente_id,
      bien_origen_id,
      bien_destino_id,
      fecha
    });
    res.status(201).json({ ok: true, transfer: newTransfer });
  } catch (error) {
    console.error("Error al crear el componente de traslado:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const updateTransferComponent = (req, res) => __async$8(void 0, null, function* () {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = yield TransferComponentModel.updateTransferComponent(Number(id), data);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Componente de traslado no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Componente de traslado actualizado con \xE9xito" });
  } catch (error) {
    console.error("Error al actualizar el componente de traslado:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const deleteTransferComponent = (req, res) => __async$8(void 0, null, function* () {
  try {
    const { id } = req.params;
    const result = yield TransferComponentModel.deleteTransferComponent(Number(id));
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Componente de traslado no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Componente de traslado eliminado con \xE9xito" });
  } catch (error) {
    console.error("Error al eliminar el componente de traslado:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
});
const TransferComponentController = {
  getAllTransferComponents,
  getTransferComponentById,
  createTransferComponent,
  updateTransferComponent,
  deleteTransferComponent
};

const router$2 = Router();
router$2.get("/", TransferComponentController.getAllTransferComponents);
router$2.get("/:id", TransferComponentController.getTransferComponentById);
router$2.post("/", TransferComponentController.createTransferComponent);
router$2.put("/:id", TransferComponentController.updateTransferComponent);
router$2.delete("/:id", TransferComponentController.deleteTransferComponent);

var __async$7 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const __filename$7 = fileURLToPath(import.meta.url);
const __dirname$7 = path.dirname(__filename$7);
function exportBM1ByDepartment(deptId, departamentoNombre, outputPath) {
  return __async$7(this, null, function* () {
    const assets = yield FurnitureModel.getFurnitureByDepartment(deptId);
    console.log(`[ExcelBM1] Retrieved ${assets.length} assets for department ${deptId}.`);
    for (const asset of assets) {
      const components = yield ComponentsModel.getComponentsByBienId(asset.id);
      asset.components_description = components.map((c) => c.nombre).join(", ");
      if (asset.components_description) {
        asset.components_description = `Componentes: ${asset.components_description}`;
      }
    }
    const PARROQUIA = "Tariba";
    const FECHA = (/* @__PURE__ */ new Date()).toLocaleDateString("es-VE");
    const BIENES_POR_PAGINA = 13;
    const totalPaginas = Math.ceil(assets.length / BIENES_POR_PAGINA);
    console.log(`[ExcelBM1] Total pages to generate: ${totalPaginas}`);
    const plantillaPath = path.resolve(__dirname$7, "../plantillas/plantilla-bm1.xlsx");
    console.log(`[ExcelBM1] Template path: ${plantillaPath}`);
    const plantillaBuffer = fs.readFileSync(plantillaPath);
    const generatedFilePaths = [];
    const workbook = new ExcelJS.Workbook();
    yield workbook.xlsx.load(plantillaBuffer);
    const escudoPath = path.resolve(__dirname$7, "../images/Escudo.jpg");
    const logoImpresionPath = path.resolve(__dirname$7, "../images/LogoImpresion.jpg");
    const redesPath = path.resolve(__dirname$7, "../images/Redes.png");
    console.log(`[ExcelBM1] Intentando cargar imagen: ${escudoPath}`);
    const escudoImageId = workbook.addImage({ filename: escudoPath, extension: "jpeg" });
    console.log(`[ExcelBM1] ID de imagen Escudo: ${escudoImageId}`);
    console.log(`[ExcelBM1] Intentando cargar imagen: ${logoImpresionPath}`);
    const logoImpresionImageId = workbook.addImage({ filename: logoImpresionPath, extension: "jpeg" });
    console.log(`[ExcelBM1] ID de imagen LogoImpresion: ${logoImpresionImageId}`);
    console.log(`[ExcelBM1] Intentando cargar imagen: ${redesPath}`);
    const redesImageId = workbook.addImage({ filename: redesPath, extension: "png" });
    console.log(`[ExcelBM1] ID de imagen Redes: ${redesImageId}`);
    const addImagesToWorksheet = (targetWs) => {
      targetWs.addImage(logoImpresionImageId, { tl: { col: 0.5, row: 0.5 }, ext: { width: 150, height: 50 } });
      targetWs.addImage(escudoImageId, { tl: { col: 6.5, row: 0.5 }, ext: { width: 80, height: 80 } });
      targetWs.addImage(redesImageId, { tl: { col: 0.5, row: 24.5 }, ext: { width: 120, height: 40 } });
      console.log(`[ExcelBM1] Im\xE1genes a\xF1adidas a la hoja de trabajo: ${targetWs.name}`);
    };
    const copyTemplateContent = (sourceWs, targetWs) => {
      sourceWs.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        const newRow = targetWs.getRow(rowNumber);
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const newCell = newRow.getCell(colNumber);
          newCell.value = cell.value;
          newCell.style = cell.style;
        });
        newRow.height = row.height;
      });
      sourceWs.model.merges.forEach((merge) => {
        targetWs.mergeCells(merge);
      });
      sourceWs.columns.forEach((column, index) => {
        if (column.width) {
          targetWs.getColumn(index + 1).width = column.width;
        }
      });
      targetWs.getCell("F5").value = `HOJA {{NPAGINA}}/{{NTOTAL}}`;
    };
    for (let pagina = 0; pagina < totalPaginas; pagina++) {
      let ws;
      if (pagina === 0) {
        ws = workbook.worksheets[0];
        ws.name = `BM1 - Pagina 1`;
        addImagesToWorksheet(ws);
        ws.getCell("F5:G5").value = `HOJA {{NPAGINA}}/{{NTOTAL}}`;
      } else {
        ws = workbook.addWorksheet(`BM1 - Pagina ${pagina + 1}`);
        copyTemplateContent(workbook.worksheets[0], ws);
        addImagesToWorksheet(ws);
      }
      console.log(`[ExcelBM1] Processing page ${pagina + 1} of ${totalPaginas}`);
      ws.eachRow((row) => {
        row.eachCell((cell) => {
          if (typeof cell.value === "string") {
            cell.value = cell.value.replace(/{{DEPARTAMENTO}}/g, departamentoNombre || "").replace(/{{PARROQUIA}}/g, PARROQUIA).replace(/{{FECHA}}/g, FECHA).replace(/{{NPAGINA}}/g, String(pagina + 1)).replace(/{{NTOTAL}}/g, String(totalPaginas));
          }
        });
      });
      const startRow = 9;
      const bienesPagina = assets.slice(pagina * BIENES_POR_PAGINA, (pagina + 1) * BIENES_POR_PAGINA);
      bienesPagina.forEach((asset, idx) => {
        const row = ws.getRow(startRow + idx);
        row.getCell(1).value = asset.grupo || "02";
        row.getCell(2).value = asset.subgrupo_codigo || "";
        row.getCell(3).value = asset.cantidad || 1;
        row.getCell(4).value = asset.numero_identificacion || "";
        row.getCell(5).value = [
          asset.nombre_descripcion,
          asset.numero_serial || "",
          asset.marca_nombre,
          asset.modelo_nombre,
          asset.estado_nombre,
          asset.components_description
          // Añadir la descripción de los componentes
        ].filter(Boolean).join(" ") || "";
        row.getCell(6).value = Number(asset.valor_unitario) || 0;
        row.getCell(7).value = Number(asset.valor_total) || 0;
        row.commit();
      });
      for (let idx = bienesPagina.length; idx < BIENES_POR_PAGINA; idx++) {
        const row = ws.getRow(startRow + idx);
        for (let col = 1; col <= 7; col++) row.getCell(col).value = "";
        row.commit();
      }
    }
    const nombreArchivo = `BM1_${departamentoNombre}.xlsx`;
    const rutaArchivo = path.join(outputPath, nombreArchivo);
    yield workbook.xlsx.writeFile(rutaArchivo);
    console.log(`[ExcelBM1] Archivo final generado: ${rutaArchivo}`);
    generatedFilePaths.push(rutaArchivo);
    console.log(`[ExcelBM1] Finished generating files. Total generated: ${generatedFilePaths.length}`);
    return generatedFilePaths;
  });
}

var __async$6 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const __filename$6 = fileURLToPath(import.meta.url);
const __dirname$6 = path.dirname(__filename$6);
function exportBM2ByDepartment(deptId, departamentoNombre, mes, a\u00F1o, tipo, outputPath) {
  return __async$6(this, null, function* () {
    let assets = [];
    let conceptoMovimiento = "";
    if (tipo === "incorporacion") {
      assets = yield IncorpModel.getIncorpsByMonthYearDept(mes, a\u00F1o, deptId);
      conceptoMovimiento = "Incorporaci\xF3n";
      console.log(`[ExcelBM2] Incorporaciones recuperadas: ${assets.length} activos.`);
    } else if (tipo === "desincorporacion") {
      assets = yield desincorpModel.getDesincorpsByMonthYearDept(mes, a\u00F1o, deptId);
      conceptoMovimiento = "Desincorporaci\xF3n";
      console.log(`[ExcelBM2] Desincorporaciones recuperadas: ${assets.length} activos.`);
    }
    console.log(`[ExcelBM2] Retrieved ${assets.length} assets for department ${deptId}, month ${mes}, year ${a\u00F1o} (tipo: ${tipo}).`);
    console.log(`[ExcelBM2] Concepto de Movimiento: ${conceptoMovimiento}`);
    console.log(`[ExcelBM2] Primeros 5 activos recuperados:`, assets.slice(0, 5).map((a) => ({ id: a.id, bien_nombre: a.bien_nombre, valor: a.valor, tipo_operacion: tipo })));
    for (const asset of assets) {
      if (asset.bien_id) {
        const components = yield ComponentsModel.getComponentsByBienId(asset.bien_id);
        asset.components_description = components.map((c) => c.nombre).join(", ");
        if (asset.components_description) {
          asset.components_description = `Componentes: ${asset.components_description}`;
        }
      }
    }
    const PARROQUIA = "Tariba";
    const FECHA = (/* @__PURE__ */ new Date()).toLocaleDateString("es-VE");
    const BIENES_POR_PAGINA = 6;
    const totalPaginas = Math.ceil(assets.length / BIENES_POR_PAGINA);
    console.log(`[ExcelBM2] Total pages to generate: ${totalPaginas}`);
    const plantillaPath = path.resolve(__dirname$6, "../plantillas/plantilla-bm2.xlsx");
    console.log(`[ExcelBM2] Template path: ${plantillaPath}`);
    const plantillaBuffer = fs.readFileSync(plantillaPath);
    const generatedFilePaths = [];
    const workbook = new ExcelJS.Workbook();
    yield workbook.xlsx.load(plantillaBuffer);
    const escudoPath = path.resolve(__dirname$6, "../images/Escudo.jpg");
    const logoImpresionPath = path.resolve(__dirname$6, "../images/LogoImpresion.jpg");
    const redesPath = path.resolve(__dirname$6, "../images/Redes.png");
    console.log(`[ExcelBM2] Intentando cargar imagen: ${escudoPath}`);
    const escudoImageId = workbook.addImage({ filename: escudoPath, extension: "jpeg" });
    console.log(`[ExcelBM2] ID de imagen Escudo: ${escudoImageId}`);
    console.log(`[ExcelBM2] Intentando cargar imagen: ${logoImpresionPath}`);
    const logoImpresionImageId = workbook.addImage({ filename: logoImpresionPath, extension: "jpeg" });
    console.log(`[ExcelBM2] ID de imagen LogoImpresion: ${logoImpresionImageId}`);
    console.log(`[ExcelBM2] Intentando cargar imagen: ${redesPath}`);
    const redesImageId = workbook.addImage({ filename: redesPath, extension: "png" });
    console.log(`[ExcelBM2] ID de imagen Redes: ${redesImageId}`);
    const addImagesToWorksheet = (targetWs) => {
      targetWs.addImage(logoImpresionImageId, { tl: { col: 0.5, row: 0.2 }, ext: { width: 150, height: 50 } });
      targetWs.addImage(escudoImageId, { tl: { col: 8.8, row: 0.2 }, ext: { width: 80, height: 80 } });
      targetWs.addImage(redesImageId, { tl: { col: 0.5, row: 24.5 }, ext: { width: 120, height: 40 } });
      console.log(`[ExcelBM2] Im\xE1genes a\xF1adidas a la hoja de trabajo: ${targetWs.name}`);
    };
    const copyTemplateContent = (sourceWs, targetWs) => {
      sourceWs.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        const newRow = targetWs.getRow(rowNumber);
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const newCell = newRow.getCell(colNumber);
          newCell.value = cell.value;
          newCell.style = cell.style;
        });
        newRow.height = row.height;
      });
      sourceWs.model.merges.forEach((merge) => {
        targetWs.mergeCells(merge);
      });
      sourceWs.columns.forEach((column, index) => {
        if (column.width) {
          targetWs.getColumn(index + 1).width = column.width;
        }
      });
      targetWs.getCell("G6").value = `HOJA {{PAGINAN}}/{{TOTALN}}`;
    };
    for (let pagina = 0; pagina < totalPaginas; pagina++) {
      let ws;
      if (pagina === 0) {
        ws = workbook.worksheets[0];
        ws.name = `BM2 ${tipo === "incorporacion" ? "Inc." : "Desinc."} - Pagina 1`;
        addImagesToWorksheet(ws);
        ws.getCell("G6").value = `HOJA {{PAGINAN}}/{{TOTALN}}`;
      } else {
        ws = workbook.addWorksheet(`BM2 ${tipo === "incorporacion" ? "Inc." : "Desinc."} - Pagina ${pagina + 1}`);
        copyTemplateContent(workbook.worksheets[0], ws);
        addImagesToWorksheet(ws);
      }
      console.log(`[ExcelBM2] Processing page ${pagina + 1} of ${totalPaginas}`);
      ws.eachRow((row) => {
        row.eachCell((cell) => {
          if (typeof cell.value === "string") {
            cell.value = cell.value.replace(/{{DEPARTAMENTO}}/g, departamentoNombre || "").replace(/{{PARROQUIA}}/g, PARROQUIA).replace(/{{FECHA}}/g, FECHA).replace(/{{PAGINAN}}/g, String(pagina + 1)).replace(/{{TOTALN}}/g, String(totalPaginas));
          }
        });
      });
      ws.getCell("H8").value = conceptoMovimiento;
      const startRow = 11;
      const bienesPagina = assets.slice(pagina * BIENES_POR_PAGINA, (pagina + 1) * BIENES_POR_PAGINA);
      bienesPagina.forEach((asset, idx) => {
        console.log(`[ExcelBM2] Procesando activo: ${asset.bien_nombre}, Valor: ${asset.valor}, Tipo: ${typeof asset.valor}`);
        const row = ws.getRow(startRow + idx);
        row.getCell(1).value = asset.grupo || "02";
        console.log(`[ExcelBM2] Col 1 (Grupo): ${row.getCell(1).value}`);
        row.getCell(2).value = asset.subgrupo_codigo || "";
        console.log(`[ExcelBM2] Col 2 (Subgrupo): ${row.getCell(2).value}`);
        row.getCell(3).value = asset.concepto_codigo || "";
        console.log(`[ExcelBM2] Col 3 (Concepto): ${row.getCell(3).value}`);
        row.getCell(4).value = asset.cantidad || 1;
        console.log(`[ExcelBM2] Col 4 (Cantidad): ${row.getCell(4).value}`);
        row.getCell(5).value = asset.numero_identificacion || "";
        console.log(`[ExcelBM2] Col 5 (N\xB0 Identificaci\xF3n): ${row.getCell(5).value}`);
        const descripcion = [
          // Columna F (Descripción de los Bienes)
          asset.bien_nombre,
          asset.numero_serial || "",
          asset.marca_nombre,
          asset.modelo_nombre,
          asset.estado_nombre,
          asset.components_description
          // Añadir la descripción de los componentes
        ].filter(Boolean).join(" ") || "";
        row.getCell(6).value = descripcion;
        console.log(`[ExcelBM2] Col 6 (Descripci\xF3n): ${row.getCell(6).value}`);
        console.log(`[ExcelBM2] Tipo actual para asignaci\xF3n de celda: ${tipo}, Valor del activo: ${asset.valor}`);
        if (tipo === "incorporacion") {
          const incorpCell = row.getCell(8);
          incorpCell.value = Number(asset.valor) || 0;
          incorpCell.numFmt = "#,##0.00";
          console.log(`[ExcelBM2] Asignando a Incorporaciones (Col 8): ${incorpCell.value}`);
          row.getCell(9).value = "";
        } else {
          row.getCell(8).value = "";
          const desincorpCell = row.getCell(9);
          desincorpCell.value = Number(asset.valor) || 0;
          desincorpCell.numFmt = "#,##0.00";
          console.log(`[ExcelBM2] Asignando a Desincorporaciones (Col 9): ${desincorpCell.value}`);
        }
        row.commit();
      });
      for (let idx = bienesPagina.length; idx < BIENES_POR_PAGINA; idx++) {
        const row = ws.getRow(startRow + idx);
        for (let col = 1; col <= 9; col++) row.getCell(col).value = "";
        row.commit();
      }
    }
    const nombreArchivo = `BM2_${tipo === "incorporacion" ? "Incorporaciones" : "Desincorporaciones"}_${departamentoNombre}_${mes}-${a\u00F1o}.xlsx`;
    const rutaArchivo = path.join(outputPath, nombreArchivo);
    const buffer = yield workbook.xlsx.writeBuffer();
    fs.writeFileSync(rutaArchivo, buffer);
    console.log(`[ExcelBM2] Archivo final generado: ${rutaArchivo}`);
    generatedFilePaths.push(rutaArchivo);
    console.log(`[ExcelBM2] Finished generating files. Total generated: ${generatedFilePaths.length}`);
    return generatedFilePaths;
  });
}

var __async$5 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const __filename$5 = fileURLToPath(import.meta.url);
const __dirname$5 = path.dirname(__filename$5);
function exportBM3ByMissingGoodsId(missingGoodsId, responsableId, outputPath) {
  return __async$5(this, null, function* () {
    let missingAsset = null;
    let departamentoNombre = "";
    let responsableNombre = "";
    let responsableRol = "";
    let responsableDepartamento = "";
    let jefeNombre = "";
    missingAsset = yield missingGoodsModel.getMissingGoodsByIdWithDetails(missingGoodsId);
    if (!missingAsset) {
      console.log(`[ExcelBM3] No se encontr\xF3 el bien faltante con ID: ${missingGoodsId}`);
      return [];
    }
    console.log(`[ExcelBM3] Retrieved missing asset with ID ${missingGoodsId}.`);
    const responsableData = yield UserModel.getUserDetailsById(responsableId);
    if (responsableData) {
      responsableNombre = `${responsableData.nombre} ${responsableData.apellido}`;
      responsableRol = responsableData.rol_nombre || "N/A";
      responsableDepartamento = responsableData.dept_nombre || "N/A";
    }
    if (missingAsset.dept_id) {
      const jefeData = yield UserModel.getUserByDeptJefe(missingAsset.dept_id);
      if (jefeData) {
        jefeNombre = jefeData.nombre || "N/A";
      }
    }
    departamentoNombre = missingAsset.departamento || "Departamento Desconocido";
    const PARROQUIA = "Tariba";
    const FECHA = (/* @__PURE__ */ new Date()).toLocaleDateString("es-VE");
    const BIENES_POR_PAGINA = 6;
    const totalPaginas = 1;
    console.log(`[ExcelBM3] Total pages to generate: ${totalPaginas}`);
    const plantillaPath = path.resolve(__dirname$5, "../plantillas/plantilla-bm3.xlsx");
    console.log(`[ExcelBM3] Template path: ${plantillaPath}`);
    const plantillaBuffer = fs.readFileSync(plantillaPath);
    const generatedFilePaths = [];
    const workbook = new ExcelJS.Workbook();
    yield workbook.xlsx.load(plantillaBuffer);
    const escudoPath = path.resolve(__dirname$5, "../images/Escudo.jpg");
    const logoImpresionPath = path.resolve(__dirname$5, "../images/LogoImpresion.jpg");
    const redesPath = path.resolve(__dirname$5, "../images/Redes.png");
    const escudoImageId = workbook.addImage({ filename: escudoPath, extension: "jpeg" });
    const logoImpresionImageId = workbook.addImage({ filename: logoImpresionPath, extension: "jpeg" });
    const redesImageId = workbook.addImage({ filename: redesPath, extension: "png" });
    const addImagesToWorksheet = (targetWs) => {
      targetWs.addImage(logoImpresionImageId, { tl: { col: 0.5, row: 0.2 }, ext: { width: 150, height: 50 } });
      targetWs.addImage(escudoImageId, { tl: { col: 8.8, row: 0.1 }, ext: { width: 70, height: 70 } });
      targetWs.addImage(redesImageId, { tl: { col: 0.5, row: 25 }, ext: { width: 120, height: 40 } });
    };
    const copyTemplateContent = (sourceWs, targetWs) => {
      sourceWs.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        const newRow = targetWs.getRow(rowNumber);
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const newCell = newRow.getCell(colNumber);
          newCell.value = cell.value;
          newCell.style = cell.style;
        });
        newRow.height = row.height;
      });
      sourceWs.model.merges.forEach((merge) => {
        targetWs.mergeCells(merge);
      });
      sourceWs.columns.forEach((column, index) => {
        if (column.width) {
          targetWs.getColumn(index + 1).width = column.width;
        }
      });
    };
    for (let pagina = 0; pagina < totalPaginas; pagina++) {
      let ws;
      if (pagina === 0) {
        ws = workbook.worksheets[0];
        ws.name = `BM3 - Pagina 1`;
        addImagesToWorksheet(ws);
      } else {
        ws = workbook.addWorksheet(`BM3 - Pagina ${pagina + 1}`);
        copyTemplateContent(workbook.worksheets[0], ws);
        addImagesToWorksheet(ws);
      }
      console.log(`[ExcelBM3] Processing page ${pagina + 1} of ${totalPaginas}`);
      ws.eachRow((row2) => {
        row2.eachCell((cell) => {
          if (typeof cell.value === "string") {
            cell.value = cell.value.replace(/{{DEPARTAMENTO}}/g, departamentoNombre || "").replace(/{{PARROQUIA}}/g, PARROQUIA).replace(/{{FECHA}}/g, FECHA).replace(/{{PAGINAN}}/g, String(pagina + 1)).replace(/{{TOTALN}}/g, String(totalPaginas)).replace(/{{RESPONSABLE}}/g, responsableNombre || "").replace(/{{ROL}}/g, responsableRol || "").replace(/{{DEPARTAMENTORESPONSABLE}}/g, responsableDepartamento || "").replace(/{{JEFE}}/g, jefeNombre || "").replace(/{{OBSERVACIONES}}/g, missingAsset.observaciones || "");
          }
        });
      });
      ws.getCell("I5").value = `Hoja N\xB0 : ${pagina + 1}/${totalPaginas}`;
      const startRow = 14;
      const asset = missingAsset;
      const row = ws.getRow(startRow);
      row.getCell(1).value = asset.grupo || "02";
      row.getCell(2).value = asset.subgrupo_codigo || "";
      row.getCell(3).value = "";
      row.getCell(4).value = asset.numero_identificacion || "";
      row.getCell(5).value = asset.cantidad || 0;
      const descripcion = [
        // Columna F (Descripción de los Bienes)
        asset.bien_nombre,
        asset.numero_serial || "",
        asset.marca_nombre,
        asset.modelo_nombre,
        asset.estado_nombre
      ].filter(Boolean).join(" ") || "";
      row.getCell(6).value = descripcion;
      row.getCell(7).value = asset.existencias || 0;
      row.getCell(9).value = asset.cantidad || 0;
      row.getCell(10).value = asset.valor_unitario || 0;
      row.getCell(10).numFmt = "#,##0.00";
      row.getCell(11).value = asset.diferencia_valor || 0;
      row.getCell(11).numFmt = "#,##0.00";
      row.commit();
      for (let idx = 1; idx < BIENES_POR_PAGINA; idx++) {
        const emptyRow = ws.getRow(startRow + idx);
        for (let col = 1; col <= 10; col++) emptyRow.getCell(col).value = "";
        emptyRow.commit();
      }
    }
    const nombreArchivo = `BM3_BienesFaltantes_${departamentoNombre}_${FECHA.replace(/\//g, "-")}.xlsx`;
    const rutaArchivo = path.join(outputPath, nombreArchivo);
    const buffer = yield workbook.xlsx.writeBuffer();
    fs.writeFileSync(rutaArchivo, buffer);
    console.log(`[ExcelBM3] Archivo final generado: ${rutaArchivo}`);
    generatedFilePaths.push(rutaArchivo);
    console.log(`[ExcelBM3] Finished generating files. Total generated: ${generatedFilePaths.length}`);
    return generatedFilePaths;
  });
}

var __async$4 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const __filename$4 = fileURLToPath(import.meta.url);
const __dirname$4 = path.dirname(__filename$4);
const logoImpresionPath = path.resolve(__dirname$4, "../images/LogoImpresion.jpg");
const escudoPath = path.resolve(__dirname$4, "../images/Escudo.jpg");
fs.readFileSync(logoImpresionPath);
fs.readFileSync(escudoPath);
function generateBM4Pdf(deptId, mes, a\u00F1o, responsableId, outputPath) {
  return __async$4(this, null, function* () {
    const pdfDoc = yield PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = yield pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = yield pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const margin = 50;
    let y = page.getHeight() - margin;
    const x = margin;
    const fontSize = 10;
    const lineHeight = 14;
    const reportData = yield reportModel.getMonthlyReportData(mes, a\u00F1o, deptId);
    const responsableData = yield UserModel.getUserDetailsById(responsableId);
    const departmentData = yield DeptModel.getDepartmentById(deptId);
    if (!reportData || !responsableData || !departmentData) {
      console.error("[BM4] Datos incompletos para generar el reporte.");
      return [];
    }
    const {
      total_incorporations,
      total_disincorporations_concept_60,
      total_disincorporations_except_concept_60,
      previous_existence,
      final_existence
    } = reportData;
    const { nombre: responsableNombre, apellido: responsableApellido, rol_nombre: responsableRol, dept_nombre: responsableDeptNombre } = responsableData;
    const { nombre: deptNombre } = departmentData;
    page.drawText("FORMATO BM-4", { x: page.getWidth() - margin - 100, y, font, size: 10, color: rgb(0, 0, 0) });
    y -= lineHeight * 2;
    page.drawText("RESUMEN DE LA CUENTA DE BIENES MUEBLES", { x, y, font: boldFont, size: 12, color: rgb(0, 0, 0) });
    y -= lineHeight;
    page.drawText(`DE LA UNIDAD DE: ${deptNombre.toUpperCase()}`, { x, y, font: boldFont, size: 12, color: rgb(0, 0, 0) });
    y -= lineHeight * 2;
    page.drawText(`Entidad Propietaria: Alcald\xEDa Bolivariana del Municipio C\xE1rdenas RIF G-20005180-9`, { x, y, font, size: fontSize });
    y -= lineHeight * 2;
    page.drawText(`1. Estado: T\xE1chira`, { x, y, font, size: fontSize });
    page.drawText(`2. Municipio: C\xE1rdenas`, { x: x + 200, y, font, size: fontSize });
    page.drawText(`Parroquia: Tariba`, { x: x + 400, y, font, size: fontSize });
    y -= lineHeight * 2;
    page.drawText(`3. Correspondiente al mes de ${mes} del a\xF1o ${a\u00F1o} (Cifras Convencionales)`, { x, y, font, size: fontSize });
    y -= lineHeight * 2;
    page.drawText(`4. Existencia anterior: ${previous_existence}`, { x, y, font, size: fontSize });
    y -= lineHeight;
    page.drawText(`5. Incorporaciones en el mes de la cuenta: ${total_incorporations}`, { x, y, font, size: fontSize });
    y -= lineHeight;
    page.drawText(`6. Desincorporaciones en el mes de la cuenta por`, { x, y, font, size: fontSize });
    y -= lineHeight;
    page.drawText(`   Todos los conceptos, con excepci\xF3n del 60, "Faltantes de Bienes por Investigar": ${total_disincorporations_except_concept_60}`, { x, y, font, size: fontSize });
    y -= lineHeight;
    page.drawText(`7. Desincorporaciones en el mes de la cuenta por`, { x, y, font, size: fontSize });
    y -= lineHeight;
    page.drawText(`   El concepto 60, "Faltantes de Bienes por Investigar": ${total_disincorporations_concept_60}`, { x, y, font, size: fontSize });
    y -= lineHeight;
    page.drawText(`8. Existencia Final: ${final_existence}`, { x, y, font, size: fontSize });
    y -= lineHeight * 3;
    page.drawText(`9. Elaborado Por:`, { x, y, font, size: fontSize });
    page.drawText(`10. Aprobado Por:`, { x: x + 170, y, font, size: fontSize });
    page.drawText(`11. Firma del Responsable Patrimonial`, { x: x + 305, y, font, size: fontSize });
    y -= lineHeight * 3;
    page.drawText(`_________________________`, { x, y, font, size: fontSize });
    page.drawText(`_________________________`, { x: x + 160, y, font, size: fontSize });
    page.drawText(`_________________________`, { x: x + 335, y, font, size: fontSize });
    y -= lineHeight;
    page.drawText(`${responsableNombre} ${responsableApellido}`, { x, y, font, size: fontSize });
    page.drawText(`Cargo: ${responsableRol}`, { x, y: y - lineHeight, font, size: fontSize });
    page.drawText(`Dependencia: ${responsableDeptNombre}`, { x, y: y - lineHeight * 2, font, size: fontSize });
    page.drawText("Original: Oficina de Control de Bienes del Municipio", { x: page.getWidth() - margin - 250, y: margin + 20, font, size: 8 });
    page.drawText("Elaborado por la Oficina de Bienes Municipio C\xE1rdenas", { x: page.getWidth() - margin - 250, y: margin + 10, font, size: 8 });
    const pdfBytes = yield pdfDoc.save();
    const fileName = `BM4_ReporteMensual_${deptNombre}_${mes}-${a\u00F1o}.pdf`;
    const filePath = path.join(outputPath, fileName);
    fs.writeFileSync(filePath, pdfBytes);
    console.log(`[BM4] Archivo PDF generado: ${filePath}`);
    return [filePath];
  });
}

var __async$3 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const __filename$3 = fileURLToPath(import.meta.url);
const __dirname$3 = path.dirname(__filename$3);
const router$1 = Router();
const tempDir$1 = path.join(__dirname$3, "../../temp_excel_exports");
if (!fs.existsSync(tempDir$1)) {
  fs.mkdirSync(tempDir$1, { recursive: true });
}
router$1.post("/bm1", (req, res) => __async$3(void 0, null, function* () {
  const { dept_id, dept_nombre } = req.body;
  if (!dept_id || !dept_nombre) {
    return res.status(400).json({ message: "deptId and departamentoNombre are required." });
  }
  try {
    const generatedFilePaths = yield exportBM1ByDepartment(
      dept_id,
      dept_nombre,
      tempDir$1
    );
    if (generatedFilePaths.length === 0) {
      return res.status(500).json({ message: "No Excel files were generated." });
    }
    const filePathToSend = generatedFilePaths[0];
    const fileName = path.basename(filePathToSend);
    res.download(filePathToSend, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
      generatedFilePaths.forEach((file) => {
        fs.unlink(file, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting temporary file ${file}:`, unlinkErr);
          } else {
            console.log(`Temporary file deleted: ${file}`);
          }
        });
      });
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: "Error generating Excel file", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred during Excel file generation." });
    }
  }
}));
router$1.post("/bm2", (req, res) => __async$3(void 0, null, function* () {
  const { dept_id, dept_nombre, mes, a\u00F1o, tipo } = req.body;
  if (!dept_id || !dept_nombre || !mes || !a\u00F1o || !tipo) {
    return res.status(400).json({ message: "deptId, departamentoNombre, mes, a\xF1o, and tipo are required." });
  }
  if (tipo !== "incorporacion" && tipo !== "desincorporacion") {
    return res.status(400).json({ message: 'Invalid type. Must be "incorporacion" or "desincorporacion".' });
  }
  try {
    let generatedFilePaths = [];
    if (tipo === "incorporacion") {
      generatedFilePaths = yield exportBM2ByDepartment(
        dept_id,
        dept_nombre,
        mes,
        a\u00F1o,
        "incorporacion",
        tempDir$1
      );
    } else if (tipo === "desincorporacion") {
      generatedFilePaths = yield exportBM2ByDepartment(
        dept_id,
        dept_nombre,
        mes,
        a\u00F1o,
        "desincorporacion",
        tempDir$1
      );
    }
    if (generatedFilePaths.length === 0) {
      return res.status(500).json({ message: `No Excel files were generated for BM2 type: ${tipo}.` });
    }
    const filePathToSend = generatedFilePaths[0];
    const fileName = path.basename(filePathToSend);
    res.download(filePathToSend, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
      generatedFilePaths.forEach((file) => {
        fs.unlink(file, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting temporary file ${file}:`, unlinkErr);
          } else {
            console.log(`Temporary file deleted: ${file}`);
          }
        });
      });
    });
  } catch (error) {
    console.error("Error generating BM2 Excel file:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: "Error generating BM2 Excel file", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred during BM2 Excel file generation." });
    }
  }
}));
router$1.post("/bm3", (req, res) => __async$3(void 0, null, function* () {
  const { missing_goods_id, responsable_id } = req.body;
  if (!missing_goods_id || !responsable_id) {
    return res.status(400).json({ message: "missing_goods_id and responsable_id are required." });
  }
  try {
    const generatedFilePaths = yield exportBM3ByMissingGoodsId(
      missing_goods_id,
      responsable_id,
      tempDir$1
    );
    if (generatedFilePaths.length === 0) {
      return res.status(500).json({ message: `No Excel file was generated for missing goods ID: ${missing_goods_id}.` });
    }
    const filePathToSend = generatedFilePaths[0];
    const fileName = path.basename(filePathToSend);
    res.download(filePathToSend, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
      generatedFilePaths.forEach((file) => {
        fs.unlink(file, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting temporary file ${file}:`, unlinkErr);
          } else {
            console.log(`Temporary file deleted: ${file}`);
          }
        });
      });
    });
  } catch (error) {
    console.error("Error generating BM3 Excel file:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: "Error generating BM3 Excel file", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred during BM3 Excel file generation." });
    }
  }
}));
router$1.post("/bm4", (req, res) => __async$3(void 0, null, function* () {
  const { dept_id, mes, a\u00F1o, responsable_id } = req.body;
  if (!dept_id || !mes || !a\u00F1o || !responsable_id) {
    return res.status(400).json({ message: "dept_id, mes, a\xF1o, and responsable_id are required." });
  }
  try {
    const generatedFilePaths = yield generateBM4Pdf(
      dept_id,
      mes,
      a\u00F1o,
      responsable_id,
      tempDir$1
    );
    if (generatedFilePaths.length === 0) {
      return res.status(500).json({ message: "No PDF file was generated for BM4." });
    }
    const filePathToSend = generatedFilePaths[0];
    const fileName = path.basename(filePathToSend);
    res.download(filePathToSend, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
      generatedFilePaths.forEach((file) => {
        fs.unlink(file, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting temporary file ${file}:`, unlinkErr);
          } else {
            console.log(`Temporary file deleted: ${file}`);
          }
        });
      });
    });
  } catch (error) {
    console.error("Error generating BM4 PDF file:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: "Error generating BM4 PDF file", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred during BM4 PDF file generation." });
    }
  }
}));

var __async$2 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const __filename$2 = fileURLToPath(import.meta.url);
const __dirname$2 = path.dirname(__filename$2);
function generateQRLabelsByDepartment(deptId, outputPath) {
  return __async$2(this, null, function* () {
    const generatedFilePaths = [];
    const assets = yield FurnitureModel.getFurnitureByDepartment(deptId);
    console.log(`[EtiquetasQR] Retrieved ${assets.length} assets for department ${deptId}.`);
    if (assets.length === 0) {
      console.log("[EtiquetasQR] No assets found for the specified department. No labels generated.");
      return [];
    }
    for (const asset of assets) {
      const components = yield ComponentsModel.getComponentsByBienId(asset.id);
      asset.components_description = components.map((c) => c.nombre).join(", ");
      if (asset.components_description) {
        asset.components_description = `Componentes: ${asset.components_description}`;
      }
    }
    const pdfDoc = yield PDFDocument.create();
    yield pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = yield pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const logoImpresionPath = path.resolve(__dirname$2, "../images/LogoImpresion.jpg");
    const escudoPath = path.resolve(__dirname$2, "../images/Escudo.jpg");
    const logoImpresionBytes = fs.readFileSync(logoImpresionPath);
    const escudoBytes = fs.readFileSync(escudoPath);
    const embeddedLogoImpresion = yield pdfDoc.embedJpg(logoImpresionBytes);
    const embeddedEscudo = yield pdfDoc.embedJpg(escudoBytes);
    const pageWidth = PageSizes.Letter[1];
    const pageHeight = PageSizes.Letter[0];
    const labelWidth = 280;
    const labelHeight = 120;
    const marginX = 30;
    const marginY = 30;
    const spacingX = (pageWidth - 2 * marginX - 2 * labelWidth) / 1;
    const spacingY = (pageHeight - 2 * marginY - 3 * labelHeight) / 2;
    const labelsPerRow = 2;
    const labelsPerColumn = 3;
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentLabelIndex = 0;
    for (const asset of assets) {
      if (currentLabelIndex >= labelsPerRow * labelsPerColumn) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        currentLabelIndex = 0;
      }
      const col = currentLabelIndex % labelsPerRow;
      const row = Math.floor(currentLabelIndex / labelsPerRow);
      const x = marginX + col * (labelWidth + spacingX);
      const y = pageHeight - marginY - (row + 1) * labelHeight - row * spacingY;
      const qrData = `
Departamento: ${asset.dept_nombre || ""}
N\xB0 Identificaci\xF3n: ${asset.numero_identificacion || ""}
Descripci\xF3n: ${asset.nombre_descripcion || ""}
Marca: ${asset.marca_nombre || ""}
Modelo: ${asset.modelo_nombre || ""}
Estado: ${asset.estado_nombre || ""}
Componentes: ${asset.components_description || ""}
`.trim();
      const qrPngBuffer = yield QRCode.toBuffer(qrData, { type: "png", errorCorrectionLevel: "H", scale: 4 });
      const embeddedQrImage = yield pdfDoc.embedPng(qrPngBuffer);
      page.drawImage(embeddedLogoImpresion, {
        x: x + 5,
        y: y + labelHeight - 40,
        // Ajuste para posicionar en la parte superior izquierda
        width: 80,
        height: 30
      });
      page.drawImage(embeddedEscudo, {
        x: x + labelWidth - 45,
        // Ajuste para posicionar en la parte superior derecha
        y: y + labelHeight - 38,
        width: 40,
        height: 36
      });
      page.drawRectangle({
        x,
        y,
        width: labelWidth,
        height: labelHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1
      });
      page.drawText(`N\xB0 ${asset.numero_identificacion || ""}`, {
        x: x + 10,
        y: y + labelHeight - 90,
        // Debajo del logo
        font: boldFont,
        size: 26,
        // Fuente más grande
        color: rgb(0, 0, 0)
      });
      page.drawImage(embeddedQrImage, {
        x: x + labelWidth - 90,
        // Derecha de la etiqueta
        y: y + labelHeight - 113,
        // Debajo del escudo
        width: 70,
        height: 70
      });
      currentLabelIndex++;
    }
    const pdfBytes = yield pdfDoc.save();
    const fileName = `EtiquetasQR_${deptId}.pdf`;
    const filePath = path.join(outputPath, fileName);
    fs.writeFileSync(filePath, pdfBytes);
    console.log(`[EtiquetasQR] PDF de etiquetas generado: ${filePath}`);
    generatedFilePaths.push(filePath);
    return generatedFilePaths;
  });
}

var __async$1 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
const router = Router();
const tempDir = path.join(__dirname$1, "../../temp_pdf_exports");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
router.post("/qr", (req, res) => __async$1(void 0, null, function* () {
  const { deptId } = req.body;
  if (!deptId) {
    return res.status(400).json({ message: "deptId is required." });
  }
  try {
    const generatedFilePaths = yield generateQRLabelsByDepartment(
      deptId,
      tempDir
      // Pass the temporary directory
    );
    if (generatedFilePaths.length === 0) {
      return res.status(500).json({ message: "No PDF files were generated." });
    }
    const filePathToSend = generatedFilePaths[0];
    const fileName = path.basename(filePathToSend);
    res.download(filePathToSend, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
      generatedFilePaths.forEach((file) => {
        fs.unlink(file, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting temporary file ${file}:`, unlinkErr);
          } else {
            console.log(`Temporary file deleted: ${file}`);
          }
        });
      });
    });
  } catch (error) {
    console.error("Error generating PDF file:", error);
    res.status(500).json({ message: "Error generating PDF file", error: error.message });
  }
}));

var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const closeOldSessions = () => __async(void 0, null, function* () {
  try {
    const query = `
      UPDATE RegistroAuditoria
      SET salida = NOW()
      WHERE salida IS NULL AND entrada < (NOW() - INTERVAL 2 HOUR)
    `;
    const [result] = yield pool.execute(query);
    if (result.affectedRows > 0) {
      console.log(`[CRON] Sesiones cerradas autom\xE1ticamente: ${result.affectedRows}`);
    }
  } catch (error) {
    console.error("[CRON] Error cerrando sesiones antiguas:", error);
  }
});
cron.schedule("0 * * * *", closeOldSessions);

db().then(() => console.log("Database connected successfully")).catch(
  (error) => console.error("Database connection failed:", error)
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path__default.dirname(__filename);
console.log("Current directory:", __dirname);
const app = express();
app.use(express.json());
app.use(cors());
app.use(
  cors({
    //permitir todas las solicitudes de origen
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use("/", router$p);
app.use("/auth", router$o);
app.use(verifyToken);
app.use("/user", router$n);
app.use("/subgroup", router$m);
app.use("/incorp", router$k);
app.use("/goods-status", router$j);
app.use("/user_role", router$i);
app.use("/concept-incorp", router$h);
app.use("/concept-desincorp", router$g);
app.use("/furniture", router$d);
app.use("/api", router$b);
app.use("/dept", router$l);
app.use("/parish", router$f);
app.use("/audit", router$e);
app.use("/transfers", router$c);
app.use("/notifications", router$a);
app.use("/config", router$9);
app.use("/missing-goods", router$8);
app.use("/desincorp", router$7);
app.use("/history", router$6);
app.use("/logs", router$5);
app.use("/components", router$3);
app.use("/transfer-component", router$2);
app.use("/report", router$4);
app.use("/excel", router$1);
app.use("/labels", router);
const PORT = process.env.PORT || 8e3;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
