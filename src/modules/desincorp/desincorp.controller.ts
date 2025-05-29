import { desincorpModel } from "./desincorp.model";

const getAllDesincorp = async (req: any, res: any) => {
    try {
        const desincorpList = await desincorpModel.getAllDesincorp();
        res.status(200).json({ ok: true, desincorp: desincorpList });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

const getDesincorpById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const desincorpItem = await desincorpModel.getDesincorpById(Number(id));
        if (!desincorpItem) {
            return res.status(404).json({ ok: false, message: "Desincorp not found" });
        }
        res.status(200).json({ ok: true, desincorp: desincorpItem });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

const createDesincorp = async (req: any, res: any) => {
    try {
        const { bien_id, fecha, valor, cantidad, concepto_id, dept_id } = req.body;
        if (bien_id === undefined || fecha === undefined || valor === undefined || cantidad === undefined || concepto_id === undefined || dept_id === undefined) {
            return res.status(400).json({ ok: false, message: "All fields are required" });
        }
        const newDesincorp = await desincorpModel.createDesincorp(bien_id, fecha, valor, cantidad, concepto_id, dept_id);
        res.status(201).json({ ok: true, desincorp: newDesincorp });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

const updateDesincorp = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { bien_id, fecha, valor, cantidad, concepto_id, dept_id } = req.body;
        if (bien_id === undefined || fecha === undefined || valor === undefined || cantidad === undefined || concepto_id === undefined || dept_id === undefined) {
            return res.status(400).json({ ok: false, message: "All fields are required" });
        }
        const result = await desincorpModel.updateDesincorp(Number(id), bien_id, fecha, valor, cantidad, concepto_id, dept_id);
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Desincorp not found" });
        }
        res.status(200).json({ ok: true, message: "Desincorp updated successfully" });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

const deleteDesincorp = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const result = await desincorpModel.deleteDesincorp(Number(id));
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Desincorp not found" });
        }
        res.status(200).json({ ok: true, message: "Desincorp deleted successfully" });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

export const desincorpController = {
    getAllDesincorp,
    getDesincorpById,
    createDesincorp,
    updateDesincorp,
    deleteDesincorp,
};