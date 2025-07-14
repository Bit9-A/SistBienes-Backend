import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { reportModel } from '../modules/report/report.model';
import { UserModel } from '../modules/users/user.model';
import { DeptModel } from '../modules/dept/dept.model';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Genera un reporte BM4 en formato PDF.
 * @param deptId ID del departamento.
 * @param mes Mes del reporte.
 * @param año Año del reporte.
 * @param responsableId ID del usuario responsable.
 * @param outputPath Ruta donde se guardará el archivo PDF generado.
 */
export async function generateBM4Pdf(
  deptId: number,
  mes: number,
  año: number,
  responsableId: number,
  outputPath: string
): Promise<string[]> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 50;
  let y = page.getHeight() - margin;
  const x = margin;
  const fontSize = 10;
  const lineHeight = 14;

  // Obtener datos del reporte
  const reportData = await reportModel.getMonthlyReportData(mes, año, deptId); // Asumiendo que se creará esta función
  const responsableData = await UserModel.getUserDetailsById(responsableId);
  const departmentData = await DeptModel.getDepartmentById(deptId);

  if (!reportData || !responsableData || !departmentData) {
    console.error("[BM4] Datos incompletos para generar el reporte.");
    return [];
  }

  const {
    total_incorporations,
    total_disincorporations_concept_60,
    total_disincorporations_except_concept_60,
    previous_existence,
    final_existence
  } = reportData;

  const { nombre: responsableNombre, apellido: responsableApellido, rol_nombre: responsableRol, dept_nombre: responsableDeptNombre } = responsableData;
  const { nombre: deptNombre } = departmentData;

  // Título
  page.drawText('FORMATO BM-4', { x: page.getWidth() - margin - 100, y: y, font, size: 10, color: rgb(0, 0, 0) });
  y -= lineHeight * 2;

  page.drawText('RESUMEN DE LA CUENTA DE BIENES MUEBLES', { x: x, y: y, font: boldFont, size: 12, color: rgb(0, 0, 0) });
  y -= lineHeight;
  page.drawText(`DE LA UNIDAD DE: ${deptNombre.toUpperCase()}`, { x: x, y: y, font: boldFont, size: 12, color: rgb(0, 0, 0) });
  y -= lineHeight * 2;

  // Información general
  page.drawText(`Entidad Propietaria: Alcaldía Bolivariana del Municipio Cárdenas RIF G-20005180-9`, { x: x, y: y, font, size: fontSize });
  y -= lineHeight * 2;

  page.drawText(`1. Estado: Táchira`, { x: x, y: y, font, size: fontSize });
  page.drawText(`2. Municipio: Cárdenas`, { x: x + 200, y: y, font, size: fontSize });
  page.drawText(`Parroquia: Tariba`, { x: x + 400, y: y, font, size: fontSize });
  y -= lineHeight * 2;

  page.drawText(`3. Correspondiente al mes de ${mes} del año ${año} (Cifras Convencionales)`, { x: x, y: y, font, size: fontSize });
  y -= lineHeight * 2;

  // Detalles del reporte
  page.drawText(`4. Existencia anterior: ${previous_existence}`, { x: x, y: y, font, size: fontSize });
  y -= lineHeight;
  page.drawText(`5. Incorporaciones en el mes de la cuenta: ${total_incorporations}`, { x: x, y: y, font, size: fontSize });
  y -= lineHeight;
  page.drawText(`6. Desincorporaciones en el mes de la cuenta por`, { x: x, y: y, font, size: fontSize });
  y -= lineHeight;
  page.drawText(`   Todos los conceptos, con excepción del 60, "Faltantes de Bienes por Investigar": ${total_disincorporations_except_concept_60}`, { x: x, y: y, font, size: fontSize });
  y -= lineHeight;
  page.drawText(`7. Desincorporaciones en el mes de la cuenta por`, { x: x, y: y, font, size: fontSize });
  y -= lineHeight;
  page.drawText(`   El concepto 60, "Faltantes de Bienes por Investigar": ${total_disincorporations_concept_60}`, { x: x, y: y, font, size: fontSize });
  y -= lineHeight;
  page.drawText(`8. Existencia Final: ${final_existence}`, { x: x, y: y, font, size: fontSize });
  y -= lineHeight * 3;

  // Firmas
  page.drawText(`9. Elaborado Por:`, { x: x, y: y, font, size: fontSize });
  page.drawText(`10. Aprobado Por:`, { x: x + 170, y: y, font, size: fontSize });
  page.drawText(`11. Firma del Responsable Patrimonial`, { x: x + 305, y: y, font, size: fontSize });
  y -= lineHeight * 3; // Espacio para la firma

  page.drawText(`_________________________`, { x: x, y: y, font, size: fontSize });
  page.drawText(`_________________________`, { x: x + 160, y: y, font, size: fontSize });
  page.drawText(`_________________________`, { x: x + 335, y: y, font, size: fontSize });
  y -= lineHeight; 

  page.drawText(`${responsableNombre} ${responsableApellido}`, { x: x, y: y, font, size: fontSize });
  page.drawText(`Cargo: ${responsableRol}`, { x: x, y: y - lineHeight, font, size: fontSize });
  page.drawText(`Dependencia: ${responsableDeptNombre}`, { x: x, y: y - lineHeight * 2, font, size: fontSize });

  // Información al pie de página
  page.drawText('Original: Oficina de Control de Bienes del Municipio', { x: page.getWidth() - margin - 250, y: margin + 20, font, size: 8 });
  page.drawText('Elaborado por la Oficina de Bienes Municipio Cárdenas', { x: page.getWidth() - margin - 250, y: margin + 10, font, size: 8 });

  const pdfBytes = await pdfDoc.save();
  const fileName = `BM4_ReporteMensual_${deptNombre}_${mes}-${año}.pdf`;
  const filePath = path.join(outputPath, fileName);

  fs.writeFileSync(filePath, pdfBytes);
  console.log(`[BM4] Archivo PDF generado: ${filePath}`);
  return [filePath];
}
