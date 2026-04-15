export default function SectionHeader({ title, subtitle }) {
  return <div className="mb-8"><h2 className="section-title">{title}</h2>{subtitle ? <p className="section-subtitle">{subtitle}</p> : null}</div>;
}
