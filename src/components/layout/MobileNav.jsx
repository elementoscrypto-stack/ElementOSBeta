import { mobileNavItems } from "../../utils/constants.js";

export default function MobileNav({ activePage, setActivePage }) {
  return (
    <nav className="mobile-nav glass">
      {mobileNavItems.map((item) => (
        <button
          key={item.id}
          className={activePage === item.id ? "mobile active" : "mobile"}
          onClick={() => setActivePage(item.id)}
        >
          <span>{item.icon}</span>
          <small>{item.label}</small>
        </button>
      ))}
    </nav>
  );
}
