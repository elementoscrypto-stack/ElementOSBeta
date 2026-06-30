import Card from "../components/ui/Card.jsx";
import MetricBar from "../components/ui/MetricBar.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import { elements } from "../data/elements.js";
import { compareMaterials } from "../engines/compareEngine.js";
import { materialScore } from "../engines/scoringEngine.js";

export default function CompareEngine({ compareElements, setCompareElements }) {
  const selected = elements.filter((element) => compareElements.includes(element.symbol));
  const rows = compareMaterials(selected);

  function reset() {
    setCompareElements(["Al", "Fe", "Cu", "Ti"]);
  }

  return (
    <div className="page">
      <SectionTitle eyebrow="ElementOS Engine" title="Compare Engine">
        <p>Deterministic comparison of material stability, conductivity, thermal behaviour, pressure, rarity and ZDAR alignment.</p>
      </SectionTitle>

      <div className="toolbar">
        <button className="button" onClick={reset}>Reset</button>
      </div>

      <div className="grid-auto">
        {rows.map((row) => (
          <Card key={row.symbol}>
            <h2>{row.symbol} — {row.name}</h2>
            <p className="score">Overall score: {materialScore(row)}</p>
            <MetricBar label="Stability" value={row.stability} />
            <MetricBar label="Conductivity" value={row.conductivity} />
            <MetricBar label="Thermal" value={row.thermal} />
            <MetricBar label="Diffusion" value={row.diffusion} />
            <MetricBar label="Pressure" value={row.pressure} />
            <MetricBar label="Rarity" value={row.rarity} />
            <MetricBar label="ZDAR" value={row.zdar} />
          </Card>
        ))}
      </div>
    </div>
  );
}
