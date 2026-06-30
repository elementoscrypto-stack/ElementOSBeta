import Card from "../components/ui/Card.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import Button from "../components/ui/Button.jsx";
import { getElement } from "../utils/elementHelpers.js";

export default function SimilarityUniverse({ selectedElement, setActivePage }) {
  const element = getElement(selectedElement);

  return (
    <div className="page">
      <SectionTitle eyebrow="ElementOS" title="Similarity Universe">
        <p>Explore elements as a cinematic orbital graph of similarity, substitution and ZDAR alignment.</p>
      </SectionTitle>

      <div className="grid-auto">
        <Card>
          <h2>Current focus</h2>
          <p><strong>{element.symbol}</strong> — {element.name}</p>
          <p>{element.summary}</p>
        </Card>

        <Card>
          <h2>Controlled module</h2>
          <p>This page is isolated in <code>src/pages/SimilarityUniverse.jsx</code> and receives global state from <code>App.jsx</code>.</p>
          <Button onClick={() => setActivePage("compare")}>Open Compare Engine</Button>
        </Card>
      </div>
    </div>
  );
}
