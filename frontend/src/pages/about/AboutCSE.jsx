import { Link } from "react-router-dom"

import Breadcrumb from "../../components/quickMenu/Breadcrumb"
import PageHeroBanner from "../../components/quickMenu/PageHeroBanner"
import { ABOUT_NAV } from "../../constants/aboutNav"
import { aboutData } from "../../constants/homeData"

const STATS = [
  { label: "Established", value: "1998" },
  { label: "Graduates", value: "2000+" },
  { label: "Faculty", value: "60+" },
  { label: "Labs", value: "8" },
]

const HIGHLIGHTS = [
  "Outcome-driven curriculum for modern software and hardware systems",
  "Strong undergraduate, postgraduate, and doctoral pathways",
  "Faculty-led research with active student participation",
  "Industry engagement for real-world problem solving",
]

const AboutCSE = () => {
  return (
    <>
      <Breadcrumb current="About CSE" />
      <PageHeroBanner title="About" navLinks={ABOUT_NAV} activeTo="/about/cse" />

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
              About CSE
            </p>
          </div>

          <div className="border border-light-blue border-t-0 p-6 md:p-8 lg:p-10 bg-linear-to-b from-white to-[#f4f9ff]">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
              <div>
                <p className="font-inter text-xs sm:text-sm font-semibold tracking-[0.18em] text-blue uppercase mb-4">
                  Department of Computer Science and Engineering
                </p>

                <h1 className="font-inter text-dark-blue-2 font-bold leading-tight text-2xl sm:text-3xl lg:text-4xl">
                  Building Engineers for Innovation, Research, and National Progress
                </h1>

                <p className="font-poppins text-gray-blue mt-5 leading-relaxed text-sm sm:text-base">
                  {aboutData.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-7">
                  {STATS.map((item) => (
                    <div key={item.label} className="rounded-xl border border-light-blue bg-white px-4 py-3">
                      <p className="font-inter font-bold text-lg sm:text-xl text-dark-blue-2">{item.value}</p>
                      <p className="font-poppins text-xs sm:text-sm text-gray-blue">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-7">
                  <Link
                    to="/about/message-from-head"
                    className="inline-flex items-center justify-center rounded-lg bg-blue px-4 py-2 text-white font-semibold hover:bg-dark-blue-0 transition-colors"
                  >
                    Message from Head
                  </Link>
                  <Link
                    to="/about/mission-vision"
                    className="inline-flex items-center justify-center rounded-lg border border-blue px-4 py-2 text-blue font-semibold hover:bg-blue/10 transition-colors"
                  >
                    Mission and Vision
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-light-blue bg-white h-fit">
                <img
                  src="/demoPhoto/HeroPic-0.webp"
                  alt="RUET CSE"
                  className="w-full h-56 md:h-64 object-cover"
                />
                <div className="p-5">
                  <h2 className="font-inter font-bold text-dark-blue-2 mb-3">Quick Highlights</h2>
                  <ul className="list-disc pl-5 space-y-2 font-poppins text-sm text-gray-blue">
                    {HIGHLIGHTS.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutCSE
