import { useMemo } from 'react'

const fallbackImg = '/RUET-logo.png'

const StudentCard = ({ profile }) => {
  const {
    name,
    studentId,
    batch,
    email,
    phone,
    interests = [],
    bio,
    image,
    createdAt,
  } = profile

  const addedText = useMemo(() => {
    if (!createdAt) return ''
    const d = new Date(createdAt)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }, [createdAt])

  return (
    <article className="bg-white border border-light-blue rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="relative bg-light-blue/40" style={{ paddingBottom: '65%' }}>
        <img
          src={image || fallbackImg}
          alt={name}
          onError={(e) => { e.currentTarget.src = fallbackImg }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {addedText && (
          <span className="absolute top-3 right-3 bg-blue text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            Added {addedText}
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col" style={{ padding: 'clamp(0.9rem, 1.4vw, 1.25rem)', gap: 'clamp(0.4rem, 0.8vw, 0.75rem)' }}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-dmSans font-semibold text-black/90" style={{ fontSize: 'clamp(1.05rem, 1.2vw, 1.15rem)' }}>{name}</p>
            <p className="text-gray-blue" style={{ fontSize: 'clamp(0.82rem, 1vw, 0.95rem)' }}>
              ID: {studentId} • Batch {batch}
            </p>
          </div>
          <span className="bg-light-blue text-dark-blue-1 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
            Active
          </span>
        </div>

        {bio && (
          <p
            className="text-black/70"
            style={{
              fontSize: 'clamp(0.86rem, 1.05vw, 1rem)',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {bio}
          </p>
        )}

        {(email || phone) && (
          <div className="flex flex-col text-black/70" style={{ gap: '0.15rem', fontSize: 'clamp(0.82rem, 1vw, 0.95rem)' }}>
            {email && <a href={`mailto:${email}`} className="hover:text-blue transition-colors duration-200">{email}</a>}
            {phone && <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-blue transition-colors duration-200">{phone}</a>}
          </div>
        )}

        {interests.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: '0.35rem' }}>
            {interests.map((tag) => (
              <span
                key={tag}
                className="bg-blue/10 text-blue border border-blue/40 rounded-full px-3 py-1 text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default StudentCard
