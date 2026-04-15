const toPublicStudent = (studentDoc) => {
  if (!studentDoc) return null

  const plain = typeof studentDoc.toObject === 'function'
    ? studentDoc.toObject()
    : { ...studentDoc }

  delete plain.password

  plain.photoDataUrl = String(plain.photoDataUrl || '').trim()
  plain.image = plain.photoDataUrl

  return plain
}

module.exports = {
  toPublicStudent,
}
