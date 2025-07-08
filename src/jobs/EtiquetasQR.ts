import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';
import QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { FurnitureModel } from "../modules/furniture/furniture.model";
import { ComponentsModel } from "../modules/components/components.model";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Genera etiquetas con QR para los bienes de un departamento.
 * @param deptId ID del departamento.
 * @param outputPath Ruta donde se guardará el archivo PDF generado.
 */
export async function generateQRLabelsByDepartment(
  deptId: number,
  outputPath: string
): Promise<string[]> {
  const generatedFilePaths: string[] = [];
  const assets = await FurnitureModel.getFurnitureByDepartment(deptId);
  console.log(`[EtiquetasQR] Retrieved ${assets.length} assets for department ${deptId}.`);

  if (assets.length === 0) {
    console.log("[EtiquetasQR] No assets found for the specified department. No labels generated.");
    return [];
  }

  // Obtener componentes para cada activo
  for (const asset of assets) {
    const components = await ComponentsModel.getComponentsByBienId(asset.id);
    asset.components_description = components.map((c: any) => c.nombre).join(', ');
    if (asset.components_description) {
      asset.components_description = `Componentes: ${asset.components_description}`;
    }
  }

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Cargar y incrustar imágenes una sola vez
  const logoImpresionPath = path.resolve(__dirname, "../../images/LogoImpresion.jpg");
  const escudoPath = path.resolve(__dirname, "../../images/Escudo.jpg");

  const logoImpresionBytes = fs.readFileSync(logoImpresionPath);
  const escudoBytes = fs.readFileSync(escudoPath);

  const embeddedLogoImpresion = await pdfDoc.embedJpg(logoImpresionBytes);
  const embeddedEscudo = await pdfDoc.embedJpg(escudoBytes);

  // Dimensiones de la página (Carta horizontal)
  const pageWidth = PageSizes.Letter[1]; // Ancho de Letter en landscape
  const pageHeight = PageSizes.Letter[0]; // Alto de Letter en landscape

  // Dimensiones de cada etiqueta (estimado de B2 a F8)
  const labelWidth = 280; // puntos
  const labelHeight = 120; // puntos

  // Márgenes y espaciado
  const marginX = 30; // Margen horizontal
  const marginY = 30; // Margen vertical
  const spacingX = (pageWidth - 2 * marginX - 2 * labelWidth) / 1; // Espacio entre 2 etiquetas en horizontal
  const spacingY = (pageHeight - 2 * marginY - 3 * labelHeight) / 2; // Espacio entre 3 etiquetas en vertical

  const labelsPerRow = 2;
  const labelsPerColumn = 3;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentLabelIndex = 0;

  for (const asset of assets) {
    if (currentLabelIndex >= labelsPerRow * labelsPerColumn) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      currentLabelIndex = 0;
    }

    const col = currentLabelIndex % labelsPerRow;
    const row = Math.floor(currentLabelIndex / labelsPerRow);

    const x = marginX + col * (labelWidth + spacingX);
    const y = pageHeight - marginY - (row + 1) * labelHeight - row * spacingY; // Y es desde arriba

    // Datos para el QR (formato de texto simple)
    const qrData = `
Departamento: ${asset.dept_nombre || ''}
N° Identificación: ${asset.numero_identificacion || ''}
Descripción: ${asset.nombre_descripcion || ''}
Marca: ${asset.marca_nombre || ''}
Modelo: ${asset.modelo_nombre || ''}
Estado: ${asset.estado_nombre || ''}
Componentes: ${asset.components_description || ''}
`.trim();

    // Generar QR como PNG Buffer
    const qrPngBuffer = await QRCode.toBuffer(qrData, { type: 'png', errorCorrectionLevel: 'H', scale: 4 });
    const embeddedQrImage = await pdfDoc.embedPng(qrPngBuffer);

    // Dibujar elementos en la etiqueta
    // Logo
    page.drawImage(embeddedLogoImpresion, {
      x: x + 5,
      y: y + labelHeight - 40, // Ajuste para posicionar en la parte superior izquierda
      width: 80,
      height: 30,
    });

    // Escudo
    page.drawImage(embeddedEscudo, {
      x: x + labelWidth - 45, // Ajuste para posicionar en la parte superior derecha
      y: y + labelHeight - 40,
      width: 40,
      height: 38,
    });

    // Número de Identificación
    // Dibujar bordes de la etiqueta
    page.drawRectangle({
      x: x,
      y: y,
      width: labelWidth,
      height: labelHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    // Número de Identificación
    page.drawText(`N° ${asset.numero_identificacion || ''}`, {
      x: x + 10,
      y: y + labelHeight - 90, // Debajo del logo
      font: boldFont,
      size: 26, // Fuente más grande
      color: rgb(0, 0, 0),
    });

    // QR Code
    page.drawImage(embeddedQrImage, {
      x: x + labelWidth - 90, // Derecha de la etiqueta
      y: y + labelHeight - 110, // Debajo del escudo
      width: 70,
      height: 70,
    });

    currentLabelIndex++;
  }

  const pdfBytes = await pdfDoc.save();
  const fileName = `EtiquetasQR_${deptId}.pdf`;
  const filePath = path.join(outputPath, fileName);
  fs.writeFileSync(filePath, pdfBytes);
  console.log(`[EtiquetasQR] PDF de etiquetas generado: ${filePath}`);
  generatedFilePaths.push(filePath);

  return generatedFilePaths;
}
