import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Edit3,
  History,
  PackageCheck,
  PackageOpen,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  Wrench,
} from "lucide-react";

const ESTADOS_HERRAMIENTA = ["Disponible", "Asignada", "Dañada", "Perdida", "Devuelta"];

function toolStatusKey(estado) {
  const map = {
    Disponible: "statusAvailable",
    Asignada: "statusAssigned",
    Dañada: "statusDamaged",
    Perdida: "statusLost",
    Devuelta: "statusReturned",
  };
  return map[estado] || "statusAvailable";
}

function Metric({ icon: Icon, label, value, tone }) {
  return (
    <div className={`flex min-w-[112px] items-center gap-2 rounded-2xl bg-gradient-to-br ${tone} px-3 py-2 text-white shadow-sm`}>
      <Icon size={15} />
      <div>
        <p className="text-sm font-black leading-none">{value}</p>
        <p className="mt-0.5 text-[9px] font-black uppercase tracking-wide text-white/75">{label}</p>
      </div>
    </div>
  );
}

function EstadoBadge({ estado, t }) {
  const cls =
    estado === "Dañada" || estado === "Perdida"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : estado === "Devuelta"
        ? "border-slate-200 bg-slate-50 text-slate-700"
        : estado === "Asignada"
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700";

  const Icon = estado === "Dañada" || estado === "Perdida" ? AlertTriangle : estado === "Devuelta" ? History : CheckCircle2;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black ${cls}`}>
      <Icon size={12} />
      {t(toolStatusKey(estado || "Disponible"))}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export default function HerramientasPage({
  t,
  herramientas,
  herramientaForm,
  setHerramientaForm,
  agregarHerramienta,
  actualizarHerramienta,
  setHerramientas,
  eliminarHerramienta,
  tecnicos,
  obtenerTecnico,
  tecnicoHerramientasSeleccionado,
  setTecnicoHerramientasSeleccionado,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [editando, setEditando] = useState(null);

  const tecnicoSeleccionado = obtenerTecnico(tecnicoHerramientasSeleccionado);

  const herramientasFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();

    return herramientas.filter((h) => {
      const tecnico = obtenerTecnico(h.tecnicoId);

      const matchTecnico = tecnicoHerramientasSeleccionado
        ? String(h.tecnicoId) === String(tecnicoHerramientasSeleccionado)
        : true;

      const matchEstado = estadoFiltro === "todos" || String(h.estado || "Disponible") === estadoFiltro;

      const matchTexto = !q || [h.nombre, h.estado, h.notas, tecnico?.nombre]
        .some((v) => String(v || "").toLowerCase().includes(q));

      return matchTecnico && matchEstado && matchTexto;
    });
  }, [herramientas, busqueda, estadoFiltro, tecnicoHerramientasSeleccionado, obtenerTecnico]);

  const totalAsignadas = herramientas.filter((h) => h.tecnicoId).length;
  const alertas = herramientas.filter((h) => ["Dañada", "Perdida"].includes(h.estado)).length;
  const devueltas = herramientas.filter((h) => h.estado === "Devuelta").length;
  const disponibles = herramientas.filter((h) => (h.estado || "Disponible") === "Disponible").length;

  const inputClass = "w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100";
  const rowInputClass = "w-full rounded-xl border border-slate-300 bg-white p-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  const agregarHerramientaParaTecnico = async () => {
    if (!tecnicoHerramientasSeleccionado) {
      alert(t("selectTechnicianAlert"));
      return;
    }

    if (!herramientaForm.nombre) {
      alert(t("enterToolNameAlert"));
      return;
    }

    await agregarHerramienta({
      nombre: herramientaForm.nombre,
      tecnicoId: tecnicoHerramientasSeleccionado,
      cantidad: Number(herramientaForm.cantidad || 1),
      estado: herramientaForm.estado || "Asignada",
      notas: herramientaForm.notas || "",
    });

    setHerramientaForm({
      nombre: "",
      tecnicoId: tecnicoHerramientasSeleccionado,
      cantidad: "",
      estado: "Asignada",
      notas: "",
    });
  };

  const cambiarTecnicoPrincipal = (id) => {
    setTecnicoHerramientasSeleccionado(id);
    setHerramientaForm({ ...herramientaForm, tecnicoId: id, estado: herramientaForm.estado || "Asignada" });
  };

  const devolverHerramienta = (id) => {
    setHerramientas(herramientas.map((h) =>
      h.id === id
        ? { ...h, estado: "Devuelta", fechaDevolucion: new Date().toISOString() }
        : h
    ));
  };

  const reasignarHerramienta = (id, tecnicoId) => {
    setHerramientas(herramientas.map((h) =>
      h.id === id
        ? { ...h, tecnicoId, estado: tecnicoId ? "Asignada" : "Disponible", fechaAsignacion: tecnicoId ? new Date().toISOString() : h.fechaAsignacion }
        : h
    ));
  };

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">{t("toolsAssignment")}</p>
              <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
                <Wrench size={24} />
                {t("technicianToolsTitle")}
              </h2>
              <p className="mt-1 text-sm text-slate-300">{t("technicianToolsDescription")}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <Metric icon={PackageOpen} label={t("availableTools")} value={disponibles} tone="from-emerald-800 to-teal-600" />
              <Metric icon={UserCog} label={t("assignedTools")} value={totalAsignadas} tone="from-blue-800 to-cyan-700" />
              <Metric icon={AlertTriangle} label={t("alerts")} value={alertas} tone="from-rose-800 to-red-700" />
              <Metric icon={History} label={t("returnedTools")} value={devueltas} tone="from-slate-800 to-slate-950" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden border-t border-cyan-200/40 bg-slate-950 p-[1px]">
          <div className="relative bg-[radial-gradient(circle_at_top_right,_#22d3ee55,_transparent_30%),radial-gradient(circle_at_bottom_left,_#2563eb38,_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-4">
            <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
              <aside className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white shadow-xl shadow-slate-300/60">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20">
                  <ShieldCheck size={24} />
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">{t("selectedTechnician")}</p>
                <h3 className="mt-1 text-2xl font-black leading-tight">{tecnicoSeleccionado?.nombre || t("selectTechnicianShort")}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-300">{t("selectedTechnicianDescription")}</p>

                <select value={tecnicoHerramientasSeleccionado} onChange={(e) => cambiarTecnicoPrincipal(e.target.value)} className="mt-5 w-full rounded-2xl border border-white/20 bg-white px-3 py-3 text-sm font-black text-slate-800 outline-none">
                  <option value="">{t("selectTechnician")}</option>
                  {tecnicos.map((tec) => <option key={tec.id} value={tec.id}>{tec.nombre}</option>)}
                </select>
              </aside>

              <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl shadow-slate-300/50 backdrop-blur">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-700">{t("modernForm")}</p>
                    <h4 className="text-lg font-black text-slate-950">{t("addTool")}</h4>
                  </div>
                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[10px] font-black uppercase text-cyan-800">
                    {t("technicianAssignment")}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <Field label={t("tool")}>
                      <input value={herramientaForm.nombre} onChange={(e) => setHerramientaForm({ ...herramientaForm, nombre: e.target.value })} placeholder={t("toolPlaceholder")} className={inputClass} />
                    </Field>
                  </div>

                  <div className="lg:col-span-2">
                    <Field label={t("quantity")}>
                      <input type="number" value={herramientaForm.cantidad} onChange={(e) => setHerramientaForm({ ...herramientaForm, cantidad: e.target.value })} placeholder="1" className={inputClass} />
                    </Field>
                  </div>

                  <div className="lg:col-span-3">
                    <Field label={t("status")}>
                      <select value={herramientaForm.estado || "Asignada"} onChange={(e) => setHerramientaForm({ ...herramientaForm, estado: e.target.value })} className={inputClass}>
                        {ESTADOS_HERRAMIENTA.map((estado) => <option key={estado} value={estado}>{t(toolStatusKey(estado))}</option>)}
                      </select>
                    </Field>
                  </div>

                  <div className="lg:col-span-3">
                    <Field label={t("notes")}>
                      <input value={herramientaForm.notas} onChange={(e) => setHerramientaForm({ ...herramientaForm, notas: e.target.value })} placeholder={t("notesPlaceholder")} className={inputClass} />
                    </Field>
                  </div>
                </div>

                <button onClick={agregarHerramientaParaTecnico} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-blue-900 to-cyan-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5">
                  <Plus size={16} />
                  {t("assignTool")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-slate-200 bg-white p-4 lg:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder={t("searchToolsPlaceholder")} className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
          </div>

          <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100">
            <option value="todos">{t("allStatuses")}</option>
            {ESTADOS_HERRAMIENTA.map((estado) => <option key={estado} value={estado}>{t(toolStatusKey(estado))}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/50">
        <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <div className="min-w-[1120px]">
            <div className="grid grid-cols-[1.1fr_0.85fr_0.6fr_0.8fr_1.2fr_230px] gap-3 bg-slate-950 px-4 py-3 text-[11px] font-black uppercase tracking-wide text-white">
              <span>{t("tool")}</span>
              <span>{t("technician")}</span>
              <span>{t("quantity")}</span>
              <span>{t("status")}</span>
              <span>{t("notes")}</span>
              <span className="text-right">{t("actions")}</span>
            </div>

            <div className="divide-y divide-slate-200">
              {herramientasFiltradas.length === 0 && (
                <div className="p-8 text-center text-sm font-semibold text-slate-500">
                  {t("noToolsFilters")}
                </div>
              )}

              {herramientasFiltradas.map((h) => {
                const editing = editando === h.id;
                const tecnico = obtenerTecnico(h.tecnicoId);

                return (
                  <article key={h.id} className="grid grid-cols-[1.1fr_0.85fr_0.6fr_0.8fr_1.2fr_230px] gap-3 px-4 py-3 text-sm transition hover:bg-blue-50/50">
                    <div className="min-w-0">
                      {editing ? (
                        <input value={h.nombre || ""} onChange={(e) => actualizarHerramienta(h.id, "nombre", e.target.value)} className={rowInputClass} />
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                            <Wrench size={19} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-black text-slate-950">{h.nombre || t("noName")}</p>
                            <p className="text-xs text-slate-500">ID #{h.id}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center">
                      {editing ? (
                        <select value={h.tecnicoId || ""} onChange={(e) => reasignarHerramienta(h.id, e.target.value)} className={rowInputClass}>
                          <option value="">{t("noTechnician")}</option>
                          {tecnicos.map((tec) => <option key={tec.id} value={tec.id}>{tec.nombre}</option>)}
                        </select>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-1 text-xs font-black text-blue-700">
                          <UserCog size={13} />
                          {tecnico?.nombre || t("noTechnician")}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center">
                      {editing ? (
                        <input type="number" value={h.cantidad || ""} onChange={(e) => actualizarHerramienta(h.id, "cantidad", e.target.value)} className={rowInputClass} />
                      ) : (
                        <p className="font-black text-slate-950">{h.cantidad || 1}</p>
                      )}
                    </div>

                    <div className="flex items-center">
                      {editing ? (
                        <select value={h.estado || "Disponible"} onChange={(e) => actualizarHerramienta(h.id, "estado", e.target.value)} className={rowInputClass}>
                          {ESTADOS_HERRAMIENTA.map((estado) => <option key={estado} value={estado}>{t(toolStatusKey(estado))}</option>)}
                        </select>
                      ) : (
                        <EstadoBadge estado={h.estado || "Disponible"} t={t} />
                      )}
                    </div>

                    <div className="flex items-center min-w-0">
                      {editing ? (
                        <input value={h.notas || ""} onChange={(e) => actualizarHerramienta(h.id, "notas", e.target.value)} className={rowInputClass} />
                      ) : (
                        <p className="line-clamp-1 text-slate-600">{h.notas || t("noNotes")}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                      <button onClick={() => setEditando(editing ? null : h.id)} className="inline-flex min-w-[82px] items-center justify-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 hover:bg-blue-100">
                        {editing ? <PackageCheck size={13} /> : <Edit3 size={13} />}
                        {editing ? t("save") : t("edit")}
                      </button>

                      <button onClick={() => devolverHerramienta(h.id)} className="inline-flex min-w-[82px] items-center justify-center gap-1 rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white">
                        <History size={13} />
                        {t("return")}
                      </button>

                      <button onClick={() => eliminarHerramienta ? eliminarHerramienta(h.id) : setHerramientas(herramientas.filter((x) => x.id !== h.id))} className="inline-flex min-w-[42px] items-center justify-center rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100">
                        <Trash2 size={13} />
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
