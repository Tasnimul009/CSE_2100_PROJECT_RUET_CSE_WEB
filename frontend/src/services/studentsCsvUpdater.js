import { parseCsv } from '../utils/parseCsv'
import { toCsv } from '../utils/toCsv'

const norm = (v) => String(v ?? '').trim()
const lower = (v) => norm(v).toLowerCase()

const findHeaderIndex = (headers, candidates) => {
  const map = headers.map((h) => lower(h))
  for (const c of candidates) {
    const idx = map.indexOf(lower(c))
    if (idx !== -1) return idx
  }
  return -1
}

export const buildUpdatedStudentsCsvWithPhoto = async ({ username, photoDataUrl }) => {
  const res = await fetch('/students.csv', { cache: 'no-store' })
  if (!res.ok) throw new Error('students.csv not found')

  const text = await res.text()
  const rows = parseCsv(text)
  if (!rows.length) throw new Error('students.csv is empty')

  const headers = rows[0].map(norm)
  const dataRows = rows.slice(1).map((r) => r.map(norm))

  const idxUsername = findHeaderIndex(headers, ['username', 'user', 'user name'])
  if (idxUsername === -1) throw new Error('students.csv must include a username column')

  let idxPhoto = findHeaderIndex(headers, ['photoDataUrl', 'photo', 'image', 'photoDataURL'])
  const nextHeaders = [...headers]

  if (idxPhoto === -1) {
    idxPhoto = nextHeaders.length
    nextHeaders.push('photoDataUrl')
  }

  const u = norm(username)
  const nextDataRows = dataRows.map((r) => {
    const next = [...r]
    while (next.length < nextHeaders.length) next.push('')
    if (norm(next[idxUsername]) === u) {
      next[idxPhoto] = norm(photoDataUrl)
    }
    return next
  })

  return toCsv([nextHeaders, ...nextDataRows]) + '\n'
}
