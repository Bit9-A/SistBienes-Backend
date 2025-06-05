import { Request, Response } from "express";
import { IncorpModel } from "./incorp.model";


//Obtener una lista de incorporaciones
const getAllIncorps = async (req: any, res: any) => {
  try {
    const incorps = await IncorpModel.getAllIncorps();
    return res.status(200).json({
      ok: true,
      incorps,
    });
  } catch (error) {
    console.error("Get All Incorps error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
const createIncorp = async (req: any, res: any) => {
  try {
    const { bien_id, fecha, valor, cantidad, concepto_id, dept_id } = req.body;
        console.log("Datos recibidos en backend:", req.body);


    if (!bien_id || !fecha || !valor || !cantidad || !concepto_id) {
      return res.status(400).json({ ok: false, message: "Please fill in all required fields." });
    }

    const newIncorp = await IncorpModel.createIncorp({
      bien_id,
      fecha,
      valor,
      cantidad,
      concepto_id,
      dept_id,
    });

    return res.status(201).json({
      ok: true,
      incorp: newIncorp,
    });
  } catch (error) {
    console.error("Create Incorp error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getIncorpById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const incorp = await IncorpModel.findIncorpById(Number(id));
    if (!incorp) {
      return res.status(404).json({ ok: false, message: "Incorp not found" });
    }

    return res.status(200).json({ ok: true, incorp });
  } catch (error) {
    console.error("Get Incorp error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const updateIncorp = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const incorp = await IncorpModel.findIncorpById(Number(id));
    if (!incorp) {
      return res.status(404).json({ ok: false, message: "Incorp not found" });
    }

    await IncorpModel.updateIncorp(Number(id), updates);

    return res.status(200).json({ ok: true,  incorp, message: "Incorp updated successfully" });
  } catch (error) {
    console.error("Update Incorp error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteIncorp = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const incorp = await IncorpModel.findIncorpById(Number(id));
    if (!incorp) {
      return res.status(404).json({ ok: false, message: "Incorp not found" });
    }

    await IncorpModel.deleteIncorp(Number(id));

    return res.status(200).json({ ok: true, message: "Incorp deleted successfully" });
  } catch (error) {
    console.error("Delete Incorp error:", error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const IncorpController = {
  createIncorp,
  getIncorpById,
  updateIncorp,
  deleteIncorp,
  getAllIncorps,
};