import {Request, Response} from "express";
import {ConcepIncorpModel} from "./concept-inc.model";

const getAllConceptInc = async (req: any, res: any) => {
    try {
        const conceptInc = await ConcepIncorpModel.getAllConceptInc();
        return res.status(200).json({ok: true, conceptInc});
    } catch (error) {
        console.error("Error al obtener el concepto de incorporacion:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
}; 

const getConceptIncById = async (req: any, res: any) => {
    try {
        const {id} = req.params;
        const conceptInc = await ConcepIncorpModel.getConceptIncById(Number(id));
        if (!conceptInc) {
            return res.status(404).json({ok: false, message: "No se encontró el concepto de incorporacion"});
        }
        return res.status(200).json({ok: true, conceptInc});
    } catch (error) {
        console.error("Error al obtener el concepto de incorporacion por ID:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

const createConceptInc = async (req: any, res: any) => {
    try {
        const {nombre, codigo} = req.body;
        const newConceptInc = await ConcepIncorpModel.createConceptInc({nombre, codigo});
        return res.status(201).json({
            ok: true,
            message: "Concepto de incorporacion creado con éxito",
            newConceptInc,
        });
    } catch (error) {
        console.error("Error al crear concepto de incorporacion:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

const updateConceptInc = async (req: any, res: any) => {
    try {
        const {id} = req.params;
        const updatedConceptInc = await ConcepIncorpModel.updateConceptInc(Number(id), req.body);
        return res.status(200).json({
            ok: true,
            message: "Concepto de incorporacion editado con éxito",
            updatedConceptInc,
        });
    } catch (error) {
        console.error("Error al editar concepto de incorporacion:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

const deleteConceptInc = async (req: any, res: any) => {
    try {
        const {id} = req.params;
        const deletedConceptInc = await ConcepIncorpModel.deleteConceptInc(Number(id));
        return res.status(200).json({
            ok: true,
            message: "Concepto de incorporacion eliminado con éxito",
            deletedConceptInc,
        });
    } catch (error) {
        console.error("Error al eliminar concepto de incorporacion:", error);
        return res.status(500).json({
            ok: false,
            message: "Error del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
};

export const ConceptIncController = {
    getAllConceptInc,
    getConceptIncById,
    createConceptInc,
    updateConceptInc,
    deleteConceptInc,
};



