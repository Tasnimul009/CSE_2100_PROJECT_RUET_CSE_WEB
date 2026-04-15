const fs = require('fs')
const path = require('path')
const express = require('express')
const multer = require('multer')

const { adminAuth } = require('../middleware/authMiddleware')
const { createAcademicHandlers } = require('../controllers/academicController')

const parsedMaxUploadBytes = Number.parseInt(process.env.MAX_UPLOAD_SIZE_BYTES || '', 10)
const maxUploadBytes = Number.isFinite(parsedMaxUploadBytes) && parsedMaxUploadBytes > 0
  ? parsedMaxUploadBytes
  : 10 * 1024 * 1024

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'academic')
    fs.mkdirSync(uploadDir, { recursive: true })
    cb(null, uploadDir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.bin'
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: maxUploadBytes,
  },
  fileFilter: (_req, file, cb) => {
    const mime = String(file?.mimetype || '').toLowerCase()
    const isImage = mime.startsWith('image/')
    const isPdf = mime === 'application/pdf'

    if (isImage || isPdf) {
      cb(null, true)
      return
    }

    cb(new Error('Only PDF or image files are allowed'))
  },
})

const createAcademicRouter = (resourceType) => {
  const router = express.Router()
  const handlers = createAcademicHandlers(resourceType)

  router.get('/', handlers.listItems)
  router.post('/', adminAuth, upload.single('file'), handlers.createItem)
  router.patch('/:id', adminAuth, upload.single('file'), handlers.updateItem)
  router.delete('/:id', adminAuth, handlers.deleteItem)

  return router
}

module.exports = {
  createAcademicRouter,
}
