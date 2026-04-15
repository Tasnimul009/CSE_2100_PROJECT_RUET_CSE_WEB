require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const { connectMongoDB } = require('./config/db')
const { configureCloudinary } = require('./config/cloudinary')
const studentRoutes = require('./routes/studentRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const app = express()

const rawCorsOrigin = String(process.env.CORS_ORIGIN || '*').trim()
if (!rawCorsOrigin || rawCorsOrigin === '*') {
	app.use(cors())
} else {
	const allowedOrigins = rawCorsOrigin
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean)

	app.use(cors({
		origin: allowedOrigins,
		credentials: true,
	}))
}

app.use(helmet())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'))
}

app.get('/api/health', (_req, res) => {
	res.json({
		success: true,
		message: 'Student backend is running',
	})
})

app.use('/api/students', studentRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = Number.parseInt(process.env.PORT || '5000', 10)

const startServer = async () => {
	try {
		await connectMongoDB()
		configureCloudinary()

		app.listen(PORT, () => {
			console.log(`Backend running on port ${PORT}`)
		})
	} catch (error) {
		console.error(`Could not start backend: ${error.message}`)
		process.exit(1)
	}
}

startServer()
