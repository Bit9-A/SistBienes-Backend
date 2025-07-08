import { statusGoodsModel } from "./goods-status.model";
// Este controlador maneja las operaciones CRUD para los estados de los bienes

// Este controlador maneja la obtención de todos los estados de los bienes
const getAllStatusGoods = async (req: any, res: any) => {
    try {
        const statusGoodsList = await statusGoodsModel.getAllStatusGoods();
        res.status(200).json({ ok: true, statusGoods: statusGoodsList });
    } catch (error) {
        console.error("Error al obtener los estados de los bienes:", error);
        res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Este controlador maneja la obtención de un estado de los bienes por su ID
const getStatusGoodsById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const statusGoodsItem = await statusGoodsModel.getStatusGoodsById(Number(id));
        if (!statusGoodsItem) {
            return res.status(404).json({ ok: false, message: "Estado no encontrado" });
        }
        res.status(200).json({ ok: true, statusGoods: statusGoodsItem });
    } catch (error) {
        console.error("Error al obtener el estado de los bienes por ID:", error);
        res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Este controlador maneja la creación de un nuevo estado de los bienes
const createStatusGoods = async (req: any, res: any) => {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
        }
        const newStatusGoods = await statusGoodsModel.createStatusGoods(nombre);
        res.status(201).json({ ok: true, statusGoods: newStatusGoods });
    } catch (error) {
        console.error("Error al crear el estado de los bienes:", error);
        res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Este controlador maneja la actualización de un estado de los bienes existente
const updateStatusGoods = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ ok: false, message: "El nombre es obligatorio" });
        }
        const result = await statusGoodsModel.updateStatusGoods(Number(id), nombre);
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Estado no encontrado" });
        }
        res.status(200).json({ ok: true, message: "Estado actualizado con éxito" });
    } catch (error) {
        console.error("Error al actualizar el estado de los bienes:", error);
        res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Este controlador maneja la eliminación de un estado de los bienes por su ID
const deleteStatusGoods = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const result = await statusGoodsModel.deleteStatusGoods(Number(id));
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ ok: false, message: "Estado no encontrado" });
        }
        res.status(200).json({ ok: true, message: "Estado eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar el estado de los bienes:", error);
        res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

// Exportamos los controladores para que puedan ser utilizados en las rutas
export const statusGoodsController = {
    getAllStatusGoods,
    getStatusGoodsById,
    createStatusGoods,
    updateStatusGoods,
    deleteStatusGoods,
};
