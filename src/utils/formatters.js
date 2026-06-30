export function percent(value) {
  return `${Math.round(value)}%`;
}

export function titleCase(value = "") {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
