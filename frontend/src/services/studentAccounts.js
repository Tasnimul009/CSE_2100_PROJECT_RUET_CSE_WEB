let cachedPublicAccounts = null
let cachedCredentialAccounts = null

const API_BASE = String(
  import.meta.env.VITE_STUDENT_API_BASE_URL
    || import.meta.env.VITE_API_BASE_URL
    || 'http://localhost:5000/api',
).replace(/\/+$/, '')

const norm = (v) => String(v ?? '').trim()

const mapStudentToAccount = (student, index) => ({
  id: norm(student?._id) || norm(student?.id) || `acc-${index + 1}`,
  name: norm(student?.name),
  studentId: norm(student?.studentId),
  email: norm(student?.email),
  username: norm(student?.username),
  password: norm(student?.password),
  batch: norm(student?.batch),
  section: norm(student?.section),
  isCR: Boolean(student?.isCR),
  phone: norm(student?.phone),
  bio: norm(student?.bio),
  interests: Array.isArray(student?.interests) ? student.interests.map((item) => norm(item)).filter(Boolean) : [],
  createdAt: norm(student?.createdAt),
  photoDataUrl: norm(student?.photoDataUrl || student?.image),
})

const requestStudentApi = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, options)
  const payload = await response.json().catch(() => null)

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `Student API request failed (${response.status})`)
  }

  return payload.data
}

const loadAccountsFromApi = async ({ includeCredentials = false } = {}) => {
  const query = includeCredentials ? '?includeCredentials=true' : ''
  const data = await requestStudentApi(`/students${query}`)
  const arr = Array.isArray(data) ? data : []
  return arr.map(mapStudentToAccount)
}

export const loadStudentAccounts = async ({ bustCache = false, includeCredentials = false } = {}) => {
  const cache = includeCredentials ? cachedCredentialAccounts : cachedPublicAccounts
  if (!bustCache && cache) return cache

  const fromApi = await loadAccountsFromApi({ includeCredentials })
  const filteredApi = fromApi.filter((a) => (includeCredentials ? a.username && a.password : a.username))

  if (includeCredentials) cachedCredentialAccounts = filteredApi
  else cachedPublicAccounts = filteredApi

  return filteredApi
}

export const loginStudentAccount = async ({ username, password }) => {
  const cleanUsername = norm(username)
  const cleanPassword = norm(password)

  if (!cleanUsername || !cleanPassword) {
    throw new Error('Username and password are required')
  }

  const data = await requestStudentApi('/students/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: cleanUsername,
      password: cleanPassword,
    }),
  })

  return mapStudentToAccount(data, 0)
}

export const uploadStudentPhoto = async ({ username, file }) => {
  const cleanUsername = norm(username)

  if (!cleanUsername) {
    throw new Error('Missing username')
  }

  if (!file) {
    throw new Error('Image file is required')
  }

  const formData = new FormData()
  formData.append('username', cleanUsername)
  formData.append('image', file)

  const data = await requestStudentApi('/students/upload-photo', {
    method: 'POST',
    body: formData,
  })

  cachedPublicAccounts = null
  cachedCredentialAccounts = null

  return mapStudentToAccount(data, 0)
}

export const getStudentApiBaseUrl = () => API_BASE
