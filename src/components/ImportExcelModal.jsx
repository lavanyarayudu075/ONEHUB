import { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertTriangle,
} from "lucide-react";
import {
  readRowsFromExcelFile,
  downloadExcelTemplate,
} from "../utils/DataImport/excelSource";
import { mapRowsToFields, findMissingColumns } from "../utils/DataImport/mapRows";

// Generic "Import from Excel" modal, reused by Members / Departments / Tasks.
//
// Props:
//   isOpen            - boolean
//   onClose           - () => void
//   title             - e.g. "Import Members from Excel"
//   fieldMap          - normalized-header -> field key, e.g. { "name": "name", "email": "email" }
//   requiredFields    - [{ key, label }] columns that must be present + non-empty
//   previewColumns    - [{ key, label }] columns to show in the preview table
//   templateHeaders   - string[] header row for the downloadable sample file
//   templateFileName  - e.g. "onehub-members-template.xlsx"
//   onImport          - (mappedRows) => void, called when the user confirms
function ImportExcelModal({
  isOpen,
  onClose,
  title,
  fieldMap,
  requiredFields,
  previewColumns,
  templateHeaders,
  templateFileName,
  onImport,
}) {
  const [status, setStatus] = useState("idle"); // idle | parsing | error | preview
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [mappedRows, setMappedRows] = useState([]);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const reset = () => {
    setStatus("idle");
    setError("");
    setFileName("");
    setMappedRows([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus("parsing");
    setError("");

    try {
      const rawRows = await readRowsFromExcelFile(file);

      const missing = findMissingColumns(rawRows, requiredFields, fieldMap);
      if (missing.length > 0) {
        setError(
          `Missing required column${missing.length > 1 ? "s" : ""}: ${missing.join(
            ", "
          )}. Download the template below to see the expected format.`
        );
        setStatus("error");
        return;
      }

      const mapped = mapRowsToFields(rawRows, fieldMap).filter((row) =>
        requiredFields.every((f) => row[f.key] && String(row[f.key]).trim())
      );

      if (mapped.length === 0) {
        setError("No valid rows found in this file.");
        setStatus("error");
        return;
      }

      setMappedRows(mapped);
      setStatus("preview");
    } catch (err) {
      console.error("Excel import error:", err);
      setError("Couldn't read that file. Make sure it's a valid .xlsx, .xls or .csv file.");
      setStatus("error");
    }
  };

  const handleConfirmImport = () => {
    onImport(mappedRows);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>

          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-900/5 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step: pick a file */}
        {(status === "idle" || status === "parsing") && (
          <div>
            <label
              htmlFor="excel-import-file"
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-cyan-500/50 dark:border-white/10 dark:bg-slate-900/70 dark:hover:border-cyan-400/40"
            >
              <UploadCloud className="h-8 w-8 text-slate-400" />

              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {status === "parsing"
                    ? `Reading ${fileName}...`
                    : "Click to choose an Excel file"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  .xlsx, .xls or .csv — exported from Excel or SharePoint
                </p>
              </div>

              <input
                id="excel-import-file"
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={status === "parsing"}
              />
            </label>

            <button
              type="button"
              onClick={() => downloadExcelTemplate(templateHeaders, templateFileName)}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-cyan-600 transition hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              <Download className="h-4 w-4" />
              Download sample template
            </button>
          </div>
        )}

        {/* Step: error */}
        {status === "error" && (
          <div>
            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => downloadExcelTemplate(templateHeaders, templateFileName)}
                className="flex items-center gap-2 text-sm font-medium text-cyan-600 transition hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                <Download className="h-4 w-4" />
                Download sample template
              </button>

              <button
                type="button"
                onClick={reset}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-900/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
              >
                Try another file
              </button>
            </div>
          </div>
        )}

        {/* Step: preview + confirm */}
        {status === "preview" && (
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
              Found{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {mappedRows.length}
              </span>{" "}
              valid row{mappedRows.length !== 1 ? "s" : ""} in {fileName}
            </div>

            <div className="max-h-64 overflow-auto rounded-xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900/70">
                  <tr>
                    {previewColumns.map((col) => (
                      <th key={col.key} className="px-4 py-2.5">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {mappedRows.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-t border-slate-100 dark:border-white/5">
                      {previewColumns.map((col) => (
                        <td
                          key={col.key}
                          className="px-4 py-2.5 text-slate-700 dark:text-slate-300"
                        >
                          {row[col.key] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {mappedRows.length > 5 && (
              <p className="mt-2 text-xs text-slate-500">
                +{mappedRows.length - 5} more row{mappedRows.length - 5 !== 1 ? "s" : ""} not shown
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={reset}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-900/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
              >
                Choose different file
              </button>

              <button
                type="button"
                onClick={handleConfirmImport}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                Import {mappedRows.length} record{mappedRows.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ImportExcelModal;