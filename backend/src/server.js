require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')

const { connectMongoDB } = require('./config/db')
const { configureCloudinary } = require('./config/cloudinary')
const { ensureDefaultAdmin } = require('./controllers/authController')
const authRoutes = require('./routes/authRoutes')
const { createAcademicRouter } = require('./routes/academicRoutes')
const studentRoutes = require('./routes/studentRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const app = express()

process.on('unhandledRejection', (reason) => {
	console.error('Unhandled promise rejection during startup/runtime:')
	console.error(reason)
})

process.on('uncaughtException', (error) => {
	console.error('Uncaught exception during startup/runtime:')
	console.error(error)
	process.exit(1)
})

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
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'))
}

app.get('/api/health', (_req, res) => {
	res.json({
		success: true,
		message: 'RUET CSE backend is running',
	})
})

app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/notices', createAcademicRouter('notice'))
app.use('/api/events', createAcademicRouter('event'))
app.use('/api/programs', createAcademicRouter('program'))
app.use('/api/curriculums', createAcademicRouter('curriculum'))
app.use('/api/syllabi', createAcademicRouter('syllabus'))
app.use('/api/calendars', createAcademicRouter('calendar'))
app.use('/api/routines', createAcademicRouter('routine'))

app.use(notFound)
app.use(errorHandler)

const PORT = Number.parseInt(process.env.PORT || '5000', 10)

const startServer = async () => {
	try {
		const mongoUriConfigured = Boolean(process.env.MONGODB_URI || process.env.MONGO_URI)
		console.log(`Startup config -> NODE_ENV=${process.env.NODE_ENV || 'undefined'}, PORT=${PORT}, MONGO_URI_SET=${mongoUriConfigured}`)

		await connectMongoDB()
		await ensureDefaultAdmin()
		configureCloudinary()

		app.listen(PORT, () => {
			console.log(`Backend running on port ${PORT}`)
		})
	} catch (error) {
		console.error('Could not start backend.')
		console.error(error && error.stack ? error.stack : error)
		process.exitCode = 1
	}
}

startServer()
