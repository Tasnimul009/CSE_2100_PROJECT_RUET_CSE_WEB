const { v2: cloudinary } = require('cloudinary')

const getCloudinaryFolder = () => process.env.CLOUDINARY_FOLDER || 'ruet-cse/students'

const isCloudinaryConfigured = () => Boolean(
  process.env.CLOUDINARY_CLOUD_NAME
    && process.env.CLOUDINARY_API_KEY
    && process.env.CLOUDINARY_API_SECRET,
)

const configureCloudinary = () => {
  if (!isCloudinaryConfigured()) {
    console.warn('Cloudinary is not fully configured. Image upload endpoints will not work.')
    return false
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  return true
}

const uploadImageBuffer = (buffer, { folder } = {}) => {
  if (!buffer) {
    throw new Error('Missing image buffer')
  }

  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured')
  }

  const targetFolder = folder || getCloudinaryFolder()

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: targetFolder,
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }
        resolve(result)
      },
    )

    stream.end(buffer)
  })
}

const deleteImageByPublicId = async (publicId) => {
  if (!publicId) return

  if (!isCloudinaryConfigured()) {
    return
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
  } catch (error) {
    console.warn(`Could not delete old Cloudinary image (${publicId}): ${error.message}`)
  }
}

module.exports = {
  configureCloudinary,
  isCloudinaryConfigured,
  uploadImageBuffer,
  deleteImageByPublicId,
  getCloudinaryFolder,
}
