import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Clock3,
  History,
  LoaderCircle,
  Navigation,
  Package,
  Phone,
  UserCog,
  Wrench,
} from "lucide-react";
import {
  getDayName,
  isFutureValue,
  isTodayValue,
  sortByDateTime,
  toDateKey,
  todayKey,
} from "../../lib/shared.jsx";
import { OrdenesGrid, OrdenCard } from "../ordenes/OrdenesPage.jsx";

export function TecnicoWorkDashboard({
  t,
  session,
  clientes = [],
  citas = [],
  ordenesActivasTecnico = [],
  historialTecnico = [],
  herramientas = [],
  obtenerCliente,
  obtenerTecnico,
  ordenProps,
}) {
  const [vista, setVista] = useState("hoy");

  const citasTecnico = citas
    .filter((c) => String(c.tecnicoId) === String(session.id))
    .sort(sortByDateTime);

  const citasHoy = citasTecnico.filter((c) => isTodayValue(c.fecha));
  const citasProximas = citasTecnico.filter((c) => isFutureValue(c.fecha));
  const ordenesHoy = ordenesActivasTecnico.filter((o) => isTodayValue(o.fechaCreacion || o.fecha));
  const pendientes = ordenesActivasTecnico.filter((o) => o.estado === "Pendiente");
  const enProceso = ordenesActivasTecnico.filter((o) => o.estado === "En proceso");

  const completadasSemana = historialTecnico.filter((o) => {
    const key = toDateKey(o.fechaCompletada || o.horaCierre);
    if (!key) return false;
    const diff = (new Date(`${todayKey()}T00:00:00`) - new Date(`${key}T00:00:00`)) / 86400000;
    return diff >= 0 && diff <= 7;
  });

  const tabs = [
    { id: "hoy", label: t("today"), icon: CalendarDays, count: ordenesHoy.length + citasHoy.length, tone: "from-blue-600 to-cyan-500" },
    { id: "pendientes", label: t("pending"), icon: ClipboardList, count: pendientes.length, tone: "from-slate-800 to-blue-900" },
    { id: "proceso", label: t("inProgress"), icon: LoaderCircle, count: enProceso.length, tone: "from-cyan-700 to-blue-700" },
    { id: "proximas", label: t("upcoming"), icon: Clock3, count: citasProximas.length, tone: "from-indigo-700 to-sky-700" },
    { id: "completadas", label: t("completed"), icon: CheckCircle2, count: historialTecnico.length, tone: "from-emerald-800 to-teal-700" },
    { id: "todas", label: t("all"), icon: CircleDot, count: ordenesActivasTecnico.length, tone: "from-neutral-900 to-slate-700" },
  ];

  const ordenesVista =
    vista === "hoy" ? ordenesHoy :
    vista === "pendientes" ? pendientes :
    vista === "proceso" ? enProceso :
    vista === "completadas" ? historialTecnico :
    vista === "todas" ? ordenesActivasTecnico :
    [];

  const citasVista =
    vista === "hoy" ? citasHoy :
    vista === "proximas" ? citasProximas :
    [];

  return (
    <section className="space-y-3 2xl:space-y-5">
      <div className="relative overflow-hidden rounded-2xl 2xl:rounded-[2rem] border border-slate-800/20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-3 2xl:p-6 text-white shadow-2xl shadow-slate-900/30">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-blue-600/20 blur-2xl" />

        <div className="relative grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <p className="text-[10px] 2xl:text-xs font-black uppercase tracking-[0.25em] text-cyan-300">{t("technicianDashboard")}</p>
            <h2 className="mt-1 text-xl 2xl:text-3xl font-black tracking-tight">
              {t("todayWorkWelcome")} {session.nombre}. {t("todayTasks")} {getDayName(new Date())}
            </h2>
            <p className="mt-1 max-w-2xl text-xs 2xl:text-sm text-slate-300">{t("reviewAssignedWork")}</p>
          </div>

          <div className="grid grid-cols-4 gap-1.5 2xl:gap-2">
            <TechMiniStat icon={CalendarDays} label={t("today")} value={ordenesHoy.length + citasHoy.length} />
            <TechMiniStat icon={ClipboardList} label={t("pending")} value={pendientes.length} />
            <TechMiniStat icon={LoaderCircle} label={t("inProgress")} value={enProceso.length} />
            <TechMiniStat icon={CheckCircle2} label="7 días" value={completadasSemana.length} />
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 2xl:gap-2 overflow-x-auto rounded-2xl border border-slate-700/20 bg-slate-950/90 p-1.5 2xl:p-2 shadow-xl shadow-slate-900/20 [-webkit-overflow-scrolling:touch]">
        {tabs.map(({ id, label, icon: Icon, count, tone }) => (
          <button
            key={id}
            onClick={() => setVista(id)}
            className={`inline-flex shrink-0 items-center gap-1.5 2xl:gap-2 rounded-xl px-2.5 2xl:px-4 py-2 2xl:py-3 text-[10px] 2xl:text-sm font-black transition ${
              vista === id ? `bg-gradient-to-r ${tone} text-white shadow-lg shadow-cyan-900/25` : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            <Icon size={12} className="2xl:hidden" strokeWidth={2.3} />
            <Icon size={18} className="hidden 2xl:block" strokeWidth={2.3} />
            <span>{label}</span>
            <span className="rounded-full bg-white/15 px-1.5 2xl:px-2 py-0.5 text-[9px] 2xl:text-xs">{count}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 2xl:gap-5 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0 rounded-2xl 2xl:rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50/60 p-3 2xl:p-5 shadow-xl shadow-slate-300/40 backdrop-blur">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-base 2xl:text-2xl font-black text-slate-950">
                <ClipboardList size={18} className="2xl:hidden" />
                <ClipboardList size={24} className="hidden 2xl:block" />
                {tabs.find((tab) => tab.id === vista)?.label || t("orders")}
              </h3>
              <p className="text-xs 2xl:text-sm text-slate-500">
                {vista === "proximas" ? t("scheduledAppointmentsInfo") : t("assignedToYourProfile")}
              </p>
            </div>
          </div>

          {citasVista.length > 0 && (
            <div className="mb-3 grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))]">
              {citasVista.map((cita) => (
                <CitaTecnicoCard
                  key={cita.id}
                  t={t}
                  cita={cita}
                  cliente={obtenerCliente(cita.clienteId)}
                  tecnico={obtenerTecnico(cita.tecnicoId)}
                  urlAppleMaps={ordenProps.urlAppleMaps}
                  urlTelefono={ordenProps.urlTelefono}
                />
              ))}
            </div>
          )}

          {ordenesVista.length > 0 ? (
            vista === "completadas" ? (
              <div className="space-y-2 2xl:space-y-3">
                {ordenesVista.map((o) => (
                  <OrdenCard key={o.id} orden={o} cliente={obtenerCliente(o.clienteId)} compacta {...ordenProps} />
                ))}
              </div>
            ) : (
              <OrdenesGrid ordenes={ordenesVista} obtenerCliente={obtenerCliente} ordenProps={ordenProps} />
            )
          ) : citasVista.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <Clock3 className="mx-auto mb-2 text-slate-400" size={28} />
              <p className="font-black text-slate-700">{t("noJobsInView")}</p>
              <p className="text-sm text-slate-500">{t("changeFilterOrWait")}</p>
            </div>
          ) : null}
        </section>

        <aside className="rounded-2xl 2xl:rounded-[2rem] border border-slate-800/10 bg-gradient-to-br from-slate-950 to-blue-950 p-3 2xl:p-5 text-white shadow-xl shadow-slate-900/25">
          <h3 className="mb-3 flex items-center gap-2 text-base 2xl:text-xl font-black">
            <Wrench size={18} />
            {t("technicianSummary")}
          </h3>

          <div className="space-y-2">
            <TechSideMetric icon={CalendarDays} label={t("todayAppointments")} value={citasHoy.length} />
            <TechSideMetric icon={Clock3} label={t("upcomingAppointments")} value={citasProximas.length} />
            <TechSideMetric icon={Package} label={t("assignedTools")} value={herramientas.length} />
            <TechSideMetric icon={History} label={t("completedJobs")} value={historialTecnico.length} />
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-3">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-200">{t("nextAppointment")}</p>
            {citasProximas[0] ? (
              <div className="mt-2 text-sm">
                <p className="font-black">{obtenerCliente(citasProximas[0].clienteId)?.nombre || t("customerNotFound")}</p>
                <p className="text-slate-300">{citasProximas[0].fecha} · {citasProximas[0].hora}</p>
                <p className="text-slate-400">{citasProximas[0].motivo || t("noReason")}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-300">{t("noUpcomingAppointments")}</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export function TechMiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-2 2xl:p-3 text-center backdrop-blur">
      <Icon className="mx-auto mb-1 text-cyan-300" size={14} />
      <p className="text-lg 2xl:text-3xl font-black leading-none">{value}</p>
      <p className="mt-1 text-[9px] 2xl:text-xs font-black uppercase tracking-wide text-slate-300">{label}</p>
    </div>
  );
}

export function TechSideMetric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/10 px-3 py-2">
      <span className="inline-flex items-center gap-2 text-xs 2xl:text-sm text-slate-200">
        <Icon size={15} className="text-cyan-300" />
        {label}
      </span>
      <span className="text-lg 2xl:text-xl font-black">{value}</span>
    </div>
  );
}

export function CitaTecnicoCard({ t, cita, cliente, tecnico, urlAppleMaps, urlTelefono }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-3 shadow-sm">
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-300/30 blur-xl" />
      <div className="relative">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm 2xl:text-base font-black text-slate-950">{cliente?.nombre || t("customerNotFound")}</p>
            <p className="text-xs text-slate-500">{cita.fecha} · {cita.hora}</p>
          </div>
          <span className="rounded-full border border-cyan-200 bg-cyan-100 px-2 py-0.5 text-[10px] font-black text-cyan-800">{t("appointment")}</span>
        </div>

        <p className="mb-2 line-clamp-2 text-xs 2xl:text-sm text-slate-700">{cita.motivo || t("noReason")}</p>
        <p className="mb-3 line-clamp-2 text-xs text-slate-500">{cliente?.direccion || t("noAddress")}</p>

        <div className="flex flex-wrap gap-1.5">
          {cliente?.direccion && (
            <a href={urlAppleMaps(cliente.direccion)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl bg-slate-950 px-2 py-1 text-[11px] font-bold text-white">
              <Navigation size={12} /> {t("map")}
            </a>
          )}
          {cliente?.telefono && (
            <a href={urlTelefono(cliente.telefono)} className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-2 py-1 text-[11px] font-bold text-white">
              <Phone size={12} /> {t("call")}
            </a>
          )}
          <span className="inline-flex items-center gap-1 rounded-xl bg-white px-2 py-1 text-[11px] font-bold text-slate-700 border">
            <UserCog size={12} /> {tecnico?.nombre || ""}
          </span>
        </div>
      </div>
    </article>
  );
}
