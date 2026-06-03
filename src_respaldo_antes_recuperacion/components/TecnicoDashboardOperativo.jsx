import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  PenLine,
  Timer,
  UserCog,
  XCircle,
} from "lucide-react";

function todayKey() {
  const d = new Date();

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dateKey(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return String(value);

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function hoursBetween(start, end) {
  if (!start || !end) return 0;

  const a = new Date(start);
  const b = new Date(end);

  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;

  return Math.max(0, (b - a) / 3600000);
}

function MetricCard({ icon: Icon, label, value, hint, tone }) {
  return (
    <div className={`overflow-hidden rounded-3xl border bg-white p-4 shadow-sm ${tone}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide opacity-70">{label}</p>
          <p className="mt-1 text-3xl font-black">{value}</p>
          {hint && <p className="mt-1 text-xs font-bold opacity-70">{hint}</p>}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/65 shadow-sm">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function TecnicoDashboardOperativo({ tecnico, ordenes = [], citas = [] }) {
  const today = todayKey();

  const ordenesHoy = ordenes.filter((o) => dateKey(o.fechaProgramada || o.fecha || o.fechaCreacion) === today && !["Completado", "Cancelada"].includes(o.estado));
  const citasHoy = citas.filter((c) => dateKey(c.fecha) === today && c.estado !== "Convertida en orden");

  const noAtendidas = ordenes.filter((o) => {
    const key = dateKey(o.fechaProgramada || o.fecha || o.fechaCreacion);
    return key && key < today && !["Completado", "Cancelada"].includes(o.estado);
  });

  const completadasHoy = ordenes.filter((o) => o.estado === "Completado" && dateKey(o.fechaCompletada) === today);
  const canceladasHoy = ordenes.filter((o) => o.estado === "Cancelada" && dateKey(o.fechaCancelacion || o.fechaCompletada) === today);

  const enProgreso = ordenes.filter((o) => o.estado === "Trabajo en progreso" || o.horaInicio);
  const firmasPendientes = ordenes.filter((o) => o.estado === "Completado" && !o.firmaCliente);

  const horasHoy = ordenes.reduce((sum, o) => {
    if (dateKey(o.fechaCompletada) !== today) return sum;

    if (o.duracionHoras) return sum + Number(o.duracionHoras || 0);

    return sum + hoursBetween(o.horaInicio, o.horaCierre);
  }, 0);

  const totalActivo = ordenes.filter((o) => !["Completado", "Cancelada"].includes(o.estado)).length;

  return (
    <section className="mb-4 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60">
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">Dashboard operativo</p>
            <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
              <UserCog size={24} />
              {tecnico?.nombre || tecnico?.usuario || "Técnico"}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Resumen rápido del trabajo de hoy, pendientes y productividad.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-4 py-3 text-center ring-1 ring-white/20">
            <p className="text-2xl font-black">{totalActivo}</p>
            <p className="text-[10px] font-black uppercase tracking-wide text-cyan-200">Activas</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 bg-[radial-gradient(circle_at_top_right,_#22d3ee33,_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={CalendarDays}
          label="Órdenes hoy"
          value={ordenesHoy.length}
          hint="Trabajo programado para hoy"
          tone="border-blue-200 text-blue-900"
        />

        <MetricCard
          icon={AlertTriangle}
          label="No atendidas"
          value={noAtendidas.length}
          hint="Pendientes de días anteriores"
          tone="border-rose-200 text-rose-900"
        />

        <MetricCard
          icon={CalendarDays}
          label="Citas hoy"
          value={citasHoy.length}
          hint="Agenda separada de órdenes"
          tone="border-cyan-200 text-cyan-900"
        />

        <MetricCard
          icon={Clock3}
          label="En progreso"
          value={enProgreso.length}
          hint="Trabajos iniciados"
          tone="border-indigo-200 text-indigo-900"
        />

        <MetricCard
          icon={CheckCircle2}
          label="Completadas hoy"
          value={completadasHoy.length}
          hint="Cerradas correctamente"
          tone="border-emerald-200 text-emerald-900"
        />

        <MetricCard
          icon={XCircle}
          label="Canceladas hoy"
          value={canceladasHoy.length}
          hint="Canceladas con motivo"
          tone="border-orange-200 text-orange-900"
        />

        <MetricCard
          icon={Timer}
          label="Horas hoy"
          value={horasHoy.toFixed(2)}
          hint="Según inicio/cierre"
          tone="border-slate-200 text-slate-900"
        />

        <MetricCard
          icon={PenLine}
          label="Firmas pendientes"
          value={firmasPendientes.length}
          hint="Órdenes completadas sin firma"
          tone="border-purple-200 text-purple-900"
        />
      </div>

      {(noAtendidas.length > 0 || firmasPendientes.length > 0) && (
        <div className="grid gap-3 border-t border-slate-200 bg-white p-4 md:grid-cols-2">
          {noAtendidas.length > 0 && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3">
              <p className="flex items-center gap-2 text-sm font-black text-rose-800">
                <AlertTriangle size={16} />
                Atención
              </p>
              <p className="mt-1 text-sm font-semibold text-rose-700">
                Hay {noAtendidas.length} orden(es) pendiente(s) de días anteriores.
              </p>
            </div>
          )}

          {firmasPendientes.length > 0 && (
            <div className="rounded-2xl border border-purple-200 bg-purple-50 p-3">
              <p className="flex items-center gap-2 text-sm font-black text-purple-800">
                <PenLine size={16} />
                Firmas pendientes
              </p>
              <p className="mt-1 text-sm font-semibold text-purple-700">
                Hay {firmasPendientes.length} orden(es) completada(s) sin firma del cliente.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
