import { useMemo, useState } from "react";
import PhotoEvidenceModal from "../components/PhotoEvidenceModal.jsx";
import OrderDetailModal from "../components/OrderDetailModal.jsx";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Camera,
  CheckCircle2,
  ClipboardList,
  Clock3,
  DollarSign,
  FileText,
  MapPin,
  Navigation,
  Phone,
  Printer,
  Search,
  Share2,
  Trash2,
  UserCog,
  Users,
  XCircle,

  UserRoundCheck,
  BadgeCheck,
  Images,
  MapPinned,
  PhoneCall,
  ReceiptText,
  Eye,
  Pencil,
} from "lucide-react";

function formatPhoneDisplay(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length !== 10) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatReportDate(value, t = (key) => key) {
  if (!value) return t("noDate");
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

function statusClass(estado) {
  if (estado === "Completado") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (estado === "Cancelada") return "border-rose-200 bg-rose-50 text-rose-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function priorityClass(prioridad) {
  if (prioridad === "Urgente") return "border-rose-200 bg-rose-50 text-rose-700";
  if (prioridad === "Alta") return "border-sky-200 bg-sky-50 text-sky-700";
  if (prioridad === "Media") return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function MiniMetric({ icon: Icon, label, value, tone = "from-slate-950 to-blue-900" }) {
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

function ActionButton({ icon: Icon, label, onClick, href, className = "" }) {
  const base = `inline-flex min-w-[42px] items-center justify-center gap-1 rounded-xl px-2.5 py-2 text-xs font-black transition ${className}`;

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className={base}>
        <Icon size={13} />
        {label && <span>{label}</span>}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={base}>
      <Icon size={13} />
      {label && <span>{label}</span>}
    </button>
  );
}

export default function HistorialPage({ t = (key) => key, lang = "es", ordenes, obtenerCliente, ordenProps }) {
  const [busqueda, setBusqueda] = useState("");
  const [evidenciaOrden, setEvidenciaOrden] = useState(null);
  const [detalleOrden, setDetalleOrden] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [ordenFecha, setOrdenFecha] = useState("recientes");
  const [vistaHistorial, setVistaHistorial] = useState("compacta");

  const {
    obtenerTecnico,
    urlAppleMaps,
    urlTelefono,
    compartirOrden,
    calcularCostoOrden,
    materialesTexto,
    corregirOrdenAdmin,
    session,
  } = ordenProps;

  const historialFiltrado = useMemo(() => {
    const q = busqueda.toLowerCase().trim();

    let lista = ordenes.filter((orden) => {
      const cliente = obtenerCliente(orden.clienteId);
      const tecnico = obtenerTecnico?.(orden.tecnicoId);

      const matchTexto = !q || [
        cliente?.nombre,
        cliente?.telefono,
        orden.direccionTrabajo,
        cliente?.direccion,
        tecnico?.nombre,
        orden.problema,
        orden.estado,
        orden.prioridad,
        orden.cancelReason,
        orden.notasTecnico,
      ].some((v) => String(v || "").toLowerCase().includes(q));

      const matchEstado = estadoFiltro === "todos" || orden.estado === estadoFiltro;

      return matchTexto && matchEstado;
    });

    lista = [...lista].sort((a, b) => {
      const aDate = new Date(a.fechaCompletada || a.fechaCreacion || a.fecha || 0).getTime();
      const bDate = new Date(b.fechaCompletada || b.fechaCreacion || b.fecha || 0).getTime();

      if (ordenFecha === "antiguos") return aDate - bDate;
      return bDate - aDate;
    });

    return lista;
  }, [ordenes, busqueda, estadoFiltro, ordenFecha, obtenerCliente, obtenerTecnico]);

  const completadas = ordenes.filter((o) => o.estado === "Completado").length;
  const canceladas = ordenes.filter((o) => o.estado === "Cancelada").length;
  const totalMateriales = ordenes.reduce((sum, orden) => sum + Number(calcularCostoOrden?.(orden) || orden.costoMateriales || 0), 0);

  const statusLabel = (estado) => {
    const map = {
      Completado: t("completed"),
      Cancelada: t("cancelled"),
      "Necesita seguimiento": t("needsFollowUp"),
    };
    return map[estado] || estado;
  };

  const priorityLabel = (prioridad) => {
    const map = {
      Baja: t("low"),
      Media: t("medium"),
      Alta: t("high"),
      Urgente: t("urgent"),
    };
    return map[prioridad] || prioridad;
  };

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/60 backdrop-blur">
        <div className="bg-slate-950 p-5 text-white">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-300">{t("history")}</p>
              <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
                <FileText size={24} />
                {t("historyTitle")}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                {t("historyDescription")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <MiniMetric icon={ClipboardList} label={t("total")} value={ordenes.length} />
              <MiniMetric icon={CheckCircle2} label={t("completed")} value={completadas} tone="from-emerald-800 to-teal-600" />
              <MiniMetric icon={XCircle} label={t("cancelled")} value={canceladas} tone="from-rose-800 to-red-700" />
              <MiniMetric icon={DollarSign} label={t("materials")} value={`$${totalMateriales.toFixed(2)}`} tone="from-slate-800 to-slate-950" />
            </div>
          </div>
        </div>

        <div className="grid gap-3 bg-[radial-gradient(circle_at_top_right,_#22d3ee33,_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-4 lg:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={t("searchHistoryPlaceholder")}
              className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          >
            <option value="todos">{t("all")}</option>
            <option value="Completado">{t("completed")}</option>
            <option value="Cancelada">{t("cancelled")}</option>
          </select>

          <select
            value={ordenFecha}
            onChange={(e) => setOrdenFecha(e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          >
            <option value="recientes">{t("mostRecent")}</option>
            <option value="antiguos">{t("oldest")}</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/60 backdrop-blur">
        <div className="bg-slate-950 px-4 py-3 text-white">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">{t("orderRecords")}</p>
              <h3 className="text-lg font-black">{t("completedAndCancelled")}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-2xl bg-white/10 p-1 ring-1 ring-white/20">
                <button
                  type="button"
                  onClick={() => setVistaHistorial("compacta")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                    vistaHistorial === "compacta" ? "bg-cyan-300 text-slate-950" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {t("compact") || "Compacta"}
                </button>
                <button
                  type="button"
                  onClick={() => setVistaHistorial("detallada")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                    vistaHistorial === "detallada" ? "bg-cyan-300 text-slate-950" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {t("detailed") || "Detallada"}
                </button>
              </div>

              <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-black ring-1 ring-white/20">
                {historialFiltrado.length} {t("records")}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-[radial-gradient(circle_at_top_right,_#22d3ee26,_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eef6ff_45%,_#f8fafc_100%)] p-5">
          {historialFiltrado.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-500">
              {t("noHistoryOrders")}
            </div>
          )}

          {vistaHistorial === "compacta" && historialFiltrado.length > 0 && (
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
              <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
                <div className="min-w-[980px]">
                  <div className="grid grid-cols-[1.25fr_0.75fr_0.9fr_0.75fr_0.65fr_280px] gap-3 bg-slate-950 px-4 py-3 text-[10px] font-black uppercase tracking-wide text-white">
                    <span>{t("customer")}</span>
                    <span>{t("status")}</span>
                    <span>{t("technician")}</span>
                    <span>{t("date")}</span>
                    <span>{t("photos")}</span>
                    <span className="text-right">{t("actions")}</span>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {historialFiltrado.map((orden) => {
                      const cliente = obtenerCliente(orden.clienteId);
                      const tecnico = obtenerTecnico?.(orden.tecnicoId);
                      const fotosCount = ["antes", "durante", "despues"].filter((k) => orden.fotos?.[k]).length;
                      const fecha = formatReportDate(orden.fechaCompletada || orden.fechaCreacion || orden.fecha);

                      return (
                        <article key={`compact-${orden.id}`} className="grid grid-cols-[1.25fr_0.75fr_0.9fr_0.75fr_0.65fr_280px] items-center gap-3 px-4 py-3 text-sm transition hover:bg-blue-50/70">
                          <div className="min-w-0">
                            <p className="truncate font-black text-slate-950">{cliente?.nombre || t("deletedCustomer")}</p>
                            <p className="truncate text-xs font-semibold text-slate-500">{orden.problema || t("workOrderFallback")}</p>
                          </div>

                          <span className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-black ${statusClass(orden.estado)}`}>
                            {statusLabel(orden.estado)}
                          </span>

                          <p className="truncate font-bold text-slate-700">{tecnico?.nombre || t("noTechnician")}</p>

                          <p className="truncate font-bold text-slate-600">{fecha}</p>

                          <button
                            type="button"
                            onClick={() => setEvidenciaOrden(orden)}
                            className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                          >
                            {fotosCount}/3
                          </button>

                          <div className="flex justify-end items-stretch gap-3">
                            <ActionButton icon={Eye} label="" onClick={() => setDetalleOrden(orden)} className="min-w-[70px] px-4 bg-slate-950 text-white hover:bg-slate-800" />
                            <ActionButton icon={Printer} label="" onClick={() => compartirOrden?.(orden, "imprimir")} className="min-w-[70px] px-4 bg-cyan-100 text-cyan-800 hover:bg-cyan-200" />
                            <ActionButton icon={Share2} label="" onClick={() => compartirOrden?.(orden, "mensaje")} className="min-w-[70px] px-4 bg-blue-50 text-blue-700 hover:bg-blue-100" />
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {vistaHistorial === "detallada" && historialFiltrado.map((orden) => {
            const cliente = obtenerCliente(orden.clienteId);
            const tecnico = obtenerTecnico?.(orden.tecnicoId);
            const direccionHistorial = orden.direccionTrabajo || cliente?.direccion || "";
            const fotosCount = ["antes", "durante", "despues"].filter((k) => orden.fotos?.[k]).length;
            const materiales = materialesTexto?.(orden);
            const fecha = formatReportDate(orden.fechaCompletada || orden.fechaCreacion || orden.fecha);

            return (
              <article key={orden.id} className="group relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white shadow-xl shadow-slate-300/60 ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className={`absolute left-0 top-0 h-full w-2 ${
                  orden.estado === "Completado" ? "bg-emerald-500" :
                  orden.estado === "Cancelada" ? "bg-rose-500" :
                  orden.estado === "Necesita seguimiento" ? "bg-amber-500" :
                  "bg-blue-500"
                }`} />
                <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-cyan-200/30 blur-3xl transition group-hover:bg-cyan-300/40" />
                <div className="grid gap-5 p-5 pl-7 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
                  <div className="min-w-0">
                    <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/70 p-4 shadow-sm ring-1 ring-white">
                      <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-blue-200/30 blur-3xl" />
                      <div className="relative flex items-start gap-4">
                        <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-700 text-white shadow-lg shadow-blue-200/70">
                          <UserRoundCheck size={25} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="max-w-full truncate text-2xl font-black leading-tight text-slate-950">
                              {cliente?.nombre || t("deletedCustomer")}
                            </p>
                            <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(orden.estado)}`}>
                              {statusLabel(orden.estado)}
                            </span>
                            <span className={`rounded-full border px-3 py-1 text-xs font-black ${priorityClass(orden.prioridad)}`}>
                              {priorityLabel(orden.prioridad || "Media")}
                            </span>
                          </div>

                          <div className="mt-3 grid gap-2 text-sm font-black text-slate-600 md:grid-cols-[180px_minmax(0,1fr)]">
                            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
                              <Phone size={15} className="shrink-0 text-emerald-600" />
                              <span className="truncate">{formatPhoneDisplay(cliente?.telefono || "") || t("noPhone")}</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
                              <MapPin size={15} className="shrink-0 text-blue-700" />
                              <span className="line-clamp-1">{direccionHistorial || t("noAddress")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-[1.35rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">{t("technician")}</p>
                        <p className="mt-1 flex items-center gap-1 truncate text-sm font-black text-slate-900">
                          <BadgeCheck size={13} className="text-blue-700" />
                          {tecnico?.nombre || t("noTechnician")}
                        </p>
                      </div>

                      <div className="rounded-[1.35rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">{t("scheduledDate")}</p>
                        <p className="mt-1 flex items-center gap-1 truncate text-sm font-black text-slate-900">
                          <CalendarDays size={13} className="text-slate-500" />
                          {fecha}
                        </p>
                      </div>

                      <div className="rounded-[1.35rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">{t("materials")}</p>
                        <p className="mt-1 line-clamp-1 text-sm font-black text-slate-900">
                          {materiales || t("noMaterials")}
                        </p>
                      </div>

                      <button
                        onClick={() => setEvidenciaOrden(orden)}
                        className="rounded-[1.35rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-3 text-left text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md"
                      >
                        <p className="text-[10px] font-black uppercase tracking-wide">{t("photos")}</p>
                        <p className="mt-1 flex items-center gap-1 text-sm font-black">
                          <Camera size={13} />
                          Ver {fotosCount}/3
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-4 text-white shadow-xl shadow-slate-300/50">
                    <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-cyan-300/20 blur-3xl" />
                    <p className="relative mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100">{t("quickActions")}</p>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setDetalleOrden(orden)}
                        className="relative inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white/12 px-3 text-sm font-black text-white shadow-sm ring-1 ring-white/15 backdrop-blur transition hover:bg-white/18"
                      >
                        <Eye size={15} />
                        {t("viewOrder")}
                      </button>

                      {cliente?.telefono && (
                        <a href={`tel:${cliente.telefono}`} className="relative inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-400/20 px-3 text-sm font-black text-emerald-100 shadow-sm ring-1 ring-emerald-200/20 backdrop-blur transition hover:bg-emerald-400/30">
                          <PhoneCall size={15} />
                          {t("call")}
                        </a>
                      )}

                      {direccionHistorial && (
                        <a href={urlAppleMaps?.(direccionHistorial)} target="_blank" rel="noreferrer" className="relative inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white/12 px-3 text-sm font-black text-white shadow-sm ring-1 ring-white/15 backdrop-blur transition hover:bg-white/18">
                          <MapPinned size={15} />
                          {t("map")}
                        </a>
                      )}

                      <button
                        onClick={() => compartirOrden?.(orden, "imprimir")}
                        className="relative inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-3 text-sm font-black text-slate-950 shadow-sm transition hover:bg-cyan-200"
                      >
                        <Printer size={15} />
                        {t("print")}
                      </button>
                    </div>

                    <button
                      onClick={() => compartirOrden?.(orden, "mensaje")}
                      className="relative mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 text-sm font-black text-white shadow-sm backdrop-blur transition hover:bg-white/15"
                    >
                      <Share2 size={15} />
                      {t("sendReport")}
                    </button>

                    {session?.role === "admin" && ["Completado", "Cancelada", "Necesita seguimiento"].includes(orden.estado) && (
                      <div className="relative mt-3 rounded-2xl border border-cyan-200/20 bg-white/10 p-2 shadow-sm ring-1 ring-white/10 backdrop-blur">
                        <button
                          onClick={() => corregirOrdenAdmin?.(orden.id)}
                          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-blue-400 px-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-200 hover:to-blue-300"
                        >
                          <Pencil size={15} />
                          {t("adminCorrection")}
                        </button>

                        {(orden.historialAdmin || []).length > 0 && (
                          <p className="mt-2 text-center text-[11px] font-black text-cyan-100">
                            {(orden.historialAdmin || []).length} corrección(es) internas registradas
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <PhotoEvidenceModal
        open={Boolean(evidenciaOrden)}
        onClose={() => setEvidenciaOrden(null)}
        orden={evidenciaOrden}
        cliente={evidenciaOrden ? obtenerCliente(evidenciaOrden.clienteId) : null}
        tecnico={evidenciaOrden ? obtenerTecnico?.(evidenciaOrden.tecnicoId) : null}
      />

      <OrderDetailModal
        open={Boolean(detalleOrden)}
        onClose={() => setDetalleOrden(null)}
        orden={detalleOrden}
        cliente={detalleOrden ? obtenerCliente(detalleOrden.clienteId) : null}
        tecnico={detalleOrden ? obtenerTecnico?.(detalleOrden.tecnicoId) : null}
        ordenProps={ordenProps}
      />
    </section>
  );
}
