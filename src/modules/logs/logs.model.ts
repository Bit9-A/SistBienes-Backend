import { pool } from '../../database/index';

const createLog = async (usuario_id: number, accion: string, detalles?: string | null) => {
    const query = `
        INSERT INTO Logs (usuario_id, fecha, accion, detalles) 
        VALUES (?, NOW(), ?, ?)`;
    const [result] = await pool.execute(query, [usuario_id, accion, detalles]);
    return {
        id: (result as any).insertId,
        usuario_id,
        accion,
        detalles,
    };
};

const getAllLogs = async () => {
    const query = `
        SELECT * FROM Logs ORDER BY fecha DESC`;
    const [rows] = await pool.query(query);
    return rows as any[];
};

const getLogById = async (id: number) => {
    const query = `
        SELECT * FROM Logs WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

export const logsModel = {
    createLog,
    getAllLogs,
    getLogById,
};
