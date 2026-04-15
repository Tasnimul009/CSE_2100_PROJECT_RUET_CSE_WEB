import CollectionPage from '../../components/common/CollectionPage';

export default function AcademicCalendar() {
  return (
    <CollectionPage
      endpoint="/calendars"
      eyebrow="Academic Calendar"
      title="Academic Calendar & Timeline"
      subtitle="Official semester timeline, important dates and institutional academic schedule for the department."
      emptyLabel="Browse published calendar files and semester-level date sheets."
    />
  );
}
