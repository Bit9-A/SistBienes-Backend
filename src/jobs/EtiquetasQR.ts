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
    // 1. Dibujar borde rojo
    page.drawRectangle({
      x: x,
      y: y,
      width: labelWidth,
      height: labelHeight,
      borderColor: rgb(0.8, 0, 0),
      borderWidth: 2,
    });

    // Definir zona de cabecera
    const headerHeight = 40;
    const headerYBase = y + labelHeight - headerHeight;

    // 2. Logo Izquierdo (Marta Gallo)
    if (embeddedLogoImpresion) {
      page.drawImage(embeddedLogoImpresion, {
        x: x + 8, // Margen izquierdo ligero
        y: y + labelHeight - 35, // Centrado verticalmente en el header
        width: 70, // Reducido un poco para dar espacio al texto central
        height: 26,
      });
    }

    // 3. Logo Derecho (Escudo)
    if (embeddedImpresion1) {
      page.drawImage(embeddedImpresion1, {
        x: x + labelWidth - 40, // Alineado a la derecha
        y: y + labelHeight - 36,
        width: 32,
        height: 30,
      });
    }

    // 4. Texto Central: "Alcaldía Bolivariana del Municipio Cárdenas"
    // Calculamos el centro exacto de la etiqueta para alinear el texto
    const centerX = x + labelWidth / 2;

    // Usamos Helvetica Bold para que destaque y tamaño pequeño (7 o 8) para que quepa
    const titleSize = 7;
    const titleColor = rgb(0, 0, 0);

    // Línea 1
    const textLine1 = "Alcaldía Bolivariana";
    const widthLine1 = boldFont.widthOfTextAtSize(textLine1, titleSize);
    page.drawText(textLine1, {
      x: centerX - (widthLine1 / 2), // Centrado matemático
      y: y + labelHeight - 18,       // Parte superior del header
      font: boldFont,
      size: titleSize,
      color: titleColor,
    });

    // Línea 2
    const textLine2 = "del Municipio Cárdenas";
    const widthLine2 = boldFont.widthOfTextAtSize(textLine2, titleSize);
    page.drawText(textLine2, {
      x: centerX - (widthLine2 / 2), // Centrado matemático
      y: y + labelHeight - 28,       // Debajo de la línea 1
      font: boldFont,
      size: titleSize,
      color: titleColor,
    });

    // 5. Línea Divisoria (Separador Header/Cuerpo)
    page.drawLine({
      start: { x: x + 5, y: headerYBase },
      end: { x: x + labelWidth - 5, y: headerYBase },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85), // Gris muy suave
    });

    // 6. QR Code (Alineado a la derecha inferior)
    const qrSize = 62; // Tamaño ajustado
    const qrX = x + labelWidth - qrSize - 8;
    const qrY = y + 8; // Margen inferior

    page.drawImage(embeddedQrImage, {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
    });

    // 7. Información del Bien (Columna Izquierda)

    // ID Principal
    page.drawText(`N° ${asset.numero_identificacion || "S/N"}`, {
      x: x + 12,
      y: headerYBase - 20, // Debajo de la línea divisoria
      font: boldFont,
      size: 18, // Tamaño prominente pero equilibrado
      color: rgb(0, 0, 0),
    });

    // Función para cortar texto largo (truncar)
    const truncateText = (text: string, maxLength: number) => {
      if (!text) return "";
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    // Descripción del Activo (Ej: "Silla de oficina...")
    const descripcion = asset.nombre_descripcion || "Sin descripción";
    const descripcionCorta = truncateText(descripcion, 30); // Max 30 caracteres aprox

    page.drawText(descripcionCorta, {
      x: x + 12,
      y: headerYBase - 35,
      font: font,
      size: 9,
      color: rgb(0.2, 0.2, 0.2),
    });

    // Ubicación / Departamento (Texto pequeño al pie)
    const ubicacion = asset.dept_nombre || "";
    const ubicacionCorta = truncateText(ubicacion, 35);

    if (ubicacionCorta) {
      page.drawText(`Ubicación: ${ubicacionCorta}`, {
        x: x + 12,
        y: y + 12, // A la altura de la base del QR
        font: font,
        size: 7,
        color: rgb(0.5, 0.5, 0.5), // Gris para info secundaria
      });
    }

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
