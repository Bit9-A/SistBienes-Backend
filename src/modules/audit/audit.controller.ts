import { auditModel } from "./audit.model";

// Este controlador maneja las operaciones CRUD para las auditorías
const getAllAudit = async (req: any, res: any) => {
    try {
        const audits = await auditModel.getAllAudit();
        return res.status(200).json({ ok: true, audits });
    } catch (error) {
        console.error("Error al obtener las auditorías", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Este controlador maneja la obtención de una auditoría por su ID
const getAuditById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const audit = await auditModel.getAuditById(Number(id));
        if (!audit) {
            return res.status(404).json({ ok: false, message: "Audit not found" });
        }
        return res.status(200).json({ ok: true, audit });
    } catch (error) {
        console.error("Error al obtener la auditoría por ID", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Este controlador maneja la creación de una nueva auditoría
const createAudit = async (req: any, res: any) => {
    try {
        const newAudit = await auditModel.createAudit(req.body);
        return res.status(201).json({
            ok: true,
            message: "Auditoría creada exitosamente",
            newAudit,
        });
    } catch (error) {
        console.error("Error al crear auditoría:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Este controlador maneja la actualización de una auditoría existente
const updateAudit = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const updatedAudit = await auditModel.updateAudit(Number(id), req.body);
        return res.status(200).json({
            ok: true,
            message: "Auditoría actualizada con éxito",
            updatedAudit,
        });
    } catch (error) {
        console.error("Error al actualizar la auditoría:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Este controlador maneja la eliminación de una auditoría por su ID
const deleteAudit = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        await auditModel.deleteAudit(Number(id));
        return res.status(200).json({
            ok: true,
            message: "Auditoría eliminada correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar la auditoría:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
}

// Este controlador maneja el registro de entrada de un usuario
const registerIn = async (req: any, res: any) => {
    try {
        const { usuario_id } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        if (!usuario_id) {
            return res.status(400).json({ ok: false, message: "usuario_id es obligatorio" });
        }
        const id = await auditModel.registerIn(usuario_id, ip);
        res.status(201).json({ ok: true, message: "Entrada registrada", id });
    } catch (error) {
        res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
    }
};

// Este controlador maneja el registro de salida de un usuario
const registerOut = async (req: any, res: any) => {
    try {
        const { usuario_id } = req.body;
        if (!usuario_id) {
            return res.status(400).json({ ok: false, message: "usuario_id es obligatorio" });
        }
        await auditModel.registerOut(usuario_id);
        res.status(200).json({ ok: true, message: "Salida registrada" });
    } catch (error) {
        res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
    }
};

// Exportamos los controladores para que puedan ser utilizados en las rutas
export const auditController = {
    getAllAudit,
    getAuditById,
    createAudit,
    updateAudit,
    deleteAudit,
    registerIn,
    registerOut,
}