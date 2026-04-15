import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import PageHero from './PageHero';
import SectionHeader from './SectionHeader';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import DocumentCard from './DocumentCard';
import InfoCard from './InfoCard';
import { fetchCollection } from '../../services/api';
import { getAcademicFallbackItems, mergeAcademicItemsWithFallback } from '../../constants/academicCollectionFallback';

const sidebarItems = [
  'Filter by category and semester',
  'Open each item on a dedicated details page',
  'Clear routine/category metadata at a glance',
  'Raw download link always available',
  'Full page preview area for each selection',
];

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

const resourceFromEndpoint = (endpoint) => toTrimmedString(endpoint).replace(/^\/+|\/+$/g, '');

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

export default function CollectionPage({
  endpoint,
  params = {},
  eyebrow,
  title,
  subtitle,
  infoMode = false,
  emptyLabel,
}) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const resourceName = useMemo(() => resourceFromEndpoint(endpoint), [endpoint]);

  useEffect(() => {
    let mounted = true;

    const applyFallback = () => {
      const fallbackItems = getAcademicFallbackItems(endpoint, params);
      if (mounted) {
        setItems(fallbackItems);
      }
    };

    (async () => {
      try {
        const res = await fetchCollection(endpoint, params);
        const apiItems = Array.isArray(res?.data) ? res.data : [];

        const mergedItems = mergeAcademicItemsWithFallback(endpoint, apiItems, params);
        if (mounted) {
          setItems(mergedItems);
        }
      } catch (error) {
        console.error(error);
        applyFallback();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [endpoint, JSON.stringify(params)]);

  const normalizedItems = useMemo(() => (
    items.map((item, index) => {
      const rawLink = item.fileUrl || item.pdfUrl || item.link || '';
      return {
        ...item,
        _identity: getItemIdentity(item, index),
        _category: getItemCategory(item),
        _semester: getItemSemester(item),
        _resolvedLink: resolveDocumentUrl(rawLink),
      };
    })
  ), [items]);

  const categoryOptions = useMemo(() => {
    const set = new Set(normalizedItems.map((item) => item._category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [normalizedItems]);

  const semesterOptions = useMemo(() => {
    const set = new Set(normalizedItems.map((item) => item._semester).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [normalizedItems]);

  const filteredItems = useMemo(() => {
    const query = toTrimmedString(searchText).toLowerCase();

    return normalizedItems.filter((item) => {
      if (categoryFilter !== 'All' && item._category !== categoryFilter) {
        return false;
      }

      if (semesterFilter !== 'All' && item._semester !== semesterFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = [item.title, item.description, item._category, item._semester]
        .map((entry) => toTrimmedString(entry).toLowerCase())
        .join(' ');

      return haystack.includes(query);
    });
  }, [normalizedItems, categoryFilter, semesterFilter, searchText]);

  const openDetailsPage = (item) => {
    if (!item?._identity || !resourceName) {
      return;
    }

    navigate(`/academic/view/${resourceName}/${encodeURIComponent(item._identity)}`);
  };

  return (
    <MainLayout>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <section className="container-padded py-12">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.55fr]">
          <aside className="h-fit rounded-[28px] border border-primary/15 bg-soft p-7 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Section guide</p>
            <h3 className="mt-3 text-2xl font-black text-secondary">Dedicated document view pages</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Open any card to jump into a separate full page for that academic item, including routine-specific details and clean document preview.
            </p>
            <div className="mt-6 space-y-3">
              {sidebarItems.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <div>
            <SectionHeader title={title} subtitle={emptyLabel || 'Browse the latest uploaded entries below.'} />
            {loading ? (
              <LoadingState />
            ) : items.length ? (
              <div className="space-y-6">
                {!infoMode ? (
                  <div className="grid gap-4 rounded-[22px] border border-slate-200 bg-white p-4 shadow-card md:grid-cols-[1.3fr_1fr_1fr]">
                    <input
                      className="input"
                      placeholder="Search by title, category or semester"
                      value={searchText}
                      onChange={(event) => setSearchText(event.target.value)}
                    />
                    <select className="select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <select className="select" value={semesterFilter} onChange={(event) => setSemesterFilter(event.target.value)}>
                      {semesterOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {infoMode ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {normalizedItems.map((item) => (
                      <InfoCard
                        key={item._identity}
                        title={item.title}
                        description={item.description}
                        meta={item.eventDate ? new Date(item.eventDate).toLocaleDateString() : item.category || 'Update'}
                      />
                    ))}
                  </div>
                ) : filteredItems.length ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {filteredItems.map((item) => (
                      <DocumentCard
                        key={item._identity}
                        item={item}
                        onPreview={() => openDetailsPage(item)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No matching documents"
                    description="Try clearing filters or changing search keywords to view more academic records."
                  />
                )}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
