import { useEffect, useMemo, useState } from 'react'

import Breadcrumb from '../../components/quickMenu/Breadcrumb'
import PageHeroBanner from '../../components/quickMenu/PageHeroBanner'
import { FACULTY_NAV } from '../../constants/facultyNav'
import { loadFacultyData } from '../../services/facultyData'

const FACULTY_SECTIONS = [
  { key: 'Professor', title: 'Professors' },
  { key: 'Associate Professor', title: 'Associate Professors' },
  { key: 'Assistant Professor', title: 'Assistant Professors' },
  { key: 'Lecturer', title: 'Lecturers' },
]

const MemberCard = ({ member }) => {
  const Wrapper = member?.profileUrl ? 'a' : 'div'
  const wrapperProps = member?.profileUrl
    ? { href: member.profileUrl, target: '_blank', rel: 'noreferrer' }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className="border border-light-blue rounded-xl overflow-hidden bg-white h-full block hover:border-blue/60 hover:bg-blue-50/20 transition-colors"
    >
      <div className="p-5 flex gap-4">
        <img
          src={member.photoUrl || '/demoPhoto/1.webp'}
          alt={member.name}
          className="w-16 h-16 rounded-lg object-cover border border-light-blue"
        />
        <div className="min-w-0 font-poppins">
          <h3 className="font-semibold text-base text-dark-blue-2 truncate">{member.name}</h3>
          {(member.designation || member.onLeave) && (
            <p className="text-sm text-gray-blue font-medium">
              {member.designation}
              {member.onLeave ? (
                <span className="ml-2 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-700">
                  On Leave
                </span>
              ) : null}
            </p>
          )}
          {member.departmentShort && (
            <p className="mt-1 text-xs text-gray-blue">{member.departmentShort}</p>
          )}
        </div>
      </div>
    </Wrapper>
  )
}

const FacultyMembers = () => {
  const [members, setMembers] = useState([])
  const [head, setHead] = useState(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setError('')
        const data = await loadFacultyData({ bustCache: true })
        if (!mounted) return
        setMembers(data.members)
        setHead(data.head)
      } catch (_) {
        if (!mounted) return
        setMembers([])
        setHead(null)
        setError('Could not load faculty.json. Please ensure frontend/public/faculty.json exists.')
      }
    })()
    return () => { mounted = false }
  }, [])

  const groupedSections = useMemo(() => {
    const q = query.trim().toLowerCase()
    const baseMembers = q
      ? members.filter((m) => {
        const haystack = `${m?.name || ''} ${m?.designation || ''}`.toLowerCase()
        return haystack.includes(q)
      })
      : members

    const byKey = new Map([['Other', []]])
    for (const section of FACULTY_SECTIONS) byKey.set(section.key, [])

    for (const member of baseMembers) {
      const designation = (member?.designation || '').trim()
      const match = FACULTY_SECTIONS.find(
        (s) => s.key.toLowerCase() === designation.toLowerCase()
      )
      const key = match ? match.key : 'Other'
      byKey.get(key).push(member)
    }

    const sortByName = (a, b) => (a?.name || '').localeCompare(b?.name || '')

    const sections = FACULTY_SECTIONS
      .map((s) => ({ ...s, items: byKey.get(s.key).sort(sortByName) }))
      .filter((s) => s.items.length > 0)

    const otherItems = byKey.get('Other').sort(sortByName)
    if (otherItems.length > 0) {
      sections.push({ key: 'Other', title: 'Other Faculty', items: otherItems })
    }

    return sections
  }, [members, query])

  return (
    <>
      <Breadcrumb current="Faculty Members" />
      <PageHeroBanner title="Faculty" navLinks={FACULTY_NAV} activeTo="/faculty/members" />

      <div
        className="w-screen bg-white mb-10"
        style={{
          paddingTop: 'clamp(2.5rem, 5vw, 6rem)',
          paddingLeft: 'clamp(1rem, 7vw, 10rem)',
          paddingRight: 'clamp(1rem, 7vw, 10rem)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between font-semibold bg-blue font-inter">
            <p className="text-white px-5 py-2" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.125rem)' }}>
              Faculty Members
            </p>
          </div>

          <div className="border border-light-blue border-t-0 p-6">
            {error ? (
              <div className="font-poppins text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            ) : (
              <>
                <div className="mb-6 font-poppins">
                  <label className="block text-sm font-semibold text-dark-blue-2 mb-2" htmlFor="faculty-search">
                    Search faculty member
                  </label>
                  <input
                    id="faculty-search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type a name (e.g., Mamun, Mondal, Shahid…)"
                    className="w-full max-w-xl rounded-lg border border-light-blue px-4 py-2 text-sm text-dark-blue-2 placeholder:text-gray-blue/70 focus:outline-none focus:ring-2 focus:ring-blue/30"
                  />
                </div>

                {head && (
                  <div className="mb-6 font-poppins">
                    <p className="text-sm text-gray-blue mb-2">Department Head</p>
                    <a
                      href={head.profileUrl || '#'}
                      target={head.profileUrl ? '_blank' : undefined}
                      rel={head.profileUrl ? 'noreferrer' : undefined}
                      className={
                        head.profileUrl
                          ? 'inline-flex flex-col items-center text-center gap-3 border border-light-blue rounded-xl bg-white p-5 hover:border-blue/60 hover:bg-blue-50/20 transition-colors'
                          : 'inline-flex flex-col items-center text-center gap-3 border border-light-blue rounded-xl bg-white p-5'
                      }
                      aria-label={head.profileUrl ? `Open ${head.name} official profile` : undefined}
                    >
                      <img
                        src={head.photoUrl || '/demoPhoto/1.webp'}
                        alt={head.name}
                        className="w-24 h-24 rounded-xl object-cover border border-light-blue"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-blue truncate">{head.name}</div>
                        {head.designation && (
                          <div className="text-sm text-gray-blue font-medium">{head.designation}</div>
                        )}
                      </div>
                    </a>
                  </div>
                )}

                {groupedSections.length === 0 ? (
                  <div className="font-poppins text-gray-blue">No faculty members found.</div>
                ) : (
                  <div className="space-y-8">
                    {groupedSections.map((section) => (
                      <div key={section.key}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-inter font-semibold text-dark-blue-2">{section.title}</h3>
                          <span className="text-xs font-poppins text-gray-blue">{section.items.length}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {section.items.map((m) => (
                            <MemberCard key={m.profileUrl || m.id || m.email || m.name} member={m} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default FacultyMembers
