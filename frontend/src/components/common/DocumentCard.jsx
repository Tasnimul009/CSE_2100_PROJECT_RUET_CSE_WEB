export default function DocumentCard({ item }) {
  const link = item.fileUrl || item.pdfUrl || item.link;
  const publishDate = item.createdAt || item.publishDate || item.updatedAt;

  return (
    <article className="group flex h-full flex-col justify-between rounded-[26px] border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-primary/30">
      <div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            {item.category || item.type || 'Document'}
          </span>
          {item.semester ? (
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
              {item.semester}
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-xl font-extrabold leading-8 text-secondary">{item.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{item.description || 'No description available for this item.'}</p>
      </div>

      <div className="mt-6 border-t border-dashed border-slate-200 pt-4">
        {publishDate ? <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Published {new Date(publishDate).toLocaleDateString()}</p> : null}
        <div className="mt-4 flex flex-wrap gap-3">
          {link ? (
            <a className="btn-primary" href={link} target="_blank" rel="noreferrer">
              View Document
            </a>
          ) : (
            <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">File pending</span>
          )}
          <span className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Archive Ready</span>
        </div>
      </div>
    </article>
  );
}
