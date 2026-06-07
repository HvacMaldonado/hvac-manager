import { getTecnicoThemeById } from "../utils/tecnicoThemes";
import { useMemo, useState } from "react";
import {
  CalendarCheck2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  MapPin,
  Navigation,
  Phone,
  Search,
  UserCog,
  Users,
} from "lucide-react";

function toDateKey(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return String(value);
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function todayKey() {
  return toDateKey(new Date());
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function monthGrid(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

function formatTime(value) {
  if (!value) return "Sin hora";

  const raw = String(value).trim();

  const match = raw.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return raw;

  let hour = Number(match[1]);
  const minute = match[2];

  if (Number.isNaN(hour)) return raw;

  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${suffix}`;
}

function eventTone(type, status) {
  if (type === "orden") {
    if (status === "Urgente") return "border-rose-200 bg-rose-50 text-rose-800";
    if (status === "Alta") return "border-violet-200 bg-violet-50 text-violet-900";
    return "border-blue-200 bg-blue-50 text-blue-800";
  }

  return "border-cyan-200 bg-cyan-50 text-cyan-800";
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-center backdrop-blur">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-[9px] font-black uppercase tracking-wide text-cyan-200">{label}</p>
    </div>
  );
}

function CalendarEvent({ event }) {
  return (
    <article className={`group/event relative overflow-hidden rounded-[1.25rem] border py-3 pl-4 pr-3 text-xs shadow-md ring-1 ring-white/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${event.theme?.event || eventTone(event.type, event.prioridad)}`}>
      <div className={`absolute left-0 top-0 h-full w-2 ${event.theme?.dot || "bg-slate-400"}`} />
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/45 blur-2xl" />

      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="line-clamp-2 flex items-start gap-2 text-[13px] font-black leading-tight">
            <span className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-white shadow-md ${event.theme?.dot || "bg-slate-400"}`} />
            {event.title}
          </p>
          <p className="mt-1 line-clamp-1 pl-6 text-[10px] font-black uppercase tracking-wide opacity-70">
            {event.tecnico}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-white/80 px-2 py-1 text-[8px] font-black uppercase shadow-sm">
          {event.type}
        </span>
      </div>

      <div className="relative mt-2 flex items-center justify-between gap-2">
        <p className="flex items-center gap-1 rounded-full bg-white/65 px-2 py-1 text-[11px] font-black shadow-sm">
          <Clock3 size={12} />
          {formatTime(event.time)}
        </p>

        {event.prioridad && (
          <span className="rounded-full bg-white/70 px-2 py-1 text-[8px] font-black uppercase shadow-sm">
            {event.prioridad}
          </span>
        )}
      </div>

      <p className="relative mt-2 line-clamp-2 text-[11px] font-semibold leading-snug opacity-80">
        {event.subtitle}
      </p>
    </article>
  );
}

function DayCell({ date, events, isCurrentMonth, onSelectDay }) {
  const key = toDateKey(date);
  const isToday = key === todayKey();
  const hasEvents = events.length > 0;

  return (
    <button
      onClick={() => onSelectDay(key)}
      className={`group/day relative min-h-[150px] overflow-hidden rounded-[1.7rem] border p-2.5 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isToday
          ? "border-cyan-300 bg-gradient-to-br from-cyan-50 via-white to-blue-50 shadow-lg shadow-cyan-100/80 ring-4 ring-cyan-100"
          : hasEvents && isCurrentMonth
            ? "border-blue-100 bg-gradient-to-br from-white via-sky-50/70 to-cyan-50/60 shadow-md shadow-slate-200/70"
            : isCurrentMonth
              ? "border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm"
              : "border-slate-100 bg-slate-50/60 opacity-60"
      }`}
    >
      <div className="pointer-events-none absolute -right-12 -top-14 h-28 w-28 rounded-full bg-cyan-200/25 blur-3xl transition group-hover/day:bg-cyan-300/35" />

      <div className="relative mb-2 flex items-center justify-between">
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-2xl text-xs font-black shadow-sm ${
          isToday ? "bg-cyan-700 text-white" : hasEvents ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"
        }`}>
          {date.getDate()}
        </span>
        {events.length > 0 && (
          <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black text-white shadow-md">
            {events.length}
          </span>
        )}
      </div>

      <div className="relative space-y-1.5">
        {events.slice(0, 3).map((event) => (
          <CalendarEvent key={event.id} event={event} />
        ))}

        {events.length > 3 && (
          <p className="rounded-full border border-slate-200 bg-white/80 px-2 py-1 text-center text-[10px] font-black text-slate-600 shadow-sm">
            +{events.length - 3} más
          </p>
        )}
      </div>
    </button>
  );
}

export default function CalendarioPage({
  t = (key) => key,
  lang = "es",
  citas = [],
  ordenes = [],
  clientes = [],
  tecnicos = [],
  obtenerCliente,
  obtenerTecnico,
  urlAppleMaps,
  urlTelefono,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [vista, setVista] = useState("mes");
  const [tecnicoFiltro, setTecnicoFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [diaSeleccionado, setDiaSeleccionado] = useState(todayKey());

  const events = useMemo(() => {
    const citaEvents = citas.map((cita) => {
      const cliente = obtenerCliente(cita.clienteId);
      const tecnico = obtenerTecnico(cita.tecnicoId);

      const theme = getTecnicoThemeById(tecnicos, cita.tecnicoId);

      return {
        id: `cita-${cita.id}`,
        rawId: cita.id,
        type: "cita",
        title: cliente?.nombre || "Cliente eliminado",
        subtitle: cita.motivo || "Cita programada",
        date: toDateKey(cita.fecha),
        time: cita.hora || "",
        tecnicoId: cita.tecnicoId,
        tecnico: tecnico?.nombre || "Sin técnico",
        cliente,
        direccion: cliente?.direccion || "",
        telefono: cliente?.telefono || "",
        estado: cita.estado || "Programada",
        theme,
      };
    });

    const ordenEvents = ordenes
      .filter((orden) => !["Completado", "Cancelada"].includes(orden.estado))
      .map((orden) => {
        const cliente = obtenerCliente(orden.clienteId);
        const tecnico = obtenerTecnico(orden.tecnicoId);

        const theme = getTecnicoThemeById(tecnicos, orden.tecnicoId);

        return {
          id: `orden-${orden.id}`,
          rawId: orden.id,
          type: "orden",
          title: cliente?.nombre || "Cliente eliminado",
          subtitle: orden.problema || "Orden de trabajo",
          date: toDateKey(orden.fechaProgramada || orden.fecha || orden.fechaCreacion),
          time: orden.horaProgramada || "",
          tecnicoId: orden.tecnicoId,
          tecnico: tecnico?.nombre || "Sin técnico",
          cliente,
          direccion: cliente?.direccion || "",
          telefono: cliente?.telefono || "",
          estado: orden.estado || "Asignada",
          prioridad: orden.prioridad || "Media",
          theme,
        };
      });

    const q = busqueda.toLowerCase().trim();

    return [...citaEvents, ...ordenEvents]
      .filter((event) => {
        const matchTecnico = tecnicoFiltro === "todos" || String(event.tecnicoId) === String(tecnicoFiltro);
        const matchTexto = !q || [event.title, event.subtitle, event.tecnico, event.direccion, event.type]
          .some((v) => String(v || "").toLowerCase().includes(q));

        return event.date && matchTecnico && matchTexto;
      })
      .sort((a, b) => `${a.date} ${a.time || "99:99"}`.localeCompare(`${b.date} ${b.time || "99:99"}`));
  }, [citas, ordenes, obtenerCliente, obtenerTecnico, tecnicoFiltro, busqueda, tecnicos]);

  const eventsByDay = useMemo(() => {
    const map = {};
    events.forEach((event) => {
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    });
    return map;
  }, [events]);

  const selectedEvents = eventsByDay[diaSeleccionado] || [];
  const monthDays = monthGrid(currentDate);
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const visibleDays = vista === "semana" ? weekDays : monthDays;

  const goPrevious = () => {
    const next = new Date(currentDate);
    if (vista === "semana") next.setDate(next.getDate() - 7);
    else next.setMonth(next.getMonth() - 1);
    setCurrentDate(next);
  };

  const goNext = () => {
    const next = new Date(currentDate);
    if (vista === "semana") next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const goToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setDiaSeleccionado(todayKey());
  };

  const citasCount = events.filter((e) => e.type === "cita").length;
  const ordenesCount = events.filter((e) => e.type === "orden").length;
  const todayEvents = eventsByDay[todayKey()] || [];

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">{t("visualAgenda")}</p>
              <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
                <CalendarCheck2 size={24} />
                {t("calendar")}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                {t("calendarDescription")}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <MiniMetric label="Eventos" value={events.length} />
              <MiniMetric label="Citas" value={citasCount} />
              <MiniMetric label="Hoy" value={todayEvents.length} />
            </div>
          </div>
        </div>

        <div className="grid gap-3 bg-[radial-gradient(circle_at_top_right,_#22d3ee33,_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-4 lg:grid-cols-[1fr_220px_180px_auto]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar cliente, técnico, dirección o trabajo..."
              className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <select
            value={tecnicoFiltro}
            onChange={(e) => setTecnicoFiltro(e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          >
            <option value="todos">Todos los técnicos</option>
            {tecnicos.map((tec) => <option key={tec.id} value={tec.id}>{tec.nombre}</option>)}
          </select>

          <div className="flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setVista("mes")}
              className={`flex-1 rounded-xl px-3 py-2 text-xs font-black transition ${vista === "mes" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-white"}`}
            >
              Mes
            </button>
            <button
              onClick={() => setVista("semana")}
              className={`flex-1 rounded-xl px-3 py-2 text-xs font-black transition ${vista === "semana" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-white"}`}
            >
              Semana
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={goPrevious} className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm">
              <ChevronLeft size={18} />
            </button>
            <button onClick={goToday} className="rounded-2xl bg-slate-950 px-4 text-sm font-black text-white shadow-sm">
              Hoy
            </button>
            <button onClick={goNext} className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-300/50">
        <div className="mb-3 flex items-center gap-2">
          <UserCog size={18} className="text-blue-700" />
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">Colores por técnico</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {tecnicos.map((tec) => {
            const theme = getTecnicoThemeById(tecnicos, tec.id);

            return (
              <span key={tec.id} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black ${theme.event}`}>
                <span className={`h-3 w-3 rounded-full ${theme.dot}`} />
                {tec.nombre}
              </span>
            );
          })}

          {tecnicos.length === 0 && (
            <span className="text-sm font-semibold text-slate-500">No hay técnicos activos.</span>
          )}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-300/60">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-700">
                {vista === "semana" ? "Vista semanal" : "Vista mensual"}
              </p>
              <h3 className="text-xl font-black text-slate-950">
                {currentDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-black">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700">Órdenes {ordenesCount}</span>
              <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-cyan-700">Citas {citasCount}</span>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase tracking-wide text-slate-500">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => <span key={day}>{day}</span>)}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {visibleDays.map((date) => {
              const key = toDateKey(date);
              return (
                <DayCell
                  key={key}
                  date={date}
                  events={eventsByDay[key] || []}
                  isCurrentMonth={date.getMonth() === currentDate.getMonth() || vista === "semana"}
                  onSelectDay={setDiaSeleccionado}
                />
              );
            })}
          </div>
        </section>

        <aside className="h-fit overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60">
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-4 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300">Detalle del día</p>
            <h3 className="mt-1 flex items-center gap-2 text-xl font-black">
              <CalendarDays size={20} />
              {diaSeleccionado}
            </h3>
          </div>

          <div className="space-y-3 p-3">
            {selectedEvents.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm font-semibold text-slate-500">
                No hay eventos para este día.
              </div>
            )}

            {selectedEvents.map((event) => (
              <article key={event.id} className={`relative overflow-hidden rounded-[1.8rem] border p-4 shadow-md ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:shadow-xl ${event.theme?.event || eventTone(event.type, event.prioridad)}`}>
                <div className={`absolute left-0 top-0 h-full w-2 ${event.theme?.dot || "bg-slate-400"}`} />
                <div className="absolute -right-10 -top-12 h-28 w-28 rounded-full bg-white/40 blur-3xl" />

                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-start gap-2 text-lg font-black leading-tight">
                      <span className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-white shadow-md ${event.theme?.dot || "bg-slate-400"}`} />
                      <span className="line-clamp-2">{event.title}</span>
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm font-semibold opacity-80">{event.subtitle}</p>
                    <p className="mt-1 text-[11px] font-black uppercase tracking-wide opacity-70">
                      {event.tecnico}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase shadow-sm">
                      {event.type}
                    </span>
                    {event.prioridad && (
                      <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase shadow-sm">
                        {event.prioridad}
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
                    <p className="text-[9px] font-black uppercase opacity-70">Hora</p>
                    <p className="mt-1 flex items-center gap-1 text-sm font-black">
                      <Clock3 size={13} />
                      {formatTime(event.time)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
                    <p className="text-[9px] font-black uppercase opacity-70">Técnico</p>
                    <p className="mt-1 truncate text-sm font-black">{event.tecnico}</p>
                  </div>
                </div>

                <p className="relative mt-3 line-clamp-2 rounded-2xl bg-white/60 p-3 text-xs font-semibold opacity-85 shadow-sm">
                  <MapPin size={12} className="mr-1 inline" />
                  {event.direccion || "Sin dirección"}
                </p>

                <div className="relative mt-3 flex flex-wrap gap-2">
                  {event.telefono && (
                    <a href={urlTelefono?.(event.telefono) || `tel:${event.telefono}`} className="inline-flex h-10 items-center gap-1 rounded-2xl bg-emerald-700 px-3 text-xs font-black text-white shadow-md transition hover:-translate-y-0.5">
                      <Phone size={13} />
                      Llamar
                    </a>
                  )}

                  {event.direccion && (
                    <a href={urlAppleMaps?.(event.direccion)} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-1 rounded-2xl bg-slate-950 px-3 text-xs font-black text-white shadow-md transition hover:-translate-y-0.5">
                      <Navigation size={13} />
                      Mapa
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
