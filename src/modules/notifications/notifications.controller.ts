import { notificationsModel } from "./notifications.model";

const getAllNotifications = async (req: any, res: any) => {
    try {
        const notifications = await notificationsModel.getAllNotifications();
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ ok: false, message: "No se encontraron notificaciones" });
        }
        res.status(200).json({ ok: true, notifications });
    } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, message: "Error del servidor", error: errorMessage });
    }
};

const getNotificationById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const notification = await notificationsModel.getNotificationById(Number(id));
        if (!notification) {
            return res.status(404).json({ ok: false, message: "Notificación no encontrada" });
        }
        res.status(200).json({ ok: true, notification });
    } catch (error) {
        console.error("Error al obtener la notificación por ID:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, message: "Error del servidor", error: errorMessage });
    }
};

const createNotification = async (req: any, res: any) => {
    try {
        const { dept_id, descripcion } = req.body;
        if (!dept_id || !descripcion) {
            return res.status(400).json({ ok: false, message: "Datos incompletos" });
        }
        const id = await notificationsModel.createNotification({ dept_id, descripcion });
        res.status(201).json({ ok: true, message: "Notificación creada", id });
    } catch (error) {
        console.error("Error al crear la notificación:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, message: "Error del servidor", error: errorMessage });
    }
};

const updateNotification = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { dept_id, descripcion } = req.body;
        const result = await notificationsModel.updateNotification(Number(id), { dept_id, descripcion });
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Notificación no encontrada" });
        }
        res.status(200).json({ ok: true, message: "Notificación actualizada", result });
    } catch (error) {
        console.error("Error al actualizar la notificación:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, message: "Error del servidor", error: errorMessage });
    }
};

const deleteNotification = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const result = await notificationsModel.deleteNotification(Number(id));
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Notificación no encontrada" });
        }
        res.status(200).json({ ok: true, message: "Notificación eliminada", result });
    } catch (error) {
        console.error("Error al eliminar la notificación:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, message: "Error del servidor", error: errorMessage });
    }
};

export const notificationsController = {
    getAllNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification,
};
