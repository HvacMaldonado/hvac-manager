export function toDateKey(value) {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return "";
}

export function todayKey() {
  return toDateKey(new Date());
}

export function todayDateKey() {
  return todayKey();
}

export function isTodayValue(value) {
  return toDateKey(value) === todayKey();
}

export function isFutureValue(value) {
  const key = toDateKey(value);
  return key && key > todayKey();
}

export function getDayName(value = new Date(), lang = "es") {
  const date = value instanceof Date ? value : new Date(value);
  const locale = lang === "en" ? "en-US" : "es-US";
  const day = date.toLocaleDateString(locale, { weekday: "long" });
  return day.charAt(0).toUpperCase() + day.slice(1);
}

export function sortByDateTime(a, b) {
  const aKey = `${a.fechaProgramada || a.fecha || toDateKey(a.fechaCreacion || a.fechaCompletada)} ${a.horaProgramada || a.hora || ""}`;
  const bKey = `${b.fechaProgramada || b.fecha || toDateKey(b.fechaCreacion || b.fechaCompletada)} ${b.horaProgramada || b.hora || ""}`;
  return aKey.localeCompare(bKey);
}
