import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib";
import QRCode from "qrcode";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { FurnitureModel } from "../modules/furniture/furniture.model";
import { ComponentsModel } from "../modules/components/components.model";
import { globalConfig } from "../variables/globals";

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
  console.log(
    `[EtiquetasQR] Retrieved ${assets.length} assets for department ${deptId}.`
  );

  if (assets.length === 0) {
    console.log(
      "[EtiquetasQR] No assets found for the specified department. No labels generated."
    );
    return [];
  }

  // Obtener componentes para cada activo
  for (const asset of assets) {
    const components = await ComponentsModel.getComponentsByBienId(asset.id);
    asset.components_description = components
      .map((c: any) => c.nombre)
      .join(", ");
    if (asset.components_description) {
      asset.components_description = `Componentes: ${asset.components_description}`;
    }
  }

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Cargar y incrustar imágenes una sola vez desde la configuración global
  let embeddedLogoImpresion;
  let embeddedImpresion1; // Para url_impresion_1 (escudo)
  // let embeddedImpresion2; // Para url_impresion_2 (redes/info adicional) - Eliminado según solicitud del usuario

  // Función auxiliar para incrustar imágenes de forma segura
  const embedImage = async (
    imageUrl: string | null | undefined,
    defaultImagePath: string,
    imageName: string
  ) => {
    if (imageUrl) {
      const imagePath = path.join(process.cwd(), imageUrl);
      try {
        const imageBytes = fs.readFileSync(imagePath);
        const imageExt = path.extname(imageUrl).toLowerCase();

        if (imageExt === ".jpg" || imageExt === ".jpeg") {
          return await pdfDoc.embedJpg(imageBytes);
        } else if (imageExt === ".png") {
          return await pdfDoc.embedPng(imageBytes);
        } else {
          console.warn(
            `[EtiquetasQR] Formato de imagen no soportado para ${imageName} (${imageExt}). Usando imagen por defecto.`
          );
          const defaultBytes = fs.readFileSync(defaultImagePath);
          return await pdfDoc.embedJpg(defaultBytes);
        }
      } catch (error) {
        console.error(
          `[EtiquetasQR] Error al cargar la imagen ${imageName} desde ${imageUrl}:`,
          error
        );
        const defaultBytes = fs.readFileSync(defaultImagePath);
        return await pdfDoc.embedJpg(defaultBytes);
      }
    } else {
      console.warn(
        `[EtiquetasQR] URL para ${imageName} no disponible en la configuración global. Usando imagen por defecto.`
      );
      const defaultBytes = fs.readFileSync(defaultImagePath);
      return await pdfDoc.embedJpg(defaultBytes);
    }
  };

  // Cargar Logo (url_logo)
  embeddedLogoImpresion = await embedImage(
    globalConfig.url_logo,
    path.resolve(__dirname, "../images/LogoImpresion.jpg"),
    "Logo"
  );

  // Cargar Impresión 1 (url_impresion_1, asumiendo que es el escudo)
  embeddedImpresion1 = await embedImage(
    globalConfig.url_impresion_1,
    path.resolve(__dirname, "../images/Escudo.jpg"), // Fallback para escudo
    "Impresion 1 (Escudo)"
  );

  // Cargar Impresión 2 (url_impresion_2, no se usa en el PDF, pero se mantiene la carga si es necesario en otro lugar)
  // embeddedImpresion2 = await embedImage(
  //   globalConfig.url_impresion_2,
  //   path.resolve(__dirname, "../images/Redes.png"), // Fallback para redes
  //   "Impresion 2 (Redes/Info Adicional)"
  // );

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
Departamento: ${asset.dept_nombre || ""}
N° Identificación: ${asset.numero_identificacion || ""}
Descripción: ${asset.nombre_descripcion || ""}
Marca: ${asset.marca_nombre || ""}
Modelo: ${asset.modelo_nombre || ""}
Estado: ${asset.estado_nombre || ""}
Componentes: ${asset.components_description || ""}
`.trim();

    // Generar QR como PNG Buffer
    const qrPngBuffer = await QRCode.toBuffer(qrData, {
      type: "png",
      errorCorrectionLevel: "H",
      scale: 4,
    });
    const embeddedQrImage = await pdfDoc.embedPng(qrPngBuffer);

    // Dibujar elementos en la etiqueta
    // Logo
    if (embeddedLogoImpresion) {
      page.drawImage(embeddedLogoImpresion, {
        x: x + 5,
        y: y + labelHeight - 40, // Ajuste para posicionar en la parte superior izquierda
        width: 80,
        height: 30,
      });
    }

    // Impresión 1 (Escudo)
    if (embeddedImpresion1) {
      page.drawImage(embeddedImpresion1, {
        x: x + labelWidth - 45, // Ajuste para posicionar en la parte superior derecha
        y: y + labelHeight - 38,
        width: 40,
        height: 36,
      });
    }

    // Dibujar borde rojo de la etiqueta
    page.drawRectangle({
      x: x,
      y: y,
      width: labelWidth,
      height: labelHeight,
      borderColor: rgb(0.8, 0, 0), // Borde rojo
      borderWidth: 2,
    });

    // Número de Identificación
    page.drawText(`N° ${asset.numero_identificacion || ""}`, {
      x: x + 10,
      y: y + labelHeight - 90, // Debajo del logo
      font: boldFont,
      size: 26, // Fuente más grande
      color: rgb(0, 0, 0),
    });

    // QR Code
    page.drawImage(embeddedQrImage, {
      x: x + labelWidth - 90, // Derecha de la etiqueta
      y: y + labelHeight - 113, // Debajo del escudo
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
