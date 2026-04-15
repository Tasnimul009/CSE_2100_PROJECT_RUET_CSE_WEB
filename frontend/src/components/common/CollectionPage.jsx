import { useEffect, useState } from 'react';
import MainLayout from '../layout/MainLayout';
import PageHero from './PageHero';
import SectionHeader from './SectionHeader';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import DocumentCard from './DocumentCard';
import InfoCard from './InfoCard';
import { fetchCollection } from '../../services/api';

const sidebarItems = [
  'Official upload-friendly layout',
  'Document cards with semester / category tags',
  'Simple API-driven rendering',
  'Suitable for notices, routine and curriculum',
];

export default function CollectionPage({
  endpoint,
  params = {},
  eyebrow,
  title,
  subtitle,
  infoMode = false,
  emptyLabel,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCollection(endpoint, params);
        setItems(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [endpoint, JSON.stringify(params)]);

  return (
    <MainLayout>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <section className="container-padded py-12">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.55fr]">
          <aside className="h-fit rounded-[28px] bg-secondary p-7 text-white shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-200">Section guide</p>
            <h3 className="mt-3 text-2xl font-black">Academic information block</h3>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              Use this page for recent uploads, archived PDFs, semester-specific content and any department-level academic publication.
            </p>
            <div className="mt-6 space-y-3">
              {sidebarItems.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100">
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
              <div className="grid gap-6 md:grid-cols-2">
                {items.map((item) =>
                  infoMode ? (
                    <InfoCard
                      key={item._id}
                      title={item.title}
                      description={item.description}
                      meta={item.eventDate ? new Date(item.eventDate).toLocaleDateString() : item.category || 'Update'}
                    />
                  ) : (
                    <DocumentCard key={item._id} item={item} />
                  )
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
