import { useEffect, useState } from 'react'

import Breadcrumb from '../../components/quickMenu/Breadcrumb'
import PageHeroBanner from '../../components/quickMenu/PageHeroBanner'
import { FACULTY_NAV } from '../../constants/facultyNav'
import { loadFacultyData } from '../../services/facultyData'

const StaffCard = ({ person }) => {
  return (
    <div className="border border-light-blue rounded-xl overflow-hidden bg-white">
      <div className="p-5 flex gap-4">
        <img
          src={person.photoUrl || '/demoPhoto/1.webp'}
          alt={person.name}
          className="w-16 h-16 rounded-lg object-cover border border-light-blue"
        />
        <div className="min-w-0 font-poppins">
          <h3 className="font-semibold text-base text-dark-blue-2 truncate">{person.name}</h3>
          <p className="text-sm text-gray-blue font-medium">{person.designation}</p>
          <div className="mt-2 text-xs text-gray-blue space-y-1">
            {person.email && (
              <a className="block hover:text-blue truncate" href={`mailto:${person.email}`}>{person.email}</a>
            )}
            {person.phone && <p className="truncate">{person.phone}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

const OfficerStaff = () => {
  const [staff, setStaff] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setError('')
        const data = await loadFacultyData({ bustCache: true })
        if (!mounted) return
        setStaff(data.staff)
      } catch (_) {
        if (!mounted) return
        setStaff([])
        setError('Could not load faculty.json. Please ensure frontend/public/faculty.json exists.')
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <>
      <Breadcrumb current="Officer & Staff" />
      <PageHeroBanner title="Faculty" navLinks={FACULTY_NAV} activeTo="/faculty/staff" />

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
              Officer &amp; Staff
            </p>
          </div>

          <div className="border border-light-blue border-t-0 p-6">
            {error ? (
              <div className="font-poppins text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            ) : staff.length === 0 ? (
              <div className="font-poppins text-gray-blue">No staff data found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {staff.map((p) => (
                  <StaffCard key={p.id || p.email || p.name} person={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default OfficerStaff
