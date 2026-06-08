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

function formatReportDate(value) {
  if (!value) return "Sin fecha";
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

export default function HistorialPage({ t, ordenes, obtenerCliente, ordenProps }) {
  const [busqueda, setBusqueda] = useState("");
  const [evidenciaOrden, setEvidenciaOrden] = useState(null);
  const [detalleOrden, setDetalleOrden] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [ordenFecha, setOrdenFecha] = useState("recientes");

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

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/60 backdrop-blur">
        <div className="bg-slate-950 p-5 text-white">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-300">Historial</p>
              <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
                <FileText size={24} />
                Historial de órdenes
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Consulta en un solo lugar las órdenes completadas y canceladas, con filtros y acciones rápidas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <MiniMetric icon={ClipboardList} label="Total" value={ordenes.length} />
              <MiniMetric icon={CheckCircle2} label="Completadas" value={completadas} tone="from-emerald-800 to-teal-600" />
              <MiniMetric icon={XCircle} label="Canceladas" value={canceladas} tone="from-rose-800 to-red-700" />
              <MiniMetric icon={DollarSign} label="Materiales" value={`$${totalMateriales.toFixed(2)}`} tone="from-slate-800 to-slate-950" />
            </div>
          </div>
        </div>

        <div className="grid gap-3 bg-[radial-gradient(circle_at_top_right,_#22d3ee33,_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-4 lg:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por cliente, técnico, problema, dirección o estado..."
              className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          >
            <option value="todos">Todos</option>
            <option value="Completado">Completadas</option>
            <option value="Cancelada">Canceladas</option>
          </select>

          <select
            value={ordenFecha}
            onChange={(e) => setOrdenFecha(e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/60 backdrop-blur">
        <div className="bg-slate-950 px-4 py-3 text-white">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">Registros de órdenes</p>
              <h3 className="text-lg font-black">Completadas y canceladas</h3>
            </div>
            <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-black ring-1 ring-white/20">
              {historialFiltrado.length} registros
            </span>
          </div>
        </div>

        <div className="space-y-5 bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 p-5">
          {historialFiltrado.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-500">
              No hay órdenes en historial con esos filtros.
            </div>
          )}

          {historialFiltrado.map((orden) => {
            const cliente = obtenerCliente(orden.clienteId);
            const tecnico = obtenerTecnico?.(orden.tecnicoId);
            const fotosCount = ["antes", "durante", "despues"].filter((k) => orden.fotos?.[k]).length;
            const materiales = materialesTexto?.(orden);
            const fecha = formatReportDate(orden.fechaCompletada || orden.fechaCreacion || orden.fecha);

            return (
              <article key={orden.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-300/50 ring-1 ring-white transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-2xl">
                <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
                  <div className="min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <UserRoundCheck size={20} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-lg font-black text-slate-950">{cliente?.nombre || "Cliente eliminado"}</p>
                          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${statusClass(orden.estado)}`}>
                            {orden.estado}
                          </span>
                          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${priorityClass(orden.prioridad)}`}>
                            {orden.prioridad || "Media"}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-sm font-semibold text-slate-500">{formatPhoneDisplay(cliente?.telefono || "")}</p>
                        <p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-500">
                          <MapPin size={13} className="mr-1 inline text-blue-700" />
                          {cliente?.direccion || "Sin dirección"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Técnico</p>
                        <p className="mt-1 flex items-center gap-1 truncate text-sm font-black text-slate-900">
                          <BadgeCheck size={13} className="text-blue-700" />
                          {tecnico?.nombre || "Sin técnico"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Fecha</p>
                        <p className="mt-1 flex items-center gap-1 truncate text-sm font-black text-slate-900">
                          <CalendarDays size={13} className="text-slate-500" />
                          {fecha}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Materiales</p>
                        <p className="mt-1 line-clamp-1 text-sm font-black text-slate-900">
                          {materiales || "Sin materiales"}
                        </p>
                      </div>

                      <button
                        onClick={() => setEvidenciaOrden(orden)}
                        className="rounded-2xl border border-blue-200 bg-blue-50 p-3 text-left text-blue-700 transition hover:bg-blue-100"
                      >
                        <p className="text-[10px] font-black uppercase tracking-wide">Fotos</p>
                        <p className="mt-1 flex items-center gap-1 text-sm font-black">
                          <Camera size={13} />
                          Ver {fotosCount}/3
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-4 shadow-inner">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Acciones</p>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setDetalleOrden(orden)}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-700 to-slate-800 px-3 text-sm font-black text-white shadow-sm"
                      >
                        <Eye size={15} />
                        Ver orden
                      </button>

                      {cliente?.telefono && (
                        <a href={`tel:${cliente.telefono}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-3 text-sm font-black text-white shadow-sm">
                          <PhoneCall size={15} />
                          Llamar
                        </a>
                      )}

                      {cliente?.direccion && (
                        <a href={urlAppleMaps?.(cliente.direccion)} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-3 text-sm font-black text-white shadow-sm">
                          <MapPinned size={15} />
                          Mapa
                        </a>
                      )}

                      <button
                        onClick={() => compartirOrden?.(orden, "imprimir")}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-blue-50 px-3 text-sm font-black text-blue-700 shadow-sm hover:bg-blue-100"
                      >
                        <Printer size={15} />
                        Imprimir
                      </button>
                    </div>

                    <button
                      onClick={() => compartirOrden?.(orden, "mensaje")}
                      className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                      <Share2 size={15} />
                      Enviar reporte
                    </button>

                    {session?.role === "admin" && ["Completado", "Cancelada", "Necesita seguimiento"].includes(orden.estado) && (
                      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                        <button
                          onClick={() => corregirOrdenAdmin?.(orden.id)}
                          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 px-3 text-sm font-black text-white shadow-md hover:from-slate-950 hover:via-blue-950 hover:to-cyan-800"
                        >
                          <Pencil size={15} />
                          Corrección administrativa
                        </button>

                        {(orden.historialAdmin || []).length > 0 && (
                          <p className="mt-2 text-center text-[11px] font-black text-slate-600">
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
