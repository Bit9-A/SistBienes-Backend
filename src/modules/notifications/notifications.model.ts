import { pool } from "../../database/index";

const getAllNotifications = async () => {
    const [rows] = await pool.execute("SELECT * FROM notificaciones");
    return rows as any[];
};

const getNotificationById = async (id: number) => {
    const [rows] = await pool.execute("SELECT * FROM notificaciones WHERE id = ?", [id]);
    return (rows as any[])[0] || null;
};

const createNotification = async ({ dept_id, descripcion }: { dept_id: number; descripcion: string; }) => {
    const [result]: any = await pool.execute(
        "INSERT INTO notificaciones (dept_id, descripcion) VALUES (?, ?)",
        [dept_id, descripcion]
    );
    return result.insertId;
};

const updateNotification = async (id: number, { dept_id, descripcion }: { dept_id?: number; descripcion?: string; }) => {
    const [result] = await pool.execute(
        `UPDATE notificaciones SET 
            dept_id = COALESCE(?, dept_id), 
            descripcion = COALESCE(?, descripcion)
         WHERE id = ?`,
        [dept_id || null, descripcion || null, id]
    );
    return result;
};

const deleteNotification = async (id: number) => {
    const [result] = await pool.execute("DELETE FROM notificaciones WHERE id = ?", [id]);
    return result;
};

export const notificationsModel = {
    getAllNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification,
};