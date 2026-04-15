import { useEffect, useMemo, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SectionHeader from '../../components/common/SectionHeader';
import { createItem, deleteItem, fetchCollection, getAdminProfile, getStoredUser, updateItem, clearAuthSession } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const endpoints = [
  { label: 'Notice', value: '/notices' },
  { label: 'Event', value: '/events' },
  { label: 'Program', value: '/programs' },
  { label: 'Curriculum', value: '/curriculums' },
  { label: 'Syllabus', value: '/syllabi' },
  { label: 'Academic Calendar', value: '/calendars' },
  { label: 'Routine', value: '/routines' },
];

const initialForm = {
  title: '',
  description: '',
  category: '',
  semester: '',
  type: 'class',
  session: '',
  eventDate: '',
  link: '',
  publishedAt: '',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [resource, setResource] = useState('/notices');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [admin, setAdmin] = useState(getStoredUser());
  const isMultipart = useMemo(() => true, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const params = resource === '/routines' ? { type: form.type } : {};
      const res = await fetchCollection(resource, params);
      setItems(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [resource, form.type]);

  useEffect(() => {
    getAdminProfile().then((res) => setAdmin(res.data)).catch(() => {
      clearAuthSession();
      navigate('/admin/login');
    });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setFile(null);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => value && payload.append(key, value));
      if (file) payload.append('file', file);
      if (editingId) {
        await updateItem(resource, editingId, payload, isMultipart);
      } else {
        await createItem(resource, payload, isMultipart);
      }
      resetForm();
      await loadItems();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Request failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await deleteItem(resource, id);
    await loadItems();
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      category: item.category || '',
      semester: item.semester || '',
      type: item.type || 'class',
      session: item.session || '',
      eventDate: item.eventDate ? new Date(item.eventDate).toISOString().slice(0, 10) : '',
      link: item.link || '',
      publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 10) : '',
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logout = () => {
    clearAuthSession();
    navigate('/admin/login');
  };

  return (
    <MainLayout>
      <section className="container-padded py-16">
        <div className="mb-8 flex flex-col gap-4 rounded-[28px] bg-secondary p-8 text-white shadow-card lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-200">Administrator console</p>
            <h1 className="mt-3 text-3xl font-black">Portal content management dashboard</h1>
            <p className="mt-3 text-sm text-slate-200">Logged in as {admin?.name || 'Admin'} · {admin?.email || 'admin@ruet.ac.bd'}</p>
          </div>
          <button className="rounded-xl bg-white px-5 py-3 font-semibold text-secondary" onClick={logout}>Logout</button>
        </div>

        <SectionHeader title="Manage academic content" subtitle="Create, edit, publish and delete every academic portal item from one place." />
        <div className="grid gap-8 lg:grid-cols-[420px,1fr]">
          <form className="card space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold">Resource</label>
              <select className="select" value={resource} onChange={(e) => { setResource(e.target.value); resetForm(); }}>
                {endpoints.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
            <input className="input" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            <textarea className="textarea min-h-28" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <div className="grid gap-4 md:grid-cols-2">
              <input className="input" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
              <input className="input" name="semester" placeholder="Semester / Session" value={form.semester} onChange={handleChange} />
            </div>
            {resource === '/routines' ? (
              <div className="grid gap-4 md:grid-cols-2">
                <select className="select" name="type" value={form.type} onChange={handleChange}>
                  <option value="class">Class</option>
                  <option value="exam">Exam</option>
                  <option value="ct">CT</option>
                </select>
                <input className="input" name="session" placeholder="Academic session" value={form.session} onChange={handleChange} />
              </div>
            ) : null}
            {resource === '/events' ? <input className="input" name="eventDate" type="date" value={form.eventDate} onChange={handleChange} /> : null}
            <input className="input" name="publishedAt" type="date" value={form.publishedAt} onChange={handleChange} />
            <input className="input" name="link" placeholder="External link (optional)" value={form.link} onChange={handleChange} />
            <input className="input" type="file" accept="application/pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="grid gap-3 md:grid-cols-2">
              <button className="btn-primary w-full" type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update item' : 'Save item'}</button>
              <button className="btn-outline w-full" type="button" onClick={resetForm}>Clear form</button>
            </div>
          </form>

          <div className="space-y-4">
            <div className="card flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-secondary">Existing items</h3>
                <p className="mt-1 text-sm text-slate-600">Use Edit to load an item into the form, then update it.</p>
              </div>
              <button className="btn-outline" onClick={loadItems}>Refresh</button>
            </div>
            {loading ? <div className="card">Loading...</div> : items.length ? items.map((item) => (
              <div key={item._id} className="card flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-secondary">{item.title}</h4>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">{item.type || item.category || 'General'} {item.semester ? `· ${item.semester}` : ''}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700" onClick={() => startEdit(item)}>Edit</button>
                  <button className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white" onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              </div>
            )) : <div className="card text-sm text-slate-600">No items yet.</div>}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
