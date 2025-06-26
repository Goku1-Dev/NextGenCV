// word_converter.js
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Convert LaTeX code to Word document via PDF intermediate
 * @param {string} latexCode - The LaTeX source code
 * @param {string} outputDir - Directory to save the output files (optional)
 * @returns {Promise<Object>} - Result object with success status and file path or error
 */
export async function convertLatexToWord(latexCode, outputDir = './temp') {
    const timestamp = Date.now();
    const filename = `resume_${timestamp}`;
    const texFilePath = path.join(outputDir, `${filename}.tex`);
    const pdfFilePath = path.join(outputDir, `${filename}.pdf`);
    const docxFilePath = path.join(outputDir, `${filename}.docx`);

    try {
        // Ensure output directory exists
        await fs.mkdir(outputDir, { recursive: true });

        // Write LaTeX code to .tex file
        await fs.writeFile(texFilePath, latexCode, 'utf8');

        // Method 1: Try pandoc direct conversion (preferred)
        try {
            await execAsync(`pandoc "${texFilePath}" -o "${docxFilePath}" --from=latex --to=docx`);
            
            // Check if DOCX was created successfully
            await fs.access(docxFilePath);

            // Clean up source file
            await fs.unlink(texFilePath);

            return {
                success: true,
                message: 'Word document generated successfully',
                filePath: docxFilePath,
                filename: `${filename}.docx`
            };

        } catch (pandocError) {
            console.log('Pandoc direct conversion failed, trying PDF intermediate method...');

            // Method 2: LaTeX -> PDF -> Word (fallback)
            // First convert to PDF
            await execAsync(`pdflatex -output-directory=${outputDir} -interaction=nonstopmode "${texFilePath}"`);
            await execAsync(`pdflatex -output-directory=${outputDir} -interaction=nonstopmode "${texFilePath}"`);

            // Check if PDF was created
            await fs.access(pdfFilePath);

            // Convert PDF to Word using pandoc or libreoffice
            try {
                // Try with pandoc first
                await execAsync(`pandoc "${pdfFilePath}" -o "${docxFilePath}"`);
            } catch (pandocPdfError) {
                // Fallback to LibreOffice
                await execAsync(`libreoffice --headless --convert-to docx --outdir "${outputDir}" "${pdfFilePath}"`);
            }

            // Check if DOCX was created
            await fs.access(docxFilePath);
        }

        // Clean up auxiliary files
        const filesToClean = [
            texFilePath,
            pdfFilePath,
            path.join(outputDir, `${filename}.aux`),
            path.join(outputDir, `${filename}.log`),
            path.join(outputDir, `${filename}.out`),
            path.join(outputDir, `${filename}.fls`),
            path.join(outputDir, `${filename}.fdb_latexmk`)
        ];

        for (const file of filesToClean) {
            try {
                await fs.unlink(file);
            } catch (error) {
                // Ignore cleanup errors
            }
        }

        return {
            success: true,
            message: 'Word document generated successfully',
            filePath: docxFilePath,
            filename: `${filename}.docx`
        };

    } catch (error) {
        console.error('LaTeX to Word conversion error:', error);

        // Clean up files on error
        const filesToClean = [texFilePath, pdfFilePath, docxFilePath];
        for (const file of filesToClean) {
            try {
                await fs.unlink(file);
            } catch (cleanupError) {
                // Ignore cleanup errors
            }
        }

        // Provide specific error messages
        if (error.message.includes('pandoc: command not found')) {
            return {
                success: false,
                error: 'Pandoc is not installed. Please install Pandoc for document conversion.'
            };
        }

        if (error.message.includes('pdflatex: command not found')) {
            return {
                success: false,
                error: 'pdflatex is not installed. Please install a LaTeX distribution.'
            };
        }

        if (error.message.includes('libreoffice: command not found')) {
            return {
                success: false,
                error: 'LibreOffice is not installed. Please install LibreOffice or Pandoc for document conversion.'
            };
        }

        return {
            success: false,
            error: `Word conversion failed: ${error.message}`
        };
    }
}

/**
 * Alternative method: Convert LaTeX to Word using only pandoc (simpler but may lose formatting)
 * @param {string} latexCode - The LaTeX source code
 * @param {string} outputDir - Directory to save the output files (optional)
 * @returns {Promise<Object>} - Result object with success status and file path or error
 */
export async function convertLatexToWordSimple(latexCode, outputDir = './temp') {
    const timestamp = Date.now();
    const filename = `resume_${timestamp}`;
    const texFilePath = path.join(outputDir, `${filename}.tex`);
    const docxFilePath = path.join(outputDir, `${filename}.docx`);

    try {
        // Ensure output directory exists
        await fs.mkdir(outputDir, { recursive: true });

        // Write LaTeX code to .tex file
        await fs.writeFile(texFilePath, latexCode, 'utf8');

        // Convert directly with pandoc
        await execAsync(`pandoc "${texFilePath}" -o "${docxFilePath}" --from=latex --to=docx --reference-doc=reference.docx`);

        // Check if DOCX was created successfully
        await fs.access(docxFilePath);

        // Clean up source file
        await fs.unlink(texFilePath);

        return {
            success: true,
            message: 'Word document generated successfully (simple conversion)',
            filePath: docxFilePath,
            filename: `${filename}.docx`
        };

    } catch (error) {
        console.error('Simple LaTeX to Word conversion error:', error);

        // Clean up files on error
        try {
            await fs.unlink(texFilePath);
            await fs.unlink(docxFilePath);
        } catch (cleanupError) {
            // Ignore cleanup errors
        }

        return {
            success: false,
            error: `Simple Word conversion failed: ${error.message}`
        };
    }
}

/**
 * Get Word document file as buffer for sending as response
 * @param {string} filePath - Path to the Word document file
 * @returns {Promise<Buffer>} - Word document file buffer
 */
export async function getWordBuffer(filePath) {
    try {
        const buffer = await fs.readFile(filePath);
        return buffer;
    } catch (error) {
        throw new Error(`Failed to read Word document: ${error.message}`);
    }
}

/**
 * Clean up temporary Word document file
 * @param {string} filePath - Path to the file to delete
 */
export async function cleanupFile(filePath) {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.error('File cleanup error:', error);
    }
}