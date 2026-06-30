import Card from "../components/ui/Card.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import Button from "../components/ui/Button.jsx";
import { getElement } from "../utils/elementHelpers.js";

export default function BehaviourAtlas({ selectedElement, setActivePage }) {
  const element = getElement(selectedElement);

  return (
    <div className="page">
      <SectionTitle eyebrow="ElementOS" title="Behaviour Atlas">
        <p>Visualize material behaviour across stability, pressure, heat, rarity and risk fields.</p>
      </SectionTitle>

      <div className="grid-auto">
        <Card>
          <h2>Current focus</h2>
          <p><strong>{element.symbol}</strong> — {element.name}</p>
          <p>{element.summary}</p>
        </Card>

        <Card>
          <h2>Controlled module</h2>
          <p>This page is isolated in <code>src/pages/BehaviourAtlas.jsx</code> and receives global state from <code>App.jsx</code>.</p>
          <Button onClick={() => setActivePage("compare")}>Open Compare Engine</Button>
        </Card>
      </div>
    </div>
  );
}
