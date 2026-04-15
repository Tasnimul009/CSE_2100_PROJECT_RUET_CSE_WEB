import { useState } from 'react'

const readerAsDataURL = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = reject
  reader.readAsDataURL(file)
})

const emptyForm = {
  name: '',
  studentId: '',
  batch: '',
  email: '',
  phone: '',
  interests: '',
  bio: '',
}

const StudentForm = ({ onAdd }) => {
  const [form, setForm] = useState(emptyForm)
  const [photoPreview, setPhotoPreview] = useState('')
  const [photoData, setPhotoData] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file) => {
    if (!file) {
      setPhotoData('')
      setPhotoPreview('')
      return
    }
    const data = await readerAsDataURL(file)
    setPhotoData(data)
    setPhotoPreview(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.studentId.trim() || !form.batch.trim()) {
      setError('Name, ID, and Batch are required')
      return
    }
    setSubmitting(true)
    try {
      const interestsArr = form.interests
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      await onAdd({
        ...form,
        interests: interestsArr,
        image: photoData,
      })

      setForm(emptyForm)
      setPhotoData('')
      setPhotoPreview('')
    } catch (err) {
      setError('Could not save the profile. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-light-blue rounded-2xl shadow-sm"
      style={{ padding: 'clamp(1rem, 2vw, 1.5rem)', gap: 'clamp(0.6rem, 1vw, 0.9rem)' }}
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-dmSans font-semibold text-black/90" style={{ fontSize: 'clamp(1.05rem, 1.35vw, 1.25rem)' }}>
            Add a Student Profile
          </h3>
          <p className="text-gray-blue" style={{ fontSize: 'clamp(0.86rem, 1.05vw, 0.98rem)' }}>
            Upload a photo and fill in the details to showcase students on the page.
          </p>
        </div>
        <span className="hidden md:inline-flex bg-blue/10 text-blue border border-blue/30 rounded-full px-3 py-1 text-xs font-semibold">Local-only — no server upload</span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 grid-cols-1" style={{ gap: 'clamp(0.75rem, 1.2vw, 1rem)' }}>
        <div className="flex flex-col" style={{ gap: '0.35rem' }}>
          <label className="font-semibold text-black/80" style={{ fontSize: 'clamp(0.88rem, 1.05vw, 1rem)' }}>Full Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-light-blue rounded-lg px-3 py-2 outline-none bg-white text-black/80"
            placeholder="e.g. Arif Rahman"
          />
        </div>
        <div className="flex flex-col" style={{ gap: '0.35rem' }}>
          <label className="font-semibold text-black/80" style={{ fontSize: 'clamp(0.88rem, 1.05vw, 1rem)' }}>Student ID *</label>
          <input
            type="text"
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            className="border border-light-blue rounded-lg px-3 py-2 outline-none bg-white text-black/80"
            placeholder="e.g. 1903001"
          />
        </div>
        <div className="flex flex-col" style={{ gap: '0.35rem' }}>
          <label className="font-semibold text-black/80" style={{ fontSize: 'clamp(0.88rem, 1.05vw, 1rem)' }}>Batch *</label>
          <input
            type="text"
            value={form.batch}
            onChange={(e) => setForm({ ...form, batch: e.target.value })}
            className="border border-light-blue rounded-lg px-3 py-2 outline-none bg-white text-black/80"
            placeholder="e.g. 19"
          />
        </div>
        <div className="flex flex-col" style={{ gap: '0.35rem' }}>
          <label className="font-semibold text-black/80" style={{ fontSize: 'clamp(0.88rem, 1.05vw, 1rem)' }}>Interests (comma separated)</label>
          <input
            type="text"
            value={form.interests}
            onChange={(e) => setForm({ ...form, interests: e.target.value })}
            className="border border-light-blue rounded-lg px-3 py-2 outline-none bg-white text-black/80"
            placeholder="AI, Web, Robotics"
          />
        </div>
        <div className="flex flex-col" style={{ gap: '0.35rem' }}>
          <label className="font-semibold text-black/80" style={{ fontSize: 'clamp(0.88rem, 1.05vw, 1rem)' }}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-light-blue rounded-lg px-3 py-2 outline-none bg-white text-black/80"
            placeholder="name@cse.ruet.ac.bd"
          />
        </div>
        <div className="flex flex-col" style={{ gap: '0.35rem' }}>
          <label className="font-semibold text-black/80" style={{ fontSize: 'clamp(0.88rem, 1.05vw, 1rem)' }}>Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border border-light-blue rounded-lg px-3 py-2 outline-none bg-white text-black/80"
            placeholder="+8801XXXXXXXXX"
          />
        </div>
      </div>

      <div className="flex flex-col" style={{ gap: '0.35rem' }}>
        <label className="font-semibold text-black/80" style={{ fontSize: 'clamp(0.88rem, 1.05vw, 1rem)' }}>Short Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={3}
          className="border border-light-blue rounded-lg px-3 py-2 outline-none bg-white text-black/80"
          placeholder="Clubs, projects, focus areas"
        />
      </div>

      <div className="grid md:grid-cols-[1.3fr_1fr] grid-cols-1 items-center" style={{ gap: 'clamp(0.75rem, 1.1vw, 1rem)' }}>
        <div className="flex flex-col" style={{ gap: '0.35rem' }}>
          <label className="font-semibold text-black/80" style={{ fontSize: 'clamp(0.88rem, 1.05vw, 1rem)' }}>Profile Photo</label>
          <label className="border-2 border-dashed border-light-blue rounded-lg bg-[#F8FBFF] px-4 py-6 cursor-pointer hover:border-blue transition-colors duration-200 flex flex-col items-start" style={{ gap: '0.35rem' }}>
            <span className="font-semibold text-black/80" style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1rem)' }}>Click to upload</span>
            <span className="text-gray-blue" style={{ fontSize: 'clamp(0.82rem, 1vw, 0.95rem)' }}>JPG or PNG, max ~2MB</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) await handleFile(file)
              }}
            />
          </label>
          <p className="text-gray-blue" style={{ fontSize: 'clamp(0.8rem, 0.95vw, 0.92rem)' }}>
            Images stay in your browser only; no server upload.
          </p>
        </div>
        <div className="flex items-center justify-center bg-white border border-light-blue rounded-lg min-h-40 p-3">
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="object-cover w-full max-h-48 rounded-md" />
          ) : (
            <div className="text-gray-blue text-center" style={{ fontSize: 'clamp(0.85rem, 1vw, 0.95rem)' }}>
              Preview will appear here after selecting a photo
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center" style={{ gap: '0.75rem' }}>
        <button
          type="submit"
          disabled={submitting}
          className={`bg-blue text-white font-semibold rounded-full px-5 py-2 transition-opacity duration-200 ${submitting ? 'opacity-60' : 'hover:bg-dark-blue-0'}`}
        >
          {submitting ? 'Saving…' : 'Add Student'}
        </button>
        <button
          type="button"
          onClick={() => { setForm(emptyForm); setPhotoData(''); setPhotoPreview(''); setError('') }}
          className="text-blue border border-blue rounded-full px-4 py-2 font-semibold hover:bg-blue/10 transition-colors duration-200"
        >
          Clear
        </button>
      </div>
    </form>
  )
}

export default StudentForm
