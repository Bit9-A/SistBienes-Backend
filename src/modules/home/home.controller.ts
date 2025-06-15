import { Request, Response } from 'express';
import { HomeModel } from './home.model';
import { get } from 'http';

const getCounts = async (req: Request, res: Response) => {
    try {
        const counts = await HomeModel.getSubgruposConConteo();
        res.status(200).json({ ok: true, counts });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

const getCountsEstadobien = async (req: Request, res: Response) => {
    try {
        const countsEstadobien = await HomeModel.getGoodStatusConConteo();
        res.status(200).json({ ok: true, countsEstadobien });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};
const getTotalMuebles = async (req: Request, res: Response) => {
    try {
        const total = await HomeModel.contarMuebles();
        res.status(200).json({ ok: true, total });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};
const getMueblesUltimaSemana = async (req: Request, res: Response) => {
    try {
        const ultimaSemana = await HomeModel.contarMueblesUltimaSemana();
        res.status(200).json({ ok: true, ultimaSemana });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};
const obtenerValorTotalBienesPorDepartamento = async (req: Request, res: Response) => {
    try {
        const valortotal = await HomeModel.obtenerValorTotalBienesPorDepartamento();
        res.status(200).json({ ok: true, valortotal });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};

const contarMueblesPorMes = async (req: Request, res: Response) => {
    try {
        const mublesPorMes = await HomeModel.contarMueblesPorMes();
        res.status(200).json({ ok: true, mublesPorMes });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
};
export const mueblesController = {
    getCounts,
    getCountsEstadobien,
    getTotalMuebles,
    getMueblesUltimaSemana,
    obtenerValorTotalBienesPorDepartamento,
    contarMueblesPorMes
};
