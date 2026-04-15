import { Link } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader';
import LoadingState from '../common/LoadingState';
import EmptyState from '../common/EmptyState';
import DocumentCard from '../common/DocumentCard';

export default function NoticePreview({ notices, loading }) {
  return (
    <section className="container-padded py-12">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeader title="Latest Notice Board" subtitle="Important circulars, student notices and downloadable academic updates." />
        <Link to="/notices" className="btn-outline">See All Notices</Link>
      </div>

      {loading ? (
        <LoadingState />
      ) : notices.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notices.slice(0, 3).map((notice) => (
            <DocumentCard key={notice._id} item={notice} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
