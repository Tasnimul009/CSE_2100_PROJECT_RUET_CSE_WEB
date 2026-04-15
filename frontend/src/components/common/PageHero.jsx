export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="container-padded py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-black text-secondary sm:text-4xl">{title}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600 sm:text-base">{subtitle}</p>
      </div>
    </section>
  );
}
