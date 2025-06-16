import { missingGoodsModel } from "./missing-goods.model";

const getAllMissingGoods = async (req: any, res: any) => {
    try {
        const missingGoodsList = await missingGoodsModel.getAllMissingGoods();
        res.status(200).json({ ok: true, missingGoods: missingGoodsList });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

const getMissingGoodsById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const missingGoodsItem = await missingGoodsModel.getMissingGoodsById(Number(id));
        if (!missingGoodsItem) {
            return res.status(404).json({ ok: false, message: "Missing goods not found" });
        }
        res.status(200).json({ ok: true, missingGoods: missingGoodsItem });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

const createMissingGoods = async (req: any, res: any) => {
    try {
        const {
            unidad,
            existencias,
            diferencia_cantidad,
            diferencia_valor,
            funcionario_id,
            jefe_id,
            observaciones,
            fecha,
            bien_id
        } = req.body;

        if (
            unidad === undefined ||
            existencias === undefined ||
            diferencia_cantidad === undefined ||
            diferencia_valor === undefined ||
            funcionario_id === undefined ||
            jefe_id === undefined ||
            !fecha ||
            bien_id === undefined
        ) {
            return res.status(400).json({ ok: false, message: "Todos los campos son requeridos" });
        }

        const newMissingGoods = await missingGoodsModel.createMissingGoods({
            unidad,
            existencias,
            diferencia_cantidad,
            diferencia_valor,
            funcionario_id,
            jefe_id,
            observaciones,
            fecha,
            bien_id
        });
        res.status(201).json({ ok: true, missingGoods: newMissingGoods });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

const updateMissingGoods = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const {
            unidad,
            existencias,
            diferencia_cantidad,
            diferencia_valor,
            funcionario_id,
            jefe_id,
            observaciones,
            fecha,
            bien_id
        } = req.body;

        if (
            unidad === undefined ||
            existencias === undefined ||
            diferencia_cantidad === undefined ||
            diferencia_valor === undefined ||
            funcionario_id === undefined ||
            jefe_id === undefined ||
            !fecha ||
            bien_id === undefined
        ) {
            return res.status(400).json({ ok: false, message: "Todos los campos son requeridos" });
        }

        const result = await missingGoodsModel.updateMissingGoods(
            Number(id),
            unidad,
            existencias,
            diferencia_cantidad,
            diferencia_valor,
            funcionario_id,
            jefe_id,
            observaciones,
            fecha,
            bien_id
        );
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Missing goods not found" });
        }
        res.status(200).json({ ok: true, message: "Missing goods updated successfully" });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

const deleteMissingGoods = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const result = await missingGoodsModel.deleteMissingGoods(Number(id));
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Missing goods not found" });
        }
        res.status(200).json({ ok: true, message: "Missing goods deleted successfully" });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

export const missingGoodsController = {
    getAllMissingGoods,
    getMissingGoodsById,
    createMissingGoods,
    updateMissingGoods,
    deleteMissingGoods,
};