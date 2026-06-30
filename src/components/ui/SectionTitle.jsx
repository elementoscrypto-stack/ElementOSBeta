export default function SectionTitle({ eyebrow, title, children }) {
  return (
    <header className="section-title">
      {eyebrow && <p>{eyebrow}</p>}
      <h1>{title}</h1>
      {children && <div>{children}</div>}
    </header>
  );
}
