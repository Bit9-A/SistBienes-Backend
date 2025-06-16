import { missingGoodsModel } from "./missing-goods.model";

const getAllMissingGoods = async (req: any, res: any) => {
    try {
        const missingGoodsList = await missingGoodsModel.getAllMissingGoods();
        if (!missingGoodsList || missingGoodsList.length === 0) {
            return res.status(404).json({ ok: false, message: "No se encontraron bienes faltantes" });
        }
        res.status(200).json({ ok: true, missingGoods: missingGoodsList });
    } catch (error) {
        console.error("Error al obtener los bienes faltantes:", error);
        res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

const getMissingGoodsById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const missingGoodsItem = await missingGoodsModel.getMissingGoodsById(Number(id));
        if (!missingGoodsItem) {
            return res.status(404).json({ ok: false, message: "Bienes faltantes no encontrados" });
        }
        res.status(200).json({ ok: true, missingGoods: missingGoodsItem });
    } catch (error) {
        console.error("Error al obtener los bienes faltantes por ID:", error);
        res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
    }
};

const createMissingGoods = async (req: any, res: any) => {
    try {
        const { unidad, existencias, diferenciaCantidad, diferenciaValor, funcionarioId, jefeId, observaciones, fecha, bienId } = req.body;
        if (!unidad || existencias === undefined || diferenciaCantidad === undefined || diferenciaValor === undefined || !funcionarioId || !jefeId || !bienId) {
            return res.status(400).json({ ok: false, message: "Todos los campos son obligatorios" });
        }
        const newMissingGoods = await missingGoodsModel.createMissingGoods(unidad, existencias, diferenciaCantidad, diferenciaValor, funcionarioId, jefeId, observaciones, fecha, bienId);
        res.status(201).json({ ok: true, missingGoods: newMissingGoods });
    } catch (error) {
        console.error("Error al crear bienes faltantes:", error);
        res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
    }
};

const updateMissingGoods = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { unidad, existencias, diferenciaCantidad, diferenciaValor, funcionarioId, jefeId, observaciones, fecha, bienId } = req.body;
        if (!unidad || existencias === undefined || diferenciaCantidad === undefined || diferenciaValor === undefined || !funcionarioId || !jefeId || !bienId) {
            return res.status(400).json({ ok: false, message: "Todos los campos son obligatorios" });
        }
        const result = await missingGoodsModel.updateMissingGoods(Number(id), unidad, existencias, diferenciaCantidad, diferenciaValor, funcionarioId, jefeId, observaciones, fecha, bienId);
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Bienes faltantes no encontrados" });
        }
        res.status(200).json({ ok: true, message: "Bienes faltantes actualizados con éxito" });
    } catch (error) {
        console.error("Error al actualizar bienes faltantes:", error);
        res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
    }
};

const deleteMissingGoods = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const result = await missingGoodsModel.deleteMissingGoods(Number(id));
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Bienes faltantes no encontrados" });
        }
        res.status(200).json({ ok: true, message: "Bienes faltantes eliminados con éxito" });
    } catch (error) {
        console.error("Error al eliminar bienes faltantes:", error);
        res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
    }
};

export const missingGoodsController = {
    getAllMissingGoods,
    getMissingGoodsById,
    createMissingGoods,
    updateMissingGoods,
    deleteMissingGoods,
};

