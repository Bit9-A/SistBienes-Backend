import { pool } from "../../database/index";

interface IncorporationCount {
  total_incorporations: number;
}

interface DisincorporationCount {
  total_disincorporations: number;
}

interface PreviousExistence {
  existencia_anterior: number;
}

interface FinalAssetsCount {
  existencia_final: number;
}

const getIncorporationsByMonthAndDepartment = async (month: number, year: number, deptId: number): Promise<IncorporationCount> => {
  const query = `
    SELECT COUNT(*) AS total_incorporations
    FROM IncorporacionActivo
    WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? AND dept_id = ? AND isActive = 1
  `;
  const [rows] = await pool.execute(query, [month, year, deptId]) as [IncorporationCount[], any];
  return rows[0];
};

const getDisincorporationsConcept60ByMonthAndDepartment = async (month: number, year: number, deptId: number): Promise<DisincorporationCount> => {
  const query = `
    SELECT COUNT(*) AS total_disincorporations
    FROM DesincorporacionActivo
    WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? AND dept_id = ?
      AND concepto_id = (SELECT id FROM ConceptoDesincorporacion WHERE codigo = '60')
  `;
  const [rows] = await pool.execute(query, [month, year, deptId]) as [DisincorporationCount[], any];
  return rows[0];
};

const getDisincorporationsExceptConcept60ByMonthAndDepartment = async (month: number, year: number, deptId: number): Promise<DisincorporationCount> => {
  const query = `
    SELECT COUNT(*) AS total_disincorporations
    FROM DesincorporacionActivo
    WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? AND dept_id = ?
      AND concepto_id != (SELECT id FROM ConceptoDesincorporacion WHERE codigo = '60')
  `;
  const [rows] = await pool.execute(query, [month, year, deptId]) as [DisincorporationCount[], any];
  return rows[0];
};

const getActiveAssetsPreviousMonthByDepartment = async (month: number, year: number, deptId: number): Promise<PreviousExistence> => {
  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;

  const query = `
    SELECT COUNT(*) AS existencia_anterior
    FROM Activos
    WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? AND dept_id = ? AND isActive = 1
  `;
  const [rows] = await pool.execute(query, [previousMonth, previousYear, deptId]) as [PreviousExistence[], any];
  return rows[0];
};

const getFinalAssetsCountByMonth = async (month: number, year: number, deptId: number): Promise<FinalAssetsCount> => {
  // Obtener todos los valores necesarios
  const [existenciaAnterior, incorporaciones, desincorporaciones60, desincorporacionesNo60] = await Promise.all([
    getActiveAssetsPreviousMonthByDepartment(month, year, deptId),
    getIncorporationsByMonthAndDepartment(month, year, deptId),
    getDisincorporationsConcept60ByMonthAndDepartment(month, year, deptId),
    getDisincorporationsExceptConcept60ByMonthAndDepartment(month, year, deptId)
  ]);

  // Calcular existencia final
  const existenciaFinal = existenciaAnterior.existencia_anterior + 
                       incorporaciones.total_incorporations - 
                       (desincorporaciones60.total_disincorporations + desincorporacionesNo60.total_disincorporations);

  return { existencia_final: existenciaFinal };
};

export const reportModel = {
  getIncorporationsByMonthAndDepartment,
  getDisincorporationsConcept60ByMonthAndDepartment,
  getDisincorporationsExceptConcept60ByMonthAndDepartment,
  getActiveAssetsPreviousMonthByDepartment,
  getFinalAssetsCountByMonth
};
