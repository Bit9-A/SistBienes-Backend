import { reportModel } from "./report.model";

// Este controlador maneja las operaciones relacionadas con los reportes mensuales

// Este controlador maneja la obtención del reporte mensual por departamento
const getMonthlyReport = async (req: any, res: any) => {
  try {
    const { month, year, deptId } = req.body;

    if (
      month === undefined ||
      year === undefined ||
      deptId === undefined
    ) {
      return res.status(400).json({
        ok: false,
        message: "El mes, año y departamento son obligatorios en el body",
      });
    }
    // Validación de que los parámetros son números
    const monthNumber = Number(month);
    const yearNumber = Number(year);
    const deptIdNumber = Number(deptId);

    if (
      isNaN(monthNumber) ||
      isNaN(yearNumber) ||
      isNaN(deptIdNumber)
    ) {
      return res.status(400).json({
        ok: false,
        message: "El mes, año y departamento deben ser números válidos",
      });
    }
    // Validación de rango de mes y año
    const totalIncorporations = await reportModel.getIncorporationsByMonthAndDepartment(monthNumber, yearNumber, deptIdNumber);
    const totalDisincorporationsConcept60 = await reportModel.getDisincorporationsConcept60ByMonthAndDepartment(monthNumber, yearNumber, deptIdNumber);
    const totalDisincorporationsExceptConcept60 = await reportModel.getDisincorporationsExceptConcept60ByMonthAndDepartment(monthNumber, yearNumber, deptIdNumber);
    const previousExistence = await reportModel.getActiveAssetsPreviousMonthByDepartment(monthNumber, yearNumber, deptIdNumber);
    const finalAssets = await reportModel.getFinalAssetsCountByMonth(monthNumber, yearNumber, deptIdNumber);

    res.status(200).json({
      ok: true,
      totalIncorporations,
      totalDisincorporationsConcept60,
      totalDisincorporationsExceptConcept60,
      previousExistence,
      finalAssets,
    });

  } catch (error) {
    console.error("Error al obtener el reporte mensual:", error);
    res.status(500).json({
      ok: false,
      message: "Error del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

export const reportController = {
  getMonthlyReport,
};
