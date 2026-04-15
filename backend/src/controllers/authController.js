const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')

const Admin = require('../models/Admin')
const { createAdminToken } = require('../utils/jwt')

const toTrimmedString = (value) => String(value ?? '').trim()

const toAdminProfile = (admin) => ({
  _id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
})

const ensureDefaultAdmin = async () => {
  const email = toTrimmedString(process.env.ADMIN_EMAIL || 'admin@ruet.ac.bd').toLowerCase()
  const name = toTrimmedString(process.env.ADMIN_NAME || 'Portal Admin')
  const password = toTrimmedString(process.env.ADMIN_PASSWORD || 'admin123')

  if (!email || !password) {
    return null
  }

  const existing = await Admin.findOne({ email })
  if (existing) {
    return existing
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const created = await Admin.create({
    name,
    email,
    passwordHash,
    role: 'admin',
  })

  console.log(`Default admin ensured: ${email}`)
  return created
}

const loginAdmin = asyncHandler(async (req, res) => {
  const email = toTrimmedString(req.body.email).toLowerCase()
  const password = toTrimmedString(req.body.password)

  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password are required')
  }

  const admin = await Admin.findOne({ email }).select('+passwordHash')
  if (!admin) {
    res.status(401)
    throw new Error('Invalid admin credentials')
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash)
  if (!isMatch) {
    res.status(401)
    throw new Error('Invalid admin credentials')
  }

  const token = createAdminToken(admin)

  res.json({
    success: true,
    data: {
      token,
      admin: toAdminProfile(admin),
    },
  })
})

const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: toAdminProfile(req.admin),
  })
})

module.exports = {
  ensureDefaultAdmin,
  loginAdmin,
  getMe,
}
