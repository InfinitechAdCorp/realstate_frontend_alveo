"use client";
import * as XLSX from "xlsx";

const exportToExcel = (title, data) => {
  if (!data || data.length === 0) {
    console.error("No data to export.");
    return;
  }

  const headers = Object.keys(data[0]).map((key) =>
    key.replace(/_/g, " ").toUpperCase()
  );
  const values = data.map((obj) => Object.values(obj));

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...values]);

  const columnWidths = headers.map((header, i) => ({
    wch: Math.max(
      header.length,
      ...values.map((row) => (row[i] ? row[i].toString().length : 10))
    ),
  }));
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, `${title.replace(/\s+/g, "_")}.xlsx`);
};

export default exportToExcel;
