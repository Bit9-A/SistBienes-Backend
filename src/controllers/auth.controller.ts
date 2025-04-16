import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthModel } from "../models/auth.model";

const register = async (req: any, res: any) => {
    try {
      const { tipo_usuario, email, password, nombre, apellido, telefono, dept_id, cedula } = req.body;
  
      if (!nombre || !apellido || !email || !password || !cedula) {
        return res.status(400).json({ ok: false, message: "Please fill in all required fields." });
      }
  
      const existingUser = await AuthModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ ok: false, message: "Email already exists" });
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

const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "Email and password are required" });
    }

    const user = await AuthModel.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ ok: false, message: "Email or password is invalid" });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ ok: false, message: "Email or password is invalid" });
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

    res.json({ ok: true, token });
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
};