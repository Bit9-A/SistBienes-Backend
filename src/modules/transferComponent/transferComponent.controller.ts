import { TransferComponentModel } from "./transferComponent.model";

const getAllTransferComponents = async (req: any, res: any) => {
  try {
    const transfers = await TransferComponentModel.getAllTransferComponents();
    res.status(200).json({ ok: true, transfers });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const getTransferComponentById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const transfer = await TransferComponentModel.getTransferComponentById(Number(id));
    if (!transfer) {
      return res.status(404).json({ ok: false, message: "TransferComponent not found" });
    }
    res.status(200).json({ ok: true, transfer });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const createTransferComponent = async (req: any, res: any) => {
  try {
    const { componente_id, bien_origen_id, bien_destino_id, fecha } = req.body;
    if (!componente_id || !bien_origen_id || !bien_destino_id || !fecha) {
      return res.status(400).json({ ok: false, message: "Todos los campos son requeridos" });
    }
    const newTransfer = await TransferComponentModel.createTransferComponent({
      componente_id,
      bien_origen_id,
      bien_destino_id,
      fecha,
    });
    res.status(201).json({ ok: true, transfer: newTransfer });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const updateTransferComponent = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await TransferComponentModel.updateTransferComponent(Number(id), data);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "TransferComponent not found" });
    }
    res.status(200).json({ ok: true, message: "TransferComponent updated successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

const deleteTransferComponent = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await TransferComponentModel.deleteTransferComponent(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "TransferComponent not found" });
    }
    res.status(200).json({ ok: true, message: "TransferComponent deleted successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
  }
};

export const TransferComponentController = {
  getAllTransferComponents,
  getTransferComponentById,
  createTransferComponent,
  updateTransferComponent,
  deleteTransferComponent,
};