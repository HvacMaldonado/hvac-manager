import {
  Ban,
  CalendarDays,
  CheckCheck,
  Clock3,
  MapPinned,
  NotebookPen,
  PhoneCall,
  PenLine,
  PlayCircle,
  Route,
  MapPinCheckInside,
  UserCog,
} from "lucide-react";

function getOrderDateKey(orden) {
  const raw = orden?.fechaProgramada || orden?.fecha || orden?.fechaCreacion || "";
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(raw))) return String(raw);

  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatTechTime(value) {
  if (!value) return "Sin hora";

  const match = String(value).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return String(value);

  let hour = Number(match[1]);
  const minute = match[2];
  const suffix = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${suffix}`;
}


function getTechnicianFlowState(orden) {
  if (orden.estado === "Completado") {
    return {
      label: "Completada",
      tone: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
  }

  if (orden.estado === "Cancelada") {
    return {
      label: "Cancelada",
      tone: "bg-rose-100 text-rose-800 border-rose-200",
    };
  }

  if (orden.estado === "Trabajo en progreso" || orden.horaInicio) {
    return {
      label: "Trabajo en progreso",
      tone: "bg-blue-100 text-blue-800 border-blue-200",
    };
  }

  if (orden.horaLlegada) {
    return {
      label: "Esperando inicio",
      tone: "bg-purple-100 text-purple-800 border-purple-200",
    };
  }

  if (orden.estado === "En ruta") {
    return {
      label: "En ruta",
      tone: "bg-cyan-100 text-cyan-800 border-cyan-200",
    };
  }

  return {
    label: "Asignada",
    tone: "bg-slate-100 text-slate-800 border-slate-200",
  };
}

export default function TecnicoCompactOrderCard({ orden, cliente, ordenProps }) {
  const direccion = cliente?.direccion || "";
  const telefono = cliente?.telefono || "";
  const tecnico = ordenProps?.obtenerTecnico?.(orden.tecnicoId);

  const fecha = getOrderDateKey(orden) || "Sin fecha";
  const hora = formatTechTime(orden.horaProgramada);

  const flowState = getTechnicianFlowState(orden);
  const prioridadColor = ordenProps?.colorPrioridad?.(orden.prioridad) || "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-300/70 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-2xl">
      <div className="h-2 bg-gradient-to-r from-blue-700 via-cyan-500 to-emerald-400" />
      <div className="border-b border-blue-900 bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-2xl font-black tracking-tight text-white">
                {cliente?.nombre || "Cliente eliminado"}
              </p>

              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${prioridadColor}`}>
                {orden.prioridad || "Media"}
              </span>
            </div>

            <p className="mt-3 line-clamp-2 rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold leading-relaxed text-white/95 backdrop-blur-sm">
              {orden.problema || "Sin problema reportado"}
            </p>

            <p className="mt-3 flex items-center gap-1.5 text-xs font-black text-cyan-100">
              <UserCog size={12} />
              Orden #{orden.id} · {tecnico?.nombre || "Sin técnico"}
            </p>
          </div>

          <span className={`shrink-0 rounded-2xl border border-white/20 bg-white/15 px-3 py-2 text-xs font-black text-white shadow-lg`} >
            {flowState.label}
          </span>
        </div>
      </div>

      <div className="grid gap-3 p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-4 shadow-md">
            <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
              <CalendarDays size={12} />
              Fecha
            </p>
            <p className="mt-1 truncate text-sm font-black text-slate-900">{fecha}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
              <Clock3 size={12} />
              Hora
            </p>
            <p className="mt-1 truncate text-sm font-black text-slate-900">{hora}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-4 shadow-md">
          <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
            <MapPinned size={12} />
            Dirección
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-700">
            {direccion || "Sin dirección"}
          </p>
        </div>

        {orden.horaLlegada && (
          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-3">
            <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-purple-700">
              <MapPinCheckInside size={12} />
              Llegada registrada
            </p>
            <p className="mt-1 text-sm font-black text-purple-950">
              {new Date(orden.horaLlegada).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })}
            </p>
          </div>
        )}


        {orden.notasTecnico && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
            <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-blue-700">
              <NotebookPen size={12} />
              Nota
            </p>
            <p className="mt-1 line-clamp-2 text-sm font-semibold text-blue-900">
              {orden.notasTecnico}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 rounded-3xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-5">
          {telefono && (
            <a
              href={ordenProps?.urlTelefono?.(telefono)}
              className="inline-flex h-12 items-center justify-center gap-1 rounded-2xl bg-emerald-700 px-3 text-xs font-black text-white shadow-md"
            >
              <PhoneCall size={13} />
              Llamar
            </a>
          )}

          {direccion && (
            <a
              href={ordenProps?.urlAppleMaps?.(direccion)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-1 rounded-2xl bg-slate-950 px-3 text-xs font-black text-white shadow-md"
            >
              <Route size={13} />
              Ruta
            </a>
          )}

          {!orden.horaLlegada && orden.estado !== "Trabajo en progreso" && orden.estado !== "Completado" && (
            <button
              onClick={() => ordenProps?.marcarLlegada?.(orden.id)}
              className="inline-flex h-12 items-center justify-center gap-1 rounded-2xl bg-purple-700 px-3 text-xs font-black text-white shadow-md"
            >
              <MapPinCheckInside size={13} />
              Llegué
            </button>
          )}

          {orden.horaLlegada && !orden.horaInicio && orden.estado !== "Completado" && (
            <div className="inline-flex h-12 items-center justify-center gap-1 rounded-2xl border border-purple-200 bg-purple-50 px-3 text-xs font-black text-purple-700 shadow-md">
              <MapPinCheckInside size={13} />
              Esperando inicio
            </div>
          )}

          {!orden.horaInicio && orden.estado !== "Completado" && (
            <button
              onClick={() => ordenProps?.iniciarTrabajo?.(orden.id)}
              className="inline-flex h-12 items-center justify-center gap-1 rounded-2xl bg-blue-700 px-3 text-xs font-black text-white shadow-md"
            >
              <PlayCircle size={13} />
              Iniciar
            </button>
          )}

          {orden.horaInicio && orden.estado !== "Completado" && (
            <div className="inline-flex h-12 items-center justify-center gap-1 rounded-2xl border border-blue-200 bg-blue-50 px-3 text-xs font-black text-blue-700 shadow-md">
              <PlayCircle size={13} />
              Trabajo en progreso
            </div>
          )}

          <button
            onClick={() => ordenProps?.completarOrden?.(orden.id)}
            className="inline-flex h-12 items-center justify-center gap-1 rounded-2xl bg-cyan-700 px-3 text-xs font-black text-white shadow-md"
          >
            <CheckCheck size={13} />
            Completar
          </button>

          <button
            onClick={() => ordenProps?.setFirmaOrdenModal?.(orden)}
            className="inline-flex h-12 items-center justify-center gap-1 rounded-2xl bg-slate-800 px-3 text-xs font-black text-white shadow-md"
          >
            <PenLine size={13} />
            {orden.firmaCliente ? "Firmada" : "Firma"}
          </button>

          <button
            onClick={() => ordenProps?.cancelarOrden?.(orden)}
            className="col-span-2 inline-flex h-12 items-center justify-center gap-1 rounded-2xl border border-rose-200 bg-rose-50 px-3 text-xs font-black text-rose-700 shadow-md sm:col-span-5"
          >
            <Ban size={13} />
            Cancelar orden
          </button>
        </div>
      </div>
    </article>
  );
}
