// pdf_converter.js
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Convert LaTeX code to PDF
 * @param {string} latexCode - The LaTeX source code
 * @param {string} outputDir - Directory to save the output files (optional)
 * @returns {Promise<Object>} - Result object with success status and file path or error
 */
export async function convertLatexToPdf(latexCode, outputDir = './temp') {
    const timestamp = Date.now();
    const filename = `resume_${timestamp}`;
    const texFilePath = path.join(outputDir, `${filename}.tex`);
    const pdfFilePath = path.join(outputDir, `${filename}.pdf`);

    try {
        // Ensure output directory exists
        await fs.mkdir(outputDir, { recursive: true });

        // Write LaTeX code to .tex file
        await fs.writeFile(texFilePath, latexCode, 'utf8');

        // Compile LaTeX to PDF using pdflatex
        // Run twice to ensure proper cross-references and bibliography
        await execAsync(`pdflatex -output-directory=${outputDir} -interaction=nonstopmode "${texFilePath}"`);
        await execAsync(`pdflatex -output-directory=${outputDir} -interaction=nonstopmode "${texFilePath}"`);

        // Check if PDF was created successfully
        try {
            await fs.access(pdfFilePath);
        } catch (error) {
            throw new Error('PDF compilation failed - output file not found');
        }

        // Clean up auxiliary files
        const auxFiles = [
            `${filename}.aux`,
            `${filename}.log`,
            `${filename}.out`,
            `${filename}.fls`,
            `${filename}.fdb_latexmk`
        ];

        for (const auxFile of auxFiles) {
            try {
                await fs.unlink(path.join(outputDir, auxFile));
            } catch (error) {
                // Ignore errors when cleaning up auxiliary files
            }
        }

        // Remove the .tex file
        try {
            await fs.unlink(texFilePath);
        } catch (error) {
            // Ignore error if file doesn't exist
        }

        return {
            success: true,
            message: 'PDF generated successfully',
            filePath: pdfFilePath,
            filename: `${filename}.pdf`
        };

    } catch (error) {
        console.error('LaTeX to PDF conversion error:', error);

        // Clean up files on error
        const filesToClean = [texFilePath, pdfFilePath];
        for (const file of filesToClean) {
            try {
                await fs.unlink(file);
            } catch (cleanupError) {
                // Ignore cleanup errors
            }
        }

        // Check if pdflatex is available
        if (error.message.includes('pdflatex: command not found')) {
            return {
                success: false,
                error: 'pdflatex is not installed. Please install a LaTeX distribution (e.g., TeX Live, MiKTeX)'
            };
        }

        return {
            success: false,
            error: `PDF conversion failed: ${error.message}`
        };
    }
}

/**
 * Get PDF file as buffer for sending as response
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<Buffer>} - PDF file buffer
 */
export async function getPdfBuffer(filePath) {
    try {
        const buffer = await fs.readFile(filePath);
        return buffer;
    } catch (error) {
        throw new Error(`Failed to read PDF file: ${error.message}`);
    }
}

/**
 * Clean up temporary PDF file
 * @param {string} filePath - Path to the file to delete
 */
export async function cleanupFile(filePath) {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.error('File cleanup error:', error);
    }
}