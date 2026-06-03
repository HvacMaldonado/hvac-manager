import * as XLSX from "xlsx";

export function exportarExcel(rows = [], fileName = "reporte.xlsx", sheetName = "Reporte") {
  try {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const columnWidths = Object.keys(rows?.[0] || {}).map((key) => ({
      wch: Math.max(String(key).length + 4, 18),
    }));

    worksheet["!cols"] = columnWidths;

    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error("Error exportando Excel:", error);
    alert("No se pudo exportar el archivo Excel.");
  }
}
