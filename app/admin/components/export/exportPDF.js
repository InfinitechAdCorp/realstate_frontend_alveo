"use client";
import { jsPDF } from "jspdf";

const exportToPDF = (title, data) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const img = new Image();
  img.src = "/logo.png"; // Adjust path if needed
  img.onload = () => {
    let pageNumber = 1;
    let yOffset = 60; // Initial Y position
    const columnWidth = 90; // Column width
    const columnOneX = 10; // First column start
    const columnTwoX = 105; // Second column start
    let currentColumnX = columnOneX; // Start with first column
    const maxY = 265; // Ensuring footer space
    let firstColumnFull = false; // Track first column status

    // Function to add header on each page
    const addHeader = () => {
      // Header Background
      doc.setFillColor(31, 41, 55); // #1F2937 in RGB
      doc.rect(0, 0, 210, 55, "F"); // Full width rectangle with height 55mm

      // Logo (aligned to the right, moved lower and widened)
      doc.addImage(img, "PNG", 150, 10, 55, 20); // Adjusted position and size

      // Title and company details
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(16);
      doc.text(title, 10, 20);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Alveo Land", 10, 35);
      doc.setFont("helvetica", "normal");
      doc.text("Alveo Corporate Center, 728 28th St, BGC, Taguig City", 10, 42);
      doc.text(
        "Email: info@alveoland.com.ph | Phone: (+632) 8848 5000",
        10,
        48
      );

      doc.setTextColor(0, 0, 0); // Reset text color to black for body content
      yOffset = 60; // Reset yOffset after header
    };

    // Function to add footer on each page
    const addFooter = () => {
      doc.line(10, 275, 200, 275); // Footer separator line
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Alveo Land - Infinitech Advertising Corporation", 10, 282);
      doc.setFont("helvetica", "normal");
      doc.text("www.infinitechphil.com | Privacy Policy", 10, 288);
    };

    addHeader(); // Add header on first page

    data.forEach((entry, index) => {
      let entryHeight = 6; // Initial height per entry (title height)
      let entryData = [];

      Object.entries(entry).forEach(([key, value]) => {
        let label = `${key.replace(/_/g, " ").toUpperCase()}:`;
        let text = value ? String(value) : "N/A";

        // 🔹 Convert ₱ to PHP
        text = text.replace(/₱/g, "PHP");

        let wrappedText = doc.splitTextToSize(text, columnWidth - 45);

        entryData.push({ label, wrappedText, height: 6 * wrappedText.length });
        entryHeight += 6 * wrappedText.length + 2;
      });

      // 🔹 Ensure entry fully fits in the column before switching
      if (yOffset + entryHeight > maxY) {
        if (!firstColumnFull) {
          yOffset = 60; // Move to second column
          currentColumnX = columnTwoX;
          firstColumnFull = true;
        } else {
          addFooter(); // Add footer before new page
          doc.addPage();
          pageNumber++;
          addHeader(); // Add header on new page
          yOffset = 60; // Reset Y position
          currentColumnX = columnOneX; // Start from first column again
          firstColumnFull = false;
        }
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Entry #${index + 1}`, currentColumnX, yOffset);
      yOffset += 6;

      entryData.forEach(({ label, wrappedText, height }) => {
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(label, currentColumnX, yOffset);

        doc.setFont("helvetica", "normal");
        doc.text(wrappedText, currentColumnX + 45, yOffset);
        yOffset += height;
      });

      yOffset += 10; // Space between entries
    });

    addFooter(); // Ensure footer is added to the last page
    doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
  };
};

export default exportToPDF;
