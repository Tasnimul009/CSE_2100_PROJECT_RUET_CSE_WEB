import Breadcrumb from "../quickMenu/Breadcrumb"
import PageHeroBanner from "../quickMenu/PageHeroBanner"
import { FACILITIES_NAV } from "../../constants/facilitiesData"

const FacilityPage = ({ facility, activeTo }) => {
  if (!facility) {
    return (
      <>
        <Breadcrumb current="Facilities" />
        <PageHeroBanner title="Facilities" navLinks={FACILITIES_NAV} activeTo={activeTo} />
        <div className="w-screen py-14 px-6 text-center text-gray-blue">Facility information not found.</div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb current={facility.label} />
      <PageHeroBanner title="Facilities" navLinks={FACILITIES_NAV} activeTo={activeTo} />

      <div
        className="w-screen bg-white mb-10"
        style={{
          paddingTop: "clamp(2.5rem, 5vw, 6rem)",
          paddingLeft: "clamp(1rem, 7vw, 10rem)",
          paddingRight: "clamp(1rem, 7vw, 10rem)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between font-semibold bg-blue font-inter">
            <p className="text-white px-5 py-2" style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.125rem)" }}>
              {facility.label}
            </p>
          </div>

          <div className="border border-light-blue border-t-0 p-6 md:p-8 lg:p-10 bg-white">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
              <div>
                <p className="font-inter text-xs sm:text-sm font-semibold tracking-[0.18em] text-blue uppercase mb-3">
                  {facility.tagline}
                </p>

                <h1 className="font-inter text-dark-blue-2 font-bold leading-tight text-2xl sm:text-3xl lg:text-4xl">
                  {facility.title}
                </h1>

                <p className="font-poppins text-gray-blue mt-5 leading-relaxed text-sm sm:text-base">
                  {facility.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-7">
                  {facility.stats.map((item) => (
                    <div key={item.label} className="rounded-xl border border-light-blue bg-[#f8fbff] px-4 py-3">
                      <p className="font-inter font-bold text-lg sm:text-xl text-dark-blue-2">{item.value}</p>
                      <p className="font-poppins text-xs sm:text-sm text-gray-blue">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-light-blue bg-white">
                <img src={facility.heroImage} alt={facility.title} className="w-full h-64 md:h-72 object-cover" />
              </div>
            </div>

            <div className="mt-9">
              <h2 className="font-inter text-dark-blue-2 font-bold text-xl sm:text-2xl mb-5">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {facility.features.map((feature, index) => (
                  <article
                    key={`${feature.title}-${index}`}
                    className="rounded-xl border border-light-blue bg-white p-5"
                    style={{ borderTop: `3px solid ${facility.color}` }}
                  >
                    <div className="text-2xl mb-3">{feature.icon}</div>
                    <h3 className="font-poppins font-semibold text-sm text-dark-blue-2 mb-1">{feature.title}</h3>
                    <p className="font-poppins text-xs sm:text-sm text-gray-blue leading-relaxed">{feature.desc}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-9">
              <h2 className="font-inter text-dark-blue-2 font-bold text-xl sm:text-2xl mb-5">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {facility.gallery.map((imageUrl, index) => (
                  <div key={`${facility.id}-gallery-${index}`} className="rounded-xl overflow-hidden aspect-[4/3] border border-light-blue">
                    <img src={imageUrl} alt={`${facility.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FacilityPage
