export default function EmptyState({ title = 'No content published yet', description = 'Add data from the admin dashboard or run the seed command to populate this section.' }) {
  return (
    <div className="card text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-black text-primary">i</div>
      <h3 className="mt-4 text-xl font-bold text-secondary">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}
