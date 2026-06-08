import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  DollarSign,
  Edit3,
  Layers3,
  Package,
  PackageOpen,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";

const CATEGORIAS_HVAC = [
  "Unidades de aire acondicionado",
  "Termostatos",
  "Filtros",
  "Capacitores",
  "Contactores",
  "Motores",
  "Refrigerante",
  "Ductos y ventilación",
  "Herramientas",
  "Material eléctrico",
  "Otros",
];

const UNIDADES = ["pieza", "unidad", "caja", "rollo", "libra", "galón", "pie", "set"];

function inventoryCategoryLabel(value, t = (key) => key) {
  const map = {
    "Unidades de aire acondicionado": t("airConditioningUnits"),
    "Termostatos": t("thermostats"),
    "Filtros": t("filters"),
    "Capacitores": t("capacitors"),
    "Contactores": t("contactors"),
    "Motores": t("motors"),
    "Refrigerante": t("refrigerant"),
    "Ductos y ventilación": t("ductsAndVentilation"),
    "Herramientas": t("tools"),
    "Material eléctrico": t("electricalMaterial"),
    "Otros": t("others"),
  };
  return map[value] || value;
}

function inventoryUnitLabel(value, t = (key) => key) {
  const map = {
    pieza: t("piece"),
    unidad: t("unitSingle"),
    caja: t("box"),
    rollo: t("roll"),
    libra: t("pound"),
    galón: t("gallon"),
    pie: t("foot"),
    set: t("set"),
  };
  return map[value] || value;
}

function MiniMetric({ icon: Icon, label, value, tone }) {
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

function ModernField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function StockBadge({ bajo, t = (key) => key }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black ${
      bajo
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700"
    }`}>
      {bajo ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
      {bajo ? t("lowStock") : t("available")}
    </span>
  );
}

function InventoryTable({ items, update, remove, t = (key) => key }) {
  const [edit, setEdit] = useState(null);

  const inputClass = "w-full rounded-xl border border-slate-300 bg-white p-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/50">
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <div className="min-w-[1050px]">
          <div className="grid grid-cols-[1.2fr_1.1fr_0.7fr_0.7fr_0.7fr_0.8fr_190px] gap-3 bg-slate-950 px-4 py-3 text-[11px] font-black uppercase tracking-wide text-white">
            <span>Material</span>
            <span>{t("category")}</span>
            <span>{t("quantity")}</span>
            <span>{t("unit")}</span>
            <span>{t("cost")}</span>
            <span>{t("status")}</span>
            <span className="text-right">{t("actions")}</span>
          </div>

          <div className="divide-y divide-slate-200">
            {items.length === 0 && (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                {t("noMaterialsRegistered")}
              </div>
            )}

            {items.map((i) => {
              const editing = edit === i.id;
              const bajo = Number(i.cantidad || 0) <= Number(i.stockMinimo || 0);

              return (
                <article key={i.id} className="grid grid-cols-[1.2fr_1.1fr_0.7fr_0.7fr_0.7fr_0.8fr_190px] gap-3 px-4 py-3 text-sm transition hover:bg-blue-50/50">
                  <div className="min-w-0">
                    {editing ? (
                      <input value={i.nombre || ""} onChange={(e) => update(i.id, "nombre", e.target.value)} className={inputClass} />
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                          <Package size={19} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-black text-slate-950">{i.nombre || "Sin nombre"}</p>
                          <p className="text-xs text-slate-500">{t("minimum")}: {i.stockMinimo || 0}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    {editing ? (
                      <select value={i.categoria || CATEGORIAS_HVAC[0]} onChange={(e) => update(i.id, "categoria", e.target.value)} className={inputClass}>
                        {CATEGORIAS_HVAC.map((c) => <option key={c} value={c}>{inventoryCategoryLabel(c, t)}</option>)}
                      </select>
                    ) : (
                      <p className="truncate rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-700">{i.categoria || "Sin categoría"}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    {editing ? (
                      <input type="number" value={i.cantidad || ""} onChange={(e) => update(i.id, "cantidad", e.target.value)} className={inputClass} />
                    ) : (
                      <p className="font-black text-slate-950">{i.cantidad || 0}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    {editing ? (
                      <select value={i.unidad ? inventoryUnitLabel(i.unidad, t) : inventoryUnitLabel("pieza", t)} onChange={(e) => update(i.id, "unidad", e.target.value)} className={inputClass}>
                        {UNIDADES.map((u) => <option key={u} value={u}>{inventoryUnitLabel(u, t)}</option>)}
                      </select>
                    ) : (
                      <p className="font-bold text-slate-600">{i.unidad ? inventoryUnitLabel(i.unidad, t) : inventoryUnitLabel("pieza", t)}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    {editing ? (
                      <input type="number" step="0.01" value={i.costo || ""} onChange={(e) => update(i.id, "costo", e.target.value)} className={inputClass} />
                    ) : (
                      <p className="font-black text-slate-950">${Number(i.costo || 0).toFixed(2)}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <StockBadge bajo={bajo} t={t} />
                  </div>

                  <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                    <button
                      onClick={() => setEdit(editing ? null : i.id)}
                      className="inline-flex min-w-[82px] items-center justify-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 hover:bg-blue-100"
                    >
                      {editing ? <Save size={13} /> : <Edit3 size={13} />}
                      {editing ? t("save") : t("edit")}
                    </button>

                    <button
                      onClick={() => remove(i.id)}
                      className="inline-flex min-w-[42px] items-center justify-center rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100"
                    >
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
  );
}

export default function InventarioGeneralPage({ t, inventario, inventarioForm, setInventarioForm, agregarInventario, actualizarInventario, setInventario }) {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");

  const inventarioFiltrado = useMemo(() => {
    const q = busqueda.toLowerCase().trim();

    return inventario.filter((item) => {
      const matchTexto = !q || [item.nombre, item.categoria, item.unidad]
        .some((v) => String(v || "").toLowerCase().includes(q));

      const matchCategoria = categoriaFiltro === "todas" || item.categoria === categoriaFiltro;

      return matchTexto && matchCategoria;
    });
  }, [inventario, busqueda, categoriaFiltro]);

  const totalItems = inventario.length;
  const stockBajo = inventario.filter((i) => Number(i.cantidad || 0) <= Number(i.stockMinimo || 0)).length;
  const valorTotal = inventario.reduce((sum, i) => sum + Number(i.cantidad || 0) * Number(i.costo || 0), 0);
  const categoriasUsadas = new Set(inventario.map((i) => i.categoria).filter(Boolean)).size;

  const fieldClass = "w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100";

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">{t("inventory")}</p>
              <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
                <Boxes size={24} />
                {t("generalInventoryTitle")}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Control de materiales, costos internos y stock mínimo.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <MiniMetric icon={PackageOpen} label={t("materials")} value={totalItems} tone="from-slate-950 to-blue-900" />
              <MiniMetric icon={AlertTriangle} label={t("lowStock")} value={stockBajo} tone="from-amber-700 to-orange-600" />
              <MiniMetric icon={Layers3} label={t("categories")} value={categoriasUsadas} tone="from-cyan-800 to-blue-700" />
              <MiniMetric icon={DollarSign} label={t("valueLabel")} value={`$${valorTotal.toFixed(2)}`} tone="from-emerald-800 to-teal-600" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden border-t border-cyan-200/40 bg-slate-950 p-[1px]">
          <div className="relative bg-[radial-gradient(circle_at_top_right,_#22d3ee55,_transparent_30%),radial-gradient(circle_at_bottom_left,_#2563eb38,_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-4">
            <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
              <aside className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white shadow-xl shadow-slate-300/60">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20">
                  <Package size={24} />
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">{t("newMaterial")}</p>
                <h3 className="mt-1 text-2xl font-black leading-tight">{t("addInventory")}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-300">
                  {t("inventorySideDescription")}
                </p>
              </aside>

              <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl shadow-slate-300/50 backdrop-blur">
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <ModernField label={t("material")}>
                      <input value={inventarioForm.nombre} onChange={(e) => setInventarioForm({ ...inventarioForm, nombre: e.target.value })} placeholder={t("materialNamePlaceholder")} className={fieldClass} />
                    </ModernField>
                  </div>

                  <div className="lg:col-span-4">
                    <ModernField label={t("category")}>
                      <select value={inventarioForm.categoria} onChange={(e) => setInventarioForm({ ...inventarioForm, categoria: e.target.value })} className={fieldClass}>
                        {CATEGORIAS_HVAC.map((c) => <option key={c} value={c}>{inventoryCategoryLabel(c, t)}</option>)}
                      </select>
                    </ModernField>
                  </div>

                  <div className="lg:col-span-2">
                    <ModernField label={t("quantity")}>
                      <input type="number" value={inventarioForm.cantidad} onChange={(e) => setInventarioForm({ ...inventarioForm, cantidad: e.target.value })} placeholder="0" className={fieldClass} />
                    </ModernField>
                  </div>

                  <div className="lg:col-span-2">
                    <ModernField label={t("unit")}>
                      <select value={inventarioForm.unidad} onChange={(e) => setInventarioForm({ ...inventarioForm, unidad: e.target.value })} className={fieldClass}>
                        {UNIDADES.map((u) => <option key={u} value={u}>{inventoryUnitLabel(u, t)}</option>)}
                      </select>
                    </ModernField>
                  </div>

                  <div className="lg:col-span-3">
                    <ModernField label={t("internalCost")}>
                      <input type="number" step="0.01" value={inventarioForm.costo} onChange={(e) => setInventarioForm({ ...inventarioForm, costo: e.target.value })} placeholder="$0.00" className={fieldClass} />
                    </ModernField>
                  </div>

                  <div className="lg:col-span-3">
                    <ModernField label={t("minimumStock")}>
                      <input type="number" value={inventarioForm.stockMinimo || ""} onChange={(e) => setInventarioForm({ ...inventarioForm, stockMinimo: e.target.value })} placeholder="0" className={fieldClass} />
                    </ModernField>
                  </div>

                  <div className="lg:col-span-6 flex items-end">
                    <button onClick={agregarInventario} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-blue-900 to-cyan-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5">
                      <Plus size={16} />
                      {t("addMaterial")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-slate-200 bg-white p-4 lg:grid-cols-[1fr_260px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder={t("searchInventoryPlaceholder")} className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
          </div>

          <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100">
            <option value="todas">{t("allCategories")}</option>
            {CATEGORIAS_HVAC.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <InventoryTable
        items={inventarioFiltrado}
        update={actualizarInventario}
        remove={(id) => setInventario(inventario.filter((i) => i.id !== id))}
      />
    </section>
  );
}
