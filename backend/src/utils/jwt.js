const jwt = require('jsonwebtoken')

const getJwtSecret = () => process.env.JWT_SECRET || 'ruet-cse-dev-secret'
const getJwtExpiry = () => process.env.JWT_EXPIRES_IN || '7d'

const createAdminToken = (admin) => jwt.sign(
  {
    sub: String(admin._id),
    role: admin.role || 'admin',
    email: admin.email,
  },
  getJwtSecret(),
  {
    expiresIn: getJwtExpiry(),
  },
)

const verifyAdminToken = (token) => jwt.verify(token, getJwtSecret())

module.exports = {
  createAdminToken,
  verifyAdminToken,
}
