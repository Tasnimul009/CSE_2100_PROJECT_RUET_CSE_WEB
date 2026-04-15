import CollectionPage from '../../components/common/CollectionPage';

export default function ExamRoutine() {
  return (
    <CollectionPage
      endpoint="/routines"
      params={{ type: 'exam' }}
      eyebrow="Examination Routine"
      title="Examination Routine"
      subtitle="Official examination schedule page for midterm, semester final and other department-level assessments."
      emptyLabel="Browse examination routine files and published updates."
    />
  );
}
