const asyncHandler = require('express-async-handler')

const Admin = require('../models/Admin')
const { verifyAdminToken } = require('../utils/jwt')

const adminAuth = asyncHandler(async (req, res, next) => {
  const authHeader = String(req.headers.authorization || '')
  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    res.status(401)
    throw new Error('Authorization token is required')
  }

  let payload
  try {
    payload = verifyAdminToken(token)
  } catch (_error) {
    res.status(401)
    throw new Error('Invalid or expired authorization token')
  }

  const admin = await Admin.findById(payload.sub)
  if (!admin) {
    res.status(401)
    throw new Error('Unauthorized admin user')
  }

  req.admin = admin
  next()
})

module.exports = {
  adminAuth,
}
