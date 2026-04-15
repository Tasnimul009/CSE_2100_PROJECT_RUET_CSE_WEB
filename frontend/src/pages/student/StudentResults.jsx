import { useEffect, useMemo, useState } from 'react'

import Breadcrumb from '../../components/quickMenu/Breadcrumb'
import PageHeroBanner from '../../components/quickMenu/PageHeroBanner'

import { useAuth } from '../../context/AuthContext'
import { loadStudentAccounts } from '../../services/studentAccounts'

const STUDENT_NAV = [
  { label: 'Dashboard', to: '/student' },
  { label: 'Results', to: '/student/results' },
]

const buildSemestersForBatch = (batch) => {
  const b = Number.parseInt(String(batch || '').trim(), 10)

  // Based on your requirement:
  // 23 → 2 semesters (1-1, 1-2)
  // 22 → 4 semesters (1-1 ... 2-2)
  // 21 → 6 semesters (1-1 ... 3-2)
  // 20 → 7 semesters (1-1 ... 4-1)
  let count = 0
  if (b === 23) count = 2
  else if (b === 22) count = 4
  else if (b === 21) count = 6
  else if (b === 20) count = 7
  else if (Number.isFinite(b)) count = 8 // default template (up to 4-2)
  else count = 0

  const semesters = []
  for (let year = 1; year <= 4; year += 1) {
    for (let sem = 1; sem <= 2; sem += 1) {
      semesters.push(`${year}-${sem}`)
    }
  }

  return semesters.slice(0, Math.max(0, count))
}

const gradeToPoint = (grade) => {
  const g = String(grade || '').trim().toUpperCase()
  const map = {
    'A+': 4.0,
    A: 3.75,
    'A-': 3.5,
    'B+': 3.25,
    B: 3.0,
    'B-': 2.75,
    'C+': 2.5,
    C: 2.25,
    D: 2.0,
    F: 0.0,
  }
  return Object.prototype.hasOwnProperty.call(map, g) ? map[g] : null
}

const computeGpa = (courses) => {
  const list = Array.isArray(courses) ? courses : []
  let totalCredits = 0
  let totalPoints = 0

  for (const c of list) {
    const credits = Number(c?.credits)
    const gp = gradeToPoint(c?.grade)
    if (!Number.isFinite(credits) || credits <= 0) continue
    if (gp == null) continue
    totalCredits += credits
    totalPoints += gp * credits
  }

  if (totalCredits <= 0) return { gpa: null, credits: null }
  return { gpa: totalPoints / totalCredits, credits: totalCredits }
}

const StudentResults = () => {
  const { user } = useAuth()
  const [batch, setBatch] = useState('')
  const [loadError, setLoadError] = useState('')
  const [activeSemester, setActiveSemester] = useState('')
  const [resultsDb, setResultsDb] = useState(null)
  const [resultsError, setResultsError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoadError('')
        const accounts = await loadStudentAccounts()

        const username = String(user?.username || '').trim()
        const studentId = String(user?.studentId || '').trim()

        const matched = accounts.find((a) => {
          if (!a) return false
          if (username && a.username === username) return true
          if (studentId && a.studentId === studentId) return true
          return false
        })

        if (!mounted) return

        const nextBatch = matched?.batch || ''
        setBatch(nextBatch)

        const sems = buildSemestersForBatch(nextBatch)
        setActiveSemester((prev) => prev || sems[0] || '')
      } catch (_) {
        if (!mounted) return
        setLoadError('Could not load academic template from student backend data.')
      }
    })()

    return () => { mounted = false }
  }, [user?.username, user?.studentId])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setResultsError('')
        const res = await fetch('/results.json', { cache: 'no-store' })
        if (!res.ok) {
          if (!mounted) return
          setResultsDb(null)
          return
        }
        const raw = await res.json()
        if (!mounted) return
        setResultsDb(raw)
      } catch (_) {
        if (!mounted) return
        setResultsDb(null)
        setResultsError('Could not load results.json')
      }
    })()
    return () => { mounted = false }
  }, [])

  const semesterOptions = useMemo(() => buildSemestersForBatch(batch), [batch])

  const studentKey = String(user?.studentId || user?.username || '').trim()
  const studentResults = studentKey && resultsDb?.students ? resultsDb.students[studentKey] : null
  const semesterResult = activeSemester && studentResults?.semesters ? studentResults.semesters[activeSemester] : null
  const courses = Array.isArray(semesterResult?.courses) ? semesterResult.courses : []

  const computed = useMemo(() => {
    if (!semesterResult) return { gpa: null, credits: null }
    const gpa = Number(semesterResult?.gpa)
    const credits = Number(semesterResult?.credits)
    if (Number.isFinite(gpa) && Number.isFinite(credits)) return { gpa, credits }
    return computeGpa(courses)
  }, [semesterResult, courses])

  return (
    <>
      <Breadcrumb current="Results" />

      <PageHeroBanner
        title="Academic Report"
        navLinks={STUDENT_NAV}
        activeTo="/student/results"
      />

      <section
        className="w-screen bg-white"
        style={{
          paddingTop: 'clamp(2.2rem, 4vw, 4rem)',
          paddingBottom: 'clamp(2.2rem, 4vw, 4rem)',
          paddingLeft: 'clamp(1rem, 6vw, 7rem)',
          paddingRight: 'clamp(1rem, 6vw, 7rem)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#F8FBFF] border border-light-blue rounded-2xl" style={{ padding: 'clamp(1rem, 2.3vw, 2rem)' }}>
            <h2 className="font-dmSans font-semibold text-dark-blue-1" style={{ fontSize: 'clamp(1.25rem, 1.8vw, 1.8rem)' }}>
              {user?.name ? `${user.name}'s Academic Report` : 'Academic Report'}
            </h2>
            <p className="text-gray-blue mt-1" style={{ fontSize: 'clamp(0.92rem, 1.05vw, 1rem)' }}>
              Design preview — reads from public/results.json when available.
            </p>

            {loadError && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm font-medium">
                {loadError}
              </div>
            )}

            {resultsError && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm font-medium">
                {resultsError}
              </div>
            )}

            <div className="mt-5 grid md:grid-cols-3 grid-cols-1" style={{ gap: '1rem' }}>
              <div className="md:col-span-1 bg-white border border-light-blue rounded-xl" style={{ padding: '1rem' }}>
                <p className="font-semibold text-black/80">Student</p>
                <div className="mt-2 text-black/70" style={{ lineHeight: 1.8, fontSize: '0.95rem' }}>
                  <p><strong>ID:</strong> {user?.studentId || 'N/A'}</p>
                  <p><strong>Username:</strong> {user?.username || 'N/A'}</p>
                  <p><strong>Batch:</strong> {batch || 'N/A'}</p>
                </div>

                <div className="mt-5">
                  <p className="font-semibold text-black/80">Semesters</p>
                  {semesterOptions.length === 0 ? (
                    <p className="text-gray-blue mt-2" style={{ fontSize: '0.95rem' }}>
                      No semester template found for this batch.
                    </p>
                  ) : (
                    <div className="mt-3 flex flex-wrap" style={{ gap: '0.5rem' }}>
                      {semesterOptions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setActiveSemester(s)}
                          className={
                            `rounded-full px-4 py-2 font-semibold border transition-colors duration-200 ` +
                            (activeSemester === s
                              ? 'bg-blue text-white border-blue'
                              : 'bg-white text-blue border-blue hover:bg-blue/10')
                          }
                          style={{ fontSize: '0.9rem' }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 bg-white border border-light-blue rounded-xl" style={{ padding: '1rem' }}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-semibold text-black/85" style={{ fontSize: '1.05rem' }}>
                      Semester {activeSemester || '—'}
                    </p>
                    <p className="text-gray-blue" style={{ fontSize: '0.95rem' }}>
                      {semesterResult ? 'Showing sample results from results.json.' : 'No results found for this semester (showing placeholders).'}
                    </p>
                  </div>

                  <div className="flex items-center" style={{ gap: '0.6rem' }}>
                    <span className="bg-light-blue text-dark-blue-1 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      GPA: {computed.gpa == null ? '—' : computed.gpa.toFixed(2)}
                    </span>
                    <span className="bg-light-blue text-dark-blue-1 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      Credits: {computed.credits == null ? '—' : computed.credits}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border border-light-blue rounded-lg overflow-hidden">
                  <div className="grid grid-cols-[1.2fr_0.4fr_0.4fr] bg-[#F6F9FF] text-black/70 font-semibold" style={{ padding: '0.7rem 0.85rem', fontSize: '0.9rem' }}>
                    <div>Course</div>
                    <div className="text-center">Grade</div>
                    <div className="text-center">Credits</div>
                  </div>

                  {courses.length > 0 ? (
                    courses.map((c, i) => (
                      <div
                        key={`${c?.code || 'course'}-${i}`}
                        className="grid grid-cols-[1.2fr_0.4fr_0.4fr] border-t border-light-blue text-black/70"
                        style={{ padding: '0.7rem 0.85rem', fontSize: '0.92rem' }}
                      >
                        <div className="truncate">
                          {[c?.code, c?.title].filter(Boolean).join(' — ') || `Course ${i + 1}`}
                        </div>
                        <div className="text-center">{c?.grade || '—'}</div>
                        <div className="text-center">{c?.credits ?? '—'}</div>
                      </div>
                    ))
                  ) : (
                    [1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[1.2fr_0.4fr_0.4fr] border-t border-light-blue text-black/70"
                        style={{ padding: '0.7rem 0.85rem', fontSize: '0.92rem' }}
                      >
                        <div className="truncate">Course Title Placeholder {i}</div>
                        <div className="text-center">—</div>
                        <div className="text-center">—</div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-4 bg-blue/5 border border-blue/30 rounded-lg px-3 py-2 text-blue font-semibold" style={{ fontSize: '0.92rem' }}>
                  Later you can connect real results from a backend.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default StudentResults
