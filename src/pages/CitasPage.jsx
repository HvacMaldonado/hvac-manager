import { useMemo, useState } from "react";
import {
  CalendarCheck2,
  CalendarDays,
  Clock3,
  ClipboardList,
  Filter,
  MapPin,
  Phone,
  Search,
  Sparkles,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";

function formatPhoneDisplay(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length !== 10) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function toDateKey(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return String(value);
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayKey() {
  return toDateKey(new Date());
}

function isTodayValue(value) {
  return toDateKey(value) === todayKey();
}

function isFutureValue(value) {
  const key = toDateKey(value);
  return key && key > todayKey();
}

function MiniAgendaStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-center backdrop-blur">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-[9px] font-black uppercase tracking-wide text-cyan-200">{label}</p>
    </div>
  );
}

function ModernField({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        {children}
      </div>
    </label>
  );
}

function FormSection({ icon: Icon, title, subtitle, children, tone = "blue" }) {
  const toneClasses = {
    blue: "from-white to-blue-50/70 bg-blue-100 text-blue-700",
    cyan: "from-white to-cyan-50/80 bg-cyan-100 text-cyan-700",
    slate: "from-white to-slate-50 bg-slate-100 text-slate-700",
  };

  const classes = toneClasses[tone] || toneClasses.blue;
  const parts = classes.split(" ");
  const gradient = parts.slice(0, 2).join(" ");
  const iconBg = parts[2];
  const iconText = parts[3];

  return (
    <section className={`rounded-3xl border border-slate-200 bg-gradient-to-br ${gradient} p-4`}>
      <div className="mb-3 flex items-center gap-2">
        <div className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ${iconBg} ${iconText}`}>
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

export default function CitasPage({ t, citas, setCitas, citaForm, setCitaForm, crearCita, clientes, tecnicos, obtenerCliente, obtenerTecnico }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [ordenVista, setOrdenVista] = useState("fecha");

  const citasVisibles = useMemo(() => {
    const q = busqueda.toLowerCase().trim();

    let lista = citas.filter((cita) => {
      const cliente = obtenerCliente(cita.clienteId);
      const tecnico = obtenerTecnico(cita.tecnicoId);

      const matchTexto = !q || [cliente?.nombre, cliente?.telefono, cliente?.direccion, tecnico?.nombre, cita.motivo, cita.fecha, cita.hora, cita.notas]
        .some((v) => String(v || "").toLowerCase().includes(q));

      const estado = String(cita.estado || "Programada");
      const matchEstado = filtroEstado === "todas" || estado === filtroEstado;

      return matchTexto && matchEstado;
    });

    if (ordenVista === "cliente") {
      lista = [...lista].sort((a, b) => String(obtenerCliente(a.clienteId)?.nombre || "").localeCompare(String(obtenerCliente(b.clienteId)?.nombre || "")));
    } else if (ordenVista === "tecnico") {
      lista = [...lista].sort((a, b) => String(obtenerTecnico(a.tecnicoId)?.nombre || "").localeCompare(String(obtenerTecnico(b.tecnicoId)?.nombre || "")));
    } else {
      lista = [...lista].sort((a, b) => `${a.fecha || ""} ${a.hora || ""}`.localeCompare(`${b.fecha || ""} ${b.hora || ""}`));
    }

    return lista;
  }, [citas, busqueda, filtroEstado, ordenVista, obtenerCliente, obtenerTecnico]);

  const cambiarEstadoCita = (id, estado) => {
    setCitas(citas.map((cita) => cita.id === id ? { ...cita, estado } : cita));
  };

  const inputClass = "w-full rounded-2xl border border-slate-300 bg-white p-3 pl-10 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100";

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">Agenda</p>
              <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
                <CalendarDays size={24} />
                Citas
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <MiniAgendaStat label="Total" value={citas.length} />
              <MiniAgendaStat label="Hoy" value={citas.filter((c) => isTodayValue(c.fecha)).length} />
              <MiniAgendaStat label="Próximas" value={citas.filter((c) => isFutureValue(c.fecha)).length} />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden border-t border-cyan-200/40 bg-slate-950 p-[1px]">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_#22d3ee55,_transparent_30%),radial-gradient(circle_at_bottom_left,_#2563eb38,_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-4 2xl:p-5">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-300/40 blur-3xl" />
            <div className="absolute -bottom-20 left-20 h-56 w-56 rounded-full bg-blue-500/25 blur-3xl" />

            <div className="relative grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
              <aside className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white shadow-xl shadow-slate-300/60">
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20">
                    <Sparkles size={24} />
                  </div>
                  <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-cyan-200">
                    Nueva
                  </span>
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
                  Agenda rápida
                </p>

                <h3 className="mt-1 text-2xl font-black leading-tight">
                  Crear cita
                </h3>

                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-300">
                  Selecciona cliente, técnico, fecha y motivo para dejar la visita programada.
                </p>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                    <Users size={18} className="text-cyan-300" />
                    <div>
                      <p className="text-xs font-black">Cliente</p>
                      <p className="text-[10px] text-slate-300">Quién recibirá el servicio</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                    <UserCog size={18} className="text-cyan-300" />
                    <div>
                      <p className="text-xs font-black">Técnico</p>
                      <p className="text-[10px] text-slate-300">Quién atenderá la cita</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                    <CalendarCheck2 size={18} className="text-cyan-300" />
                    <div>
                      <p className="text-xs font-black">Fecha y hora</p>
                      <p className="text-[10px] text-slate-300">Programación clara</p>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl shadow-slate-300/50 backdrop-blur">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-700">
                      Formulario moderno
                    </p>
                    <h4 className="text-lg font-black text-slate-950">
                      Datos de la cita
                    </h4>
                  </div>

                  <button
                    onClick={crearCita}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-blue-900 to-cyan-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5"
                  >
                    <CalendarCheck2 size={16} />
                    Guardar cita
                  </button>
                </div>

                <div className="space-y-4">
                  <FormSection icon={Users} title="Cliente y técnico" subtitle="Selecciona quién recibe y quién atiende" tone="blue">
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      <ModernField label="Cliente" icon={Users}>
                        <select
                          value={citaForm.clienteId}
                          onChange={(e) => setCitaForm({ ...citaForm, clienteId: e.target.value })}
                          className={inputClass}
                        >
                          <option value="">Seleccionar cliente</option>
                          {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                        </select>
                      </ModernField>

                      <ModernField label="Técnico" icon={UserCog}>
                        <select
                          value={citaForm.tecnicoId}
                          onChange={(e) => setCitaForm({ ...citaForm, tecnicoId: e.target.value })}
                          className={inputClass}
                        >
                          <option value="">Seleccionar técnico</option>
                          {tecnicos.map((tec) => <option key={tec.id} value={tec.id}>{tec.nombre}</option>)}
                        </select>
                      </ModernField>
                    </div>
                  </FormSection>

                  <FormSection icon={CalendarCheck2} title="Programación" subtitle="Fecha y hora de la visita" tone="cyan">
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      <ModernField label="Fecha" icon={CalendarDays}>
                        <input
                          type="date"
                          value={citaForm.fecha}
                          onChange={(e) => setCitaForm({ ...citaForm, fecha: e.target.value })}
                          className={inputClass}
                        />
                      </ModernField>

                      <ModernField label="Hora" icon={Clock3}>
                        <input
                          type="time"
                          value={citaForm.hora}
                          onChange={(e) => setCitaForm({ ...citaForm, hora: e.target.value })}
                          className={inputClass}
                        />
                      </ModernField>
                    </div>
                  </FormSection>

                  <FormSection icon={ClipboardList} title="Detalle de la visita" subtitle="Describe el motivo de la cita" tone="slate">
                    <ModernField label="Motivo" icon={ClipboardList}>
                      <input
                        value={citaForm.motivo}
                        onChange={(e) => setCitaForm({ ...citaForm, motivo: e.target.value })}
                        placeholder="Ej. Revisión de aire acondicionado"
                        className={inputClass}
                      />
                    </ModernField>
                  </FormSection>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de citas */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">Tabla dinámica</p>
            <h3 className="flex items-center gap-2 text-xl font-black text-slate-950">
              <Clock3 size={20} />
              Listado de citas
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[260px_160px_160px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar cita..."
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-100"
            >
              <option value="todas">Todas</option>
              <option value="Programada">Programadas</option>
              <option value="Cancelada">Canceladas</option>
              <option value="Completada">Completadas</option>
            </select>

            <select
              value={ordenVista}
              onChange={(e) => setOrdenVista(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-100"
            >
              <option value="fecha">Fecha</option>
              <option value="cliente">Cliente</option>
              <option value="tecnico">Técnico</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <div className="min-w-[960px]">
            <div className="grid grid-cols-[1fr_1fr_1fr_1.3fr_1fr_180px] gap-3 bg-slate-950 px-4 py-3 text-[11px] font-black uppercase tracking-wide text-white">
              <span>Fecha / Hora</span>
              <span>Cliente</span>
              <span>Técnico</span>
              <span>Motivo</span>
              <span>Estado</span>
              <span className="text-right">Acciones</span>
            </div>

            <div className="divide-y divide-slate-200">
              {citasVisibles.length === 0 && (
                <div className="p-6 text-center text-sm text-slate-500">No hay citas para mostrar.</div>
              )}

              {citasVisibles.map((cita) => {
                const cliente = obtenerCliente(cita.clienteId);
                const tecnico = obtenerTecnico(cita.tecnicoId);
                const estado = cita.estado || "Programada";

                return (
                  <article key={cita.id} className="grid grid-cols-[1fr_1fr_1fr_1.3fr_1fr_180px] gap-3 px-4 py-3 text-sm transition hover:bg-blue-50/50">
                    <div>
                      <p className="flex items-center gap-1.5 font-black text-slate-950">
                        <CalendarDays size={14} />
                        {cita.fecha || "Sin fecha"}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock3 size={13} />
                        {cita.hora || "Sin hora"}
                      </p>
                    </div>

                    <div>
                      <p className="truncate font-black text-slate-800">{cliente?.nombre || "Cliente eliminado"}</p>
                      <p className="truncate text-xs text-slate-500">{formatPhoneDisplay(cliente?.telefono || "")}</p>
                    </div>

                    <div>
                      <p className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-1 text-xs font-black text-blue-700">
                        <UserCog size={13} />
                        {tecnico?.nombre || "Sin técnico"}
                      </p>
                    </div>

                    <p className="line-clamp-2 text-slate-600">{cita.motivo || "Sin motivo"}</p>

                    <select
                      value={estado}
                      onChange={(e) => cambiarEstadoCita(cita.id, e.target.value)}
                      className={`h-fit rounded-xl border px-2 py-1 text-xs font-black outline-none ${
                        estado === "Cancelada" ? "border-rose-200 bg-rose-50 text-rose-700" :
                        estado === "Completada" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                        "border-cyan-200 bg-cyan-50 text-cyan-700"
                      }`}
                    >
                      <option>Programada</option>
                      <option>Completada</option>
                      <option>Cancelada</option>
                    </select>

                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                      {cliente?.telefono && (
                        <a href={`tel:${cliente.telefono}`} className="inline-flex min-w-[78px] items-center justify-center gap-1 rounded-xl bg-emerald-700 px-2 py-1.5 text-[11px] font-black text-white">
                          <Phone size={12} />
                          Llamar
                        </a>
                      )}

                      <button
                        onClick={() => {
                          if (window.confirm("¿Eliminar esta cita?")) {
                            setCitas(citas.filter((x) => x.id !== cita.id));
                          }
                        }}
                        className="inline-flex min-w-[78px] items-center justify-center gap-1 rounded-xl bg-red-50 px-2 py-1.5 text-[11px] font-black text-red-700"
                      >
                        <Trash2 size={12} />
                        Eliminar
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
