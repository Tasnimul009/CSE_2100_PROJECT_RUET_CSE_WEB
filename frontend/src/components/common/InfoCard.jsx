export default function InfoCard({ title, description, meta }) {
  return (
    <article className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-card">
      <span className="inline-flex rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-800">
        {meta || 'Update'}
      </span>
      <h3 className="mt-4 text-xl font-extrabold text-secondary">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}
