import { auditModel } from "./audit.model";

const getAllAudit = async (req: any, res: any) => {
    try {
        const audits = await auditModel.getAllAudit();
        return res.status(200).json({ ok: true, audits });
    } catch (error) {
        console.error("Error fetching audits:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const getAuditById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const audit = await auditModel.getAuditById(Number(id));
        if (!audit) {
            return res.status(404).json({ ok: false, message: "Audit not found" });
        }
        return res.status(200).json({ ok: true, audit });
    } catch (error) {
        console.error("Error fetching audit by ID:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const createAudit = async (req: any, res: any) => {
    try {
        const newAudit = await auditModel.createAudit(req.body);
        return res.status(201).json({
            ok: true,
            message: "Audit created successfully",
            newAudit,
        });
    } catch (error) {
        console.error("Error creating audit:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const updateAudit = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const updatedAudit = await auditModel.updateAudit(Number(id), req.body);
        return res.status(200).json({
            ok: true,
            message: "Audit updated successfully",
            updatedAudit,
        });
    } catch (error) {
        console.error("Error updating audit:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const deleteAudit = async (req: any, res:any) => {
    try {
        const { id } = req.params;
        await auditModel.deleteAudit(Number(id));
        return res.status(200).json({
            ok: true,
            message: "Audit deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting audit:", error);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

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

export const auditController = {
    getAllAudit,
    getAuditById,
    createAudit,
    updateAudit,
    deleteAudit,
    registerIn,
    registerOut,
}