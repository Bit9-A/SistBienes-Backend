import { transfersModel } from "./transfers.model";

const getAllTransfers = async (req: any, res: any) => {
    try {
        const transfers = await transfersModel.getAllTransfers();
        res.status(200).json({ ok: true, transfers });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, error: errorMessage });
    }
};

const getTransferById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const transfer = await transfersModel.getTransferById(Number(id));
        if (!transfer) {
            return res.status(404).json({ ok: false, message: "Traslado no encontrado" });
        }
        res.status(200).json({ ok: true, transfer });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, error: errorMessage });
    }
};

const createTransfer = async (req: any, res: any) => {
    try {
        const { fecha, cantidad, origen_id, destino_id, bienes } = req.body;
        if (!fecha || !cantidad || !origen_id || !destino_id || !Array.isArray(bienes) || bienes.length === 0) {
            return res.status(400).json({ ok: false, message: "Datos incompletos o bienes no seleccionados" });
        }
        const trasladoId = await transfersModel.createTransfer({ fecha, cantidad, origen_id, destino_id, bienes });
        res.status(201).json({ ok: true, message: "Traslado creado", trasladoId });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, error: errorMessage });
    }
};

const updateTransfer = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const result = await transfersModel.updateTransfer(Number(id), req.body);
        res.status(200).json({ ok: true, message: "Traslado actualizado", result });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, error: errorMessage });
    }
};

const deleteTransfer = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const result = await transfersModel.deleteTransfer(Number(id));
        res.status(200).json({ ok: true, message: "Traslado eliminado", result });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ ok: false, error: errorMessage });
    }
};

export const transfersController = {
    getAllTransfers,
    getTransferById,
    createTransfer,
    updateTransfer,
    deleteTransfer,
};