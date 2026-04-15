const PHOTO_PREFIX = 'ruet-cse-student-photo-v1:'

export const getStudentPhoto = (username) => {
  const u = String(username || '').trim()
  if (!u) return ''
  try {
    return localStorage.getItem(`${PHOTO_PREFIX}${u}`) || ''
  } catch (_) {
    return ''
  }
}

export const setStudentPhoto = (username, dataUrl) => {
  const u = String(username || '').trim()
  if (!u) return
  try {
    if (!dataUrl) localStorage.removeItem(`${PHOTO_PREFIX}${u}`)
    else localStorage.setItem(`${PHOTO_PREFIX}${u}`, dataUrl)
  } catch (_) {
    /* ignore */
  }
}
