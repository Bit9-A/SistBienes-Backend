import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthModel } from "./auth.model";

// Este controlador maneja el registro de nuevos usuarios
const register = async (req: any, res: any) => {
  try {
    const { tipo_usuario, email, password, nombre, apellido, telefono, dept_id, cedula, username, isActive } = req.body;

    // Validar que todos los campos obligatorios estén presentes
    if (!nombre || !apellido || !email || !password || !cedula || !username) {
      return res.status(400).json({ ok: false, message: "Por favor, rellene todos los campos obligatorios." });
    }

    // Validar que el tipo de usuario sea válido
    const existingUser = await AuthModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ ok: false, message: "El correo electrónico ya existe" });
    }

    // Validar que el username sea único
    const existingUsername = await AuthModel.findUserByUsername
      ? await AuthModel.findUserByUsername(username)
      : null;
    if (existingUsername) {
      return res.status(400).json({ ok: false, message: "El nombre de usuario ya existe" });
    }
    // Validar que la cédula sea única
    const existingCedula = await AuthModel.findUserByCedula(cedula);
    if (existingCedula) {
      return res.status(400).json({ ok: false, message: "La cédula ya existe." });
    }

    // Validar que el teléfono sea único
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // Crear el nuevo usuario
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
    // Generar un token JWT para el nuevo usuario
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
    console.error("Error de registro:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// Este controlador maneja el inicio de sesión de los usuarios
const login = async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    // Validar que se proporcionen el nombre de usuario y la contraseña
    if (!username || !password) {
      return res.status(400).json({ ok: false, message: "Se requieren nombre de usuario y contraseña" });
    }
    // Buscar el usuario por nombre de usuario
    const user = await AuthModel.findUserByUsername(username);

    // Primero verifica si existe el usuario
    if (!user) {
      return res.status(400).json({ ok: false, message: "El nombre de usuario o la contraseña no son válidos" });
    }

    // Luego verifica si está activo (acepta 0 o false)
    if (user.isActive === 0 || user.isActive === false) {
      return res.status(403).json({ ok: false, message: "El usuario está inactivo" });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ ok: false, message: "La contraseña no es válida" });
    }
    // Generar un token JWT para el usuario
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET_KEY || "defaultSecret",
      { expiresIn: "1h" }
    );
    // Guardar el token de inicio de sesión en la base de datos
    const expiration = new Date(Date.now() + 3600000); // 1 hour from now
    await AuthModel.saveLoginToken(user.id, token, expiration);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });
    // Excluir la contraseña del usuario en la respuesta
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
    console.error("Error de inicio de sesión:", error);
    res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// Este controlador maneja el cierre de sesión de los usuarios
const logout = async (req: any, res: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No se proporciona ningún token" });
    }
    // Verificar el formato del token
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ message: "Formato de token no válido" });
    }
    // Buscar al usuario por el token de inicio de sesión
    const user = await AuthModel.findUserByLoginToken(token);
    if (!user) {
      return res.status(403).json({ message: "Token no válido" });
    }

    await AuthModel.clearLoginToken(user.id);
    // Eliminar la cookie del token de inicio de sesión
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.json({ ok: true, message: "Cerrar sesión exitosamentel" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// Este controlador maneja la obtención del perfil del usuario
const profile = async (req: any, res: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ ok: false, message: "No se proporciona ningún token" });
    }
    // Verificar el formato del token
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ ok: false, message: "Formato de token no válido" });
    }
    // Buscar al usuario por el token de inicio de sesión
    const user = await AuthModel.findUserByLoginToken(token);
    if (!user) {
      return res.status(403).json({ ok: false, message: "Token no válido" });
    }

    // Verificar si el token ha expirado
    if (user.login_token_expiration && new Date(user.login_token_expiration) < new Date()) {
      return res.status(403).json({ ok: false, message: "El token ha expirado" });
    }

    // Combinar nombre y apellido en un solo campo
    const nombreCompleto = `${user.nombre} ${user.apellido}`;
    // Crear un objeto de perfil de usuario con los datos necesarios
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
    console.error("Error de perfil:", error);
    res.status(500).json({
      ok: false,
      msg: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// Este controlador maneja el restablecimiento de contraseña
const changePassword = async (req: any, res: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ ok: false, message: "No se proporciona ningún token" });
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ ok: false, message: "Formato de token no válido" });
    }
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ ok: false, message: "Usuario no autenticado" });
    }

    const user = await AuthModel.findUserPasswordById(userId)
    if (!user) {
      return res.status(403).json({ ok: false, message: "Token no válido" });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ ok: false, message: "Debe proporcionar la contraseña actual y la nueva." });
    }

    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ ok: false, message: "La contraseña actual es incorrecta." });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedNewPassword = await bcryptjs.hash(newPassword, salt);

    await AuthModel.updateUserPassword(user.id, hashedNewPassword);

    return res.json({ ok: true, message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    return res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// Exportar los controladores para que puedan ser utilizados en las rutas
export const AuthController = {
  register,
  login,
  logout,
  changePassword,
  profile
};