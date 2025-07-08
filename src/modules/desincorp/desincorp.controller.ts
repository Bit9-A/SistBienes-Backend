import { desincorpModel } from "./desincorp.model";

// Este controlador maneja las operaciones CRUD para las desincorporaciones
const getAllDesincorp = async (req: any, res: any) => {
    try {
        const desincorps = await desincorpModel.getAllDesincorp();
        return res.status(200).json({ ok: true, desincorps });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Este controlador maneja la obtención de una desincorporación por su ID
const getDesincorpById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const desincorp = await desincorpModel.getDesincorpById(Number(id));
        if (!desincorp) {
            return res.status(404).json({ ok: false, message: "Desincorporacion no encontrado" });
        }
        return res.status(200).json({ ok: true, desincorp });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Este controlador maneja la creación de una nueva desincorporación
const createDesincorp = async (req: any, res: any) => {
    try {
        const { bien_id, fecha, valor, cantidad, concepto_id, dept_id, observaciones } = req.body;
        if (!bien_id || !fecha || !valor || !cantidad || !concepto_id) {
            return res.status(400).json({ ok: false, message: "Por favor, complete todos los campos requeridos." });
        }
        const newDesincorp = await desincorpModel.createDesincorp({
            bien_id,
            fecha,
            valor,
            cantidad,
            concepto_id,
            dept_id,
            observaciones,
        });
        return res.status(201).json({ ok: true, desincorp: newDesincorp });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Este controlador maneja la actualización de una desincorporación existente
const updateDesincorp = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const desincorp = await desincorpModel.getDesincorpById(Number(id));
        if (!desincorp) {
            return res.status(404).json({ ok: false, message: "Desincorporacion no encontrado" });
        }
        await desincorpModel.updateDesincorp(Number(id), updates);
        return res.status(200).json({ ok: true, desincorp, message: "Desincorporacion actualizado con éxito" });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Este controlador maneja la eliminación de una desincorporación por su ID
const deleteDesincorp = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const desincorp = await desincorpModel.getDesincorpById(Number(id));
        if (!desincorp) {
            return res.status(404).json({ ok: false, message: "Desincorporacion no encontrado" });
        }
        await desincorpModel.deleteDesincorp(Number(id));
        return res.status(200).json({ ok: true, message: "Desincorporacion eliminado con éxito" });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Exportamos los controladores para que puedan ser utilizados en las rutas
export const desincorpController = {
    getAllDesincorp,
    getDesincorpById,
    createDesincorp,
    updateDesincorp,
    deleteDesincorp,
};
