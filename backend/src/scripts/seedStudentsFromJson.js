require('dotenv').config()

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

const { connectMongoDB } = require('../config/db')
const Student = require('../models/Student')

const toTrimmedString = (value) => String(value ?? '').trim()

const toBoolean = (value) => {
  if (typeof value === 'boolean') return value
  const raw = toTrimmedString(value).toLowerCase()
  return raw === 'true' || raw === '1' || raw === 'yes' || raw === 'on'
}

const parseSourceStudents = (rawJson) => {
  if (Array.isArray(rawJson)) return rawJson
  if (Array.isArray(rawJson?.students)) return rawJson.students
  return []
}

const resolveSourcePath = () => {
  const fromArg = process.argv[2]
  if (fromArg) {
    return path.resolve(process.cwd(), fromArg)
  }

  return path.resolve(__dirname, '../../../frontend/public/students.json')
}

const run = async () => {
  const sourcePath = resolveSourcePath()

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`students.json not found: ${sourcePath}`)
  }

  const fileText = fs.readFileSync(sourcePath, 'utf-8')
  const parsed = JSON.parse(fileText)
  const sourceStudents = parseSourceStudents(parsed)

  if (!sourceStudents.length) {
    console.log('No students found in source JSON. Nothing to seed.')
    return
  }

  await connectMongoDB()

  let created = 0
  let updated = 0
  let skipped = 0

  for (const item of sourceStudents) {
    const studentId = toTrimmedString(item.studentId)
    const username = toTrimmedString(item.username || item.studentId)
    const name = toTrimmedString(item.name)
    const password = toTrimmedString(item.password)

    if (!studentId || !username || !name || !password) {
      skipped += 1
      continue
    }

    const payload = {
      name,
      studentId,
      username,
      password,
      email: toTrimmedString(item.email).toLowerCase(),
      batch: toTrimmedString(item.batch),
      section: toTrimmedString(item.section),
      isCR: toBoolean(item.isCR),
      photoDataUrl: toTrimmedString(item.photoDataUrl),
    }

    const existing = await Student.findOne({
      $or: [{ studentId }, { username }],
    }).select('+password')

    if (!existing) {
      await Student.create(payload)
      created += 1
      continue
    }

    Object.assign(existing, payload)
    await existing.save()
    updated += 1
  }

  console.log(`Seed complete. created=${created}, updated=${updated}, skipped=${skipped}`)
}

run()
  .catch((error) => {
    console.error(`Seed failed: ${error.message}`)
    process.exitCode = 1
  })
  .finally(async () => {
    try {
      await mongoose.disconnect()
    } catch (_) {
      // ignore disconnect failures
    }
  })
