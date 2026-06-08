import { exportarExcel } from "../utils/exportExcel";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  Download,
  FileText,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Search,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

function formatPhoneDisplay(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length !== 10) return digits || "—";
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatDate(value) {
  if (!value) return "Sin actividad";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
}

function Metric({ icon: Icon, label, value, tone }) {
  return (
    <div className={`flex min-w-[118px] items-center gap-2 rounded-2xl bg-gradient-to-br ${tone} px-3 py-2 text-white shadow-sm`}>
      <Icon size={15} />
      <div>
        <p className="text-sm font-black leading-none">{value}</p>
        <p className="mt-0.5 text-[9px] font-black uppercase tracking-wide text-white/75">{label}</p>
      </div>
    </div>
  );
}

function activityStatus(totalOrdenes, citasCount, t) {
  if (totalOrdenes > 0) return t("withHistory");
  if (citasCount > 0) return t("withAppointment");
  return t("new");
}

function statusClass(status, t) {
  if (status === t("withHistory")) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === t("withAppointment")) return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export default function ReportesClientesPage({ t, clientes, ordenes, citas = [], obtenerCliente, exportarCSV, urlAppleMaps, urlTelefono }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [ordenVista, setOrdenVista] = useState("actividad");

  const getOrdenesCliente = (clienteId) => ordenes.filter((o) => String(o.clienteId) === String(clienteId));
  const getCitasCliente = (clienteId) => citas.filter((c) => String(c.clienteId) === String(clienteId));

  const filas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();

    let rows = clientes.map((c) => {
      const ordenesC = getOrdenesCliente(c.id);
      const citasC = getCitasCliente(c.id);
      const completadas = ordenesC.filter((o) => o.estado === "Completado").length;
      const canceladas = ordenesC.filter((o) => o.estado === "Cancelada").length;
      const activas = ordenesC.filter((o) => !["Completado", "Cancelada"].includes(o.estado)).length;
      const ultimaActividad = [
        ...ordenesC.map((o) => o.fechaCompletada || o.fechaCreacion || o.fecha || ""),
        ...citasC.map((x) => x.fecha || x.fechaCreacion || ""),
      ].filter(Boolean).sort().at(-1) || "";

      const status = activityStatus(ordenesC.length, citasC.length, t);

      return {
        ...c,
        ordenesCount: ordenesC.length,
        citasCount: citasC.length,
        completadas,
        canceladas,
        activas,
        ultimaActividad,
        status,
      };
    });

    rows = rows.filter((c) => {
      const matchTexto = !q || [c.nombre, c.telefono, c.email, c.direccion, c.apartamento, c.edificio, c.calle]
        .some((v) => String(v || "").toLowerCase().includes(q));

      const matchFiltro =
        filtro === "todos" ||
        (filtro === "conOrdenes" && c.ordenesCount > 0) ||
        (filtro === "conCitas" && c.citasCount > 0) ||
        (filtro === "sinActividad" && c.ordenesCount === 0 && c.citasCount === 0);

      return matchTexto && matchFiltro;
    });

    if (ordenVista === "nombre") {
      rows = [...rows].sort((a, b) => String(a.nombre || "").localeCompare(String(b.nombre || "")));
    } else if (ordenVista === "ordenes") {
      rows = [...rows].sort((a, b) => b.ordenesCount - a.ordenesCount);
    } else {
      rows = [...rows].sort((a, b) => String(b.ultimaActividad || "").localeCompare(String(a.ultimaActividad || "")));
    }

    return rows;
  }, [clientes, ordenes, citas, busqueda, filtro, ordenVista]);

  const exportRows = filas.map((c) => ({
    Cliente: c.nombre,
    Telefono: c.telefono,
    Email: c.email,
    Direccion: c.direccion,
    Ordenes: c.ordenesCount,
    Citas: c.citasCount,
    Completadas: c.completadas,
    Canceladas: c.canceladas,
    Activas: c.activas,
    UltimaActividad: c.ultimaActividad,
  }));

  const totalOrdenes = clientes.reduce((sum, c) => sum + getOrdenesCliente(c.id).length, 0);
  const clientesConHistorial = clientes.filter((c) => getOrdenesCliente(c.id).length > 0).length;
  const clientesConCitas = clientes.filter((c) => getCitasCliente(c.id).length > 0).length;

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">Reportes</p>
              <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
                <Users size={24} />
                {t("customerReportsTitle")}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                {t("customerReportsDescription")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <Metric icon={Users} label={t("customers")} value={clientes.length} tone="from-slate-950 to-blue-900" />
              <Metric icon={ClipboardList} label={t("orders")} value={totalOrdenes} tone="from-blue-800 to-cyan-700" />
              <Metric icon={TrendingUp} label={t("withHistory")} value={clientesConHistorial} tone="from-emerald-800 to-teal-600" />
              <Metric icon={CalendarDays} label={t("withAppointments")} value={clientesConCitas} tone="from-cyan-800 to-blue-700" />
            </div>
          </div>
        </div>

        <div className="grid gap-3 bg-[radial-gradient(circle_at_top_right,_#22d3ee33,_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-4 lg:grid-cols-[1fr_180px_180px_auto]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={t("customerReportsSearchPlaceholder")}
              className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100">
            <option value="todos">{t("all")}</option>
            <option value="conOrdenes">{t("withOrders")}</option>
            <option value="conCitas">{t("withAppointments")}</option>
            <option value="sinActividad">{t("noActivity")}</option>
          </select>

          <select value={ordenVista} onChange={(e) => setOrdenVista(e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100">
            <option value="actividad">{t("lastActivity")}</option>
            <option value="nombre">{t("nameSort")}</option>
            <option value="ordenes">{t("mostOrders")}</option>
          </select>

          <button
            onClick={() => exportarExcel(exportRows, "reporte_clientes.xlsx", "Clientes")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg"
          >
            <Download size={16} />
            {t("exportExcel")}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/50">
        <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <div className="min-w-[1220px]">
            <div className="grid grid-cols-[1.2fr_0.9fr_1.2fr_0.7fr_0.7fr_0.8fr_260px] gap-3 bg-slate-950 px-4 py-3 text-[11px] font-black uppercase tracking-wide text-white">
              <span>{t("customer")}</span>
              <span>{t("contact")}</span>
              <span>{t("address")}</span>
              <span>{t("orders")}</span>
              <span>{t("appointments")}</span>
              <span>{t("activity")}</span>
              <span className="text-right">{t("actions")}</span>
            </div>

            <div className="divide-y divide-slate-200">
              {filas.length === 0 && (
                <div className="p-8 text-center text-sm font-semibold text-slate-500">
                  {t("noCustomersFilters")}
                </div>
              )}

              {filas.map((c) => (
                <article key={c.id} className="grid grid-cols-[1.2fr_0.9fr_1.2fr_0.7fr_0.7fr_0.8fr_260px] gap-3 px-4 py-3 text-sm transition hover:bg-blue-50/50">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <Users size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-black text-slate-950">{c.nombre || "Sin nombre"}</p>
                        <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-black ${statusClass(c.status, t)}`}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 font-bold text-slate-700">
                      <Phone size={13} className="text-emerald-700" />
                      {formatPhoneDisplay(c.telefono)}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">
                      <Mail size={12} />
                      {c.email || t("noEmail")}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="line-clamp-1 font-semibold text-slate-700">
                      <MapPin size={13} className="mr-1 inline text-blue-700" />
                      {c.direccion || t("noAddress")}
                    </p>
                    <p className="text-xs text-slate-500">
                      Apt {c.apartamento || "—"} · Edificio {c.edificio || "—"} · Código {c.codigoAcceso || "—"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-950">{c.ordenesCount}</span>
                    <span className="text-[10px] font-bold text-slate-500">{t("activePlural")} {c.activas}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="rounded-2xl bg-blue-50 px-3 py-2 text-sm font-black text-blue-700">{c.citasCount}</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <CalendarDays size={14} className="text-slate-500" />
                    {formatDate(c.ultimaActividad)}
                  </div>

                  <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                    {c.telefono && (
                      <a href={urlTelefono?.(c.telefono) || `tel:${c.telefono}`} className="inline-flex h-9 min-w-[76px] items-center justify-center gap-1 rounded-xl bg-emerald-700 px-2.5 text-xs font-black text-white">
                        <Phone size={13} />
                        {t("call")}
                      </a>
                    )}

                    {c.direccion && (
                      <a href={urlAppleMaps?.(c.direccion)} target="_blank" rel="noreferrer" className="inline-flex h-9 min-w-[68px] items-center justify-center gap-1 rounded-xl bg-slate-950 px-2.5 text-xs font-black text-white">
                        <Navigation size={13} />
                        {t("map")}
                      </a>
                    )}

                    <button
                      onClick={() => {
                        const rows = [{
                          Cliente: c.nombre,
                          Telefono: c.telefono,
                          Email: c.email,
                          Direccion: c.direccion,
                          Ordenes: c.ordenesCount,
                          Citas: c.citasCount,
                          Completadas: c.completadas,
                          Canceladas: c.canceladas,
                          Activas: c.activas,
                          UltimaActividad: c.ultimaActividad,
                        }];
                        exportarExcel(rows, `cliente_${String(c.nombre || "reporte").replace(/\s+/g, "_")}.xlsx`, "Cliente");
                      }}
                      className="inline-flex h-9 min-w-[86px] items-center justify-center gap-1 rounded-xl bg-blue-700 px-2.5 text-xs font-black text-white"
                    >
                      <FileText size={13} />
                      {t("export")}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
