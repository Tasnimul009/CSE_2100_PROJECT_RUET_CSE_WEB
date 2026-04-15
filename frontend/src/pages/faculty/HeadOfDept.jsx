import { useEffect, useState } from 'react'

import Breadcrumb from '../../components/quickMenu/Breadcrumb'
import PageHeroBanner from '../../components/quickMenu/PageHeroBanner'
import { FACULTY_NAV } from '../../constants/facultyNav'
import { loadFacultyData } from '../../services/facultyData'

const HeadOfDept = () => {
  const [head, setHead] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setError('')
        const data = await loadFacultyData({ bustCache: true })
        if (!mounted) return
        setHead(data.head)
      } catch (_) {
        if (!mounted) return
        setHead(null)
        setError('Could not load faculty.json. Please ensure frontend/public/faculty.json exists.')
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <>
      <Breadcrumb current="Head of Department" />
      <PageHeroBanner title="Faculty" navLinks={FACULTY_NAV} activeTo="/faculty/head" />

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
              Head of Department
            </p>
          </div>

          <div className="border border-light-blue border-t-0 p-6">
            {error ? (
              <div className="font-poppins text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            ) : head ? (
              <div className="border border-light-blue rounded-xl overflow-hidden bg-white">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  <a
                    href={head.profileUrl || '#'}
                    target={head.profileUrl ? '_blank' : undefined}
                    rel={head.profileUrl ? 'noreferrer' : undefined}
                    className={head.profileUrl ? 'shrink-0' : 'shrink-0 pointer-events-none'}
                    aria-label={head.profileUrl ? `Open ${head.name} official profile` : undefined}
                  >
                    <img
                      src={head.photoUrl || '/demoPhoto/1.webp'}
                      alt={head.name}
                      className="w-44 h-44 rounded-xl object-cover border border-light-blue"
                    />
                  </a>
                  <div className="flex-1 min-w-0 font-poppins">
                    {head.profileUrl ? (
                      <a
                        href={head.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block font-semibold text-2xl text-dark-blue-2 hover:underline"
                      >
                        {head.name}
                      </a>
                    ) : (
                      <h2 className="font-semibold text-2xl text-dark-blue-2">{head.name}</h2>
                    )}
                    <p className="text-gray-blue font-medium mt-1">{head.designation}</p>
                    {head.department && (
                      <p className="text-gray-blue/90 mt-1">{head.department}</p>
                    )}

                    {head.profileUrl && (
                      <div className="mt-4">
                        <a
                          href={head.profileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-lg bg-blue px-4 py-2 text-white font-semibold hover:bg-dark-blue transition-colors"
                        >
                          Open Official Profile
                        </a>
                      </div>
                    )}

                    {(head.email || head.phone || head.office) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-sm text-gray-blue">
                        {head.email && (
                          <a className="hover:text-blue" href={`mailto:${head.email}`}>{head.email}</a>
                        )}
                        {head.phone && <p>{head.phone}</p>}
                        {head.office && <p className="sm:col-span-2">Office: {head.office}</p>}
                      </div>
                    )}

                    {head.bio && (
                      <p className="mt-5 text-gray-blue leading-relaxed">
                        {head.bio}
                      </p>
                    )}

                    {head.message && (
                      <div className="mt-6 border border-light-blue rounded-xl bg-white p-5">
                        <p className="font-inter font-semibold text-dark-blue-2">Message from the Head</p>
                        <p className="mt-2 font-poppins text-gray-blue leading-relaxed">{head.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="font-poppins text-gray-blue">No head data found.</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default HeadOfDept
