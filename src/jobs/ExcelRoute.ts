import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { exportBM1ByDepartment } from './ExcelBM1'; // Adjust path if necessary

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Define a temporary directory for generated Excel files
const tempDir = path.join(__dirname, '../../temp_excel_exports');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

router.post('/bm1', async (req: any, res: any) => {
  const { dept_id, dept_nombre } = req.body;

  if (!dept_id || !dept_nombre) {
    return res.status(400).json({ message: 'deptId and departamentoNombre are required.' });
  }

  try {
    // Generate the Excel files
    const generatedFilePaths = await exportBM1ByDepartment(
      dept_id, // Use the correct parameter name
      dept_nombre,
      tempDir // Pass the temporary directory
    );

    if (generatedFilePaths.length === 0) {
      return res.status(500).json({ message: 'No Excel files were generated.' });
    }

    // For simplicity, send the first generated file.
    // If multiple files are expected, consider zipping them or handling multiple downloads on the frontend.
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

  } catch (error: unknown) {
    console.error('Error generating Excel file:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error generating Excel file', error: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred during Excel file generation.' });
    }
  }
});

export default router;
