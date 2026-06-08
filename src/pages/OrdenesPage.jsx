import { useState, useMemo } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MapPin,
  Navigation,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserCog,
  Wrench,

  Mail,
  MessageCircle,
  Printer,
  Share2,
  MoreHorizontal,
  X,} from "lucide-react";

const iconProps = { size: 18, strokeWidth: 2 };

const PRIORIDADES = [
  { value: "Baja", help: "mantenimiento normal", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "Media", help: "servicio programado", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "Alta", help: "cliente sin aire o calefacción", cls: "bg-sky-50 text-sky-700 border-sky-200" },
  { value: "Urgente", help: "emergencia / sistema detenido", cls: "bg-rose-50 text-rose-700 border-rose-200" },
];

function IconText({ icon: Icon, children, className = "" }) {
  return <span className={`inline-flex items-center gap-2 ${className}`}><Icon {...iconProps} />{children}</span>;
}

function formatPhoneDisplay(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length !== 10) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatReportDate(value) {
  if (!value) return new Date().toLocaleDateString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

function ModernField({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <div className="relative col-span-1">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        {children}
      </div>
    </label>
  );
}

function FormSection({ icon: Icon, title, subtitle, tone = "blue", children }) {
  const toneClasses = {
    blue: "from-white to-blue-50/70 bg-blue-100 text-blue-700",
    cyan: "from-white to-cyan-50/80 bg-cyan-100 text-cyan-700",
    slate: "from-white to-slate-50 bg-slate-100 text-slate-700",
    rose: "from-white to-rose-50/70 bg-rose-100 text-rose-700",
  };

  const classes = toneClasses[tone] || toneClasses.blue;
  const parts = classes.split(" ");
  const gradient = parts.slice(0, 2).join(" ");
  const iconBg = parts[2];
  const iconText = parts[3];

  return (
    <section className={`rounded-3xl border border-slate-200 bg-gradient-to-br ${gradient} p-4`}>
      <div className="mb-3 flex items-center gap-2">
        <div className={`inline-flex h-10 w-9 items-center justify-center rounded-2xl ${iconBg} ${iconText}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-black text-slate-950">{title}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function PriorityChips({ value, onChange }) {
  const iconByPriority = {
    Baja: CheckCircle2,
    Media: Clock3,
    Alta: AlertCircle,
    Urgente: AlertTriangle,
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {PRIORIDADES.map((p) => {
        const Icon = iconByPriority[p.value] || AlertTriangle;
        const active = value === p.value;

        return (
          <button
            key={p.value}
            type="button"
            onClick={() => onChange(p.value)}
            className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${
              active
                ? `${p.cls} ring-4 ring-cyan-100 shadow-lg`
                : "border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:bg-cyan-50"
            }`}
          >
            <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-white/40 blur-xl" />

            <div className="relative flex items-center gap-3">
              <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                active
                  ? "bg-white/70"
                  : "bg-slate-100 text-slate-500 group-hover:bg-cyan-100 group-hover:text-cyan-700"
              }`}>
                <Icon size={18} />
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-black">{p.value}</p>
                <p className="truncate text-[11px] opacity-75">{p.help}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function OrdenesPage({ t, ordenes, obtenerCliente, ordenProps, crearOrden, ordenForm, setOrdenForm, busquedaClienteOrden, setBusquedaClienteOrden, clientesFiltradosOrden, tecnicos }) {
  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [periodoOrdenes, setPeriodoOrdenes] = useState("semana");

  const seleccionarCliente = (c) => {
    setOrdenForm({ ...ordenForm, clienteId: String(c.id) });
    setBusquedaClienteOrden(`${c.nombre} - ${c.telefono || ""}`);
    setMostrarClientes(false);
  };

  const inputClass = "w-full rounded-2xl border border-slate-300 bg-white p-3 pl-10 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100";

  return (
    <section className="grid w-full min-w-0 grid-cols-1 gap-5 2xl:grid-cols-[minmax(460px,540px)_minmax(0,1fr)]">
      <section className="h-fit overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">{t("quickOrder")}</p>
              <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
                <ClipboardList size={24} />
                {t("createOrderTitle")}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                {t("createOrderDescription")}
              </p>
            </div>

            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20">
              <Sparkles size={24} />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden border-t border-cyan-200/40 bg-slate-950 p-[1px]">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_#22d3ee55,_transparent_30%),radial-gradient(circle_at_bottom_left,_#2563eb38,_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-4">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-300/35 blur-3xl" />
            <div className="absolute -bottom-16 left-8 h-44 w-44 rounded-full bg-blue-500/25 blur-3xl" />

            <div className="relative space-y-4">
              <FormSection icon={Search} title={t("customer")} subtitle={t("selectCustomerForOrder")} tone="blue">
                <div className="relative">
                  <input
                    value={busquedaClienteOrden}
                    onFocus={() => setMostrarClientes(Boolean(busquedaClienteOrden.trim()))}
                    onChange={(e) => {
                      setBusquedaClienteOrden(e.target.value);
                      setMostrarClientes(Boolean(e.target.value.trim()));
                    }}
                    placeholder={t("customerSearchPlaceholder")}
                    className="w-full rounded-2xl border border-slate-300 bg-white p-3 pr-10 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  />
                  <Search size={17} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />

                  {mostrarClientes && clientesFiltradosOrden.length > 0 && (
                    <div className="absolute left-0 right-0 z-20 mt-2 max-h-64 overflow-auto rounded-3xl border border-slate-200 bg-white shadow-xl">
                      {clientesFiltradosOrden.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => seleccionarCliente(c)}
                          className="block w-full px-4 py-3 text-left transition hover:bg-blue-50"
                        >
                          <p className="font-black text-slate-950">{c.nombre}</p>
                          <p className="text-xs text-slate-500">{c.telefono} · {c.direccion}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </FormSection>

              <FormSection icon={CalendarCheck2} title={t("scheduling")} subtitle={t("schedulingDescription")} tone="cyan">
                <div className="grid grid-cols-2 gap-2">
                  <ModernField label={t("scheduledDate")} icon={CalendarDays}>
                    <input
                      type="date"
                      value={ordenForm.fechaProgramada || ""}
                      onChange={(e) => setOrdenForm({ ...ordenForm, fechaProgramada: e.target.value })}
                      className={inputClass}
                    />
                  </ModernField>

                  <ModernField label={t("scheduledTime")} icon={Clock3}>
                    <input
                      type="time"
                      value={ordenForm.horaProgramada || ""}
                      onChange={(e) => setOrdenForm({ ...ordenForm, horaProgramada: e.target.value })}
                      className={inputClass}
                    />
                  </ModernField>
                </div>
              </FormSection>

              <FormSection icon={ClipboardList} title={t("reportedProblem")} subtitle={t("reportedProblemDescription")} tone="slate">
                <textarea
                  value={ordenForm.problema}
                  onChange={(e) => setOrdenForm({ ...ordenForm, problema: e.target.value })}
                  placeholder={t("reportedProblem")}
                  className="w-full min-h-28 rounded-2xl border border-slate-300 bg-white p-3 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                />
              </FormSection>

              <FormSection icon={UserCog} title={t("assignedTechnician")} subtitle={t("assignedTechnicianDescription")} tone="blue">
                <div className="grid grid-cols-2 gap-2">
                  {tecnicos.map((tec, tecIndex) => {
                    const theme = getTecnicoTheme(String(tec.id), tecIndex);
                    const selected = String(ordenForm.tecnicoId) === String(tec.id);

                    return (
                      <button
                        key={tec.id}
                        disabled={!ordenForm.clienteId || tec.activo === false}
                        onClick={() => setOrdenForm({ ...ordenForm, tecnicoId: tec.id })}
                        className={`rounded-2xl border px-3 py-3 text-left transition disabled:opacity-40 ${
                          selected ? theme.buttonActive : theme.buttonIdle
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`h-3 w-3 shrink-0 rounded-full ${theme.dot}`} />
                          <UserCog size={16} />
                          <span className="truncate font-black">{tec.nombre}</span>
                        </span>
                        <span className="mt-1 block text-[10px] font-black uppercase tracking-wide opacity-70">
                          {t("themeLabel")} {themeNameLabel(theme.name, t)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </FormSection>

              <FormSection icon={AlertTriangle} title={t("priority")} subtitle={t("priorityDescription")} tone="rose">
                <PriorityChips value={ordenForm.prioridad} onChange={(p) => setOrdenForm({ ...ordenForm, prioridad: p })} />
              </FormSection>

              <button
                onClick={crearOrden}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-blue-900 to-cyan-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5"
              >
                <Send size={16} />
                Asignar al técnico
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 min-w-0 rounded-3xl border border-white/70 bg-white/95 p-3 2xl:p-5 shadow-xl shadow-blue-100/70 backdrop-blur">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-700">{t("administrativeTracking")}</p>
            <h2 className="flex items-center gap-2 text-xl 2xl:text-2xl font-black">
              <ShieldCheck {...iconProps} />
              {t("generatedOrdersList")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {t("generatedOrdersDescription")}
            </p>
          </div>

          <div className="flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
            {[
              ["semana", t("week")],
              ["mes", t("month")],
              ["ano", t("year")],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setPeriodoOrdenes(id)}
                className={`rounded-xl px-3 py-2 text-xs font-black transition ${
                  periodoOrdenes === id
                    ? "bg-slate-950 text-white shadow"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <AdminOrdenesRegistro
          ordenes={ordenes}
          obtenerCliente={obtenerCliente}
          ordenProps={ordenProps}
          periodo={periodoOrdenes}
          t={t}
        />
      </section>
    </section>
  );
}

function getOrdenDate(orden) {
  return orden.fechaProgramada || orden.fechaCreacion || orden.fechaCompletada || orden.fecha || "";
}

function getStartOfWeek(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

function getGroupKeyByPeriod(orden, periodo, t = (key) => key) {
  const raw = getOrdenDate(orden);
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return t("noDate");

  if (periodo === "semana") {
    const start = getStartOfWeek(d);
    return `${t("weekOf")} ${formatReportDate(start)}`;
  }

  if (periodo === "mes") {
    return d.toLocaleDateString("es-US", { month: "long", year: "numeric" });
  }

  return String(d.getFullYear());
}


const TECNICO_CARD_THEMES = [
  {
    name: "Azul",
    header: "bg-gradient-to-r from-blue-950 via-blue-800 to-cyan-600",
    chip: "bg-cyan-300/25 text-cyan-50 ring-cyan-100/30",
    border: "border-cyan-300",
    body: "bg-cyan-50/70",
    buttonActive: "border-cyan-400 bg-cyan-50 text-cyan-800 ring-4 ring-cyan-100",
    buttonIdle: "border-cyan-200 bg-white text-slate-700 hover:border-cyan-400 hover:bg-cyan-50",
    dot: "bg-cyan-400",
  },
  {
    name: "Verde",
    header: "bg-gradient-to-r from-emerald-950 via-emerald-800 to-lime-600",
    chip: "bg-lime-300/25 text-lime-50 ring-lime-100/30",
    border: "border-emerald-300",
    body: "bg-emerald-50/75",
    buttonActive: "border-emerald-400 bg-emerald-50 text-emerald-800 ring-4 ring-emerald-100",
    buttonIdle: "border-emerald-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50",
    dot: "bg-emerald-400",
  },
  {
    name: "Morado",
    header: "bg-gradient-to-r from-violet-950 via-purple-800 to-fuchsia-600",
    chip: "bg-fuchsia-300/25 text-fuchsia-50 ring-fuchsia-100/30",
    border: "border-violet-300",
    body: "bg-violet-50/75",
    buttonActive: "border-violet-400 bg-violet-50 text-violet-800 ring-4 ring-violet-100",
    buttonIdle: "border-violet-200 bg-white text-slate-700 hover:border-violet-400 hover:bg-violet-50",
    dot: "bg-violet-400",
  },
  {
    name: "Naranja",
    header: "bg-gradient-to-r from-orange-950 via-orange-800 to-amber-500",
    chip: "bg-amber-300/30 text-amber-50 ring-amber-100/30",
    border: "border-orange-300",
    body: "bg-orange-50/80",
    buttonActive: "border-orange-400 bg-orange-50 text-orange-800 ring-4 ring-orange-100",
    buttonIdle: "border-orange-200 bg-white text-slate-700 hover:border-orange-400 hover:bg-orange-50",
    dot: "bg-orange-400",
  },
  {
    name: "Rosa",
    header: "bg-gradient-to-r from-pink-950 via-rose-800 to-red-600",
    chip: "bg-rose-300/25 text-rose-50 ring-rose-100/30",
    border: "border-rose-300",
    body: "bg-rose-50/75",
    buttonActive: "border-rose-400 bg-rose-50 text-rose-800 ring-4 ring-rose-100",
    buttonIdle: "border-rose-200 bg-white text-slate-700 hover:border-rose-400 hover:bg-rose-50",
    dot: "bg-rose-400",
  },
  {
    name: "Gris",
    header: "bg-gradient-to-r from-slate-950 via-slate-800 to-zinc-600",
    chip: "bg-slate-300/25 text-slate-50 ring-slate-100/30",
    border: "border-slate-300",
    body: "bg-slate-100",
    buttonActive: "border-slate-400 bg-slate-100 text-slate-900 ring-4 ring-slate-200",
    buttonIdle: "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100",
    dot: "bg-slate-400",
  },
];

function getTecnicoTheme(tecnicoKey, index = 0) {
  if (tecnicoKey === "sin-tecnico") {
    return {
      name: "Sin técnico",
      header: "bg-gradient-to-r from-red-950 via-orange-800 to-amber-600",
      chip: "bg-amber-300/25 text-amber-50 ring-amber-100/30",
      border: "border-amber-300",
      body: "bg-amber-50/80",
      buttonActive: "border-amber-400 bg-amber-50 text-amber-800 ring-4 ring-amber-100",
      buttonIdle: "border-amber-200 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50",
      dot: "bg-amber-400",
    };
  }

  return TECNICO_CARD_THEMES[index % TECNICO_CARD_THEMES.length];
}

function getTecnicoThemeById(tecnicos = [], tecnicoId) {
  const index = tecnicos.findIndex((tec) => String(tec.id) === String(tecnicoId));
  return getTecnicoTheme(tecnicoId ? String(tecnicoId) : "sin-tecnico", index >= 0 ? index : 0);
}

function themeNameLabel(name, t = (key) => key) {
  const map = {
    Azul: t("blue"),
    Verde: t("green"),
    Morado: t("purple"),
    Naranja: t("orange"),
    Rosa: t("pink"),
    Gris: t("gray"),
    "Sin técnico": t("noTechnician"),
  };

  return map[name] || name;
}

function AdminOrdenesRegistro({ ordenes, obtenerCliente, ordenProps, periodo, t = (key) => key }) {
  const grupos = useMemo(() => {
    const porTecnico = {};

    ordenes.forEach((orden) => {
      const tecnico = ordenProps.obtenerTecnico?.(orden.tecnicoId);
      const tecnicoKey = orden.tecnicoId ? String(orden.tecnicoId) : "sin-tecnico";
      const tecnicoNombre = tecnico?.nombre || t("noAssignedTechnician");

      if (!porTecnico[tecnicoKey]) {
        porTecnico[tecnicoKey] = {
          tecnicoKey,
          tecnicoNombre,
          total: 0,
          urgentes: 0,
          atrasadas: 0,
          periodos: {},
        };
      }

      porTecnico[tecnicoKey].total += 1;

      if (orden.prioridad === "Urgente") {
        porTecnico[tecnicoKey].urgentes += 1;
      }

      const fechaOrden = getOrdenDate(orden);
      const hoy = new Date().toISOString().slice(0, 10);
      if (fechaOrden && String(fechaOrden).slice(0, 10) < hoy) {
        porTecnico[tecnicoKey].atrasadas += 1;
      }

      const periodoKey = getGroupKeyByPeriod(orden, periodo, t);
      if (!porTecnico[tecnicoKey].periodos[periodoKey]) {
        porTecnico[tecnicoKey].periodos[periodoKey] = [];
      }

      porTecnico[tecnicoKey].periodos[periodoKey].push(orden);
    });

    return Object.values(porTecnico)
      .sort((a, b) => {
        if (a.tecnicoKey === "sin-tecnico") return 1;
        if (b.tecnicoKey === "sin-tecnico") return -1;
        return a.tecnicoNombre.localeCompare(b.tecnicoNombre);
      })
      .map((grupoTecnico) => ({
        ...grupoTecnico,
        periodos: Object.entries(grupoTecnico.periodos)
          .map(([key, lista]) => ({
            key,
            lista: lista.sort((a, b) => String(getOrdenDate(b)).localeCompare(String(getOrdenDate(a)))),
          }))
          .sort((a, b) => String(b.key).localeCompare(String(a.key))),
      }));
  }, [ordenes, periodo, ordenProps]);

  if (ordenes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
        {t("noGeneratedOrdersYet")}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {grupos.map((grupoTecnico, tecnicoIndex) => { const theme = getTecnicoTheme(grupoTecnico.tecnicoKey, tecnicoIndex); return (
        <section key={grupoTecnico.tecnicoKey} className={`overflow-hidden rounded-3xl border ${theme.border} bg-white shadow-xl shadow-slate-200/70`}>
          <div className={`flex flex-col gap-3 px-4 py-4 text-white lg:flex-row lg:items-center lg:justify-between ${theme.header}`}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-200">
                {t("assignedTechnicianLabel")}
              </p>

              <h3 className="mt-1 flex items-center gap-2 text-xl font-black">
                <span className={`inline-flex h-4 w-4 rounded-full ${theme.dot} ring-4 ring-white/20`} />
                <UserCog size={20} />
                {grupoTecnico.tecnicoNombre}
                <span className={`rounded-full px-2 py-1 text-[10px] font-black ring-1 ${theme.chip}`}>
                  {themeNameLabel(theme.name, t)}
                </span>
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-2xl px-3 py-2 text-xs font-black ring-1 ${theme.chip}`}>
                {grupoTecnico.total} {t("ordersLabel")}
              </span>

              <span className={`rounded-2xl px-3 py-2 text-xs font-black ring-1 ${theme.chip}`}>
                {t("urgentPlural")} {grupoTecnico.urgentes}
              </span>

              <span className={`rounded-2xl px-3 py-2 text-xs font-black ring-1 ${theme.chip}`}>
                {t("overduePlural")} {grupoTecnico.atrasadas}
              </span>
            </div>
          </div>

          <div className={`space-y-3 border-t p-3 ${theme.border} ${theme.body}`}>
            {grupoTecnico.periodos.map((grupoPeriodo) => (
              <div key={`${grupoTecnico.tecnicoKey}-${grupoPeriodo.key}`} className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
                      {t("period")}
                    </p>
                    <h4 className="text-sm font-black capitalize text-slate-950">
                      {grupoPeriodo.key}
                    </h4>
                  </div>

                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                    {grupoPeriodo.lista.length} {t("ordersLabel")}
                  </span>
                </div>

                <div className="divide-y divide-slate-200">
                  {grupoPeriodo.lista.map((orden) => (
                    <AdminOrdenRow
                      key={orden.id}
                      orden={orden}
                      cliente={obtenerCliente(orden.clienteId)}
                      ordenProps={ordenProps}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      );})}
    </div>
  );
}

function AdminOrdenRow({ orden, cliente, ordenProps, t = (key) => key }) {
  const [shareOpen, setShareOpen] = useState(false);

  const tecnico = ordenProps.obtenerTecnico(orden.tecnicoId);
  const direccion = cliente?.direccion || "";
  const telefono = cliente?.telefono || "";

  const compartir = (metodo) => {
    setShareOpen(false);
    ordenProps.compartirOrden?.(orden, metodo);
  };

  return (
    <article className="relative border-b border-slate-100 bg-white transition last:border-b-0 hover:bg-blue-50/50">
      <div className="grid grid-cols-1 gap-3 px-4 py-3 xl:grid-cols-[minmax(260px,1fr)_132px_132px_150px_150px_260px] xl:items-center">
        <div className="min-w-0">
          <p className="truncate text-base font-black text-slate-950">
            {cliente?.nombre || t("deletedCustomer")}
          </p>

          <p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-600">
            {orden.problema || t("noReportedProblem")}
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-400">
            {t("orderId")} #{orden.id}
          </p>
        </div>

        <div className="flex h-14 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <ShieldCheck size={15} />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wide text-slate-500">{t("status")}</p>
            <p className={`truncate rounded-full border px-2 py-0.5 text-[10px] font-black ${ordenProps.colorEstado(orden.estado)}`}>
              {orden.estado}
            </p>
          </div>
        </div>

        <div className="flex h-14 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <AlertTriangle size={15} />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wide text-slate-500">{t("priority")}</p>
            <p className={`truncate rounded-full border px-2 py-0.5 text-[10px] font-black ${ordenProps.colorPrioridad(orden.prioridad)}`}>
              {orden.prioridad}
            </p>
          </div>
        </div>

        <div className="flex h-14 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2.5">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <UserCog size={15} />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wide text-slate-500">{t("technician")}</p>
            <p className="truncate text-xs font-black text-slate-900">{tecnico?.nombre || t("unassigned")}</p>
          </div>
        </div>

        <div className="flex h-14 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
            <CalendarDays size={15} />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wide text-slate-500">{t("scheduledLabel")}</p>
            <p className="truncate text-xs font-black text-slate-800">{orden.fechaProgramada || orden.fecha || t("noDate")}</p>
            <p className="truncate text-[10px] font-semibold text-slate-500">{orden.horaProgramada || t("time")}</p>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-2 xl:ml-auto">
          {telefono && (
            <a href={ordenProps.urlTelefono(telefono)} className="inline-flex h-10 w-[120px] items-center justify-center gap-1 rounded-xl bg-emerald-700 px-2.5 text-xs font-black text-white shadow-sm">
              <Phone size={13} />
              {t("call")}
            </a>
          )}

          {direccion && (
            <a href={ordenProps.urlAppleMaps(direccion)} target="_blank" rel="noreferrer" className="inline-flex h-10 w-[120px] items-center justify-center gap-1 rounded-xl bg-slate-950 px-2.5 text-xs font-black text-white shadow-sm">
              <Navigation size={13} />
              {t("map")}
            </a>
          )}

          <button onClick={() => compartir("imprimir")} className="inline-flex h-10 w-[120px] items-center justify-center gap-1 rounded-xl bg-blue-700 px-2.5 text-xs font-black text-white shadow-sm">
            <Printer size={13} />
            {t("print")}
          </button>

          <div className="relative">
            <button onClick={() => setShareOpen((v) => !v)} className="inline-flex h-10 w-[120px] items-center justify-center gap-1 rounded-xl bg-cyan-700 px-2.5 text-xs font-black text-white shadow-sm">
              <Share2 size={13} />
              {t("share")}
            </button>

            {shareOpen && (
              <>
                <button type="button" aria-label={t("closeShareMenu")} className="fixed inset-0 z-[998]" onClick={() => setShareOpen(false)} />

                <div className="absolute right-0 top-11 z-[999] w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-400/40">
                  <button onClick={() => compartir("whatsapp")} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-black text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">
                    <MessageCircle size={14} />
                    WhatsApp
                  </button>

                  <button onClick={() => compartir("messenger")} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-black text-slate-700 hover:bg-sky-50 hover:text-sky-700">
                    <Send size={14} />
                    Messenger
                  </button>

                  <button onClick={() => compartir("mensaje")} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-black text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                    <Share2 size={14} />
                    {t("share")} sistema
                  </button>

                  <button onClick={() => compartir("email")} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-black text-slate-700 hover:bg-slate-50">
                    <Mail size={14} />
                    Email
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
