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
  ShieldAlert,
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
  const informeCO =
    ordenProps?.obtenerInformeCOPorOrden?.(orden.id) || null;

  const estadoCO = String(orden.estado || "")
    .trim()
    .toLowerCase();

  const informeCOFirmado =
    String(informeCO?.estado || "").toLowerCase() === "firmado";

  const estadoPermiteInformeCO =
    [
      "en sitio",
      "en proceso",
      "trabajo en progreso",
      "en trabajo",
      "necesita seguimiento",
    ].includes(estadoCO) ||
    Boolean(
      orden.horaLlegada ||
      orden.fechaLlegada ||
      orden.horaInicioTrabajo
    );

  const estadoFinalInformeCO = [
    "completado",
    "completada",
    "cerrado",
    "cerrada",
    "completed",
  ].includes(estadoCO);

  const estadoCanceladoInformeCO = [
    "cancelado",
    "cancelada",
    "cancelled",
    "canceled",
  ].includes(estadoCO);

  const mostrarInformeCO =
    !estadoCanceladoInformeCO &&
    (
      estadoPermiteInformeCO ||
      (
        estadoFinalInformeCO &&
        Boolean(informeCO)
      )
    );

  const etiquetaInformeCO = informeCOFirmado
    ? "Ver informe CO"
    : informeCO
      ? "Continuar informe CO"
      : "Generar informe CO";

  const fecha = getOrderDateKey(orden) || "Sin fecha";
  const hora = formatTechTime(orden.horaProgramada);

  const flowState = getTechnicianFlowState(orden);
  const prioridadColor = ordenProps?.colorPrioridad?.(orden.prioridad) || "bg-blue-50 text-blue-700 border-blue-200";

  const accionPrincipal = (() => {
    if (orden.estado === "Completado") {
      if (!orden.firmaCliente) {
        return {
          label: "Capturar firma",
          hint: "El trabajo ya fue completado. Falta confirmación del cliente.",
          icon: PenLine,
          onClick: () => ordenProps?.setFirmaOrdenModal?.(orden),
          className: "from-slate-800 to-slate-950",
        };
      }

      return {
        label: "Orden completada",
        hint: "Esta orden ya fue cerrada correctamente.",
        icon: CheckCheck,
        onClick: null,
        className: "from-emerald-600 to-cyan-600",
        disabled: true,
      };
    }

    if (orden.horaInicio || orden.estado === "Trabajo en progreso" || orden.estado === "En proceso") {
      return {
        label: "Finalizar trabajo",
        hint: "Cierra la orden, calcula horas y solicita firma/calificación.",
        icon: CheckCheck,
        onClick: () => ordenProps?.completarOrden?.(orden.id),
        className: "from-emerald-600 to-cyan-600",
      };
    }

    if (orden.horaLlegada || orden.estado === "En sitio") {
      return {
        label: "Comenzar trabajo",
        hint: "Inicia el conteo de horas reales de trabajo.",
        icon: PlayCircle,
        onClick: () => ordenProps?.iniciarTrabajo?.(orden.id),
        className: "from-blue-700 to-cyan-600",
      };
    }

    if (orden.estado === "En ruta") {
      return {
        label: "Llegué al sitio",
        hint: "Registra la llegada para calcular traslado.",
        icon: MapPinCheckInside,
        onClick: () => ordenProps?.marcarLlegada?.(orden.id),
        className: "from-purple-700 to-indigo-600",
      };
    }

    return {
      label: "Salir al cliente",
      hint: "Marca la orden en ruta y abre el flujo del servicio.",
      icon: Route,
      onClick: () =>
        ordenProps?.marcarEnRuta
          ? ordenProps.marcarEnRuta(orden.id)
          : ordenProps?.marcarLlegada?.(orden.id),
      className: "from-blue-700 to-cyan-600",
    };
  })();

  const AccionIcon = accionPrincipal.icon;

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

        <div className="space-y-3 rounded-3xl border border-cyan-100 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-4 shadow-xl shadow-cyan-900/20">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                Acción actual
              </p>
              <h4 className="mt-1 text-xl font-black text-white">
                {accionPrincipal.label}
              </h4>
            </div>

            <p className="max-w-md text-xs font-bold leading-relaxed text-white/55">
              {accionPrincipal.hint}
            </p>
          </div>

          <button
            type="button"
            disabled={accionPrincipal.disabled}
            onClick={accionPrincipal.onClick || undefined}
            className={`flex w-full items-center justify-center gap-3 rounded-[1.35rem] bg-gradient-to-r ${accionPrincipal.className} px-5 py-4 text-lg font-black text-white shadow-xl transition hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-80 disabled:hover:translate-y-0`}
          >
            <AccionIcon size={25} strokeWidth={2.7} />
            {accionPrincipal.label}
          </button>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {telefono && (
              <a
                href={ordenProps?.urlTelefono?.(telefono)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-3 text-xs font-black text-white shadow-md shadow-emerald-900/20"
              >
                <PhoneCall size={15} />
                Llamar
              </a>
            )}

            {direccion && (
              <a
                href={ordenProps?.urlAppleMaps?.(direccion)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-3 text-xs font-black text-slate-950 shadow-md"
              >
                <Route size={15} />
                Ruta
              </a>
            )}

            {mostrarInformeCO && (
              <button
                type="button"
                data-compact-co-button="true"
                onClick={() => ordenProps?.abrirInformeCO?.(orden)}
                className={
                  "inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-3 text-xs font-black text-white ring-1 " +
                  (informeCOFirmado
                    ? "bg-emerald-500/25 ring-emerald-300/30"
                    : informeCO
                      ? "bg-amber-500/25 ring-amber-300/30"
                      : "bg-violet-500/25 ring-violet-300/30")
                }
              >
                <ShieldAlert size={15} />
                {etiquetaInformeCO}
              </button>
            )}

            <button
              onClick={() => ordenProps?.setFirmaOrdenModal?.(orden)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white/10 px-3 text-xs font-black text-white ring-1 ring-white/15"
            >
              <PenLine size={15} />
              {orden.firmaCliente ? "Firmada" : "Firma"}
            </button>

            {orden.estado !== "Completado" && orden.estado !== "Cancelada" && (
              <button
                onClick={() => ordenProps?.cancelarOrden?.(orden)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-rose-300/30 bg-rose-500/15 px-3 text-xs font-black text-rose-100"
              >
                <Ban size={15} />
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
