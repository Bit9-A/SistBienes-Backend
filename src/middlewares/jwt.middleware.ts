import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction } from "express";
import { AuthModel } from "../auth/auth.model";
import { UserModel } from "../users/user.model";

const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwicm9sZV9pZCI6MSwiaWF0IjoxNzM4NjgwNzcwLCJleHAiOjE3Mzg2ODQzNzB9.kHNI4ccrzs1g5vH3HO6y5vdIxpn7sedy3tgQA27qXKs";

export const verifyToken = async (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    // Verificar si es un token de administrador
    if (token === ADMIN_TOKEN) {
      req.user = { admin: true, role_id: 1 };
      return next();
    }

    // Verificar el token JWT
    const decoded = jwt.verify(token, process.env.SECRET_KEY || "defaultSecret") as JwtPayload;

    // Buscar el usuario en la base de datos
    const user = await AuthModel.findUserByLoginToken(token);
    if (!user) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Verificar si el token está cerca de expirar
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = decoded.exp ? decoded.exp - currentTime : 0;

    if (timeLeft < 600) { // Si quedan menos de 10 minutos
      const newToken = jwt.sign(
        { userId: user.id, email: user.email, role_id: user.role_id },
        process.env.SECRET_KEY || "defaultSecret",
        { expiresIn: "1h" }
      );

      const expiration = new Date(Date.now() + 3600000); // 1 hora desde ahora
      await AuthModel.saveLoginToken(user.id, newToken, expiration);

      res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      });

      req.headers.authorization = `Bearer ${newToken}`;
    }

    // Adjuntar información del usuario al objeto `req`
    req.user = { email: decoded.email, userId: decoded.userId, role_id: user.role_id };
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired, please log in again" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Token verification error:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
};