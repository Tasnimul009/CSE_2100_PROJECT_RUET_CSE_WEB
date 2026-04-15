import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import PageHero from '../../components/common/PageHero';
import { loginAdmin } from '../../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: 'admin@ruet.ac.bd', password: 'admin123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(form);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHero eyebrow="Admin access" title="Portal administrator login" subtitle="Sign in to manage notices, routines, syllabus, curriculum and calendars." />
      <section className="container-padded py-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] bg-secondary p-8 text-white shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-200">Default demo credentials</p>
            <h2 className="mt-4 text-3xl font-black">Seeded administrator account</h2>
            <div className="mt-8 space-y-4 text-sm leading-7 text-slate-200">
              <p><span className="font-semibold text-white">Email:</span> admin@ruet.ac.bd</p>
              <p><span className="font-semibold text-white">Password:</span> admin123</p>
              <p>Run <code className="rounded bg-white/10 px-2 py-1">npm run seed</code> in the backend to create this login and load demo content.</p>
            </div>
          </div>

          <form className="card space-y-4" onSubmit={onSubmit}>
            <h3 className="text-2xl font-black text-secondary">Sign in</h3>
            <p className="text-sm text-slate-600">Use the administrator account to create, update and delete portal content.</p>
            <input className="input" name="email" type="email" placeholder="Admin email" value={form.email} onChange={onChange} required />
            <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
            {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
            <button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login to dashboard'}</button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}
