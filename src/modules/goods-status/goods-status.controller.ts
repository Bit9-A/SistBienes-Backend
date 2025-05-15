import { statusGoodsModel } from "./goods-status.model";

const getAllStatusGoods = async (req: any, res: any) => {
    try {
        const statusGoodsList = await statusGoodsModel.getAllStatusGoods();
        res.status(200).json({ ok: true, statusGoods: statusGoodsList });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

const getStatusGoodsById = async (req: any, res:any) => {
    try {
        const {id} = req.params;
        const statusGoodsItem = await statusGoodsModel.getStatusGoodsById(Number(id));
        if (!statusGoodsItem) {
            return res.status(404).json({ ok: false, message: "Status not found" });
        }
        res.status(200).json({ ok: true, statusGoods: statusGoodsItem });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
        
    }
};

const createStatusGoods = async (req: any, res: any) => {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ ok: false, message: "Name is required" });
        }
        const newStatusGoods = await statusGoodsModel.createStatusGoods(nombre);
        res.status(201).json({ ok: true, statusGoods: newStatusGoods });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

const updateStatusGoods = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ ok: false, message: "Name is required" });
        }
        const result = await statusGoodsModel.uptadeStatusGoods(Number(id), nombre);
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Status not found" });
        }
        res.status(200).json({ ok: true, message: "Status updated successfully" });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

const deleteStatusGoods = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const result = await statusGoodsModel.deleteStatusGoods(Number(id));
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Status not found" });
        }
        res.status(200).json({ ok: true, message: "Status deleted successfully" });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};
export const statusGoodsController = {
    getAllStatusGoods,
    getStatusGoodsById,
    createStatusGoods,
    updateStatusGoods,
    deleteStatusGoods,
}