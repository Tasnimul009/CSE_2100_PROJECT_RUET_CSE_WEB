import { Link } from "react-router-dom"

import Breadcrumb from "../../components/quickMenu/Breadcrumb"
import PageHeroBanner from "../../components/quickMenu/PageHeroBanner"
import { ABOUT_NAV } from "../../constants/aboutNav"
import { achievements } from "../../constants/achievementsData"

const Achievement = () => {
  const featured = achievements.slice(0, 9)

  return (
    <>
      <Breadcrumb current="Achievement" />
      <PageHeroBanner title="About" navLinks={ABOUT_NAV} activeTo="/about/achievement" />

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
              Achievement
            </p>
          </div>

          <div className="border border-light-blue border-t-0 p-6 md:p-8 lg:p-10 bg-white">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((item) => (
                <article key={item.isoDate + item.title} className="rounded-2xl overflow-hidden border border-light-blue bg-white">
                  <img src={item.imgURL} alt={item.title} className="w-full h-44 object-cover" />
                  <div className="p-4">
                    <p className="font-poppins text-xs text-gray-blue mb-2">{item.date}</p>
                    <h2 className="font-inter text-dark-blue-2 font-semibold text-base leading-snug line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="font-poppins text-sm text-gray-blue leading-relaxed mt-2 line-clamp-4">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-7 flex justify-center">
              <Link
                to="/achievements"
                className="inline-flex items-center justify-center rounded-lg bg-blue px-5 py-2.5 text-white font-semibold hover:bg-dark-blue-0 transition-colors"
              >
                View All Achievements
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Achievement
