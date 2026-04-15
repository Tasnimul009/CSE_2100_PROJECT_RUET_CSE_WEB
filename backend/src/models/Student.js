const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    studentId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    batch: {
      type: String,
      trim: true,
      default: '',
    },
    section: {
      type: String,
      trim: true,
      default: '',
    },
    isCR: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    interests: {
      type: [String],
      default: [],
    },
    photoDataUrl: {
      type: String,
      trim: true,
      default: '',
    },
    photoPublicId: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  },
)

studentSchema.index({ batch: 1, section: 1 })

module.exports = mongoose.model('Student', studentSchema)
