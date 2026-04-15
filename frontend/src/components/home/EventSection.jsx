import { Link } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader';
import LoadingState from '../common/LoadingState';
import EmptyState from '../common/EmptyState';
import InfoCard from '../common/InfoCard';

export default function EventSection({ events, loading }) {
  return (
    <section className="container-padded py-12">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeader title="News & Events" subtitle="Seminars, workshops, competitions and departmental academic activities." />
        <Link to="/news-events" className="btn-outline">View All Events</Link>
      </div>

      {loading ? (
        <LoadingState />
      ) : events.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 3).map((event) => (
            <InfoCard
              key={event._id}
              title={event.title}
              description={event.description}
              meta={event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'Event'}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
