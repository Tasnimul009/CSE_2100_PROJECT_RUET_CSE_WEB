import CollectionPage from '../../components/common/CollectionPage';

export default function Programs() {
  return (
    <CollectionPage
      endpoint="/programs"
      eyebrow="Programs"
      title="Academic Programs"
      subtitle="Undergraduate and postgraduate academic program information in an official department-style presentation."
      emptyLabel="Browse available program entries and downloadable documents."
    />
  );
}
