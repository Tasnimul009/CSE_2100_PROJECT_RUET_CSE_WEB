import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import MainLayout from '../../components/layout/MainLayout';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';

import { fetchCollection } from '../../services/api';
import { getAcademicFallbackItems } from '../../constants/academicCollectionFallback';

const RESOURCE_CONFIG = {
  programs: {
    endpoint: '/programs',
    label: 'Programs',
    backPath: '/academic/programs',
  },
  curriculums: {
    endpoint: '/curriculums',
    label: 'Curriculum',
    backPath: '/academic/curriculum',
  },
  syllabi: {
    endpoint: '/syllabi',
    label: 'Syllabus',
    backPath: '/academic/syllabus',
  },
  calendars: {
    endpoint: '/calendars',
    label: 'Academic Calendar',
    backPath: '/academic/calendar',
  },
  routines: {
    endpoint: '/routines',
    label: 'Routine',
    backPath: '/academic/class-routine',
  },
  notices: {
    endpoint: '/notices',
    label: 'Notice',
    backPath: '/notice',
  },
  events: {
    endpoint: '/events',
    label: 'News and Events',
    backPath: '/news-events',
  },
};

const API_BASE_URL = String(
  import.meta.env.VITE_API_BASE_URL
    || import.meta.env.VITE_STUDENT_API_BASE_URL
    || (import.meta.env.DEV ? 'http://localhost:5000/api' : ''),
).trim().replace(/\/+$/, '');

const BACKEND_ORIGIN = API_BASE_URL
  ? API_BASE_URL.replace(/\/api$/, '')
  : (import.meta.env.DEV ? 'http://localhost:5000' : '');

const toTrimmedString = (value) => String(value ?? '').trim();

const getItemIdentity = (item, index) => (
  toTrimmedString(item?._id)
  || toTrimmedString(item?.id)
  || `${toTrimmedString(item?.title || 'item')}-${index}`
);

const getItemCategory = (item) => (
  toTrimmedString(item?.category)
  || toTrimmedString(item?.type)
  || 'General'
);

const getItemSemester = (item) => toTrimmedString(item?.semester) || 'Not specified';

const resolveDocumentUrl = (rawLink) => {
  const link = toTrimmedString(rawLink);
  if (!link) return '';

  if (/^https?:\/\//i.test(link)) return link;

  if (link.startsWith('/uploads/')) {
    return BACKEND_ORIGIN ? `${BACKEND_ORIGIN}${link}` : link;
  }

  if (link.startsWith('/')) {
    return link;
  }

  return BACKEND_ORIGIN ? `${BACKEND_ORIGIN}/${link}` : link;
};

const inferPreviewType = (url) => {
  const normalized = toTrimmedString(url).toLowerCase();
  if (!normalized) return 'none';
  if (/\.(pdf)(\?.*)?$/.test(normalized)) return 'pdf';
  if (/\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/.test(normalized)) return 'image';
  if (/\.(txt|md|json|csv|log)(\?.*)?$/.test(normalized)) return 'text';
  return 'external';
};

const matchesItemId = (entry, targetId, index) => {
  const needle = toTrimmedString(targetId);
  if (!needle) return false;

  const candidates = [
    entry?._id,
    entry?.id,
    getItemIdentity(entry, index),
    entry?.title,
  ].map((value) => toTrimmedString(value));

  return candidates.some((candidate) => candidate === needle);
};

export default function AcademicItemView() {
  const { resource, itemId } = useParams();

  const normalizedResource = toTrimmedString(resource).toLowerCase();
  const config = RESOURCE_CONFIG[normalizedResource];

  const decodedItemId = useMemo(() => {
    try {
      return decodeURIComponent(itemId || '');
    } catch {
      return itemId || '';
    }
  }, [itemId]);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [textContent, setTextContent] = useState('');
  const [textLoading, setTextLoading] = useState(false);
  const [textError, setTextError] = useState('');

  useEffect(() => {
    if (!config) {
      return undefined;
    }

    let mounted = true;

    const normalizeEntries = (entries) => entries.map((entry, index) => {
      const rawLink = entry.fileUrl || entry.pdfUrl || entry.link || '';
      return {
        ...entry,
        _identity: getItemIdentity(entry, index),
        _category: getItemCategory(entry),
        _semester: getItemSemester(entry),
        _resolvedLink: resolveDocumentUrl(rawLink),
      };
    });

    const applyFromEntries = (entries) => {
      const normalized = normalizeEntries(entries);
      const matched = normalized.find((entry, index) => matchesItemId(entry, decodedItemId, index));

      if (!mounted || !matched) {
        return false;
      }

      setItem(matched);
      setError('');
      return true;
    };

    (async () => {
      setLoading(true);
      try {
        const response = await fetchCollection(config.endpoint, {});
        const apiItems = Array.isArray(response?.data) ? response.data : [];

        if (apiItems.length && applyFromEntries(apiItems)) {
          return;
        }

        const fallbackItems = getAcademicFallbackItems(config.endpoint, {});
        if (applyFromEntries(fallbackItems)) {
          return;
        }

        if (mounted) {
          setItem(null);
          setError('Requested academic item was not found.');
        }
      } catch (fetchError) {
        console.error(fetchError);

        const fallbackItems = getAcademicFallbackItems(config.endpoint, {});
        if (applyFromEntries(fallbackItems)) {
          return;
        }

        if (mounted) {
          setItem(null);
          setError('Could not load this academic item right now.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [config, decodedItemId]);

  const previewType = inferPreviewType(item?._resolvedLink || '');

  useEffect(() => {
    const link = item?._resolvedLink || '';

    if (previewType !== 'text' || !link) {
      setTextContent('');
      setTextLoading(false);
      setTextError('');
      return undefined;
    }

    const controller = new AbortController();
    let mounted = true;

    (async () => {
      setTextLoading(true);
      setTextError('');
      try {
        const response = await fetch(link, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Could not load document (${response.status})`);
        }
        const body = await response.text();
        if (mounted) {
          setTextContent(body);
        }
      } catch (previewError) {
        if (previewError?.name === 'AbortError') {
          return;
        }

        if (mounted) {
          setTextError('Could not preview this text file in-page. Use Open Raw File instead.');
        }
      } finally {
        if (mounted) {
          setTextLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [item?._resolvedLink, previewType]);

  const backPath = useMemo(() => {
    if (!config) {
      return '/academic/programs';
    }

    if (normalizedResource !== 'routines') {
      return config.backPath;
    }

    const routineType = toTrimmedString(item?.type).toLowerCase();
    if (routineType === 'exam') return '/academic/exam-routine';
    if (routineType === 'ct') return '/academic/ct-routine';
    return '/academic/class-routine';
  }, [config, normalizedResource, item?.type]);

  const routineHighlights = useMemo(() => {
    if (normalizedResource !== 'routines' || previewType !== 'text' || !textContent) {
      return [];
    }

    return textContent
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => !/^RUET|^Title:|^Type:|^Semester:|^Session:|^Prepared/i.test(line))
      .slice(0, 12);
  }, [normalizedResource, previewType, textContent]);

  if (!config) {
    return <Navigate to="/academic/programs" replace />;
  }

  return (
    <MainLayout>
      <section className="container-padded py-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Academic Detail Page</p>
            <h1 className="mt-2 text-3xl font-black text-secondary">{item?.title || `${config.label} Details`}</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Full-page viewer for this academic item. Use the back button to return to the filtered list.
            </p>
          </div>
          <Link to={backPath} className="btn-outline">Back To {config.label}</Link>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <EmptyState title="Could not open this item" description={error} />
        ) : !item ? (
          <EmptyState title="Item not found" description="The selected academic item does not exist anymore." />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <article className="card space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                  {item._category}
                </span>
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {item._semester}
                </span>
                {item.session ? (
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {item.session}
                  </span>
                ) : null}
              </div>

              <h2 className="text-2xl font-black text-secondary">{item.title}</h2>
              <p className="text-sm leading-7 text-slate-600">{item.description || 'No description provided for this item.'}</p>

              <div className="rounded-2xl border border-slate-200 bg-soft p-4 text-sm text-slate-700">
                <p><strong>Published:</strong> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Category:</strong> {item._category}</p>
                <p><strong>Semester:</strong> {item._semester}</p>
                {item.eventDate ? <p><strong>Event Date:</strong> {new Date(item.eventDate).toLocaleDateString()}</p> : null}
              </div>

              {routineHighlights.length ? (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Routine Highlights</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {routineHighlights.map((line, index) => (
                      <li key={`${line}-${index}`} className="rounded-lg border border-primary/20 bg-white px-3 py-2">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                {item._resolvedLink ? (
                  <a className="btn-primary" href={item._resolvedLink} target="_blank" rel="noreferrer">
                    Open Raw File
                  </a>
                ) : (
                  <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">File pending</span>
                )}
                <Link to={backPath} className="btn-outline">Back To List</Link>
              </div>
            </article>

            <article className="card">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Document Preview</p>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {!item._resolvedLink ? (
                  <p className="text-sm text-slate-600">No file linked with this entry yet.</p>
                ) : previewType === 'pdf' ? (
                  <iframe
                    title={`Preview - ${item.title}`}
                    src={item._resolvedLink}
                    className="h-[72vh] w-full rounded-xl border border-slate-200 bg-white"
                  />
                ) : previewType === 'image' ? (
                  <img src={item._resolvedLink} alt={item.title} className="h-auto w-full rounded-xl border border-slate-200 bg-white" />
                ) : previewType === 'text' ? (
                  textLoading ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Loading preview...</div>
                  ) : textError ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{textError}</div>
                  ) : (
                    <pre className="max-h-[72vh] overflow-auto rounded-xl border border-slate-200 bg-white p-4 text-xs leading-6 whitespace-pre-wrap text-slate-700">{textContent}</pre>
                  )
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                    This file type is best viewed in a separate tab.
                  </div>
                )}
              </div>
            </article>
          </div>
        )}
      </section>
    </MainLayout>
  );
}
