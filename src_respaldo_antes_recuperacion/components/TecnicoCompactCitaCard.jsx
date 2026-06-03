import {
  CalendarDays,
  Clock3,
  MapPinned,
  PhoneCall,
  Route,
  UserRound,
  ClipboardPlus,
  CalendarClock,
} from "lucide-react";

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

export default function TecnicoCompactCitaCard({ cita, cliente, ordenProps }) {
  const direccion = cliente?.direccion || "";
  const telefono = cliente?.telefono || "";
  const fecha = cita.fecha || "Sin fecha";
  const hora = formatTechTime(cita.hora);

  return (
    <article className="overflow-hidden rounded-3xl border border-cyan-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-xl">
      <div className="border-b border-cyan-100 bg-gradient-to-br from-cyan-50 via-sky-50 to-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-lg font-black text-slate-950">
                {cliente?.nombre || "Cliente eliminado"}
              </p>

              <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-black text-cyan-700">
                {cita.estado === "Convertida en orden" ? "Convertida" : "Cita"}
              </span>
            </div>

            <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-600">
              {cita.motivo || "Cita programada"}
            </p>

            <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <UserRound size={12} />
              {cita.estado === "Reprogramada" ? "Cita reprogramada" : "Cliente programado"}
            </p>

            {cita.estado === "Reprogramada" && (
              <p className="mt-1 flex items-center gap-1 text-[11px] font-black text-cyan-700">
                <CalendarClock size={12} />
                Reprogramada: {cita.motivoReprogramacion || "Sin motivo"}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-2 p-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
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

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
            <MapPinned size={12} />
            Dirección
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-700">
            {direccion || "Sin dirección"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4">
          {telefono && (
            <a
              href={ordenProps?.urlTelefono?.(telefono)}
              className="inline-flex h-10 items-center justify-center gap-1 rounded-2xl bg-emerald-700 px-3 text-xs font-black text-white shadow-sm"
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
              className="inline-flex h-10 items-center justify-center gap-1 rounded-2xl bg-slate-950 px-3 text-xs font-black text-white shadow-sm"
            >
              <Route size={13} />
              Ruta
            </a>
          )}

          <button
            onClick={() => ordenProps?.setReprogramarCitaModal?.(cita)}
            className="inline-flex h-10 items-center justify-center gap-1 rounded-2xl bg-cyan-700 px-3 text-xs font-black text-white shadow-sm"
          >
            <CalendarClock size={13} />
            Reprogramar
          </button>

          <button
            onClick={() => ordenProps?.convertirCitaEnOrden?.(cita)}
            disabled={cita.estado === "Convertida en orden"}
            className="inline-flex h-10 items-center justify-center gap-1 rounded-2xl bg-blue-700 px-3 text-xs font-black text-white shadow-sm disabled:bg-slate-300 disabled:text-slate-500"
          >
            <ClipboardPlus size={13} />
            {cita.estado === "Convertida en orden" ? "Convertida" : "Crear orden"}
          </button>
        </div>
      </div>
    </article>
  );
}
