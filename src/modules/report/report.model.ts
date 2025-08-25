import { pool } from "../../database/index";
// Este modelo maneja las operaciones relacionadas con los reportes mensuales
interface ReportAmount {
  total_amount: number;
}

interface PreviousExistenceAmount {
  existencia_anterior_amount: number;
}

interface FinalExistenceAmount {
  existencia_final_amount: number;
}

interface MonthlyReportBM4 {
  id?: number;
  dept_id: number;
  mes: number;
  año: number;
  existencia_anterior_monto: number;
  incorporaciones_monto: number;
  desincorporaciones_excepto_60_monto: number;
  desincorporaciones_60_monto: number;
  existencia_final_monto: number;
  fecha_generacion?: Date;
  responsable_id: number;
}

// Este modelo maneja las operaciones relacionadas con los reportes mensuales

// Función para obtener un reporte mensual de la base de datos
const getMonthlyReportFromDB = async (month: number, year: number, deptId: number): Promise<MonthlyReportBM4 | undefined> => {
  const query = `
    SELECT * FROM ReporteMensualBM4
    WHERE mes = ? AND año = ? AND dept_id = ?
  `;
  const [rows] = await pool.execute(query, [month, year, deptId]) as [MonthlyReportBM4[], any];
  return rows[0];
};

// Función para guardar o actualizar un reporte mensual en la base de datos
const saveMonthlyReportToDB = async (report: MonthlyReportBM4): Promise<void> => {
  const { dept_id, mes, año, existencia_anterior_monto, incorporaciones_monto, desincorporaciones_excepto_60_monto, desincorporaciones_60_monto, existencia_final_monto, responsable_id } = report;
  const query = `
    INSERT INTO ReporteMensualBM4 (dept_id, mes, año, existencia_anterior_monto, incorporaciones_monto, desincorporaciones_excepto_60_monto, desincorporaciones_60_monto, existencia_final_monto, responsable_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      existencia_anterior_monto = VALUES(existencia_anterior_monto),
      incorporaciones_monto = VALUES(incorporaciones_monto),
      desincorporaciones_excepto_60_monto = VALUES(desincorporaciones_excepto_60_monto),
      desincorporaciones_60_monto = VALUES(desincorporaciones_60_monto),
      existencia_final_monto = VALUES(existencia_final_monto),
      fecha_generacion = CURRENT_TIMESTAMP,
      responsable_id = VALUES(responsable_id)
  `;
  await pool.execute(query, [dept_id, mes, año, existencia_anterior_monto, incorporaciones_monto, desincorporaciones_excepto_60_monto, desincorporaciones_60_monto, existencia_final_monto, responsable_id]);
};

// Este modelo maneja la obtención de incorporaciones por mes y departamento
const getIncorporationsByMonthAndDepartment = async (month: number, year: number, deptId: number): Promise<ReportAmount> => {
  const query = `
    SELECT SUM(A.valor_unitario) AS total_amount
    FROM IncorporacionActivo IA
    JOIN Activos A ON IA.bien_id = A.id
    WHERE MONTH(IA.fecha) = ? AND YEAR(IA.fecha) = ? AND IA.dept_id = ? AND IA.isActive = 1
  `;
  const [rows] = await pool.execute(query, [month, year, deptId]) as [ReportAmount[], any];
  return { total_amount: rows[0]?.total_amount || 0 };
};

// Este modelo maneja la obtención de desincorporaciones por concepto 60 por mes y departamento
const getDisincorporationsConcept60ByMonthAndDepartment = async (month: number, year: number, deptId: number): Promise<ReportAmount> => {
  const query = `
    SELECT SUM(A.valor_unitario) AS total_amount
    FROM DesincorporacionActivo DA
    JOIN Activos A ON DA.bien_id = A.id
    WHERE MONTH(DA.fecha) = ? AND YEAR(DA.fecha) = ? AND DA.dept_id = ?
      AND DA.concepto_id = (SELECT id FROM ConceptoDesincorporacion WHERE codigo = '60')
  `;
  const [rows] = await pool.execute(query, [month, year, deptId]) as [ReportAmount[], any];
  return { total_amount: rows[0]?.total_amount || 0 };
};

// Este modelo maneja la obtención de desincorporaciones por concepto diferente a 60 por mes y departamento
const getDisincorporationsExceptConcept60ByMonthAndDepartment = async (month: number, year: number, deptId: number): Promise<ReportAmount> => {
  const query = `
    SELECT SUM(A.valor_unitario) AS total_amount
    FROM DesincorporacionActivo DA
    JOIN Activos A ON DA.bien_id = A.id
    WHERE MONTH(DA.fecha) = ? AND YEAR(DA.fecha) = ? AND DA.dept_id = ?
      AND DA.concepto_id != (SELECT id FROM ConceptoDesincorporacion WHERE codigo = '60')
  `;
  const [rows] = await pool.execute(query, [month, year, deptId]) as [ReportAmount[], any];
  return { total_amount: rows[0]?.total_amount || 0 };
};

// Exportamos el modelo para que pueda ser utilizado en los controladores
export const reportModel = {
  getIncorporationsByMonthAndDepartment,
  getDisincorporationsConcept60ByMonthAndDepartment,
  getDisincorporationsExceptConcept60ByMonthAndDepartment,
  getMonthlyReportFromDB, // Exponer la función
  // Nueva función para obtener todos los datos del reporte mensual
  getMonthlyReportData: async (month: number, year: number, deptId: number, responsableId: number) => {
    // Siempre calcular los montos más recientes
    const [
      totalIncorporations,
      totalDisincorporationsConcept60,
      totalDisincorporationsExceptConcept60,
    ] = await Promise.all([
      reportModel.getIncorporationsByMonthAndDepartment(month, year, deptId),
      reportModel.getDisincorporationsConcept60ByMonthAndDepartment(month, year, deptId),
      reportModel.getDisincorporationsExceptConcept60ByMonthAndDepartment(month, year, deptId),
    ]);

    // Calcular la existencia anterior (existencia final del mes anterior)
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? year - 1 : year;
    const previousMonthReport = await getMonthlyReportFromDB(previousMonth, previousYear, deptId);
    const previousExistenceAmount = parseFloat(previousMonthReport?.existencia_final_monto as any) || 0;

    // Calcular existencia final
    const finalExistenceAmount = parseFloat((previousExistenceAmount || 0) as any) +
      parseFloat((totalIncorporations.total_amount || 0) as any) -
      parseFloat((totalDisincorporationsConcept60.total_amount || 0) as any) -
      parseFloat((totalDisincorporationsExceptConcept60.total_amount || 0) as any);

    // Guardar o actualizar el reporte calculado en la BD
    const reportToSave: MonthlyReportBM4 = {
      dept_id: deptId,
      mes: month,
      año: year,
      existencia_anterior_monto: previousExistenceAmount,
      incorporaciones_monto: totalIncorporations.total_amount || 0,
      desincorporaciones_excepto_60_monto: totalDisincorporationsExceptConcept60.total_amount || 0,
      desincorporaciones_60_monto: totalDisincorporationsConcept60.total_amount || 0,
      existencia_final_monto: finalExistenceAmount,
      responsable_id: responsableId,
    };
    await saveMonthlyReportToDB(reportToSave);

    return {
      total_incorporations: reportToSave.incorporaciones_monto,
      total_disincorporations_concept_60: reportToSave.desincorporaciones_60_monto,
      total_disincorporations_except_concept_60: reportToSave.desincorporaciones_excepto_60_monto,
      previous_existence: reportToSave.existencia_anterior_monto,
      final_existence: reportToSave.existencia_final_monto,
    };
  }
};
