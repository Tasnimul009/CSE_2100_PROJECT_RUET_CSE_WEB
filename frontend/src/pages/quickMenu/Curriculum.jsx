import CollectionPage from '../../components/common/CollectionPage';

export default function Curriculum() {
  return (
    <CollectionPage
      endpoint="/curriculums"
      eyebrow="Curriculum"
      title="Curriculum Structure"
      subtitle="Semester-wise course distribution, credit planning and department academic framework."
      emptyLabel="Browse curriculum documents and semester-aligned academic records."
    />
  );
}
