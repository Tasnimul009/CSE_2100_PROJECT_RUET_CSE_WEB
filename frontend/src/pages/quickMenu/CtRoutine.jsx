import CollectionPage from '../../components/common/CollectionPage';

export default function CtRoutine() {
  return (
    <CollectionPage
      endpoint="/routines"
      params={{ type: 'ct' }}
      eyebrow="CT Routine"
      title="CT Routine"
      subtitle="Continuous test routine and class test scheduling page with consistent department website styling."
      emptyLabel="Browse CT routine uploads and ongoing assessment schedules."
    />
  );
}
