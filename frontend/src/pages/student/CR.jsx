import { useEffect, useMemo, useState } from 'react'
import { BATCHES, SECTIONS } from '../../constants/crData'
import { loadStudentAccounts } from '../../services/studentAccounts'
import './CR.css'

// ── helpers ───────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

const SECTION_COLORS = { A: 'cr-sec--blue', B: 'cr-sec--teal', C: 'cr-sec--amber' }

// ── CRCard ────────────────────────────────────────────────────────────────────
const CRCard = ({ student }) => (
  <div className={`cr-card ${student.isCR ? 'cr-card--active' : 'cr-card--dim'}`}>
    <div className="cr-card-top">
      <div className="cr-avatar">
        {student.photoDataUrl
          ? <img src={student.photoDataUrl} alt={student.name} className="cr-avatar-img" />
          : <span className="cr-avatar-initials">{getInitials(student.name)}</span>}
      </div>
      <div className="cr-name-wrap">
        <p className="cr-name">{student.name}</p>
        <p className="cr-id">{student.studentId}</p>
      </div>
      {student.isCR && <span className="cr-badge">CR</span>}
    </div>
    <div className="cr-card-bottom">
      <span className={`cr-section-pill ${SECTION_COLORS[student.section]}`}>
        Section {student.section}
      </span>
      <a href={`mailto:${student.email}`} className="cr-email">{student.email}</a>
    </div>
  </div>
)

// ── Main Page ─────────────────────────────────────────────────────────────────
const CR = () => {
  const [activeBatch, setActiveBatch] = useState('all')
  const [students, setStudents] = useState([])
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoadError('')
        const accounts = await loadStudentAccounts({ bustCache: true })
        if (!mounted) return
        setStudents(accounts)
      } catch (_) {
        if (!mounted) return
        setStudents([])
        setLoadError('Could not load student list from backend API.')
      }
    })()
    return () => { mounted = false }
  }, [])

  const filteredStudents = useMemo(() => {
    const batchFiltered = activeBatch === 'all'
      ? students
      : students.filter(s => s.batch === activeBatch)

    const q = query.trim().toLowerCase()
    if (!q) return batchFiltered

    return batchFiltered.filter(s => {
      const haystack = `${s?.name || ''} ${s?.studentId || ''} ${s?.email || ''}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [activeBatch, students, query])

  // group by batch → section
  const grouped = {}
  filteredStudents.forEach(student => {
    if (!grouped[student.batch]) grouped[student.batch] = {}
    if (!grouped[student.batch][student.section]) grouped[student.batch][student.section] = []
    grouped[student.batch][student.section].push(student)
  })

  const batchKeys = Object.keys(grouped).sort()

  return (
    <div className="cr-page font-inter">
      {/* ── Hero banner ── */}
      <div className="cr-hero">
        <div className="cr-hero-inner">
          <p className="cr-hero-label">RUET · Department of CSE</p>
          <h1 className="cr-hero-title">Class Representatives</h1>
          <p className="cr-hero-sub">
            Meet the student leaders of each section across all active batches.
          </p>
        </div>
      </div>

      {/* ── Demo message ── */}
      <div className="cr-message-wrap">
        <div className="cr-message">
          <p className="cr-message-title">Message</p>
          <p className="cr-message-body">
            This is a demo message for the CR page. For class updates, announcements, and support, feel free to reach out to your section CRs.
          </p>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="cr-filter-wrap">
        <div className="cr-filter">
          <button
            className={`cr-tab ${activeBatch === 'all' ? 'cr-tab--on' : ''}`}
            onClick={() => setActiveBatch('all')}
          >All Batches</button>
          {BATCHES.map(b => (
            <button
              key={b}
              className={`cr-tab ${activeBatch === b ? 'cr-tab--on' : ''}`}
              onClick={() => setActiveBatch(b)}
            >Batch {b}</button>
          ))}
        </div>

        <div className="cr-search-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search CR by name / ID / email"
            className="cr-search"
            aria-label="Search class representatives"
          />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="cr-content">
        {loadError && (
          <div className="cr-load-error">{loadError}</div>
        )}
        {batchKeys.map(batch => (
          <div key={batch} className="cr-batch-block">
            {/* batch heading */}
            <div className="cr-batch-header">
              <span className="cr-batch-tag">Batch {batch}</span>
              <span className="cr-batch-series">Series {batch}00</span>
            </div>

            {/* sections */}
            {SECTIONS.map(sec => {
              const students = grouped[batch]?.[sec]
              if (!students) return null
              return (
                <div key={sec} className="cr-section-block">
                  <div className="cr-section-label">
                    <span className={`cr-sec-dot ${SECTION_COLORS[sec]}`} />
                    Section {sec}
                  </div>
                  <div className="cr-cards-row">
                    {students.map(s => (
                      <CRCard key={s.studentId} student={s} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CR
