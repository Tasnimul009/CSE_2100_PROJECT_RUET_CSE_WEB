const mongoose = require('mongoose')

const connectMongoDB = async () => {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured in environment variables')
  }

  mongoose.set('strictQuery', true)

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME || undefined,
  })

  console.log(`MongoDB connected: ${mongoose.connection.host}`)
}

module.exports = {
  connectMongoDB,
}
