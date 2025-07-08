import { pool } from "../../database/index";

// Este modelo maneja las operaciones de auditoría en la base de datos
const getAllAudit = async () => {
    const query = `SELECT a.id, a.usuario_id, a.entrada, a.salida, a.ip, CONCAT(u.nombre, ' ', u.apellido) AS nombre, d.nombre as departamento
    FROM RegistroAuditoria a
	LEFT JOIN Usuarios u ON a.usuario_id = u.id
	LEFT JOIN Departamento d ON u.dept_id = d.id;
    `;
    const [rows] = await pool.execute(query);
    return rows as any[];
}

// Este modelo obtiene una auditoría por su ID
const getAuditById = async (id: number) => {
    const query = `SELECT * FROM RegistroAuditoria WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return (rows as any[])[0];
}

// Este modelo crea una nueva auditoría
const createAudit = async ({
    usuario_id,
    entrada,
    salida,
    ip,
}: {
    usuario_id: number;
    entrada: Date;
    salida: Date;
    ip: string;
}) => {
    const query = `
        INSERT INTO RegistroAuditoria (usuario_id, entrada, salida, ip)
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [usuario_id, entrada, salida, ip]);

    const auditQuery = `
        SELECT id, usuario_id, entrada, salida, ip
        FROM RegistroAuditoria WHERE id = ?`;
    const [rows] = await pool.execute(auditQuery, [(result as any).insertId]);
    return (rows as any[])[0];
}

// Este modelo actualiza una auditoría existente
const updateAudit = async (
    id: number,
    {
        usuario_id,
        entrada,
        salida,
        ip,
    }: {
        usuario_id?: number;
        entrada?: Date;
        salida?: Date;
        ip?: string;
    }
) => {
    const query = `
    UPDATE RegistroAuditoria 
    SET
        usuario_id = COALESCE(?, usuario_id),
        entrada = COALESCE(?, entrada),
        salida = COALESCE(?, salida),
        ip = COALESCE(?, ip)
    WHERE id = ?`;
    const [result] = await pool.execute(query, [
        usuario_id || null,
        entrada || null,
        salida || null,
        ip || null,
        id
    ]);
    return result;
};

// Este modelo elimina una auditoría por su ID
const deleteAudit = async (id: number) => {
    const query = `DELETE FROM RegistroAuditoria WHERE id = ?`;
    const [result] = await pool.execute(query, [id]);
    return result;
}

// Este modelo registra la entrada de un usuario
const registerIn = async (usuario_id: number, ip: string) => {
    const query = `
        INSERT INTO RegistroAuditoria (usuario_id, entrada, ip)
        VALUES (?, NOW(), ?)
    `;
    const [result] = await pool.execute(query, [usuario_id, ip]);
    return (result as any).insertId;
};

// Este modelo registra la salida de un usuario
const registerOut = async (usuario_id: number) => {
    const query = `
        UPDATE RegistroAuditoria
        SET salida = NOW()
        WHERE usuario_id = ? AND salida IS NULL
        ORDER BY entrada DESC
        LIMIT 1
    `;
    const [result] = await pool.execute(query, [usuario_id]);
    return result;
};

// Exportamos los modelos para que puedan ser utilizados en los controladores
export const auditModel = {
    getAllAudit,
    getAuditById,
    createAudit,
    updateAudit,
    deleteAudit,
    registerIn,
    registerOut,
}
