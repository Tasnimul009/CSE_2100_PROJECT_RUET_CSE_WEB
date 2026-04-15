export const buildUpdatedStudentsJsonWithPhoto = async ({ username, photoDataUrl }) => {
  const res = await fetch('/students.json', { cache: 'no-store' })
  if (!res.ok) throw new Error('students.json not found')

  const raw = await res.json()
  const students = Array.isArray(raw) ? raw : Array.isArray(raw?.students) ? raw.students : null
  if (!Array.isArray(students)) throw new Error('students.json must be an array')

  const u = String(username || '').trim()
  const next = students.map((s) => {
    const item = { ...(s || {}) }
    if (String(item.username || '').trim() === u) {
      item.photoDataUrl = String(photoDataUrl || '').trim()
    }
    return item
  })

  return JSON.stringify(next, null, 2) + '\n'
}
