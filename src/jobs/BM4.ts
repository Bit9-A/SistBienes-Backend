import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { reportModel } from '../modules/report/report.model';
import { UserModel } from '../modules/users/user.model';
import { DeptModel } from '../modules/dept/dept.model';

// Cargar y incrustar imágenes una sola vez
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoImpresionPath = path.resolve(__dirname, "../images/LogoImpresion.jpg");
const escudoPath = path.resolve(__dirname, "../images/Escudo.jpg");

const logoImpresionBytes = fs.readFileSync(logoImpresionPath);
const escudoBytes = fs.readFileSync(escudoPath);


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
  // Establecer la página en formato horizontal (ancho, alto)
  const page = pdfDoc.addPage([842, 595]); // A4 Landscape: 842 x 595
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 50;
  let y = page.getHeight() - margin;
  const x = margin;
  const fontSize = 10;
  const lineHeight = 14;

  // Coordenadas ajustadas para formato horizontal
  const centerX = page.getWidth() / 2;
  const startX = margin;
  const endX = page.getWidth() - margin;

  // Incrustar imágenes
  const logoImpresion = await pdfDoc.embedJpg(logoImpresionBytes);
  const escudo = await pdfDoc.embedJpg(escudoBytes);

  // Dibujar imágenes en la página
  page.drawImage(logoImpresion, {
    x: startX,
    y: page.getHeight() - margin - 50, // Ajustar posición Y
    width: 100,
    height: 50,
  });

  page.drawImage(escudo, {
    x: endX - 100, // Ajustar posición X para la derecha
    y: page.getHeight() - margin - 50, // Ajustar posición Y
    width: 50,
    height: 50,
  });

  // Obtener datos del reporte
  const reportData = await reportModel.getMonthlyReportData(mes, año, deptId, responsableId);
  const responsableData = await UserModel.getUserDetailsById(responsableId);
  const departmentData = await DeptModel.getDepartmentById(deptId);

  if (!reportData || !responsableData || !departmentData) {
    console.error("[BM4] Datos incompletos para generar el reporte.");
    return [];
  }

  const {
    total_incorporations, // Ahora es el monto total de incorporaciones
    total_disincorporations_concept_60, // Ahora es el monto total de desincorporaciones por concepto 60
    total_disincorporations_except_concept_60, // Ahora es el monto total de desincorporaciones excepto concepto 60
    previous_existence, // Ahora es el monto de la existencia anterior
    final_existence // Ahora es el monto de la existencia final
  } = reportData;

  const { nombre: responsableNombre, apellido: responsableApellido, rol_nombre: responsableRol, dept_nombre: responsableDeptNombre } = responsableData;
  const { nombre: deptNombre } = departmentData;

  // Título
  page.drawText('FORMATO BM-4', { x: endX - 100, y: y, font, size: 10, color: rgb(0, 0, 0) });
  y -= lineHeight * 2;

  page.drawText('RESUMEN DE LA CUENTA DE BIENES MUEBLES', { x: centerX - 150, y: y, font: boldFont, size: 12, color: rgb(0, 0, 0) });
  y -= lineHeight;
  page.drawText(`DE LA UNIDAD DE: ${deptNombre.toUpperCase()}`, { x: centerX - 150, y: y, font: boldFont, size: 12, color: rgb(0, 0, 0) });
  y -= lineHeight * 4; // Aumentar el espacio para bajar el contenido

  // Información general
  page.drawText(`Entidad Propietaria: Alcaldía Bolivariana del Municipio Cárdenas RIF G-20005180-9`, { x: startX, y: y, font, size: fontSize });
  y -= lineHeight * 2;

  page.drawText(`1. Estado: Táchira`, { x: startX, y: y, font, size: fontSize });
  page.drawText(`2. Municipio: Cárdenas`, { x: startX + 200, y: y, font, size: fontSize });
  page.drawText(`Parroquia: Tariba`, { x: startX + 400, y: y, font, size: fontSize });
  y -= lineHeight * 2;

  page.drawText(`3. Correspondiente al mes de ${mes} del año ${año} (Cifras Convencionales)`, { x: startX, y: y, font, size: fontSize });
  y -= lineHeight * 2;

  // Detalles del reporte
  page.drawText(`4. Existencia anterior: Bs. ${(previous_existence || 0)}`, { x: startX, y: y, font, size: fontSize });
  y -= lineHeight;
  page.drawText(`5. Incorporaciones en el mes de la cuenta: Bs. ${(total_incorporations || 0)}`, { x: startX, y: y, font, size: fontSize });
  y -= lineHeight;
  page.drawText(`6. Desincorporaciones en el mes de la cuenta por`, { x: startX, y: y, font, size: fontSize });
  y -= lineHeight;
  page.drawText(`   Todos los conceptos, con excepción del 60, "Faltantes de Bienes por Investigar": Bs. ${(total_disincorporations_except_concept_60 || 0)}`, { x: startX, y: y, font, size: fontSize });
  y -= lineHeight;
  page.drawText(`7. Desincorporaciones en el mes de la cuenta por`, { x: startX, y: y, font, size: fontSize });
  y -= lineHeight;
  page.drawText(`   El concepto 60, "Faltantes de Bienes por Investigar": Bs. ${(total_disincorporations_concept_60 || 0)}`, { x: startX, y: y, font, size: fontSize });
  y -= lineHeight;
  page.drawText(`8. Existencia Final: Bs. ${(final_existence || 0)}`, { x: startX, y: y, font, size: fontSize });
  y -= lineHeight * 3;

  // Firmas
  const signatureX1 = startX + 50;
  const signatureX2 = startX + 280;
  const signatureX3 = startX + 510;

  page.drawText(`9. Elaborado Por:`, { x: signatureX1, y: y, font, size: fontSize });
  page.drawText(`10. Aprobado Por:`, { x: signatureX2, y: y, font, size: fontSize });
  page.drawText(`11. Firma del Responsable Patrimonial`, { x: signatureX3, y: y, font, size: fontSize });
  y -= lineHeight * 3; // Espacio para la firma

  page.drawText(`_________________________`, { x: signatureX1, y: y, font, size: fontSize });
  page.drawText(`_________________________`, { x: signatureX2, y: y, font, size: fontSize });
  page.drawText(`_________________________`, { x: signatureX3, y: y, font, size: fontSize });
  y -= lineHeight; 

  page.drawText(`${responsableNombre} ${responsableApellido}`, { x: signatureX1, y: y, font, size: fontSize });
  page.drawText(`Cargo: ${responsableRol}`, { x: signatureX1, y: y - lineHeight, font, size: fontSize });
  page.drawText(`Dependencia: ${responsableDeptNombre}`, { x: signatureX1, y: y - lineHeight * 2, font, size: fontSize });

  // Información al pie de página
  page.drawText('Original: Oficina de Control de Bienes del Municipio', { x: endX - 250, y: margin + 20, font, size: 8 });
  page.drawText('Elaborado por la Oficina de Bienes Municipio Cárdenas', { x: endX - 250, y: margin + 10, font, size: 8 });

  const pdfBytes = await pdfDoc.save();
  const fileName = `BM4_ReporteMensual_${deptNombre}_${mes}-${año}.pdf`;
  const filePath = path.join(outputPath, fileName);

  fs.writeFileSync(filePath, pdfBytes);
  console.log(`[BM4] Archivo PDF generado: ${filePath}`);
  return [filePath];
}
