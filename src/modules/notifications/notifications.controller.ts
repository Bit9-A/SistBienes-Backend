import { notificationsModel } from "./notifications.model";

// Este controlador maneja las operaciones relacionadas con las notificaciones
const getAllNotifications = async (req: any, res: any) => {
    try {
        const notifications = await notificationsModel.getAllNotifications();
        res.status(200).json({ ok: true, notifications });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, error: errorMessage });
    }
};

// Este controlador maneja la obtención de una notificación por su ID
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

// Este controlador maneja la creación de una nueva notificación
const createNotification = async (req: any, res: any) => {
    try {
        const { dept_id, descripcion, fecha, isRead } = req.body;
        if (!dept_id || !descripcion || !fecha || isRead === undefined) {
            return res.status(400).json({ ok: false, message: "Datos incompletos" });
        }
        const id = await notificationsModel.createNotification({ dept_id, descripcion, fecha, isRead: Number(isRead) });
        res.status(201).json({ ok: true, message: "Notificación creada", id });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, error: errorMessage });
    }
};

// Este controlador maneja la actualización de una notificación existente
const updateNotification = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { dept_id, descripcion, isRead, fecha } = req.body;
        const result = await notificationsModel.updateNotification(Number(id), { dept_id, descripcion, isRead, fecha });
        res.status(200).json({ ok: true, message: "Notificación actualizada", result });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, error: errorMessage });
    }
};

// Este controlador maneja la eliminación de una notificación por su ID
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

// Este controlador maneja la obtención de notificaciones por ID de departamento
const getNotificationsByDeptId = async (req: any, res: any) => {
    try {
        const { dept_id } = req.params;
        const notifications = await notificationsModel.getNotificationsByDeptId(Number(dept_id));
        res.status(200).json({ ok: true, notifications });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, error: errorMessage });
    }
};

// Exportamos los controladores para que puedan ser utilizados en las rutas
export const notificationsController = {
    getAllNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification,
    getNotificationsByDeptId,
};
