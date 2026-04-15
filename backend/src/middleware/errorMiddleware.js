const notFound = (req, res, next) => {
  res.status(404)
  next(new Error(`Route not found: ${req.originalUrl}`))
}

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err)
    return
  }

  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  let message = err?.message || 'Internal server error'

  if (err?.name === 'ValidationError') {
    statusCode = 400
  }

  if (err?.code === 11000) {
    statusCode = 409
    const duplicateField = Object.keys(err.keyPattern || {})[0] || 'field'
    message = `${duplicateField} already exists`
  }

  if (err?.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413
    message = 'Uploaded file is too large'
  }

  if (/only .* files are allowed/i.test(message)) {
    statusCode = 400
  }

  res.status(statusCode).json({
    success: false,
    message,
  })
}

module.exports = {
  notFound,
  errorHandler,
}
