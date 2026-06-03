import {
  Ban,
  CalendarClock,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  FileText,
  LoaderCircle,
  MapPin,
  MapPinCheckInside,
  Route,
  Wrench,
} from "lucide-react";

function formatDateTime(value) {
  if (!value) return "Pendiente";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function TimelineItem({ icon: Icon, title, subtitle, time, done, tone = "blue" }) {
  const color =
    tone === "red"
      ? "bg-rose-600 text-white"
      : tone === "green"
        ? "bg-emerald-600 text-white"
        : tone === "amber"
          ? "bg-amber-500 text-white"
          : tone === "cyan"
            ? "bg-cyan-600 text-white"
            : "bg-blue-700 text-white";

  return (
    <div className="relative flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`z-10 flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm ${done ? color : "bg-slate-100 text-slate-400"}`}>
          <Icon size={18} />
        </div>
        <div className="h-full w-px bg-slate-200" />
      </div>

      <div className="min-w-0 pb-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-black text-slate-950">{title}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">{subtitle}</p>
            </div>

            <span className={`w-fit rounded-full px-2 py-1 text-[10px] font-black ${
              done ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"
            }`}>
              {done ? "Hecho" : "Pendiente"}
            </span>
          </div>

          <p className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-500">
            <Clock3 size={12} />
            {time}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderTimeline({ orden }) {
  if (!orden) return null;

  const fotos = orden.fotos || {};
  const fotosCount = ["antes", "durante", "despues"].filter((key) => fotos[key]).length;
  const materialesCount = (orden.materialesUsados || orden.materiales || []).length;

  const isCancelada = orden.estado === "Cancelada";
  const isCompletada = orden.estado === "Completado";

  const items = [
    {
      icon: ClipboardList,
      title: "Orden creada",
      subtitle: orden.origenCitaId ? "Creada desde una cita programada." : "Orden registrada en el sistema.",
      time: formatDateTime(orden.fechaCreacion || orden.fecha),
      done: Boolean(orden.fechaCreacion || orden.fecha),
      tone: "blue",
    },
    {
      icon: ClipboardCheck,
      title: "Asignada",
      subtitle: "La orden fue asignada a un técnico.",
      time: formatDateTime(orden.fechaCreacion || orden.fecha),
      done: Boolean(orden.tecnicoId),
      tone: "cyan",
    },
    {
      icon: Route,
      title: "En ruta",
      subtitle: "El técnico marcó o puede marcar que va en camino.",
      time: orden.estado === "En ruta" ? "Estado actual: En ruta" : "Sin registro",
      done: orden.estado === "En ruta" || Boolean(orden.horaInicio || orden.horaCierre || orden.fechaCompletada),
      tone: "cyan",
    },
    {
      icon: MapPinCheckInside,
      title: "Técnico llegó",
      subtitle: "Hora real de llegada al domicilio del cliente.",
      time: formatDateTime(orden.horaLlegada),
      done: Boolean(orden.horaLlegada),
      tone: "cyan",
    },
    {
      icon: LoaderCircle,
      title: "Trabajo iniciado",
      subtitle: "Inicio real del trabajo en campo.",
      time: formatDateTime(orden.horaInicio),
      done: Boolean(orden.horaInicio),
      tone: "blue",
    },
    {
      icon: Camera,
      title: "Evidencia fotográfica",
      subtitle: `${fotosCount}/3 fotos registradas: antes, durante y después.`,
      time: fotosCount > 0 ? "Fotos guardadas en la orden" : "Sin fotos",
      done: fotosCount > 0,
      tone: "amber",
    },
    {
      icon: Wrench,
      title: "Materiales / trabajo",
      subtitle: materialesCount > 0 ? `${materialesCount} material(es) registrado(s).` : "Sin materiales registrados.",
      time: materialesCount > 0 ? "Registro interno" : "Pendiente o no aplica",
      done: materialesCount > 0,
      tone: "blue",
    },
    {
      icon: CheckCircle2,
      title: "Orden completada",
      subtitle: isCompletada ? "El trabajo fue cerrado correctamente." : "Aún no está completada.",
      time: formatDateTime(orden.fechaCompletada),
      done: isCompletada,
      tone: "green",
    },
    {
      icon: Ban,
      title: "Cancelación",
      subtitle: isCancelada ? `${orden.cancelTipo || "Cancelada"} · ${orden.cancelReason || "Sin motivo registrado"}` : "No cancelada.",
      time: formatDateTime(orden.fechaCancelacion || (isCancelada ? orden.fechaCompletada : "")),
      done: isCancelada,
      tone: "red",
    },
  ];

  if (orden.fechaProgramada || orden.horaProgramada) {
    items.splice(2, 0, {
      icon: CalendarClock,
      title: "Programada",
      subtitle: `Fecha: ${orden.fechaProgramada || "Sin fecha"} · Hora: ${orden.horaProgramada || "Sin hora"}`,
      time: "Agenda",
      done: true,
      tone: "cyan",
    });
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-sm">
      <div className="mb-4">
        <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-blue-700">
          <FileText size={17} />
          Timeline de la orden
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Secuencia completa del trabajo desde que se creó hasta cierre o cancelación.
        </p>
      </div>

      <div className="space-y-0">
        {items.map((item, index) => (
          <TimelineItem key={`${item.title}-${index}`} {...item} />
        ))}
      </div>
    </section>
  );
}
