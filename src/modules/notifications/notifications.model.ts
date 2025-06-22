import { pool } from "../../database/index";

const getAllNotifications = async () => {
    const [rows] = await pool.execute(`
        SELECT 
            n.*,
            d.nombre AS departamento
        FROM Notificaciones n
        JOIN Departamento d ON n.dept_id = d.id
    `);
    return rows as any[];
};

const getNotificationsByDeptId = async (dept_id: number) => {
    const [rows] = await pool.execute(`
        SELECT 
            n.*,
            d.nombre AS departamento
        FROM Notificaciones n
        JOIN Departamento d ON n.dept_id = d.id
        WHERE n.dept_id = ?
    `, [dept_id]);
    return rows as any[];
};

const getNotificationById = async (id: number) => {
    const [rows] = await pool.execute("SELECT * FROM Notificaciones WHERE id = ?", [id]);
    return (rows as any[])[0] || null;
};

const createNotification = async ({ dept_id, descripcion, fecha, isRead }: { dept_id: number; descripcion: string; fecha: string | null; isRead: number; }) => {
    const [result]: any = await pool.execute(
        "INSERT INTO Notificaciones (dept_id, descripcion, fecha, isRead) VALUES (?, ?, ?, ?)",
        [dept_id, descripcion, fecha || null, isRead]
    );
    return result.insertId;
};

const updateNotification = async (id: number, { dept_id, descripcion, isRead, fecha }: { dept_id?: number; descripcion?: string; isRead?: number; fecha?: string; }) => {
    const [result] = await pool.execute(
        `UPDATE Notificaciones SET 
            dept_id = COALESCE(?, dept_id), 
            descripcion = COALESCE(?, descripcion),
            isRead = COALESCE(?, isRead),
            fecha = COALESCE(?, fecha)
         WHERE id = ?`,
        [dept_id || null, descripcion || null, isRead || null, fecha || null, id]
    );
    return result;
};

const deleteNotification = async (id: number) => {
    const [result] = await pool.execute("DELETE FROM Notificaciones WHERE id = ?", [id]);
    return result;
};

export const notificationsModel = {
    getAllNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification,
    getNotificationsByDeptId,
};
