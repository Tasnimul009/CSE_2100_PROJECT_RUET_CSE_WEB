const mongoose = require('mongoose')

const academicItemSchema = new mongoose.Schema(
  {
    resource: {
      type: String,
      required: true,
      enum: ['notice', 'event', 'program', 'curriculum', 'syllabus', 'calendar', 'routine'],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    semester: {
      type: String,
      trim: true,
      default: '',
    },
    type: {
      type: String,
      trim: true,
      default: '',
    },
    session: {
      type: String,
      trim: true,
      default: '',
    },
    eventDate: {
      type: Date,
      default: undefined,
    },
    link: {
      type: String,
      trim: true,
      default: '',
    },
    fileUrl: {
      type: String,
      trim: true,
      default: '',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

academicItemSchema.index({ resource: 1, createdAt: -1 })

module.exports = mongoose.model('AcademicItem', academicItemSchema)
