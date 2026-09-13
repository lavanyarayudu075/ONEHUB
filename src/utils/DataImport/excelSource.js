// Reads rows out of a real .xlsx/.xls/.csv file the user picked from their
// computer (which may itself be a file they just downloaded from SharePoint
// or OneDrive). This is the "Excel upload" data source.
//
// Requires the `xlsx` (SheetJS) package:
//   npm install xlsx

import * as XLSX from "xlsx";

// file: a browser File object (from an <input type="file"> change event)
// Returns: an array of plain objects, one per spreadsheet row, keyed by
// the column headers in row 1 — e.g. [{ Name: "Arjun", Email: "..." }, ...]
export async function readRowsFromExcelFile(file) {
  const buffer = await file.arrayBuffer();

  // cellDates: true makes Excel date cells come back as real JS Date
  // objects instead of raw date-serial numbers.
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];

  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

// Generates and downloads a blank .xlsx with just the header row, so the
// user always knows exactly which column names to use.
export function downloadExcelTemplate(headers, fileName) {
  const worksheet = XLSX.utils.aoa_to_sheet([headers]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, fileName);
}