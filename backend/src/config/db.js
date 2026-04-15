const mongoose = require('mongoose')

const connectMongoDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('MONGODB_URI (or MONGO_URI) is not configured in environment variables')
  }

  mongoose.set('strictQuery', true)

  const isRender = Boolean(process.env.RENDER)
  const forceIpv4 = String(process.env.MONGODB_FORCE_IPV4 || (isRender ? 'true' : 'false')).toLowerCase() === 'true'
  const serverSelectionTimeoutMS = Number.parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || '10000', 10)

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || undefined,
      family: forceIpv4 ? 4 : undefined,
      serverSelectionTimeoutMS,
    })
  } catch (error) {
    const guidance = [
      'MongoDB connection failed.',
      'If you are deploying on Render + Atlas, ensure Atlas Network Access allows 0.0.0.0/0 or your Render egress IP.',
      'Also verify MONGODB_URI is the full mongodb+srv connection string and database user credentials are correct.',
    ].join(' ')

    throw new Error(`${guidance} Original error: ${error.message}`)
  }

  console.log(`MongoDB connected: ${mongoose.connection.host}`)
}

module.exports = {
  connectMongoDB,
}
