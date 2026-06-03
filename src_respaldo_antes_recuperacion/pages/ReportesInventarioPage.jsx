import { exportarExcel } from "../utils/exportExcel";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Filter,
  Layers3,
  Package,
  Search,
  TrendingUp,
  UserCog,
  Wrench,
} from "lucide-react";

function Metric({ icon: Icon, label, value, tone }) {
  return (
    <div className={`flex min-w-[118px] items-center gap-2 rounded-2xl bg-gradient-to-br ${tone} px-3 py-2 text-white shadow-sm`}>
      <Icon size={15} />
      <div>
        <p className="text-sm font-black leading-none">{value}</p>
        <p className="mt-0.5 text-[9px] font-black uppercase tracking-wide text-white/75">{label}</p>
      </div>
    </div>
  );
}

function StockBadge({ status }) {
  const cls =
    status === "Stock bajo"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : status === "Dañada" || status === "Perdida"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

  const Icon = status === "Stock bajo" || status === "Dañada" || status === "Perdida" ? AlertTriangle : CheckCircle2;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black ${cls}`}>
      <Icon size={12} />
      {status}
    </span>
  );
}

export default function ReportesInventarioPage({ t, inventario, herramientas, obtenerTecnico, exportarCSV }) {
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  const filas = useMemo(() => {
    const inventarioRows = inventario.map((i) => {
      const cantidad = Number(i.cantidad || 0);
      const costo = Number(i.costo || 0);
      const stockMinimo = Number(i.stockMinimo || 0);
      const status = cantidad <= stockMinimo ? "Stock bajo" : "Disponible";

      return {
        id: `inv-${i.id}`,
        tipo: "Inventario",
        nombre: i.nombre || "Sin nombre",
        categoria: i.categoria || "Sin categoría",
        cantidad,
        unidad: i.unidad || "unidad",
        costo,
        total: cantidad * costo,
        estado: status,
        responsable: "Almacén",
      };
    });

    const herramientaRows = herramientas.map((h) => {
      const estado = h.estado || "Disponible";
      return {
        id: `tool-${h.id}`,
        tipo: "Herramienta",
        nombre: h.nombre || "Sin nombre",
        categoria: "Herramienta técnico",
        cantidad: Number(h.cantidad || 1),
        unidad: estado,
        costo: 0,
        total: 0,
        estado,
        responsable: obtenerTecnico(h.tecnicoId)?.nombre || "Sin técnico",
      };
    });

    let rows = [...inventarioRows, ...herramientaRows];
    const q = busqueda.toLowerCase().trim();

    rows = rows.filter((row) => {
      const matchTexto = !q || [row.nombre, row.categoria, row.estado, row.responsable, row.tipo]
        .some((v) => String(v || "").toLowerCase().includes(q));

      const matchTipo = tipoFiltro === "todos" || row.tipo === tipoFiltro;

      const matchEstado =
        estadoFiltro === "todos" ||
        (estadoFiltro === "alertas" && ["Stock bajo", "Dañada", "Perdida"].includes(row.estado)) ||
        row.estado === estadoFiltro;

      return matchTexto && matchTipo && matchEstado;
    });

    return rows.sort((a, b) => {
      const alertaA = ["Stock bajo", "Dañada", "Perdida"].includes(a.estado) ? 1 : 0;
      const alertaB = ["Stock bajo", "Dañada", "Perdida"].includes(b.estado) ? 1 : 0;
      return alertaB - alertaA || String(a.nombre).localeCompare(String(b.nombre));
    });
  }, [inventario, herramientas, obtenerTecnico, busqueda, tipoFiltro, estadoFiltro]);

  const totalInventario = inventario.length;
  const totalHerramientas = herramientas.length;
  const stockBajo = inventario.filter((i) => Number(i.cantidad || 0) <= Number(i.stockMinimo || 0)).length;
  const alertasHerramientas = herramientas.filter((h) => ["Dañada", "Perdida"].includes(h.estado)).length;
  const valorInterno = inventario.reduce((sum, i) => sum + Number(i.cantidad || 0) * Number(i.costo || 0), 0);
  const categorias = new Set(inventario.map((i) => i.categoria).filter(Boolean)).size;

  const exportRows = filas.map((row) => ({
    Tipo: row.tipo,
    Nombre: row.nombre,
    Categoria: row.categoria,
    Cantidad: row.cantidad,
    Unidad_Estado: row.unidad,
    Estado: row.estado,
    Responsable: row.responsable,
    CostoInterno: row.costo,
    ValorTotalInterno: row.total,
  }));

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">Reportes</p>
              <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
                <FileSpreadsheet size={24} />
                Reportes inventario
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Vista consolidada de materiales, herramientas, alertas y valor interno.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <Metric icon={Package} label="Inventario" value={totalInventario} tone="from-slate-950 to-blue-900" />
              <Metric icon={Wrench} label="Herramientas" value={totalHerramientas} tone="from-blue-800 to-cyan-700" />
              <Metric icon={AlertTriangle} label="Alertas" value={stockBajo + alertasHerramientas} tone="from-amber-700 to-orange-600" />
              <Metric icon={Layers3} label="Categorías" value={categorias} tone="from-cyan-800 to-blue-700" />
              <Metric icon={TrendingUp} label="Valor" value={`$${valorInterno.toFixed(2)}`} tone="from-emerald-800 to-teal-600" />
            </div>
          </div>
        </div>

        <div className="grid gap-3 bg-[radial-gradient(circle_at_top_right,_#22d3ee33,_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-4 lg:grid-cols-[1fr_170px_190px_auto]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar material, herramienta, responsable, categoría..."
              className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100">
            <option value="todos">Todo</option>
            <option value="Inventario">Inventario</option>
            <option value="Herramienta">Herramientas</option>
          </select>

          <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100">
            <option value="todos">Todos los estados</option>
            <option value="alertas">Solo alertas</option>
            <option value="Disponible">Disponible</option>
            <option value="Asignada">Asignada</option>
            <option value="Devuelta">Devuelta</option>
            <option value="Dañada">Dañada</option>
            <option value="Perdida">Perdida</option>
            <option value="Stock bajo">Stock bajo</option>
          </select>

          <button
            onClick={() => exportarExcel(exportRows, "reporte_inventario_herramientas.xlsx", "Inventario")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg"
          >
            <Download size={16} />
            Excel
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/50">
        <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <div className="min-w-[1180px]">
            <div className="grid grid-cols-[0.8fr_1.2fr_1.1fr_0.65fr_0.8fr_0.85fr_0.9fr_0.9fr] gap-3 bg-slate-950 px-4 py-3 text-[11px] font-black uppercase tracking-wide text-white">
              <span>Tipo</span>
              <span>Nombre</span>
              <span>Categoría</span>
              <span>Cant.</span>
              <span>Unidad/Estado</span>
              <span>Estado</span>
              <span>Responsable</span>
              <span>Valor interno</span>
            </div>

            <div className="divide-y divide-slate-200">
              {filas.length === 0 && (
                <div className="p-8 text-center text-sm font-semibold text-slate-500">
                  No hay registros con esos filtros.
                </div>
              )}

              {filas.map((row) => (
                <article key={row.id} className="grid grid-cols-[0.8fr_1.2fr_1.1fr_0.65fr_0.8fr_0.85fr_0.9fr_0.9fr] gap-3 px-4 py-3 text-sm transition hover:bg-blue-50/50">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-black ${
                      row.tipo === "Inventario" ? "bg-blue-50 text-blue-700" : "bg-cyan-50 text-cyan-700"
                    }`}>
                      {row.tipo === "Inventario" ? <Boxes size={13} /> : <Wrench size={13} />}
                      {row.tipo}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-950">{row.nombre}</p>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-700">{row.categoria}</p>
                  </div>

                  <div className="flex items-center">
                    <p className="font-black text-slate-950">{row.cantidad}</p>
                  </div>

                  <div className="flex items-center">
                    <p className="font-bold text-slate-600">{row.unidad}</p>
                  </div>

                  <div className="flex items-center">
                    <StockBadge status={row.estado} />
                  </div>

                  <div className="flex items-center gap-1.5 min-w-0">
                    <UserCog size={13} className="shrink-0 text-blue-700" />
                    <p className="truncate font-bold text-slate-700">{row.responsable}</p>
                  </div>

                  <div className="flex items-center">
                    <p className="font-black text-slate-950">{row.tipo === "Inventario" ? `$${row.total.toFixed(2)}` : "—"}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
