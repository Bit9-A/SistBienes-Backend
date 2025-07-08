import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { configModel } from "./config.model"
import { Request, Response } from "express";
// Image Config 


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const diskStorage = multer.diskStorage({
    destination: path.join(__dirname, "../../../images"),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        let baseName = file.fieldname;
        cb(null, `${baseName}${ext}`);
    }
});

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


const createConfig = (req: Request, res: Response) => {
    const upload = multer({
        storage: diskStorage,
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

        // Lee los archivos recién guardados en disco
        const pathBase = path.join(__dirname, "../../../images");
        const bannerFilename = files?.banner?.[0]?.filename;
        const logoFilename = files?.logo?.[0]?.filename;
        const faviconFilename = files?.favicon?.[0]?.filename;

        const url_banner = bannerFilename
            ? fs.readFileSync(path.join(pathBase, bannerFilename))
            : null;
        const url_logo = logoFilename
            ? fs.readFileSync(path.join(pathBase, logoFilename))
            : null;
        const url_favicon = faviconFilename
            ? fs.readFileSync(path.join(pathBase, faviconFilename))
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
        });

        res.status(200).json({
            ok: true,
            message: "Configuración actualizada correctamente",
        });
    });
};

//Images


const updateConfig = (req: Request, res: Response) => {
    const upload = multer({
        storage: diskStorage,
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

        // Lee los archivos recién guardados en disco
        const pathBase = path.join(__dirname, "../../../images");
        const bannerFilename = files?.banner?.[0]?.filename;
        const logoFilename = files?.logo?.[0]?.filename;
        const faviconFilename = files?.favicon?.[0]?.filename;

        const url_banner = bannerFilename
            ? fs.readFileSync(path.join(pathBase, bannerFilename))
            : null;
        const url_logo = logoFilename
            ? fs.readFileSync(path.join(pathBase, logoFilename))
            : null;
        const url_favicon = faviconFilename
            ? fs.readFileSync(path.join(pathBase, faviconFilename))
            : null;

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

export const configController = {
    getConfig,
    createConfig,
    updateConfig,
};