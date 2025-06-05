import { desincorpModel } from "./desincorp.model";

const getAllDesincorp = async (req: any, res: any) => {
    try {
        const desincorps = await desincorpModel.getAllDesincorp();
        return res.status(200).json({ ok: true, desincorps });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const getDesincorpById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const desincorp = await desincorpModel.getDesincorpById(Number(id));
        if (!desincorp) {
            return res.status(404).json({ ok: false, message: "Desincorp not found" });
        }
        return res.status(200).json({ ok: true, desincorp });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const createDesincorp = async (req: any, res: any) => {
    try {
        const { bien_id, fecha, valor, cantidad, concepto_id, dept_id } = req.body;
        if (!bien_id || !fecha || !valor || !cantidad || !concepto_id) {
            return res.status(400).json({ ok: false, message: "Please fill in all required fields." });
        }
        const newDesincorp = await desincorpModel.createDesincorp({
            bien_id,
            fecha,
            valor,
            cantidad,
            concepto_id,
            dept_id,
        });
        return res.status(201).json({ ok: true, desincorp: newDesincorp });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const updateDesincorp = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const desincorp = await desincorpModel.getDesincorpById(Number(id));
        if (!desincorp) {
            return res.status(404).json({ ok: false, message: "Desincorp not found" });
        }
        await desincorpModel.updateDesincorp(Number(id), updates);
        return res.status(200).json({ ok: true, desincorp ,message: "Desincorp updated successfully" });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const deleteDesincorp = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const desincorp = await desincorpModel.getDesincorpById(Number(id));
        if (!desincorp) {
            return res.status(404).json({ ok: false, message: "Desincorp not found" });
        }
        await desincorpModel.deleteDesincorp(Number(id));
        return res.status(200).json({ ok: true, message: "Desincorp deleted successfully" });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const desincorpController = {
    getAllDesincorp,
    getDesincorpById,
    createDesincorp,
    updateDesincorp,
    deleteDesincorp,
};