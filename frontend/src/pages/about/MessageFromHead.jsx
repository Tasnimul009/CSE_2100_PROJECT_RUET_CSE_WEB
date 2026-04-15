import Breadcrumb from "../../components/quickMenu/Breadcrumb"
import PageHeroBanner from "../../components/quickMenu/PageHeroBanner"
import { ABOUT_NAV } from "../../constants/aboutNav"
import { aboutData } from "../../constants/homeData"

const MESSAGE_PARAGRAPHS = [
  aboutData.headMsg,
  "Our department combines rigorous academic foundations with practical engineering exposure to prepare students for national and global technology challenges.",
  "We encourage every learner to participate in research, teamwork, and leadership activities that build both professional excellence and social responsibility.",
]

const MessageFromHead = () => {
  return (
    <>
      <Breadcrumb current="Message from Head" />
      <PageHeroBanner title="About" navLinks={ABOUT_NAV} activeTo="/about/message-from-head" />

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
              Message from Head
            </p>
          </div>

          <div className="border border-light-blue border-t-0 p-6 md:p-8 lg:p-10 bg-white">
            <div className="grid gap-8 md:grid-cols-[260px_1fr] items-start">
              <div className="rounded-2xl overflow-hidden border border-light-blue bg-white">
                <img
                  src="/SUZ.webp"
                  alt="Dr. Md. Shahid Uz Zaman"
                  className="w-full h-[310px] object-cover object-top"
                />
                <div className="p-5">
                  <h2 className="font-inter text-dark-blue-2 font-semibold text-base sm:text-lg">
                    Dr. Md. Shahid Uz Zaman
                  </h2>
                  <p className="font-poppins text-xs sm:text-sm text-gray-blue mt-1">Head of Department, CSE</p>
                </div>
              </div>

              <div className="rounded-2xl border border-light-blue p-6 md:p-8 bg-linear-to-b from-white to-[#f8fbff]">
                <h1 className="font-inter text-dark-blue-2 font-bold leading-tight text-2xl sm:text-3xl mb-5">
                  A Message of Vision, Integrity, and Excellence
                </h1>

                {MESSAGE_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph} className="font-poppins text-sm sm:text-base text-gray-blue leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}

                <div className="mt-7 pt-5 border-t border-light-blue">
                  <p className="font-inter font-semibold text-dark-blue-2">Dr. Md. Shahid Uz Zaman</p>
                  <p className="font-poppins text-sm text-gray-blue">Head, Department of CSE, RUET</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MessageFromHead
