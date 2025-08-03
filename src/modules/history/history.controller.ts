import { goodHistoryModel } from "./history.models.js";

// Este controlador maneja las operaciones relacionadas con el historial de bienes
export const getGoodHistory = async (req: any, res: any) => {
    try {
        const { goodId } = req.params;
        if (!goodId) {
            return res.status(400).json({ ok: false, message: "El ID del bien es obligatorio" });
        }
        const history = await goodHistoryModel.getGoodHistoryById(Number(goodId));
        if (history.length === 0) {
            return res.status(404).json({ ok: false, message: "No se encontró historial para este ID de bien" });
        }
        const hasRelevantHistory = history.some(item => 
            item.tipo_evento === 'Traslado' || 
            item.tipo_evento === 'Desincorporacion' || 
            item.tipo_evento === 'Activo Faltante'
        );
        if (!hasRelevantHistory) {
            return res.status(200).json({ ok: true, message: "No se encontraron traslados, desincorporaciones o activos faltantes para este ID de bien", history });
        }
        res.status(200).json({ ok: true, history });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
    }
}
