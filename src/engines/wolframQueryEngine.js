import { elements } from "../data/elements.js";

export function runMaterialQuery(query = "") {
  const q = query.toLowerCase();
  const found = elements.find((element) =>
    q.includes(element.symbol.toLowerCase()) || q.includes(element.name.toLowerCase())
  );

  if (!query.trim()) {
    return {
      title: "Ask ElementOS anything",
      summary: "Try: Compare aluminium and titanium for aerospace over 50 years.",
      entity: null,
    };
  }

  if (found) {
    return {
      title: `${found.name} computational profile`,
      summary: found.summary,
      entity: found,
    };
  }

  return {
    title: "Material intelligence query",
    summary: "ElementOS can turn this into a computed material report, ranking, graph and forecast.",
    entity: null,
  };
}
