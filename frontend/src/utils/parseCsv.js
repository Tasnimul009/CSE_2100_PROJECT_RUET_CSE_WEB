export const parseCsv = (text) => {
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false

  const pushCell = () => {
    row.push(cell)
    cell = ''
  }

  const pushRow = () => {
    // ignore fully-empty trailing row
    if (row.length === 1 && row[0] === '') return
    rows.push(row)
    row = []
  }

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]

    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cell += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (!inQuotes && (ch === ',')) {
      pushCell()
      continue
    }

    if (!inQuotes && (ch === '\n' || ch === '\r')) {
      // handle CRLF
      if (ch === '\r' && text[i + 1] === '\n') i += 1
      pushCell()
      pushRow()
      continue
    }

    cell += ch
  }

  // flush last cell/row
  pushCell()
  pushRow()

  return rows
}
