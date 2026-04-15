import { Link } from 'react-router-dom';
import { quickMenuItems } from '../../data/navItems';

export default function QuickAccess() {
  return (
    <section className="container-padded -mt-10 relative z-10 pb-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,61,145,0.12)] sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Quick menu</p>
            <h3 className="mt-2 text-2xl font-black text-secondary">Student-first shortcuts</h3>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Keep the homepage in a familiar department-site style by showing the most used academic links directly on the landing page.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {quickMenuItems.filter((item) => !item.path.startsWith('/admin')).map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-primary hover:bg-primary hover:text-white"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-primary transition group-hover:bg-white/15 group-hover:text-white">
                {index + 1}
              </div>
              <h4 className="mt-4 text-base font-bold text-secondary transition group-hover:text-white">{item.label}</h4>
              <p className="mt-2 text-sm text-slate-600 transition group-hover:text-slate-100">Open section</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
