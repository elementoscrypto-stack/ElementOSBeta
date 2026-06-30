import { navItems } from "../../utils/constants.js";

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar glass">
      <div className="brand">
        <div className="brand-mark">E</div>
        <div>
          <strong>ElementOS</strong>
          <span>Material Intelligence</span>
        </div>
      </div>

      <nav>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={activePage === item.id ? "nav active" : "nav"}
            onClick={() => setActivePage(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
