import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url'; // Importar fileURLToPath
import { generateQRLabelsByDepartment } from '../jobs/EtiquetasQR';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Define a temporary directory for generated PDF files
const tempDir = path.join(__dirname, '../../temp_pdf_exports');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

router.post('/qr', async (req: any, res: any) => {
  const { deptId } = req.body;

  if (!deptId) {
    return res.status(400).json({ message: 'deptId is required.' });
  }

  try {
    // Generate the PDF files
    const generatedFilePaths = await generateQRLabelsByDepartment(
      deptId,
      tempDir // Pass the temporary directory
    );

    if (generatedFilePaths.length === 0) {
      return res.status(500).json({ message: 'No PDF files were generated.' });
    }

    // For simplicity, send the first generated file.
    const filePathToSend = generatedFilePaths[0];
    const fileName = path.basename(filePathToSend);

    res.download(filePathToSend, fileName, (err: Error | null) => {
      if (err) {
        console.error('Error sending file:', err);
        // If there's an error sending, still try to clean up
      }
      // Clean up the generated files after sending
      generatedFilePaths.forEach(file => {
        fs.unlink(file, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting temporary file ${file}:`, unlinkErr);
          } else {
            console.log(`Temporary file deleted: ${file}`);
          }
        });
      });
    });

  } catch (error: any) {
    console.error('Error generating PDF file:', error);
    res.status(500).json({ message: 'Error generating PDF file', error: error.message });
  }
});

export default router;
