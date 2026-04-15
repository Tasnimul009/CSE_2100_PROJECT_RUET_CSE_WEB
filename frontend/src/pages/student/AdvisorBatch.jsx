import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Breadcrumb from '../../components/quickMenu/Breadcrumb'
import PageHeroBanner from '../../components/quickMenu/PageHeroBanner'
import { BATCHES, SECTIONS } from '../../constants/crData'
import { loadFacultyData } from '../../services/facultyData'

const STUDENT_NAV = [
  { label: 'Advisor', to: '/student/advisor' },
  { label: 'Class Representative (CR)', to: '/student/cr' },
]

function hashToIndex(seed, mod) {
  // Simple deterministic hash (djb2-ish)
  let h = 5381
  for (let i = 0; i < seed.length; i += 1) {
    h = ((h << 5) + h) ^ seed.charCodeAt(i)
  }
  const n = Math.abs(h)
  return mod > 0 ? (n % mod) : 0
}

const AdvisorCard = ({ teacher }) => {
  const Wrapper = teacher?.profileUrl ? 'a' : 'div'
  const wrapperProps = teacher?.profileUrl
    ? { href: teacher.profileUrl, target: '_blank', rel: 'noreferrer' }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className="border border-light-blue rounded-xl overflow-hidden bg-white block hover:border-blue/60 hover:bg-blue-50/20 transition-colors"
    >
      <div className="p-5 flex gap-4">
        <img
          src={teacher.photoUrl || '/demoPhoto/1.webp'}
          alt={teacher.name}
          className="w-16 h-16 rounded-lg object-cover border border-light-blue"
          loading="lazy"
        />
        <div className="min-w-0 font-poppins">
          <h3 className="font-semibold text-base text-dark-blue-2 truncate">{teacher.name}</h3>
          {teacher.designation && (
            <p className="text-sm text-gray-blue font-medium">{teacher.designation}</p>
          )}
          {teacher.departmentShort && (
            <p className="mt-1 text-xs text-gray-blue">{teacher.departmentShort}</p>
          )}
        </div>
      </div>
    </Wrapper>
  )
}

const AdvisorBatch = () => {
  const { batch } = useParams()
  const [members, setMembers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setError('')
        const data = await loadFacultyData({ bustCache: true })
        if (!mounted) return
        setMembers(data.members)
      } catch (_) {
        if (!mounted) return
        setMembers([])
        setError('Could not load faculty.json. Please ensure frontend/public/faculty.json exists.')
      }
    })()
    return () => { mounted = false }
  }, [])

  const isValidBatch = BATCHES.includes(String(batch || ''))

  const advisors = useMemo(() => {
    const list = Array.isArray(members) ? members : []
    const eligible = list.filter(m => m?.isAdvisor)
    const pool = eligible.length > 0 ? eligible : list

    const chosen = new Map()
    const usedUrls = new Set()

    for (const section of SECTIONS) {
      if (pool.length === 0) {
        chosen.set(section, null)
        continue
      }

      let idx = hashToIndex(`${batch}-${section}`, pool.length)
      let guard = 0
      while (guard < pool.length && usedUrls.has(pool[idx]?.profileUrl)) {
        idx = (idx + 1) % pool.length
        guard += 1
      }

      const pick = pool[idx] || null
      if (pick?.profileUrl) usedUrls.add(pick.profileUrl)
      chosen.set(section, pick)
    }

    return chosen
  }, [members, batch])

  return (
    <>
      <Breadcrumb current={`Advisor · Batch ${batch || ''}`} />

      <PageHeroBanner
        title="Advisor"
        navLinks={STUDENT_NAV}
        activeTo="/student/advisor"
      />

      <section
        className="w-screen bg-white mb-10"
        style={{
          paddingTop: 'clamp(2.5rem, 5vw, 6rem)',
          paddingLeft: 'clamp(1rem, 7vw, 10rem)',
          paddingRight: 'clamp(1rem, 7vw, 10rem)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between font-semibold bg-blue font-inter">
            <p className="text-white px-5 py-2" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.125rem)' }}>
              Batch {batch}
            </p>
            <Link to="/student/advisor" className="text-white/90 hover:text-white px-5 py-2 font-poppins text-sm">
              Change batch
            </Link>
          </div>

          <div className="border border-light-blue border-t-0 p-6">
            {!isValidBatch ? (
              <div className="font-poppins text-gray-blue">
                Invalid batch. Please select from: {BATCHES.slice().sort((a, b) => Number(b) - Number(a)).join(', ')}.
              </div>
            ) : error ? (
              <div className="font-poppins text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SECTIONS.map((sec) => {
                  const teacher = advisors.get(sec)
                  return (
                    <div key={sec} className="font-poppins">
                      {teacher ? (
                        <AdvisorCard teacher={teacher} />
                      ) : (
                        <div className="border border-light-blue rounded-xl bg-white p-5 text-gray-blue">
                          No advisor available
                        </div>
                      )}
                      <div className="mt-2 text-center text-sm font-semibold text-gray-blue">
                        Section {sec}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default AdvisorBatch
