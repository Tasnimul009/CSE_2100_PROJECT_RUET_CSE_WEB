import Breadcrumb from "../../components/quickMenu/Breadcrumb"
import PageHeroBanner from "../../components/quickMenu/PageHeroBanner"
import { ABOUT_NAV } from "../../constants/aboutNav"
import { aboutData } from "../../constants/homeData"

const VALUES = ["Excellence", "Integrity", "Innovation", "Collaboration", "Impact", "Inclusivity"]

const MissionVision = () => {
  return (
    <>
      <Breadcrumb current="Mission and Vision" />
      <PageHeroBanner title="About" navLinks={ABOUT_NAV} activeTo="/about/mission-vision" />

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
              Mission and Vision
            </p>
          </div>

          <div className="border border-light-blue border-t-0 p-6 md:p-8 lg:p-10 bg-white">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-light-blue p-6 bg-[#f8fbff]">
                <p className="font-inter text-xs sm:text-sm font-semibold tracking-[0.18em] text-blue uppercase mb-3">
                  Our Mission
                </p>
                <ul className="list-disc pl-5 space-y-3 font-poppins text-sm sm:text-base text-gray-blue leading-relaxed">
                  <li>{aboutData.mission1}</li>
                  <li>{aboutData.mission2}</li>
                  <li>{aboutData.mission3}</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-light-blue p-6 bg-[#fffdf5]">
                <p className="font-inter text-xs sm:text-sm font-semibold tracking-[0.18em] text-blue uppercase mb-3">
                  Our Vision
                </p>
                <p className="font-poppins text-sm sm:text-base text-gray-blue leading-relaxed">
                  {aboutData.vision}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-light-blue p-6 mt-6">
              <p className="font-inter text-xs sm:text-sm font-semibold tracking-[0.18em] text-blue uppercase mb-4">
                Core Values
              </p>
              <div className="flex flex-wrap gap-3">
                {VALUES.map((value) => (
                  <span
                    key={value}
                    className="px-4 py-1.5 rounded-full border border-blue/25 bg-blue/5 text-blue font-poppins text-sm"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MissionVision
