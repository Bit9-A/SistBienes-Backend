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
        SELECT l.*, u.username AS usuario_nombre, d.nombre AS departamento
        FROM Logs l 
        JOIN Usuarios u ON l.usuario_id = u.id
        LEFT JOIN Dept d ON u.dept_id = d.id or u.dept_id = null
        ORDER BY l.fecha DESC`;
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