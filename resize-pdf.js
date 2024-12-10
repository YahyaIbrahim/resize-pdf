const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function resizePdfWithContent(inputPath, outputPath) {
  // Load the existing PDF
  const pdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Set the desired dimensions (4x6 inches in points)
  const newWidth = 288; // 4 inches * 72 points
  const newHeight = 432; // 6 inches * 72 points

  const pages = pdfDoc.getPages();

  for (const page of pages) {
    // Get original page size
    const { width: originalWidth, height: originalHeight } = page.getMediaBox();

    // Calculate scale factors for width and height
    const scaleX = newWidth / originalWidth;
    const scaleY = newHeight / originalHeight;

    // Use the smaller scale factor to maintain aspect ratio
    const scaleFactor = Math.min(scaleX, scaleY);

    // Center content within the new page size
    const offsetX = (newWidth - originalWidth * scaleFactor) / 2;
    const offsetY = (newHeight - originalHeight * scaleFactor) / 2;

    // Resize the page's media box
    page.setMediaBox(0, 0, newWidth, newHeight);

    // Scale and center the content
    page.scaleContent(scaleFactor, scaleFactor);
    page.translateContent(offsetX, offsetY);
  }

  // Save the resized PDF
  const resizedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, resizedPdfBytes);

  console.log(`PDF resized and saved to: ${outputPath}`);
}

// Specify the input and output files
const inputPdf = 'LetterPDF.pdf'; // Replace with your input PDF path
const outputPdf = 'output.pdf'; // Replace with your desired output PDF path

resizePdfWithContent(inputPdf, outputPdf).catch((error) => {
  console.error('Error resizing PDF:', error);
});
