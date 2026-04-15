const FACULTY_URL = '/faculty.json'

export async function loadFacultyData({ bustCache = false } = {}) {
  const url = bustCache ? `${FACULTY_URL}?t=${Date.now()}` : FACULTY_URL
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Failed to load faculty data (${res.status})`)
  }
  const data = await res.json()
  return {
    version: data?.version ?? 1,
    dean: data?.dean ?? null,
    head: data?.head ?? null,
    members: Array.isArray(data?.members) ? data.members : [],
    staff: Array.isArray(data?.staff) ? data.staff : [],
  }
}
