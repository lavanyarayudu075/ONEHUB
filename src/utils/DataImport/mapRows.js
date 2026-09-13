// Shared helpers for turning raw spreadsheet rows (keyed by whatever
// column headers were in the file) into the exact field names each page's
// state expects (e.g. "email" instead of "Email" or "E-mail").

export function normalizeHeader(header) {
  return String(header).trim().toLowerCase();
}

// fieldMap: { "name": "name", "e-mail": "email", "email": "email", ... }
// — keys are normalized headers you want to accept, values are the field
// name your app actually uses.
export function mapRowsToFields(rawRows, fieldMap) {
  return rawRows.map((raw) => {
    const mapped = {};

    Object.entries(raw).forEach(([header, value]) => {
      const key = fieldMap[normalizeHeader(header)];
      if (key) {
        mapped[key] = typeof value === "string" ? value.trim() : value;
      }
    });

    return mapped;
  });
}

// requiredFields: [{ key: "name", label: "Name" }, ...]
// Returns the human-readable labels of any required columns the file is
// missing, so the UI can show a clear error before trying to import.
export function findMissingColumns(rawRows, requiredFields, fieldMap) {
  if (rawRows.length === 0) {
    return requiredFields.map((f) => f.label);
  }

  const presentHeaders = Object.keys(rawRows[0]).map(normalizeHeader);
  const presentKeys = new Set(
    presentHeaders.map((h) => fieldMap[h]).filter(Boolean)
  );

  return requiredFields
    .filter((f) => !presentKeys.has(f.key))
    .map((f) => f.label);
}