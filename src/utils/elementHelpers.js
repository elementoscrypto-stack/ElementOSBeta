import { elements } from "../data/elements.js";

export function getElement(symbol) {
  return elements.find((element) => element.symbol === symbol) || elements[0];
}
