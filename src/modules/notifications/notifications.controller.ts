import { notificationsModel } from "./notifications.model";

const getAllNotifications = async (req: any, res: any) => {
    try {
        const notifications = await notificationsModel.getAllNotifications();
        res.status(200).json({ ok: true, notifications });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, error: errorMessage });
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
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, error: errorMessage });
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
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, error: errorMessage });
    }
};

const updateNotification = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { dept_id, descripcion } = req.body;
        const result = await notificationsModel.updateNotification(Number(id), { dept_id, descripcion });
        res.status(200).json({ ok: true, message: "Notificación actualizada", result });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, error: errorMessage });
    }
};

const deleteNotification = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const result = await notificationsModel.deleteNotification(Number(id));
        res.status(200).json({ ok: true, message: "Notificación eliminada", result });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, error: errorMessage });
    }
};

export const notificationsController = {
    getAllNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification,
};