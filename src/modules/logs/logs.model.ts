import { pool } from '../../database/index';

// Este modelo maneja las operaciones relacionadas con los logs del sistema

// Este modelo maneja la creación de un nuevo log
const createLog = async (usuario_id: number, accion: string, detalles?: string | null) => {
    const query = `
        INSERT INTO RegistroLogs (usuario_id, fecha, accion, detalles) 
        VALUES (?, NOW(), ?, ?)`;
    const [result] = await pool.execute(query, [usuario_id, accion, detalles]);
    return {
        id: (result as any).insertId,
        usuario_id,
        accion,
        detalles,
    };
};

// Este modelo maneja la obtención de todos los logs
const getAllLogs = async () => {
    const query = `
        SELECT rl.*, u.username AS usuario_nombre, d.nombre AS departamento
        FROM RegistroLogs rl 
        LEFT JOIN Usuarios u ON rl.usuario_id = u.id
        LEFT JOIN Departamento d ON u.dept_id = d.id
        ORDER BY rl.fecha DESC`;
    const [rows] = await pool.query(query);
    return rows as any[];
};

// Este modelo maneja la obtención de un log por su ID
const getLogById = async (id: number) => {
    const query = `
        SELECT * FROM RegistroLogs WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
};

// Exportamos el modelo para que pueda ser utilizado en los controladores
export const logsModel = {
    createLog,
    getAllLogs,
    getLogById,
};
