import { transfersModel} from "../tranfer/transfers.model";

const getAllTranfers = async (req: any, res:any) => {
    try{
        const tranfers = await transfersModel.getAllTranfers();
        if(tranfers.length === 0){
            return res.status(404).json({
                ok: false,
                message: "No hay traslados registrados"
            });
        }
    }
    catch (error) {
        console.error("Error al obtener los traslados:", error);
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
            error: error instanceof Error ? error.message : "Error desconocido"
        });
    }
};

const getAllGoodTranfers = async (req: any, res:any) => {
    try{
        const tranfers = await transfersModel.getAllGoodTranfers();
        if(tranfers.length === 0){
            return res.status(404).json({
                ok: false,
                message: "No hay traslados registrados"
            });
        }
    }
    catch (error) {
        console.error("Error al obtener los traslados:", error);
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
            error: error instanceof Error ? error.message : "Error desconocido"
        });
    }
};

const getGoodTranfersId = async (req: any, res:any) => {
    try {
        const {id} = req.params;
        const tranfer = await transfersModel.getGoodsTranferById(Number(id));
        if(!tranfer){
            return res.status(404).json({
                ok:false,
                message:'No existe el traslado',
            })
        }
        return res.status(200).json({
            ok:true,
            tranfer
        })
    } catch (error) {
        return res.status(500).json({
            ok:false,
            message:'Error en el servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });

    }
};

const getTranferById = async (req: any, res:any) => {
    try {
        const {id} = req.params;
        const tranfer = await transfersModel.getTranfersById(Number(id));
        if(!tranfer){
            return res.status(404).json({
                ok:false,
                message:'No existe el traslado',
            })
        }
        return res.status(200).json({ok:true, tranfer});
    } catch (error) {
        return res.status(500).json({
            ok:false,
            message:'Error en el servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

const createTranfer = async (res:any, req:any) => {
    try {
        const {fecha, cantidad, origen_id, destino_id} = req.body;
        if(!fecha || !cantidad || !origen_id || !destino_id){
            return res.status(400).json({
                ok:false,
                message:'Faltan datos obligatorios'
            });
        }
        const tranfer = await transfersModel.createTranfer({fecha, cantidad, origen_id, destino_id});
        return res.status(201).json({
            ok:true,
            message:'Traslado creado correctamente',
            tranfer
        });
    } catch (error) {
        return res.status(500).json({
            ok:false,
            message:'Error en el servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

const createGoodTranfer = async (res:any, req:any) => {
    try {
        const {traslado_id, mueble_id} = req.body;
        if(!traslado_id || !mueble_id){
            return res.status(400).json({
                ok:false,
                message:'Faltan datos obligatorios'
            });
        }
        const tranfer = await transfersModel.createGoodTranfer({traslado_id, mueble_id});
        return res.status(201).json({
            ok:true,
            message:'Traslado creado correctamente',
            tranfer
        });
    } catch (error) {
        return res.status(500).json({
            ok:false,
            message:'Error en el servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

const updateTranfer = async (req:any, res:any) => {
    try {
        const {id} = req.params;
        const tranfer = await transfersModel.updatedTransfer(Number(id), req.body);
        return res.status(200).json({
            ok:true,
            message:'Traslado actualizado correctamente',
            tranfer
        });
    } catch (error) {
        return res.status(500).json({
            ok:false,
            message:'Error en el servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

const updatedGoodTransfer = async (req:any, res:any) => {
    try {
        const {id} = req.params;
        const tranfer = await transfersModel.updatedGoodTransfer(Number(id), req.body);
        return res.status(200).json({
            ok:true,
            message:'Traslado actualizado correctamente',
            tranfer
        });
    } catch (error) {
        return res.status(500).json({
            ok:false,
            message:'Error en el servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
}

const deleteTranfer = async (req:any, res:any) => {
    try {
        const {id} = req.params;
        const tranfer = await transfersModel.deleteTranfer(Number(id));
        return res.status(200).json({
            ok:true,
            message:'Traslado eliminado correctamente',
            tranfer
        });
    } catch (error) {
        return res.status(500).json({
            ok:false,
            message:'Error en el servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

const deleteGoodTransfer = async (req:any, res:any) => {
    try {
        const {id} = req.params;
        const tranfer = await transfersModel.deleteGoodsTranfer(Number(id));
        return res.status(200).json({
            ok:true,
            message:'Traslado eliminado correctamente',
            tranfer
        });
    } catch (error) {
        return res.status(500).json({
            ok:false,
            message:'Error en el servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const transfersController = {
    getAllTranfers,
    getAllGoodTranfers,
    getGoodTranfersId,
    getTranferById,
    createTranfer,
    createGoodTranfer,
    updateTranfer,
    updatedGoodTransfer,
    deleteTranfer,
    deleteGoodTransfer
}