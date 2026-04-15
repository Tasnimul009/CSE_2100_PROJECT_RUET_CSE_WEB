import CollectionPage from '../../components/common/CollectionPage';

export default function Syllabus() {
  return (
    <CollectionPage
      endpoint="/syllabi"
      eyebrow="Syllabus"
      title="Detailed Course Syllabus"
      subtitle="Course outlines, learning topics and downloadable syllabus files in a clean academic portal layout."
      emptyLabel="Browse syllabus uploads and semester-linked document entries."
    />
  );
}
