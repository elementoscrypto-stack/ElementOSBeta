import { useState } from "react";

export function useElementSelection(defaultSymbol = "Al") {
  const [selectedElement, setSelectedElement] = useState(defaultSymbol);
  return { selectedElement, setSelectedElement };
}
