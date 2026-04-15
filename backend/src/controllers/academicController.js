const fs = require('fs')
const path = require('path')
const asyncHandler = require('express-async-handler')

const AcademicItem = require('../models/AcademicItem')

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)
const toTrimmedString = (value) => String(value ?? '').trim()

const parseOptionalDate = (value) => {
  const raw = toTrimmedString(value)
  if (!raw) return undefined

  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return parsed
}

const removeUploadedFile = async (fileUrl) => {
  const prefix = '/uploads/academic/'
  if (!toTrimmedString(fileUrl).startsWith(prefix)) {
    return
  }

  const fileName = path.basename(fileUrl)
  if (!fileName) {
    return
  }

  const localPath = path.join(__dirname, '..', '..', 'uploads', 'academic', fileName)

  try {
    await fs.promises.unlink(localPath)
  } catch (_error) {
    // Ignore missing-file cleanup failures.
  }
}

const createAcademicHandlers = (resourceType) => {
  const listItems = asyncHandler(async (req, res) => {
    const query = { resource: resourceType }

    if (resourceType === 'routine') {
      const requestedType = toTrimmedString(req.query.type).toLowerCase()
      if (requestedType) {
        query.type = requestedType
      }
    }

    const items = await AcademicItem.find(query).sort({ createdAt: -1 })

    res.json({
      success: true,
      count: items.length,
      data: items,
    })
  })

  const createItem = asyncHandler(async (req, res) => {
    const title = toTrimmedString(req.body.title)
    if (!title) {
      res.status(400)
      throw new Error('title is required')
    }

    const payload = {
      resource: resourceType,
      title,
      description: toTrimmedString(req.body.description),
      category: toTrimmedString(req.body.category),
      semester: toTrimmedString(req.body.semester),
      type: resourceType === 'routine' ? toTrimmedString(req.body.type).toLowerCase() || 'class' : '',
      session: toTrimmedString(req.body.session),
      link: toTrimmedString(req.body.link),
      fileUrl: req.file ? `/uploads/academic/${req.file.filename}` : '',
      createdBy: req.admin?._id || null,
    }

    const eventDate = parseOptionalDate(req.body.eventDate)
    if (resourceType === 'event' && eventDate) {
      payload.eventDate = eventDate
    }

    const publishedAt = parseOptionalDate(req.body.publishedAt)
    if (publishedAt) {
      payload.publishedAt = publishedAt
    }

    const created = await AcademicItem.create(payload)

    res.status(201).json({
      success: true,
      data: created,
    })
  })

  const updateItem = asyncHandler(async (req, res) => {
    const id = toTrimmedString(req.params.id)
    const item = await AcademicItem.findOne({ _id: id, resource: resourceType })

    if (!item) {
      res.status(404)
      throw new Error('Item not found')
    }

    if (hasOwn(req.body, 'title')) item.title = toTrimmedString(req.body.title)
    if (hasOwn(req.body, 'description')) item.description = toTrimmedString(req.body.description)
    if (hasOwn(req.body, 'category')) item.category = toTrimmedString(req.body.category)
    if (hasOwn(req.body, 'semester')) item.semester = toTrimmedString(req.body.semester)
    if (hasOwn(req.body, 'session')) item.session = toTrimmedString(req.body.session)
    if (hasOwn(req.body, 'link')) item.link = toTrimmedString(req.body.link)

    if (resourceType === 'routine' && hasOwn(req.body, 'type')) {
      item.type = toTrimmedString(req.body.type).toLowerCase()
    }

    if (resourceType === 'event' && hasOwn(req.body, 'eventDate')) {
      const nextEventDate = parseOptionalDate(req.body.eventDate)
      item.eventDate = nextEventDate
    }

    if (hasOwn(req.body, 'publishedAt')) {
      const nextPublishedAt = parseOptionalDate(req.body.publishedAt)
      if (nextPublishedAt) {
        item.publishedAt = nextPublishedAt
      }
    }

    if (req.file) {
      const oldFileUrl = item.fileUrl
      item.fileUrl = `/uploads/academic/${req.file.filename}`
      await removeUploadedFile(oldFileUrl)
    }

    const updated = await item.save()

    res.json({
      success: true,
      data: updated,
    })
  })

  const deleteItem = asyncHandler(async (req, res) => {
    const id = toTrimmedString(req.params.id)
    const item = await AcademicItem.findOne({ _id: id, resource: resourceType })

    if (!item) {
      res.status(404)
      throw new Error('Item not found')
    }

    const oldFileUrl = item.fileUrl
    await item.deleteOne()
    await removeUploadedFile(oldFileUrl)

    res.json({
      success: true,
      message: 'Item deleted successfully',
    })
  })

  return {
    listItems,
    createItem,
    updateItem,
    deleteItem,
  }
}

module.exports = {
  createAcademicHandlers,
}
