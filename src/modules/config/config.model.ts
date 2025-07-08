import { pool } from "../../database/index";
import path from "path";
import fs from "fs";

// Obtener la configuración actual
const getConfig = async () => {
    const [rows] = await pool.execute("SELECT * FROM Configuracion LIMIT 1");
    return (rows as any[])[0] || null;
};

// Crear una nueva configuración
const createConfig = async ({
    fecha,
    colorprimario,
    colorsecundario,
    nombre_institucion,
    url_banner,
    url_logo,
    url_favicon,
}: {
    fecha?: string | null;
    colorprimario?: string | null;
    colorsecundario?: string | null;
    nombre_institucion?: string | null;
    url_banner?: Buffer | null;
    url_logo?: Buffer | null;
    url_favicon?: Buffer | null;
}) => {
    const fechaFinal = fecha || new Date().toISOString().slice(0, 10);

    const [result]: any = await pool.execute(
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
            colorprimario ?? null,
            colorsecundario ?? null,
            nombre_institucion ?? null,
            url_banner ?? null,
            url_logo ?? null,
            url_favicon ?? null,
        ]
    );
    return result.insertId;
};

// Actualizar la configuración general
const updateGeneralConfig = async ({
    fecha,
    colorprimario,
    colorsecundario,
    nombre_institucion,
    url_banner,
    url_logo,
    url_favicon,
}: {
    fecha?: string | null;
    colorprimario?: string | null;
    colorsecundario?: string | null;
    nombre_institucion?: string | null;
    url_banner?: Buffer | null;
    url_logo?: Buffer | null;
    url_favicon?: Buffer | null;
}) => {
    const [result] = await pool.execute(
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
            colorprimario ?? null,
            colorsecundario ?? null,
            nombre_institucion ?? null,
            url_banner ?? null,
            url_logo ?? null,
            url_favicon ?? null,
        ]
    );
    return result;
};

// Exportamos las funciones del modelo para que puedan ser utilizadas en los controladores
export const configModel = {
    getConfig,
    createConfig,
    updateGeneralConfig,
};
