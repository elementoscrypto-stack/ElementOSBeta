export function createReport({ title, selectedElement, compareElements }) {
  return {
    id: `EOS-${Date.now().toString(36).toUpperCase()}`,
    title,
    selectedElement,
    compareElements,
    createdAt: new Date().toISOString(),
  };
}
