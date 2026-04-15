import { Link } from 'react-router-dom'

import Breadcrumb from '../../components/quickMenu/Breadcrumb'
import PageHeroBanner from '../../components/quickMenu/PageHeroBanner'
import { BATCHES } from '../../constants/crData'

const STUDENT_NAV = [
  { label: 'Advisor', to: '/student/advisor' },
  { label: 'Class Representative (CR)', to: '/student/cr' },
]

const Advisor = () => {
  const sorted = [...BATCHES].sort((a, b) => Number(b) - Number(a))

  return (
    <>
      <Breadcrumb current="Advisor" />

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
          <div className="flex justify-between font-semibold bg-blue font-inter">
            <p className="text-white px-5 py-2" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.125rem)' }}>
              Select Batch
            </p>
          </div>

          <div className="border border-light-blue border-t-0 p-6">
            <div className="font-poppins text-gray-blue mb-5">
              Choose a batch to view section-wise advisors.
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {sorted.map((b) => (
                <Link
                  key={b}
                  to={`/student/advisor/${b}`}
                  className="border border-light-blue bg-white rounded-xl px-4 py-3 font-poppins font-semibold text-dark-blue-2 hover:border-blue/60 hover:bg-blue-50/20 transition-colors text-center"
                >
                  Batch {b}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Advisor
