import { logsModel } from "./logs.model";

const createLog = async (req: any, res: any) => {
    try {
        const { usuario_id, accion, detalles } = req.body;
        if (!usuario_id || !accion) {
            return res.status(400).json({ ok: false, message: "usuario_id y accion son obligatorios" });
        }
        const log = await logsModel.createLog(usuario_id, accion, detalles);
        res.status(201).json({ ok: true, log });
    } catch (error) {
        res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
    }
};

const getAllLogs = async (req: any, res: any) => {
    try {
        const logs = await logsModel.getAllLogs();
        res.status(200).json({ ok: true, logs });
    } catch (error) {
        res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
    }
};

const getLogById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const log = await logsModel.getLogById(Number(id));
        if (!log) {
            return res.status(404).json({ ok: false, message: "Log no encontrado" });
        }
        res.status(200).json({ ok: true, log });
    } catch (error) {
        res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
    }
};

export const logsController = {
    createLog,
    getAllLogs,
    getLogById,
};