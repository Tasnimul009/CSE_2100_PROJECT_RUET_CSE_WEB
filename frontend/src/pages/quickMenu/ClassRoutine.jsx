import CollectionPage from '../../components/common/CollectionPage';

export default function ClassRoutine() {
  return (
    <CollectionPage
      endpoint="/routines"
      params={{ type: 'class' }}
      eyebrow="Class Routine"
      title="Class Routine"
      subtitle="Published class schedule with quick access to the latest routine files and archived routine documents."
      emptyLabel="Browse class routine uploads and latest schedule changes."
    />
  );
}
