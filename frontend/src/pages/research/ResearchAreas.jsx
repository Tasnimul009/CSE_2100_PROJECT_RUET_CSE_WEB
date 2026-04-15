import Breadcrumb from "../../components/quickMenu/Breadcrumb"
import PageHeroBanner from "../../components/quickMenu/PageHeroBanner"
import { RESEARCH_NAV } from "../../constants/researchNav"
import { RESEARCH_AREAS, RESEARCH_STATS } from "../../constants/researchData"

const STATS = [
  { label: "Research Areas", value: RESEARCH_STATS.researchAreas },
  { label: "Publications", value: `${RESEARCH_STATS.publications}+` },
  { label: "Active Projects", value: RESEARCH_STATS.activeProjects },
  { label: "Faculty Researchers", value: RESEARCH_STATS.facultyResearchers },
]

const ResearchAreas = () => {
  return (
    <>
      <Breadcrumb current="Research Areas" />
      <PageHeroBanner title="Research" navLinks={RESEARCH_NAV} activeTo="/research/areas" />

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
              Research Areas
            </p>
          </div>

          <div className="border border-light-blue border-t-0 p-6 md:p-8 lg:p-10 bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {STATS.map((item) => (
                <div key={item.label} className="rounded-xl border border-light-blue bg-[#f8fbff] px-4 py-3">
                  <p className="font-inter font-bold text-lg sm:text-xl text-dark-blue-2">{item.value}</p>
                  <p className="font-poppins text-xs sm:text-sm text-gray-blue">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {RESEARCH_AREAS.map((area) => (
                <article key={area._id} className="rounded-2xl border border-light-blue bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg bg-blue/10 px-2 text-xs font-bold text-blue">
                      {area.code}
                    </span>
                    <span className="rounded-full bg-light-blue px-3 py-1 text-xs font-semibold text-dark-blue-0">
                      {area.paperCount} papers
                    </span>
                  </div>

                  <h2 className="font-inter text-dark-blue-2 font-bold text-lg mt-4 leading-snug">{area.name}</h2>
                  <p className="font-poppins text-sm text-gray-blue leading-relaxed mt-2">{area.description}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {area.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-blue/20 bg-blue/5 px-2.5 py-0.5 text-xs font-medium text-blue">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResearchAreas
