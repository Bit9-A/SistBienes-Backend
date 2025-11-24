import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { configModel } from "./config.model";
import { Request, Response } from "express";
// Image Config

// Este controlador maneja la configuración general de la aplicación, incluyendo la carga de imágenes y la obtención de la configuración actual.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const diskStorage = multer.diskStorage({
  destination: path.join(process.cwd(), "./images"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    let baseName = file.fieldname;
    cb(null, `${baseName}${ext}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.fieldname === "favicon") {
    if (path.extname(file.originalname).toLowerCase() === ".ico") {
      cb(null, true);
    } else {
      cb(new Error("El favicon debe ser un archivo .ico"));
    }
  } else if (
    file.fieldname === "url_impresion_1" ||
    file.fieldname === "url_impresion_2" ||
    file.fieldname === "banner" ||
    file.fieldname === "logo"
  ) {
    // Permitir cualquier tipo de imagen para estos campos
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error(`El archivo ${file.fieldname} debe ser una imagen.`));
    }
  } else {
    cb(null, true);
  }
};

// Este controlador maneja la obtención de la configuración actual de la aplicación
const getConfig = async (req: any, res: any) => {
  try {
    const config = await configModel.getConfig();
    res.status(200).json({ ok: true, config });
  } catch (error) {
    console.error("Error al obtener la configuración:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Este controlador maneja la creación de una nueva configuración general de la aplicación
const createConfig = (req: Request, res: Response) => {
  const upload = multer({
    storage: diskStorage,
    fileFilter: fileFilter,
  }).fields([
    { name: "favicon", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "url_impresion_1", maxCount: 1 },
    { name: "url_impresion_2", maxCount: 1 },
  ]);

  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al subir la imagen",
        error: err.message,
      });
    }
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Obtiene los nombres de los archivos recién guardados
    const bannerFilename = files?.banner?.[0]?.filename;
    const logoFilename = files?.logo?.[0]?.filename;
    const faviconFilename = files?.favicon?.[0]?.filename;
    const impresion1Filename = files?.url_impresion_1?.[0]?.filename;
    const impresion2Filename = files?.url_impresion_2?.[0]?.filename;

    // Construye las URLs relativas para guardar en la base de datos
    const url_banner = bannerFilename ? `/images/${bannerFilename}` : null;
    const url_logo = logoFilename ? `/images/${logoFilename}` : null;
    const url_favicon = faviconFilename ? `/images/${faviconFilename}` : null;
    const url_impresion_1 = impresion1Filename
      ? `/images/${impresion1Filename}`
      : null;
    const url_impresion_2 = impresion2Filename
      ? `/images/${impresion2Filename}`
      : null;

    const { colorprimario, colorsecundario, nombre_institucion } = req.body;

    await configModel.createConfig({
      fecha: new Date().toISOString().slice(0, 10),
      colorprimario: colorprimario || null,
      colorsecundario: colorsecundario || null,
      nombre_institucion: nombre_institucion || null,
      url_banner,
      url_logo,
      url_favicon,
      url_impresion_1,
      url_impresion_2,
    });

    res.status(200).json({
      ok: true,
      message: "Configuración actualizada correctamente",
    });
  });
};

//Images

// Este controlador maneja la creación de una nueva configuración general de la aplicación
const updateConfig = (req: Request, res: Response) => {
  const upload = multer({
    storage: diskStorage,
    fileFilter: fileFilter,
  }).fields([
    { name: "favicon", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "url_impresion_1", maxCount: 1 },
    { name: "url_impresion_2", maxCount: 1 },
  ]);

  upload(req, res, async function (err) {
    if (err) {
      console.error("[updateConfig] Error de Multer:", err); // Log del error de Multer
      return res.status(500).json({
        ok: false,
        message: "Error al subir la imagen",
        error: err.message,
      });
    }
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Obtiene los nombres de los archivos recién guardados
    const bannerFilename = files?.banner?.[0]?.filename;
    const logoFilename = files?.logo?.[0]?.filename;
    const faviconFilename = files?.favicon?.[0]?.filename;
    const impresion1Filename = files?.url_impresion_1?.[0]?.filename;
    const impresion2Filename = files?.url_impresion_2?.[0]?.filename;

    // Construye las URLs relativas para guardar en la base de datos
    const url_banner = bannerFilename ? `/images/${bannerFilename}` : null;
    const url_logo = logoFilename ? `/images/${logoFilename}` : null;
    const url_favicon = faviconFilename ? `/images/${faviconFilename}` : null;
    const url_impresion_1 = impresion1Filename
      ? `/images/${impresion1Filename}`
      : null;
    const url_impresion_2 = impresion2Filename
      ? `/images/${impresion2Filename}`
      : null;

    const { colorprimario, colorsecundario, nombre_institucion } = req.body;

    // Obtener la configuración actual para eliminar imágenes antiguas
    const currentConfig = await configModel.getConfig();

    // Función auxiliar para eliminar archivos antiguos
    const deleteOldImage = async (
      oldUrl: string | null | undefined,
      newFilename: string | null | undefined
    ) => {
      if (newFilename && oldUrl) {
        const oldPath = path.join(process.cwd(), oldUrl);
        try {
          await fs.promises.unlink(oldPath);
          console.log(`[updateConfig] Imagen antigua eliminada: ${oldPath}`);
        } catch (error: any) {
          if (error.code === "ENOENT") {
            console.warn(
              `[updateConfig] La imagen antigua no existe en la ruta: ${oldPath}. No se pudo eliminar.`
            );
          } else {
            console.error(
              `[updateConfig] Error al eliminar la imagen antigua ${oldPath}:`,
              error
            );
          }
        }
      }
    };

    // Eliminar imágenes antiguas si se han subido nuevas
    await deleteOldImage(currentConfig?.url_banner, bannerFilename);
    await deleteOldImage(currentConfig?.url_logo, logoFilename);
    await deleteOldImage(currentConfig?.url_favicon, faviconFilename);
    await deleteOldImage(currentConfig?.url_impresion_1, impresion1Filename);
    await deleteOldImage(currentConfig?.url_impresion_2, impresion2Filename);

    await configModel.updateGeneralConfig({
      fecha: new Date().toISOString().slice(0, 10),
      colorprimario: colorprimario || null,
      colorsecundario: colorsecundario || null,
      nombre_institucion: nombre_institucion || null,
      url_banner,
      url_logo,
      url_favicon,
      url_impresion_1,
      url_impresion_2,
    });

    res.status(200).json({
      ok: true,
      message: "Configuración actualizada correctamente",
    });
  });
};

// Exportamos los controladores para que puedan ser utilizados en las rutas
export const configController = {
  getConfig,
  createConfig,
  updateConfig,
};
