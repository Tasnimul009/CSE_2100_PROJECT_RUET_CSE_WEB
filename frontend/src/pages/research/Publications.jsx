import { useMemo, useState } from "react"

import Breadcrumb from "../../components/quickMenu/Breadcrumb"
import PageHeroBanner from "../../components/quickMenu/PageHeroBanner"
import { RESEARCH_NAV } from "../../constants/researchNav"
import { PUBLICATIONS } from "../../constants/researchData"

const FILTERS = [
  { key: "all", label: "All" },
  { key: "journal", label: "Journal" },
  { key: "conference", label: "Conference" },
  { key: "2024", label: "2024" },
  { key: "2023", label: "2023" },
]

const Publications = () => {
  const [activeFilter, setActiveFilter] = useState("all")

  const filteredPubs = useMemo(() => {
    if (activeFilter === "all") return PUBLICATIONS
    if (activeFilter === "journal" || activeFilter === "conference") {
      return PUBLICATIONS.filter((pub) => pub.type === activeFilter)
    }

    const year = Number(activeFilter)
    return PUBLICATIONS.filter((pub) => pub.year === year)
  }, [activeFilter])

  return (
    <>
      <Breadcrumb current="Publications" />
      <PageHeroBanner title="Research" navLinks={RESEARCH_NAV} activeTo="/research/publications" />

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
              Publications
            </p>
          </div>

          <div className="border border-light-blue border-t-0 p-6 md:p-8 lg:p-10 bg-white">
            <div className="flex flex-wrap gap-2 mb-7">
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter.key
                return (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors ${
                      isActive
                        ? "bg-blue text-white border-blue"
                        : "bg-white text-gray-blue border-light-blue hover:border-blue"
                    }`}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </div>

            <div className="flex flex-col gap-4">
              {filteredPubs.map((pub) => (
                <article key={pub._id} className="rounded-2xl border border-light-blue bg-white p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <span className="inline-flex w-fit rounded-lg bg-blue/10 px-3 py-1.5 text-sm font-bold text-blue">
                      {pub.year}
                    </span>

                    <div className="min-w-0">
                      <h2 className="font-inter text-dark-blue-2 font-semibold text-base sm:text-lg leading-snug">
                        {pub.title}
                      </h2>
                      <p className="font-poppins text-sm text-blue mt-1">{pub.authors}</p>
                      <p className="font-poppins text-sm text-gray-blue italic mt-1">{pub.venue}</p>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="rounded-full border border-blue/20 bg-blue/5 px-3 py-1 text-xs font-semibold text-dark-blue-0">
                          {pub.type === "journal" ? "Journal" : "Conference"}
                          {pub.rank ? ` / ${pub.rank}` : ""}
                        </span>
                        {pub.citations > 0 ? (
                          <span className="text-xs sm:text-sm text-gray-blue">{pub.citations} citations</span>
                        ) : null}
                      </div>
                    </div>
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

export default Publications
