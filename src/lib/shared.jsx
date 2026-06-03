import { AlertTriangle } from "lucide-react";

export const iconProps = { size: 18, strokeWidth: 2 };

export function IconText({ icon: Icon, children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Icon {...iconProps} />
      {children}
    </span>
  );
}

export const PRIORIDADES = [
  { value: "Baja", help: "mantenimiento normal", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "Media", help: "servicio programado", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "Alta", help: "cliente sin aire o calefacción", cls: "bg-sky-50 text-sky-700 border-sky-200" },
  { value: "Urgente", help: "emergencia / sistema detenido", cls: "bg-cyan-50 text-cyan-700 border-cyan-200" },
];

export const formatPhoneUS = (value) => String(value || "").replace(/[^0-9]/g, "").slice(0, 10);
export const phoneIsValidUS = (value) => formatPhoneUS(value).length === 10;

export function buildAddressFromPrediction(value) {
  return String(value || "").trim();
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatPhoneDisplay(value) {
  const digits = formatPhoneUS(value);
  if (!digits) return "";
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function formatReportDate(value) {
  if (!value) return new Date().toLocaleDateString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

export function getDayName(value = new Date(), lang = "es") {
  const date = value instanceof Date ? value : new Date(value);
  const locale = lang === "en" ? "en-US" : "es-US";
  const day = date.toLocaleDateString(locale, { weekday: "long" });
  return day.charAt(0).toUpperCase() + day.slice(1);
}

export function toDateKey(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return String(value);
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayKey() {
  return toDateKey(new Date());
}

export function isTodayValue(value) {
  return toDateKey(value) === todayKey();
}

export function isFutureValue(value) {
  const key = toDateKey(value);
  return key && key > todayKey();
}

export function sortByDateTime(a, b) {
  const aKey = `${a.fecha || toDateKey(a.fechaCreacion || a.fechaCompletada)} ${a.hora || ""}`;
  const bKey = `${b.fecha || toDateKey(b.fechaCreacion || b.fechaCompletada)} ${b.hora || ""}`;
  return aKey.localeCompare(bKey);
}
