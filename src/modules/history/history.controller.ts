import { goodHistoryModel } from "./history.models.js";

export const getGoodHistory = async (req: any, res: any) => {
    try {
        const { goodId } = req.params;
        if (!goodId) {
            return res.status(400).json({ ok: false, message: "Goods ID is required" });
        }
        const history = await goodHistoryModel.getGoodHistoryById(Number(goodId));
        if (history.length === 0) {
            return res.status(404).json({ ok: false, message: "No history found for this Good ID" });
        }
        const hasTransfersOrDecompositions = history.some(item => item.fecha_traslado || item.fecha_desincorporacion);
        if (!hasTransfersOrDecompositions) {
            return res.status(200).json({ ok: true, message: "No transfers or decommissioning found for this Good ID", history });
        }
        res.status(200).json({ ok: true, history });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
}