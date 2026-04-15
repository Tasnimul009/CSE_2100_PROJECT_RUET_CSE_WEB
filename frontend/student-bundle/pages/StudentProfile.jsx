import { useEffect, useMemo, useState } from 'react'

import Breadcrumb      from '../../src/components/quickMenu/Breadcrumb'
import PageHeroBanner  from '../../src/components/quickMenu/PageHeroBanner'
import StudentForm     from '../components/StudentForm'
import StudentCard     from '../components/StudentCard'

import { initialStudentProfiles } from '../constants/studentData'

const STORAGE_KEY = 'ruet-cse-student-profiles-v1'

const STUDENT_NAV = [
  { label: 'Student Profiles', to: '/student/profiles' },
]

const StudentProfile = () => {
  const [profiles, setProfiles] = useState([])
  const [search, setSearch]     = useState('')
  const [batchFilter, setBatchFilter] = useState('All')
  const [sortBy, setSortBy]     = useState('recent')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProfiles(parsed)
          return
        }
      }
    } catch (_) {
      /* ignore */
    }
    setProfiles(initialStudentProfiles)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
    } catch (_) {
      /* ignore */
    }
  }, [profiles])

  const handleAddProfile = async (payload) => {
    const newProfile = {
      ...payload,
      id: payload.id || `st-${Date.now()}`,
      createdAt: new Date().toISOString(),
      image: payload.image || '/RUET-logo.png',
    }
    setProfiles((prev) => [newProfile, ...prev])
  }

  const handleResetSamples = () => {
    setProfiles(initialStudentProfiles)
    setBatchFilter('All')
    setSearch('')
  }

  const batchOptions = useMemo(() => {
    const unique = new Set()
    profiles.forEach((p) => p.batch && unique.add(p.batch))
    return ['All', ...Array.from(unique).sort()]
  }, [profiles])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return [...profiles]
      .filter((p) => {
        if (batchFilter !== 'All' && p.batch !== batchFilter) return false
        if (!q) return true
        const blob = [p.name, p.studentId, p.batch, p.email, p.phone, (p.interests || []).join(' '), p.bio]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return blob.includes(q)
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        const aDate = new Date(a.createdAt || a.date || 0).getTime()
        const bDate = new Date(b.createdAt || b.date || 0).getTime()
        return bDate - aDate
      })
  }, [profiles, search, batchFilter, sortBy])

  const lastAdded = useMemo(() => {
    if (profiles.length === 0) return ''
    const sorted = [...profiles].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    const d = sorted[0].createdAt ? new Date(sorted[0].createdAt) : null
    return d && !Number.isNaN(d.getTime())
      ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : ''
  }, [profiles])

  return (
    <>
      <Breadcrumb current="Student Profiles" />

      <PageHeroBanner
        title="Student Profiles"
        navLinks={STUDENT_NAV}
        activeTo="/student/profiles"
      />

      <div
        className="w-screen bg-white"
        style={{
          paddingTop:   'clamp(2.5rem, 5vw, 5.5rem)',
          paddingLeft:  'clamp(1rem, 7vw, 9rem)',
          paddingRight: 'clamp(1rem, 7vw, 9rem)',
          paddingBottom:'clamp(2rem, 4vw, 4rem)',
        }}
      >
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1" style={{ gap: 'clamp(0.9rem, 1.5vw, 1.25rem)' }}>
          <div className="bg-[#F6F9FF] border border-light-blue rounded-xl p-4 flex flex-col" style={{ gap: '0.3rem' }}>
            <p className="text-gray-blue font-semibold" style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1.02rem)' }}>Profiles</p>
            <p className="font-spaceG text-dark-blue-1" style={{ fontSize: 'clamp(2rem, 2.6vw, 2.4rem)' }}>{profiles.length}</p>
            <p className="text-black/60" style={{ fontSize: 'clamp(0.85rem, 1vw, 0.95rem)' }}>Stored locally in your browser</p>
          </div>
          <div className="bg-[#F6F9FF] border border-light-blue rounded-xl p-4 flex flex-col" style={{ gap: '0.3rem' }}>
            <p className="text-gray-blue font-semibold" style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1.02rem)' }}>Batches represented</p>
            <p className="font-spaceG text-dark-blue-1" style={{ fontSize: 'clamp(2rem, 2.6vw, 2.4rem)' }}>{Math.max(0, batchOptions.length - 1)}</p>
            <p className="text-black/60" style={{ fontSize: 'clamp(0.85rem, 1vw, 0.95rem)' }}>Auto-generated from profiles</p>
          </div>
          <div className="bg-[#F6F9FF] border border-light-blue rounded-xl p-4 flex flex-col" style={{ gap: '0.3rem' }}>
            <p className="text-gray-blue font-semibold" style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1.02rem)' }}>Last added</p>
            <p className="font-spaceG text-dark-blue-1" style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)' }}>{lastAdded || '—'}</p>
            <p className="text-black/60" style={{ fontSize: 'clamp(0.85rem, 1vw, 0.95rem)' }}>Refresh-safe via localStorage</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] grid-cols-1" style={{ gap: 'clamp(1.1rem, 2vw, 1.5rem)', marginTop: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
          <StudentForm onAdd={handleAddProfile} />

          <div className="bg-white border border-light-blue rounded-2xl shadow-sm" style={{ padding: 'clamp(1rem, 2vw, 1.5rem)', gap: '0.6rem' }}>
            <h3 className="font-dmSans font-semibold text-black/90" style={{ fontSize: 'clamp(1.05rem, 1.35vw, 1.25rem)' }}>
              How this page works
            </h3>
            <ul className="list-disc pl-5 text-black/75" style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1rem)', lineHeight: 1.6 }}>
              <li>Profiles are stored in localStorage so you can export the page later.</li>
              <li>Use the filters below to find students by batch, name, or interest.</li>
              <li>Click “Reset samples” to restore the starter data set.</li>
            </ul>
            <div className="bg-blue/5 border border-blue/30 rounded-lg px-3 py-2 text-blue font-semibold" style={{ fontSize: 'clamp(0.88rem, 1.02vw, 0.98rem)' }}>
              No backend calls are made. Images stay in the browser for now.
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col lg:flex-row lg:items-center" style={{ gap: 'clamp(0.75rem, 1vw, 1rem)' }}>
          <div className="relative flex-1 min-w-[220px]">
            <input
              type="text"
              placeholder="Search name, ID, batch, interests"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-light-blue rounded-full bg-white px-4 py-2.5 font-medium text-black/80 outline-none"
              style={{ fontSize: 'clamp(0.92rem, 1.05vw, 1rem)' }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="absolute right-3 top-1/2 -translate-y-1/2 fill-gray-400"
              width={18}
              height={18}
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center" style={{ gap: '0.75rem' }}>
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="border border-light-blue bg-white rounded-full px-3 py-2 text-black/80 outline-none"
              style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1rem)' }}
            >
              {batchOptions.map((opt) => (
                <option key={opt} value={opt}>{opt === 'All' ? 'All batches' : `Batch ${opt}`}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-light-blue bg-white rounded-full px-3 py-2 text-black/80 outline-none"
              style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1rem)' }}
            >
              <option value="recent">Newest first</option>
              <option value="name">Name A→Z</option>
            </select>

            <button
              onClick={handleResetSamples}
              className="text-blue border border-blue rounded-full px-4 py-2 font-semibold hover:bg-blue/10 transition-colors duration-200"
              style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1rem)' }}
            >
              Reset samples
            </button>
          </div>
        </div>

        <div className="mt-6">
          {filtered.length === 0 ? (
            <div className="border border-light-blue rounded-xl bg-[#F8FBFF] text-center py-12 px-6 text-black/70 font-poppins" style={{ fontSize: 'clamp(0.95rem, 1.05vw, 1rem)' }}>
              No profiles match your filters. Try clearing the search or batch filter.
            </div>
          ) : (
            <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1" style={{ gap: 'clamp(1rem, 1.6vw, 1.5rem)' }}>
              {filtered.map((profile) => (
                <StudentCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default StudentProfile
