const escapeCell = (value) => {
  const s = String(value ?? '')
  if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export const toCsv = (rows) => rows
  .map((row) => row.map(escapeCell).join(','))
  .join('\n')
