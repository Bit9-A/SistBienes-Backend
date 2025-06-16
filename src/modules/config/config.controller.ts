import { configModel } from "./config.model";

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

const updateConfig = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const result = await configModel.updateConfig(Number(id), req.body);
        res.status(200).json({ ok: true, message: "Configuración actualizada", result });
    } catch (error) {
        console.error("Error al actualizar la configuración:", error);
        res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

const createConfig = async (req: any, res: any) => {
    try {
        const { fecha, colorprimario, colorsecundario, url_banner, url_logo, url_favicon, nombre_institucion } = req.body;
        if (!fecha) {
            return res.status(400).json({ ok: false, message: "La fecha es obligatoria" });
        }
        const id = await configModel.createConfig({
            fecha,
            colorprimario,
            colorsecundario,
            url_banner,
            url_logo,
            url_favicon,
            nombre_institucion,
        });
        res.status(201).json({ ok: true, message: "Configuración creada", id });
    } catch (error) {
        console.error("Error al crear la configuración:", error);
        res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const configController = {
    getConfig,
    updateConfig,
    createConfig,
};