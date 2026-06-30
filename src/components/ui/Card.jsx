export default function Card({ children, className = "" }) {
  return <section className={`card glass ${className}`}>{children}</section>;
}
