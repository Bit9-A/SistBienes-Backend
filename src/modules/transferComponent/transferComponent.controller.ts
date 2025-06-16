import { TransferComponentModel } from "./transferComponent.model";

const getAllTransferComponents = async (req: any, res: any) => {
  try {
    const transfers = await TransferComponentModel.getAllTransferComponents();
    if (!transfers || transfers.length === 0) {
      return res.status(404).json({ ok: false, message: "No se encontraron componentes de traslado" });
    }
    res.status(200).json({ ok: true, transfers });
  } catch (error) {
    console.error("Error al obtener los componentes de traslado:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

const getTransferComponentById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const transfer = await TransferComponentModel.getTransferComponentById(Number(id));
    if (!transfer) {
      return res.status(404).json({ ok: false, message: "Componente de traslado no encontrado" });
    }
    res.status(200).json({ ok: true, transfer });
  } catch (error) {
    console.error("Error al obtener el componente de traslado por ID:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
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
    console.error("Error al crear el componente de traslado:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

const updateTransferComponent = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await TransferComponentModel.updateTransferComponent(Number(id), data);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Componente de traslado no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Componente de traslado actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el componente de traslado:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

const deleteTransferComponent = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await TransferComponentModel.deleteTransferComponent(Number(id));
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Componente de traslado no encontrado" });
    }
    res.status(200).json({ ok: true, message: "Componente de traslado eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el componente de traslado:", error);
    res.status(500).json({ ok: false, message: "Error del servidor", error: error instanceof Error ? error.message : "Error desconocido" });
  }
};

export const TransferComponentController = {
  getAllTransferComponents,
  getTransferComponentById,
  createTransferComponent,
  updateTransferComponent,
  deleteTransferComponent,
};
