import { pool } from "../../database/index";

// Obtener todos los traslados con sus bienes asociados
const getAllTransfers = async () => {
    const query = `
        SELECT t.*,CONCAT(u.nombre,' ',u.apellido) as responsable, bt.id as bien_traslado_id, bt.id_mueble, d.nombre as origen_nombre, d2.nombre as destino_nombre
        FROM Traslado t
        LEFT JOIN bien_traslado bt ON t.id = bt.id_traslado
        JOIN Dept d ON t.origen_id = d.id
        JOIN Dept d2 ON t.destino_id = d2.id
        JOIN Usuarios u ON t.responsable_id = u.id
    `;
    const [rows] = await pool.execute(query);
    return rows as any[];
};

// Obtener un traslado por ID con sus bienes asociados
const getTransferById = async (id: number) => {
    const trasladoQuery = `SELECT t.*, CONCAT(u.nombre,' ',u.apellido) as responsable ,d.nombre as origen_nombre, d2.nombre as destino_nombre
    FROM Traslado t
    JOIN Usuarios u ON t.responsable_id = u.id
    JOIN Dept d ON t.origen_id = d.id
    JOIN Dept d2 ON t.destino_id = d2.id
    WHERE t.id = ?`;
    const bienesQuery = `
        SELECT bt.*, m.nombre_descripcion, m.numero_identificacion,eb.nombre as estado
        FROM bien_traslado bt
        JOIN Muebles m ON bt.id_mueble = m.id
        JOIN EstadoBien eb ON m.estado_id = eb.id
        WHERE bt.id_traslado = ?
    `;
    const [trasladoRows] = await pool.execute(trasladoQuery, [id]) as [any[], any];
    if (trasladoRows.length === 0) return null;
    const [bienesRows] = await pool.execute(bienesQuery, [id]) as [any[], any];

    // Sobrescribe cantidad con la cantidad real de bienes asociados
    return { 
        ...trasladoRows[0], 
        cantidad: bienesRows.length,
        bienes: bienesRows 
    };
};

// Crear un traslado y asociar bienes
const createTransfer = async ({
    fecha,
    cantidad,
    origen_id,
    destino_id,
    bienes, // array de IDs de bienes
    responsable_id, // Cambiar a number
    observaciones,
}: {
    fecha: Date;
    cantidad: number;
    origen_id: number;
    destino_id: number;
    bienes: number[];
    responsable_id: number; // Cambiar a number
    observaciones: string;
}) => {

    // 1. Crear el traslado
    const query = `
        INSERT INTO Traslado (fecha, cantidad, origen_id, destino_id, responsable_id, observaciones)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result]: any = await pool.execute(query, [
        fecha,
        cantidad,
        origen_id,
        destino_id,
        responsable_id, // Asegúrate de que este valor no sea undefined
        observaciones || null, // Si observaciones es undefined, se pasará null
    ]);
    const trasladoId = result.insertId;

    // 2. Asociar los bienes al traslado
    for (const mueble_id of bienes) {
        await pool.execute(
            `INSERT INTO bien_traslado (id_traslado, id_mueble) VALUES (?, ?)`,
            [trasladoId, mueble_id]
        );
    }

    return trasladoId;
};

// Actualizar traslado
const updateTransfer = async (
    id: number,
    {
        fecha,
        cantidad,
        origen_id,
        destino_id,
    }: {
        fecha?: Date;
        cantidad?: number;
        origen_id?: number;
        destino_id?: number;
    }
) => {
    const query = `
        UPDATE Traslado
        SET 
            fecha = COALESCE(?, fecha),
            cantidad = COALESCE(?, cantidad),
            origen_id = COALESCE(?, origen_id),
            destino_id = COALESCE(?, destino_id)
        WHERE id = ?
    `;
    const [result] = await pool.execute(query, [
        fecha || null,
        cantidad || null,
        origen_id || null,
        destino_id || null,
        id,
    ]);
    return result;
};

// Eliminar traslado y sus bienes asociados
const deleteTransfer = async (id: number) => {
    await pool.execute(`DELETE FROM bien_traslado WHERE id_traslado = ?`, [id]);
    const [result] = await pool.execute(`DELETE FROM Traslado WHERE id = ?`, [id]);
    return result;
};

export const transfersModel = {
    getAllTransfers,
    getTransferById,
    createTransfer,
    updateTransfer,
    deleteTransfer,
};