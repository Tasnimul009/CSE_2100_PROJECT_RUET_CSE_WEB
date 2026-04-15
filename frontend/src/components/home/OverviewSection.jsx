const items = [
  {
    title: 'Programs and curriculum',
    text: 'Present undergraduate and postgraduate offerings with clean cards, semester labels and downloadable attachments.',
  },
  {
    title: 'Routine management',
    text: 'Store class routine, examination routine and CT routine under one routine module and filter by type in the UI.',
  },
  {
    title: 'Admin publishing workflow',
    text: 'Allow authorized users to upload PDF files, publish notices and keep academic information current without editing code.',
  },
];

export default function OverviewSection() {
  return (
    <section className="container-padded py-12">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="rounded-[28px] bg-white p-7 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Portal overview</p>
          <h3 className="mt-3 text-3xl font-black text-secondary">Built for academic communication and document access</h3>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600 sm:text-base">
            This version is designed to feel closer to a university department website: bold header, structured quick links,
            official-style sections, prominent notice area and simple content blocks that work well for programs, routine and circulars.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {['Programs', 'Routine', 'Calendar'].map((pill) => (
              <div key={pill} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm font-bold text-slate-700">
                {pill}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-card">
              <h4 className="text-xl font-bold text-secondary">{item.title}</h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
