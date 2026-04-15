import Breadcrumb from "../../components/quickMenu/Breadcrumb"
import PageHeroBanner from "../../components/quickMenu/PageHeroBanner"
import { ABOUT_NAV } from "../../constants/aboutNav"

const TIMELINE = [
  {
    year: "1964",
    title: "RUET Foundation",
    description:
      "The university was founded as one of Bangladesh's major engineering institutions, laying the foundation for future technology education and innovation.",
  },
  {
    year: "1998",
    title: "CSE Department Established",
    description:
      "The Department of Computer Science and Engineering was established to meet the growing national demand for computing professionals.",
  },
  {
    year: "2005",
    title: "Expansion of Laboratories",
    description:
      "Modern computing laboratories were introduced to support software engineering, networking, hardware, and systems courses.",
  },
  {
    year: "2012",
    title: "Postgraduate Research Growth",
    description:
      "Research-oriented postgraduate activities accelerated with stronger faculty publication output and student thesis engagement.",
  },
  {
    year: "2018",
    title: "Advanced Technology Focus",
    description:
      "Dedicated work in AI, machine learning, data science, and cybersecurity gained momentum through projects and collaborative studies.",
  },
  {
    year: "2023",
    title: "Recognition and Impact",
    description:
      "The department strengthened its reputation through national recognition, competition performance, and impactful research contributions.",
  },
]

const History = () => {
  return (
    <>
      <Breadcrumb current="History" />
      <PageHeroBanner title="About" navLinks={ABOUT_NAV} activeTo="/about/history" />

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
              History
            </p>
          </div>

          <div className="border border-light-blue border-t-0 p-6 md:p-8 lg:p-10 bg-white">
            <div className="relative border-l-2 border-light-blue ml-2">
              {TIMELINE.map((item) => (
                <div key={item.year} className="relative pl-8 pb-8 last:pb-0">
                  <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-blue border-2 border-white" />
                  <span className="inline-flex rounded-full bg-blue text-white px-3 py-1 text-xs font-semibold tracking-wide font-inter">
                    {item.year}
                  </span>
                  <h2 className="font-inter text-dark-blue-2 font-bold text-lg sm:text-xl mt-3">{item.title}</h2>
                  <p className="font-poppins text-sm sm:text-base text-gray-blue leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default History
