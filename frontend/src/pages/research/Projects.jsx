import Breadcrumb from "../../components/quickMenu/Breadcrumb"
import PageHeroBanner from "../../components/quickMenu/PageHeroBanner"
import { RESEARCH_NAV } from "../../constants/researchNav"
import { RESEARCH_PROJECTS } from "../../constants/researchData"

const Projects = () => {
  return (
    <>
      <Breadcrumb current="Projects" />
      <PageHeroBanner title="Research" navLinks={RESEARCH_NAV} activeTo="/research/projects" />

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
              Projects
            </p>
          </div>

          <div className="border border-light-blue border-t-0 p-6 md:p-8 lg:p-10 bg-white">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {RESEARCH_PROJECTS.map((project) => {
                const isActive = project.status === "active"
                return (
                  <article key={project._id} className="rounded-2xl border border-light-blue bg-white p-5">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                          isActive
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-blue/10 text-blue border-blue/20"
                        }`}
                      >
                        {isActive ? "Ongoing" : "Completed"}
                      </span>

                      {project.funding ? (
                        <span className="rounded-full border border-light-blue bg-light-blue px-2.5 py-1 text-xs font-semibold text-dark-blue-0">
                          {project.funding}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="font-inter text-dark-blue-2 font-bold text-lg mt-4 leading-snug">{project.name}</h2>
                    <p className="font-poppins text-sm text-gray-blue leading-relaxed mt-2">{project.description}</p>

                    <div className="mt-4 pt-3 border-t border-light-blue">
                      <p className="font-poppins text-xs sm:text-sm text-gray-blue">
                        PI: <span className="font-semibold text-dark-blue-2">{project.pi}</span>
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Projects
