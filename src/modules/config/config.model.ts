import { pool } from "../../database/index";

// Obtener la configuración actual
const getConfig = async () => {
    const [rows] = await pool.execute("SELECT * FROM config LIMIT 1");
    return (rows as any[])[0] || null;
};

// Crea una nueva configuración, permitiendo que los campos sean opcionales
const createConfig = async ({
    fecha,
    colorprimario,
    colorsecundario,
    url_banner,
    url_logo,
    url_favicon,
    nombre_institucion,
}: {
    fecha: string;
    colorprimario?: string;
    colorsecundario?: string;
    url_banner?: string;
    url_logo?: string;
    url_favicon?: string;
    nombre_institucion?: string;
}) => {
    const [result]: any = await pool.execute(
        `INSERT INTO config (
            fecha, colorprimario, colorsecundario, url_banner, url_logo, url_favicon, nombre_institucion
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            fecha,
            colorprimario || null,
            colorsecundario || null,
            url_banner || null,
            url_logo || null,
            url_favicon || null,
            nombre_institucion || null,
        ]
    );
    return result.insertId;
};

// Actualiza la configuración existente, permitiendo que los campos sean opcionales
const updateConfig = async (
    id: number,
    {
        fecha,
        colorprimario,
        colorsecundario,
        url_banner,
        url_logo,
        url_favicon,
        nombre_institucion,
    }: {
        fecha?: string;
        colorprimario?: string;
        colorsecundario?: string;
        url_banner?: string;
        url_logo?: string;
        url_favicon?: string;
        nombre_institucion?: string;
    }
) => {
    const [result] = await pool.execute(
        `UPDATE config SET
            fecha = COALESCE(?, fecha),
            colorprimario = COALESCE(?, colorprimario),
            colorsecundario = COALESCE(?, colorsecundario),
            url_banner = COALESCE(?, url_banner),
            url_logo = COALESCE(?, url_logo),
            url_favicon = COALESCE(?, url_favicon),
            nombre_institucion = COALESCE(?, nombre_institucion)
        WHERE id = ?`,
        [
            fecha || null,
            colorprimario || null,
            colorsecundario || null,
            url_banner || null,
            url_logo || null,
            url_favicon || null,
            nombre_institucion || null,
            id,
        ]
    );
    return result;
};

export const configModel = {
    getConfig,
    updateConfig,
    createConfig,
};
