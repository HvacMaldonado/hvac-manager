import { TECNICO_COLOR_OPTIONS, getTecnicoTheme } from "../utils/tecnicoThemes";
import { crearTecnicoSupabase } from "../services/tecnicosService";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  History,
  LogOut,
  Palette,
  MapPin,
  MoreVertical,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";

function makeTechnicianId(nombre) {
  const base = String(nombre || "tecnico")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${base || "tecnico"}-${Date.now()}`;
}

function Field({ label, value, onChange, type = "text", disabled = false, placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-black uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type={type}
        value={value || ""}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function CompactMetric({ icon: Icon, label, value, tone }) {
  return (
    <div className={`flex min-w-[88px] items-center gap-2 rounded-2xl bg-gradient-to-br ${tone} px-3 py-2 text-white shadow-sm`}>
      <Icon size={14} />
      <div>
        <p className="text-sm font-black leading-none">{value}</p>
        <p className="mt-0.5 text-[9px] font-black uppercase tracking-wide text-white/75">{label}</p>
      </div>
    </div>
  );
}

function NewTechnicianForm({ t = (key) => key, setTecnicos, tecnicos }) {
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    password: "1234",
    telefono: "",
    direccion: "",
    fechaIngreso: new Date().toISOString().slice(0, 10),
  });

  const update = (field, value) => {
    const next = { ...form, [field]: value };

    if (field === "nombre" && !form.usuario) {
      next.usuario = String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    setForm(next);
  };

  const agregar = async () => {
    if (!form.nombre.trim()) {
      alert(t("enterTechnicianName"));
      return;
    }

    try {
      const nuevo = await crearTecnicoSupabase({
        nombre: form.nombre.trim(),
        usuario: form.usuario.trim() || form.nombre.toLowerCase().replace(/\s+/g, "-"),
        password: form.password || "1234",
        telefono: form.telefono || "",
        direccion: form.direccion || "",
        fechaIngreso: form.fechaIngreso || "",
        fechaSalida: "",
        pagoHora: 0,
        activo: true,
      });

      setTecnicos([...tecnicos, nuevo]);

      setForm({
        nombre: "",
        usuario: "",
        password: "1234",
        telefono: "",
        direccion: "",
        fechaIngreso: new Date().toISOString().slice(0, 10),
      });
    } catch (error) {
      console.error("Error guardando técnico en Supabase:", error);
      alert(t("saveTechnicianError"));
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/50 backdrop-blur">
      <div className="grid gap-4 bg-[radial-gradient(circle_at_top_right,_#22d3ee55,_transparent_28%),radial-gradient(circle_at_bottom_left,_#2563eb35,_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#eef6ff_48%,_#e0f7ff_100%)] p-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white shadow-xl shadow-slate-300/60">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20">
            <UserCog size={24} />
          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">{t("newTechnician")}</p>
          <h3 className="mt-1 text-2xl font-black leading-tight">{t("addTechnician")}</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-300">
            {t("technicianCreateDescription")}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
              <ShieldCheck size={18} className="mx-auto text-cyan-300" />
              <p className="mt-1 text-[10px] font-black uppercase text-slate-200">{t("active")}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
              <CalendarDays size={18} className="mx-auto text-cyan-300" />
              <p className="mt-1 text-[10px] font-black uppercase text-slate-200">{t("entry")}</p>
            </div>
          </div>
        </aside>

        <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-xl shadow-slate-300/50 backdrop-blur">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-700">{t("quickForm")}</p>
              <h4 className="text-lg font-black text-slate-950">{t("technicianData")}</h4>
            </div>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[10px] font-black uppercase text-cyan-800">
              {t("userPasswordContact")}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Field label={t("name")} value={form.nombre} onChange={(v) => update("nombre", v)} placeholder={t("technicianName")} />
            </div>
            <div className="lg:col-span-4">
              <Field label={t("user")} value={form.usuario} onChange={(v) => update("usuario", v)} placeholder="usuario" />
            </div>
            <div className="lg:col-span-4">
              <Field label={t("passwordLabel")} value={form.password} onChange={(v) => update("password", v)} placeholder="1234" />
            </div>
            <div className="lg:col-span-4">
              <Field label={t("phone")} value={form.telefono} onChange={(v) => update("telefono", v)} placeholder="___-___-____" />
            </div>
            <div className="lg:col-span-4">
              <Field label={t("entryDate")} type="date" value={form.fechaIngreso} onChange={(v) => update("fechaIngreso", v)} />
            </div>
            <div className="lg:col-span-4">
              <Field label={t("address")} value={form.direccion} onChange={(v) => update("direccion", v)} placeholder={t("address")} />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold text-slate-500">
              {t("technicianActiveLogin")}
            </p>

            <button
              onClick={agregar}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-blue-900 to-cyan-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5"
            >
              <Plus size={16} />
              {t("addTechnician")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TecnicoEditor({ t = (key) => key, tecnico, onClose, onSave }) {
  const [form, setForm] = useState({ ...tecnico });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl shadow-slate-950/40">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300">{t("editTechnician")}</p>
          <h3 className="mt-1 flex items-center gap-2 text-2xl font-black">
            <UserCog size={24} />
            {tecnico.nombre}
          </h3>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2">
          <Field label={t("name")} value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
          <Field label={t("user")} value={form.usuario} onChange={(v) => setForm({ ...form, usuario: v })} />
          <Field label={t("passwordLabel")} value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
          <Field label={t("phone")} value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} placeholder="___-___-____" />
          <div className="sm:col-span-2">
            <Field label={t("address")} value={form.direccion} onChange={(v) => setForm({ ...form, direccion: v })} />
          </div>
          <Field label={t("entryDate")} type="date" value={form.fechaIngreso} onChange={(v) => setForm({ ...form, fechaIngreso: v })} />

          <Field
            label={t("hourlyPay")}
            type="number"
            value={form.pagoHora || ""}
            onChange={(v) => setForm({ ...form, pagoHora: v })}
          />

          <Field label={t("exitDate")} type="date" value={form.fechaSalida} disabled={form.activo !== false} onChange={(v) => setForm({ ...form, fechaSalida: v })} />
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 p-4">
          <button onClick={onClose} className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700">{t("cancel")}</button>
          <button onClick={() => onSave(form)} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-black text-white">
            <Save size={16} />
            {t("saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}

function TechniciansTable({ t = (key) => key, title, subtitle, icon: Icon, rows, activeList, onEdit, onBaja, onReactivar, onEliminar }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/50 backdrop-blur">
      <div className={`flex items-center justify-between px-5 py-4 text-white ${activeList ? "bg-gradient-to-r from-emerald-900 via-teal-800 to-cyan-800" : "bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700"}`}>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">{subtitle}</p>
          <h3 className="mt-1 flex items-center gap-2 text-xl font-black">
            <Icon size={20} />
            {title}
          </h3>
        </div>
        <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-black">{rows.length}</span>
      </div>

      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <div className="min-w-[1180px]">
          <div className="grid grid-cols-[64px_1.25fr_0.9fr_1.25fr_0.85fr_0.85fr_340px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-black uppercase tracking-wide text-slate-500">
            <span>ID</span>
            <span>{t("name")}</span>
            <span>{t("user")}</span>
            <span>{t("contact")}</span>
            <span>{t("color")}</span>
            <span>{t("entry")}</span>
            <span>{t("exit")}</span>
            <span className="text-right">{t("actions")}</span>
          </div>

          <div className="divide-y divide-slate-200">
            {rows.length === 0 && (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">No hay registros en esta sección.</div>
            )}

            {rows.map((tec, index) => (
              <article key={tec.id} className="grid grid-cols-[64px_1.25fr_0.9fr_1.25fr_0.85fr_0.85fr_340px] gap-3 px-4 py-3 text-sm transition hover:bg-blue-50/50">
                <div className="flex items-center font-black text-slate-500">{index + 1}</div>

                <div className="flex min-w-0 items-center gap-3">
                  <div className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${activeList ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    <UserCog size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-950">{tec.nombre}</p>
                    <StatusBadge t={t} active={activeList} />
                  </div>
                </div>

                <div className="flex items-center">
                  <p className="truncate font-bold text-slate-700">{tec.usuario || "Sin usuario"}</p>
                </div>

                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Phone size={13} className="text-blue-700" />
                    {tec.telefono || "—"}
                  </p>
                  <p className="flex items-center gap-1.5 truncate text-xs font-semibold text-slate-500">
                    <MapPin size={13} className="text-blue-700" />
                    {tec.direccion || "—"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <CalendarDays size={14} className="text-slate-500" />
                  {tec.fechaIngreso || "—"}
                </div>

                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Clock3 size={14} className="text-slate-500" />
                  {tec.fechaSalida || "—"}
                </div>

                <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                  <button onClick={() => onEdit(tec)} className="inline-flex min-w-[82px] items-center justify-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 hover:bg-blue-100">
                    <Save size={13} />
                    {t("edit")}
                  </button>

                  {activeList ? (
                    <button onClick={() => onBaja(tec.id)} className="inline-flex min-w-[82px] items-center justify-center gap-1 rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white">
                      <LogOut size={13} />
                      {t("deactivate")}
                    </button>
                  ) : (
                    <button onClick={() => onReactivar(tec.id)} className="inline-flex min-w-[92px] items-center justify-center gap-1 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-black text-white">
                      <RotateCcw size={13} />
                      {t("reactivate")}
                    </button>
                  )}

                  <button onClick={() => onEliminar(tec)} className="inline-flex min-w-[42px] items-center justify-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100">
                    <Trash2 size={13} />
                  </button>

                  <MoreVertical size={16} className="shrink-0 text-slate-400" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusBadge({ t = (key) => key, active }) {
  return active ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-black text-emerald-700">
      <CheckCircle2 size={12} />
      {t("active")}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-700">
      <LogOut size={12} />
      {t("deactivate")}
    </span>
  );
}

export default function TecnicosPage({ t, tecnicos, actualizarTecnico, guardarTecnico, darDeBajaTecnico, setTecnicos }) {
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null);

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return tecnicos;
    return tecnicos.filter((tec) =>
      [tec.nombre, tec.usuario, tec.telefono, tec.direccion, tec.fechaIngreso, tec.fechaSalida]
        .some((v) => String(v || "").toLowerCase().includes(q))
    );
  }, [tecnicos, busqueda]);

  const activos = filtrados.filter((tec) => tec.activo !== false);
  const dadosDeBaja = filtrados.filter((tec) => tec.activo === false);

  const guardarEdicion = (form) => {
    Object.entries(form).forEach(([campo, valor]) => actualizarTecnico(form.id, campo, valor));
    setEditando(null);
  };

  const eliminarTecnico = (tec) => {
    if (window.confirm(`${t("deleteTechnicianConfirm")} ${tec.nombre}?`)) {
      setTecnicos(tecnicos.filter((x) => String(x.id) !== String(tec.id)));
    }
  };

  return (
    <section className="space-y-4">
      {editando && (
        <TecnicoEditor
          tecnico={editando}
          onClose={() => setEditando(null)}
          onSave={guardarEdicion}
        />
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300">{t("technician")}</p>
              <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
                <UserCog size={24} />
                {t("technician")}
              </h2>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
                <CompactMetric icon={Users} label={t("total")} value={tecnicos.length} tone="from-slate-900 to-blue-900" />
                <CompactMetric icon={CheckCircle2} label={t("active")} value={tecnicos.filter((tec) => tec.activo !== false).length} tone="from-emerald-800 to-teal-600" />
                <CompactMetric icon={LogOut} label={t("inactive")} value={tecnicos.filter((tec) => tec.activo === false).length} tone="from-slate-700 to-slate-950" />
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder={t("searchTechnician")}
                  className="w-full rounded-xl border border-white/20 bg-white py-2 pl-9 pr-3 text-sm font-bold text-slate-800 outline-none lg:w-72"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewTechnicianForm t={t} setTecnicos={setTecnicos} tecnicos={tecnicos} />

      <TechniciansTable t={t}
        title={t("activeTechnicians")}
        subtitle={t("inService")}
        icon={CheckCircle2}
        rows={activos}
        activeList
        onEdit={setEditando}
        onBaja={darDeBajaTecnico}
        onReactivar={(id) => actualizarTecnico(id, "activo", true)}
        onEliminar={eliminarTecnico}
      />

      <TechniciansTable t={t}
        title={t("inactiveHistory")}
        subtitle={t("inactiveData")}
        icon={History}
        rows={dadosDeBaja}
        activeList={false}
        onEdit={setEditando}
        onBaja={darDeBajaTecnico}
        onReactivar={(id) => actualizarTecnico(id, "activo", true)}
        onEliminar={eliminarTecnico}
      />
    </section>
  );
}
