import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthModel } from "./auth.model";

const register = async (req: any, res: any) => {
  try {
    const { tipo_usuario, email, password, nombre, apellido, telefono, dept_id, cedula, username, isActive } = req.body;

    if (!nombre || !apellido || !email || !password || !cedula || !username) {
      return res.status(400).json({ ok: false, message: "Please fill in all required fields." });
    }

    const existingUser = await AuthModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ ok: false, message: "Email already exists" });
    }

    // Validar que el username sea único
    const existingUsername = await AuthModel.findUserByUsername
      ? await AuthModel.findUserByUsername(username)
      : null;
    if (existingUsername) {
      return res.status(400).json({ ok: false, message: "Username already exists" });
    }

    const existingCedula = await AuthModel.findUserByCedula(cedula);
    if (existingCedula) {
      return res.status(400).json({ ok: false, message: "Cedula already exists" });
    }


    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await AuthModel.createUser({
      tipo_usuario,
      email,
      password: hashedPassword,
      nombre,
      apellido,
      telefono,
      dept_id,
      cedula,
      username,
      isActive: isActive !== undefined ? isActive : true,
    });

    const token = jwt.sign({ email: newUser.email }, process.env.SECRET_KEY || "defaultSecret", {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    return res.status(201).json({
      ok: true,
      user: { ...newUser, password: undefined }, // Excluir la contraseña del usuario en la respuesta
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const login = async (req:any, res:any) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ ok: false, message: "Username and password are required" });
    }

    const user = await AuthModel.findUserByUsername(username);

    // Primero verifica si existe el usuario
    if (!user) {
      return res.status(400).json({ ok: false, message: "Username or password is invalid" });
    }

    // Luego verifica si está activo (acepta 0 o false)
    if (user.isActive === 0 || user.isActive === false) {
      return res.status(403).json({ ok: false, message: "User is inactive" });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ ok: false, message: "Password is invalid" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET_KEY || "defaultSecret",
      { expiresIn: "1h" }
    );

    const expiration = new Date(Date.now() + 3600000); // 1 hour from now
    await AuthModel.saveLoginToken(user.id, token, expiration);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
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
        isActive: user.isActive,
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const logout = async (req: any, res: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const user = await AuthModel.findUserByLoginToken(token);
    if (!user) {
      return res.status(403).json({ message: "Invalid token" });
    }

    await AuthModel.clearLoginToken(user.id);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ ok: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const profile = async (req: any, res: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ ok: false, message: "No token provided" });
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ ok: false, message: "Invalid token format" });
    }

    const user = await AuthModel.findUserByLoginToken(token);
    if (!user) {
      return res.status(403).json({ ok: false, message: "Invalid token" });
    }

    // Verificar si el token ha expirado
    if (user.login_token_expiration && new Date(user.login_token_expiration) < new Date()) {
      return res.status(403).json({ ok: false, message: "Token has expired" });
    }

    // Combinar nombre y apellido en un solo campo
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
      isActive: user.isActive,
    };

    res.json({ user: userProfile });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const resetPassword = async (req: any, res: any) => {
  try {
    const { newPassword, token } = req.body;

    const user = await AuthModel.findUserByResetToken(token);

    if (!user) {
      return res.status(400).json({ ok: false, message: "Invalid or expired token" });
    }

    if (user.reset_token_expiration < Date.now()) {
      return res.status(400).json({ ok: false, message: "Token has expired" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    await AuthModel.updateUserPassword(user.id, hashedPassword);
    await AuthModel.clearPasswordResetToken(user.id);

    res.status(200).json({ ok: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const AuthController = {
  register,
  login,
  logout,
  resetPassword,
  profile
};