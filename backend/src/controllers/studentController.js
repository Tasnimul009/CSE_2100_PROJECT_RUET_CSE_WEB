const asyncHandler = require('express-async-handler')

const Student = require('../models/Student')
const { toPublicStudent } = require('../utils/studentMapper')
const { uploadImageBuffer, deleteImageByPublicId } = require('../config/cloudinary')

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)
const toTrimmedString = (value) => String(value ?? '').trim()

const toBoolean = (value) => {
  if (typeof value === 'boolean') return value
  const raw = toTrimmedString(value).toLowerCase()
  return raw === 'true' || raw === '1' || raw === 'yes' || raw === 'on'
}

const toInterestsArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => toTrimmedString(item)).filter(Boolean)
  }

  const raw = toTrimmedString(value)
  if (!raw) return []

  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const toStudentWithCredentials = (studentDoc) => {
  const plain = typeof studentDoc.toObject === 'function'
    ? studentDoc.toObject()
    : { ...studentDoc }

  plain.photoDataUrl = toTrimmedString(plain.photoDataUrl)
  plain.image = plain.photoDataUrl

  return plain
}

const getStudents = asyncHandler(async (req, res) => {
  const includeCredentials = toTrimmedString(req.query.includeCredentials).toLowerCase() === 'true'

  const query = Student.find({}).sort({ batch: 1, studentId: 1, createdAt: -1 })
  if (includeCredentials) {
    query.select('+password')
  }

  const students = await query

  const data = includeCredentials
    ? students.map(toStudentWithCredentials)
    : students.map(toPublicStudent)

  res.json({
    success: true,
    count: data.length,
    data,
  })
})

const getStudentByUsername = asyncHandler(async (req, res) => {
  const username = toTrimmedString(req.params.username)
  if (!username) {
    res.status(400)
    throw new Error('Username is required')
  }

  const includeCredentials = toTrimmedString(req.query.includeCredentials).toLowerCase() === 'true'
  const query = Student.findOne({ username })

  if (includeCredentials) {
    query.select('+password')
  }

  const student = await query
  if (!student) {
    res.status(404)
    throw new Error('Student not found')
  }

  res.json({
    success: true,
    data: includeCredentials ? toStudentWithCredentials(student) : toPublicStudent(student),
  })
})

const loginStudent = asyncHandler(async (req, res) => {
  const username = toTrimmedString(req.body.username)
  const password = toTrimmedString(req.body.password)

  if (!username || !password) {
    res.status(400)
    throw new Error('Username and password are required')
  }

  const student = await Student.findOne({ username }).select('+password')

  if (!student || student.password !== password) {
    res.status(401)
    throw new Error('Invalid username or password')
  }

  res.json({
    success: true,
    data: toPublicStudent(student),
  })
})

const createStudent = asyncHandler(async (req, res) => {
  const payload = {
    name: toTrimmedString(req.body.name),
    studentId: toTrimmedString(req.body.studentId),
    username: toTrimmedString(req.body.username || req.body.studentId),
    password: toTrimmedString(req.body.password),
    email: toTrimmedString(req.body.email).toLowerCase(),
    batch: toTrimmedString(req.body.batch),
    section: toTrimmedString(req.body.section),
    isCR: toBoolean(req.body.isCR),
    phone: toTrimmedString(req.body.phone),
    bio: toTrimmedString(req.body.bio),
    interests: toInterestsArray(req.body.interests),
  }

  if (!payload.name || !payload.studentId || !payload.username || !payload.password) {
    res.status(400)
    throw new Error('name, studentId, username, and password are required')
  }

  let uploadedImage = null

  if (req.file?.buffer) {
    uploadedImage = await uploadImageBuffer(req.file.buffer)
    payload.photoDataUrl = uploadedImage.secure_url
    payload.photoPublicId = uploadedImage.public_id
  }

  try {
    const created = await Student.create(payload)
    const fresh = await Student.findById(created._id)

    res.status(201).json({
      success: true,
      data: toPublicStudent(fresh),
    })
  } catch (error) {
    if (uploadedImage?.public_id) {
      await deleteImageByPublicId(uploadedImage.public_id)
    }
    throw error
  }
})

const updateStudentById = asyncHandler(async (req, res) => {
  const studentId = toTrimmedString(req.params.id)
  if (!studentId) {
    res.status(400)
    throw new Error('Student id is required')
  }

  const student = await Student.findById(studentId)
  if (!student) {
    res.status(404)
    throw new Error('Student not found')
  }

  const updates = {}

  if (hasOwn(req.body, 'name')) updates.name = toTrimmedString(req.body.name)
  if (hasOwn(req.body, 'studentId')) updates.studentId = toTrimmedString(req.body.studentId)
  if (hasOwn(req.body, 'username')) updates.username = toTrimmedString(req.body.username)
  if (hasOwn(req.body, 'password')) updates.password = toTrimmedString(req.body.password)
  if (hasOwn(req.body, 'email')) updates.email = toTrimmedString(req.body.email).toLowerCase()
  if (hasOwn(req.body, 'batch')) updates.batch = toTrimmedString(req.body.batch)
  if (hasOwn(req.body, 'section')) updates.section = toTrimmedString(req.body.section)
  if (hasOwn(req.body, 'phone')) updates.phone = toTrimmedString(req.body.phone)
  if (hasOwn(req.body, 'bio')) updates.bio = toTrimmedString(req.body.bio)
  if (hasOwn(req.body, 'isCR')) updates.isCR = toBoolean(req.body.isCR)
  if (hasOwn(req.body, 'interests')) updates.interests = toInterestsArray(req.body.interests)

  if (Object.keys(updates).length === 0 && !req.file?.buffer) {
    res.status(400)
    throw new Error('No update fields provided')
  }

  const oldPhotoPublicId = student.photoPublicId

  if (req.file?.buffer) {
    const uploadedImage = await uploadImageBuffer(req.file.buffer)
    updates.photoDataUrl = uploadedImage.secure_url
    updates.photoPublicId = uploadedImage.public_id
  }

  Object.assign(student, updates)
  await student.save()

  if (updates.photoPublicId && oldPhotoPublicId && oldPhotoPublicId !== updates.photoPublicId) {
    await deleteImageByPublicId(oldPhotoPublicId)
  }

  res.json({
    success: true,
    data: toPublicStudent(student),
  })
})

const uploadStudentPhoto = asyncHandler(async (req, res) => {
  const username = toTrimmedString(req.body.username)

  if (!username) {
    res.status(400)
    throw new Error('username is required')
  }

  if (!req.file?.buffer) {
    res.status(400)
    throw new Error('image file is required')
  }

  const student = await Student.findOne({ username })
  if (!student) {
    res.status(404)
    throw new Error('Student not found')
  }

  const oldPhotoPublicId = student.photoPublicId
  const uploadedImage = await uploadImageBuffer(req.file.buffer)

  student.photoDataUrl = uploadedImage.secure_url
  student.photoPublicId = uploadedImage.public_id
  await student.save()

  if (oldPhotoPublicId && oldPhotoPublicId !== uploadedImage.public_id) {
    await deleteImageByPublicId(oldPhotoPublicId)
  }

  res.json({
    success: true,
    data: toPublicStudent(student),
  })
})

module.exports = {
  getStudents,
  getStudentByUsername,
  loginStudent,
  createStudent,
  updateStudentById,
  uploadStudentPhoto,
}
