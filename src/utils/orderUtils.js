export function priorityWeight(value) {
  const map = { Urgente: 0, Alta: 1, Media: 2, Baja: 3 };
  return map[value] ?? 4;
}
