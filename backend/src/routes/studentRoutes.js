const express = require('express')
const multer = require('multer')

const {
  getStudents,
  getStudentByUsername,
  loginStudent,
  createStudent,
  updateStudentById,
  uploadStudentPhoto,
} = require('../controllers/studentController')

const router = express.Router()

const parsedMaxSize = Number.parseInt(process.env.MAX_IMAGE_SIZE_BYTES || '', 10)
const maxImageSizeBytes = Number.isFinite(parsedMaxSize) && parsedMaxSize > 0
  ? parsedMaxSize
  : 5 * 1024 * 1024

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxImageSizeBytes,
  },
  fileFilter: (_req, file, cb) => {
    if (file?.mimetype?.startsWith('image/')) {
      cb(null, true)
      return
    }
    cb(new Error('Only image files are allowed'))
  },
})

router.get('/', getStudents)
router.get('/username/:username', getStudentByUsername)
router.post('/login', loginStudent)
router.post('/', upload.single('image'), createStudent)
router.patch('/:id', upload.single('image'), updateStudentById)
router.post('/upload-photo', upload.single('image'), uploadStudentPhoto)

module.exports = router
