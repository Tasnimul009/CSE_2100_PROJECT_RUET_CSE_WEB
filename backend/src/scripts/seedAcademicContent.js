require('dotenv').config()

const mongoose = require('mongoose')

const { connectMongoDB } = require('../config/db')
const { ensureDefaultAdmin } = require('../controllers/authController')
const AcademicItem = require('../models/AcademicItem')

const defaults = [
  {
    resource: 'notice',
    title: 'Semester Registration Notice',
    description: 'Registration schedule for Level-2 Term-II students.',
    category: 'Academic Notice',
    semester: 'L2 T2',
  },
  {
    resource: 'event',
    title: 'AI and Robotics Seminar',
    description: 'Department seminar on modern AI tools in robotics.',
    category: 'Seminar',
    eventDate: new Date(),
  },
  {
    resource: 'program',
    title: 'BSc in Computer Science and Engineering',
    description: 'Four-year undergraduate degree covering core CSE tracks.',
    category: 'Undergraduate',
  },
  {
    resource: 'program',
    title: 'MSc in Computer Science and Engineering',
    description: 'Postgraduate program with research and thesis track.',
    category: 'Postgraduate',
  },
  {
    resource: 'curriculum',
    title: 'Level 1 Term 1 Curriculum',
    description: 'Core mathematics, physics and introductory computing courses.',
    semester: 'L1 T1',
  },
  {
    resource: 'syllabus',
    title: 'Thermodynamics Syllabus',
    description: 'Detailed outline, outcomes and assessment policy.',
    semester: 'L2 T1',
  },
  {
    resource: 'calendar',
    title: 'Academic Calendar 2026',
    description: 'Semester timeline, breaks and examination windows.',
  },
  {
    resource: 'routine',
    type: 'class',
    title: 'Class Routine - Level 1 Term 1',
    description: 'Weekly class schedule for first year first term.',
    semester: 'L1 T1',
    session: '2025-26',
  },
  {
    resource: 'routine',
    type: 'exam',
    title: 'Midterm Examination Routine',
    description: 'Department midterm examination schedule.',
    semester: 'L2 T1',
    session: '2025-26',
  },
  {
    resource: 'routine',
    type: 'ct',
    title: 'CT Routine - Section A',
    description: 'Continuous assessment schedule for Section A.',
    semester: 'L1 T1',
    session: '2025-26',
  },
]

const run = async () => {
  await connectMongoDB()
  await ensureDefaultAdmin()

  const resetMode = process.argv.includes('--reset')
  if (resetMode) {
    await AcademicItem.deleteMany({})
  }

  let created = 0

  for (const item of defaults) {
    const exists = await AcademicItem.findOne({
      resource: item.resource,
      title: item.title,
      type: item.type || '',
    })

    if (exists) {
      continue
    }

    await AcademicItem.create(item)
    created += 1
  }

  console.log(`Academic seed complete. created=${created}`)
}

run()
  .catch((error) => {
    console.error(`Academic seed failed: ${error.message}`)
    process.exitCode = 1
  })
  .finally(async () => {
    try {
      await mongoose.disconnect()
    } catch (_) {
      // ignore disconnect failures
    }
  })
