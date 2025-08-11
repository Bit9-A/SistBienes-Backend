import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { configModel } from "./config.model"
import { Request, Response } from "express";
// Image Config 

// Este controlador maneja la configuración general de la aplicación, incluyendo la carga de imágenes y la obtención de la configuración actual.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const diskStorage = multer.diskStorage({
    destination: path.join(process.cwd(), "images"),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        let baseName = file.fieldname;
        cb(null, `${baseName}${ext}`);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.fieldname === "favicon") {
        if (path.extname(file.originalname).toLowerCase() === ".ico") {
            cb(null, true);
        } else {
            cb(new Error("El favicon debe ser un archivo .ico"));
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
        { name: "LogoImpresion", maxCount: 1 },
    ]);

    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ ok: false, message: "Error al subir la imagen", error: err.message });
        }
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        // Obtiene los nombres de los archivos recién guardados
        const bannerFilename = files?.banner?.[0]?.filename;
        const logoFilename = files?.logo?.[0]?.filename;
        const faviconFilename = files?.favicon?.[0]?.filename;

        // Construye las URLs relativas para guardar en la base de datos
        const url_banner = bannerFilename ? `/images/${bannerFilename}` : null;
        const url_logo = logoFilename ? `/images/${logoFilename}` : null;
        const url_favicon = faviconFilename ? `/images/${faviconFilename}` : null;

        const { colorprimario, colorsecundario, nombre_institucion } = req.body;

        await configModel.createConfig({
            fecha: new Date().toISOString().slice(0, 10),
            colorprimario: colorprimario || null,
            colorsecundario: colorsecundario || null,
            nombre_institucion: nombre_institucion || null,
            url_banner,
            url_logo,
            url_favicon,
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
    ]);

    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ ok: false, message: "Error al subir la imagen", error: err.message });
        }
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        // Obtiene los nombres de los archivos recién guardados
        const bannerFilename = files?.banner?.[0]?.filename;
        const logoFilename = files?.logo?.[0]?.filename;
        const faviconFilename = files?.favicon?.[0]?.filename;

        // Construye las URLs relativas para guardar en la base de datos
        const url_banner = bannerFilename ? `/images/${bannerFilename}` : null;
        const url_logo = logoFilename ? `/images/${logoFilename}` : null;
        const url_favicon = faviconFilename ? `/images/${faviconFilename}` : null;

        const { colorprimario, colorsecundario, nombre_institucion } = req.body;

        await configModel.updateGeneralConfig({
            fecha: new Date().toISOString().slice(0, 10),
            colorprimario: colorprimario || null,
            colorsecundario: colorsecundario || null,
            nombre_institucion: nombre_institucion || null,
            url_banner,
            url_logo,
            url_favicon,
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
