require('dotenv').config()

const mongoose = require('mongoose')

const { connectMongoDB } = require('../config/db')
const AcademicItem = require('../models/AcademicItem')

const EMPTY_FILE_QUERY = {
  $or: [
    { fileUrl: { $exists: false } },
    { fileUrl: null },
    { fileUrl: '' },
  ],
}

const updates = [
  {
    query: {
      resource: 'program',
      category: { $regex: /^undergraduate$/i },
      ...EMPTY_FILE_QUERY,
    },
    fileUrl: '/academic-docs/bsc-program-overview.txt',
  },
  {
    query: {
      resource: 'program',
      category: { $regex: /^postgraduate$/i },
      ...EMPTY_FILE_QUERY,
    },
    fileUrl: '/academic-docs/msc-program-overview.txt',
  },
  {
    query: {
      resource: 'curriculum',
      ...EMPTY_FILE_QUERY,
    },
    fileUrl: '/academic-docs/curriculum-l1t1.txt',
  },
  {
    query: {
      resource: 'syllabus',
      ...EMPTY_FILE_QUERY,
    },
    fileUrl: '/academic-docs/syllabus-thermodynamics.txt',
  },
  {
    query: {
      resource: 'calendar',
      ...EMPTY_FILE_QUERY,
    },
    fileUrl: '/academic-docs/academic-calendar-2026.txt',
  },
  {
    query: {
      resource: 'routine',
      type: { $regex: /^class$/i },
      ...EMPTY_FILE_QUERY,
    },
    fileUrl: '/academic-docs/class-routine-l1t1.txt',
  },
  {
    query: {
      resource: 'routine',
      type: { $regex: /^exam$/i },
      ...EMPTY_FILE_QUERY,
    },
    fileUrl: '/academic-docs/exam-routine-midterm.txt',
  },
  {
    query: {
      resource: 'routine',
      type: { $regex: /^ct$/i },
      ...EMPTY_FILE_QUERY,
    },
    fileUrl: '/academic-docs/ct-routine-section-a.txt',
  },
]

const run = async () => {
  await connectMongoDB()

  let totalUpdated = 0

  for (const item of updates) {
    const result = await AcademicItem.updateMany(item.query, {
      $set: {
        fileUrl: item.fileUrl,
      },
    })

    totalUpdated += Number(result.modifiedCount || 0)

    console.log(`Updated ${result.modifiedCount || 0} docs -> ${item.fileUrl}`)
  }

  const sample = await AcademicItem.findOne({
    resource: 'program',
    category: { $regex: /^postgraduate$/i },
  }).select('_id title category fileUrl')

  if (sample) {
    console.log('Sample postgraduate program record:', {
      _id: String(sample._id),
      title: sample.title,
      category: sample.category,
      fileUrl: sample.fileUrl,
    })
  }

  console.log(`Academic fileUrl patch complete. modified=${totalUpdated}`)
}

run()
  .catch((error) => {
    console.error(`Academic fileUrl patch failed: ${error.message}`)
    process.exitCode = 1
  })
  .finally(async () => {
    try {
      await mongoose.disconnect()
    } catch (_error) {
      // ignore disconnect errors
    }
  })
