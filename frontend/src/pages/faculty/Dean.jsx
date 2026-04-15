import { useEffect, useState } from 'react'

import Breadcrumb from '../../components/quickMenu/Breadcrumb'
import PageHeroBanner from '../../components/quickMenu/PageHeroBanner'
import { FACULTY_NAV } from '../../constants/facultyNav'
import { loadFacultyData } from '../../services/facultyData'

const PersonCard = ({ person }) => {
  if (!person) return null

  const hasContact = Boolean(person.email || person.phone || person.office)

  return (
    <div className="border border-light-blue rounded-xl overflow-hidden bg-white">
      <div className="flex flex-col sm:flex-row gap-6 p-6">
        <img
          src={person.photoUrl || '/demoPhoto/1.webp'}
          alt={person.name}
          className="w-36 h-36 rounded-xl object-cover border border-light-blue"
        />
        <div className="flex-1 min-w-0 font-poppins">
          <h2 className="font-semibold text-xl text-dark-blue-2">{person.name}</h2>
          <p className="text-gray-blue font-medium mt-1">{person.designation}</p>
          {person.department && (
            <p className="text-gray-blue/90 mt-1">{person.department}</p>
          )}

          {hasContact && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-sm text-gray-blue">
              {person.email && (
                <a className="hover:text-blue" href={`mailto:${person.email}`}>{person.email}</a>
              )}
              {person.phone && <p>{person.phone}</p>}
              {person.office && <p className="md:col-span-2">Office: {person.office}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const Dean = () => {
  const [dean, setDean] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setError('')
        const data = await loadFacultyData({ bustCache: true })
        if (!mounted) return
        setDean(data.dean)
      } catch (e) {
        if (!mounted) return
        setDean(null)
        setError('Could not load faculty.json. Please ensure frontend/public/faculty.json exists.')
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <>
      <Breadcrumb current="Dean" />
      <PageHeroBanner title="Faculty" navLinks={FACULTY_NAV} activeTo="/faculty/dean" />

      <div
        className="w-screen bg-white mb-10"
        style={{
          paddingTop: 'clamp(2.5rem, 5vw, 6rem)',
          paddingLeft: 'clamp(1rem, 7vw, 10rem)',
          paddingRight: 'clamp(1rem, 7vw, 10rem)',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between font-semibold bg-blue font-inter">
            <p className="text-white px-5 py-2" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.125rem)' }}>
              Dean
            </p>
          </div>

          <div className="border border-light-blue border-t-0 p-6">
            {error ? (
              <div className="font-poppins text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            ) : (
              <>
                <PersonCard person={dean} />
                {dean?.message && (
                  <div className="mt-6 border border-light-blue rounded-xl bg-white p-6">
                    <p className="font-inter font-semibold text-dark-blue-2">Message from the Dean</p>
                    <p className="mt-2 font-poppins text-gray-blue leading-relaxed">{dean.message}</p>
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

export default Dean
