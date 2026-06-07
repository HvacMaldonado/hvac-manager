import { exportarExcel } from "../utils/exportExcel";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  ClipboardList,
  Download,
  FileSpreadsheet,
  Package,
  Printer,
  Search,
  TrendingUp,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";

function monthKey(value) {
  if (!value) return "Sin fecha";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Sin fecha";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(key) {
  if (!key || key === "Sin fecha") return "Sin fecha";
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function SoftMetric({ icon: Icon, label, value, alert = false, positive = false }) {
  const boxClass = alert
    ? "border-rose-200 bg-rose-50 text-rose-800"
    : positive
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-slate-200 bg-slate-50 text-slate-700";

  const iconClass = alert ? "text-rose-600" : positive ? "text-emerald-700" : "text-slate-500";

  return (
    <div className={`rounded-2xl border p-3 ${boxClass}`}>
      <div className="flex items-center gap-2">
        <Icon size={16} className={iconClass} />
        <p className="text-[10px] font-black uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone, hint }) {
  return (
    <div className={`group relative min-h-[130px] overflow-hidden rounded-[2rem] bg-gradient-to-br ${tone} p-5 text-white shadow-xl shadow-slate-300/60 ring-1 ring-white/20 transition hover:-translate-y-1 hover:shadow-2xl`}>
      <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/15 blur-2xl transition group-hover:bg-white/25" />
      <div className="absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.26em] text-white/70">{label}</p>
          <p className="mt-3 text-4xl font-black tracking-tight">{value}</p>
          {hint && <p className="mt-2 text-xs font-bold text-white/75">{hint}</p>}
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/20">
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}

function SimpleBar({ label, value, max }) {
  const percent = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2.5 text-xs font-black text-slate-600">
        <span className="truncate">{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-700 to-cyan-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function DonutFigure({ label, value, total, tone = "blue" }) {
  const safeTotal = Math.max(Number(total || 0), 1);
  const percent = Math.min(100, Math.max(0, Math.round((Number(value || 0) / safeTotal) * 100)));
  const stroke = 31.4;
  const dash = (percent / 100) * stroke;

  const color = tone === "green" ? "text-emerald-600" : tone === "rose" ? "text-rose-600" : tone === "amber" ? "text-amber-600" : "text-blue-700";

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/70">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 36 36" className="h-20 w-20 rotate-[-90deg]">
            <circle cx="18" cy="18" r="15.8" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-slate-100" />
            <circle cx="18" cy="18" r="15.8" fill="none" stroke="currentColor" strokeWidth="3.5" strokeDasharray={`${dash} ${stroke}`} strokeLinecap="round" className={color} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-slate-950">{percent}%</div>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
          <p className="text-xs font-semibold text-slate-500">de {total} registros</p>
        </div>
      </div>
    </div>
  );
}

function InsightPanel({ t = (key) => key, completadas, canceladas, total, stockBajo, herramientasAlerta, valorInventario, money }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-300/60 backdrop-blur">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-700">{t("operationalHealth")}</p>
          <h3 className="text-xl font-black text-slate-950">{t("visualIndicators")}</h3>
        </div>
        <p className="text-xs font-bold text-slate-500">{t("selectedPeriodSummary")}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <DonutFigure label={t("completedOrders")} value={completadas} total={total} tone="green" />
        <DonutFigure label={t("cancellations")} value={canceladas} total={total} tone={canceladas > 0 ? "rose" : "blue"} />

        <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 p-4 text-white shadow-lg shadow-slate-300/60">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">{t("inventory")}</p>
          <p className="mt-2 text-3xl font-black">{money(valorInventario)}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
              <p className="text-[10px] font-black uppercase text-white/60">{t("lowStock")}</p>
              <p className="text-2xl font-black">{stockBajo}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
              <p className="text-[10px] font-black uppercase text-white/60">{t("toolAlerts")}</p>
              <p className="text-2xl font-black">{herramientasAlerta}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export default function ReportesDashboardPage({ t = (key) => key, clientes, ordenes, inventario, herramientas, tecnicos, obtenerTecnico, exportarCSV }) {
  const [busqueda, setBusqueda] = useState("");
  const [periodo, setPeriodo] = useState("todos");

  const data = useMemo(() => {
    const q = busqueda.toLowerCase().trim();

    const ordenesFiltradas = ordenes.filter((o) => {
      const tecnico = obtenerTecnico(o.tecnicoId);
      const key = monthKey(o.fechaCompletada || o.fechaCreacion || o.fecha);
      const matchPeriodo = periodo === "todos" || key === periodo;
      const matchTexto = !q || [o.problema, o.estado, o.prioridad, tecnico?.nombre]
        .some((v) => String(v || "").toLowerCase().includes(q));

      return matchPeriodo && matchTexto;
    });

    const meses = Array.from(new Set(ordenes.map((o) => monthKey(o.fechaCompletada || o.fechaCreacion || o.fecha))))
      .filter(Boolean)
      .sort()
      .reverse();

    const mensual = meses.map((mes) => {
      const rows = ordenes.filter((o) => monthKey(o.fechaCompletada || o.fechaCreacion || o.fecha) === mes);
      const completadas = rows.filter((o) => o.estado === "Completado").length;
      const canceladas = rows.filter((o) => o.estado === "Cancelada").length;
      return {
        mes,
        total: rows.length,
        completadas,
        canceladas,
        activas: rows.length - completadas - canceladas,
      };
    });

    const calcularHoras = (inicio, fin) => {
      if (!inicio || !fin) return 0;

      const start = new Date(inicio);
      const end = new Date(fin);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 0;

      return (end - start) / 3600000;
    };

    const tecnicoStats = tecnicos.map((tec) => {
      const rows = ordenesFiltradas.filter((o) => String(o.tecnicoId) === String(tec.id));
      const completadas = rows.filter((o) => o.estado === "Completado").length;
      const canceladas = rows.filter((o) => o.estado === "Cancelada").length;

      const horasTrabajo = rows.reduce((sum, orden) => {
        return sum + calcularHoras(orden.horaInicio, orden.horaCierre);
      }, 0);

      const horasTraslado = rows.reduce((sum, orden) => {
        return sum + calcularHoras(orden.horaEnRuta, orden.horaLlegada);
      }, 0);

      const pagoPorHora = Number(tec.pagoPorHora || 0);
      const pagoTotal = (horasTrabajo + horasTraslado) * pagoPorHora;

      return {
        id: tec.id,
        tecnico: tec.nombre,
        total: rows.length,
        completadas,
        canceladas,
        efectividad: rows.length ? Math.round((completadas / rows.length) * 100) : 0,
        horasTrabajo,
        horasTraslado,
        pagoPorHora,
        pagoTotal,
      };
    }).sort((a, b) => b.pagoTotal - a.pagoTotal);

    const resumenNomina = {
      totalHorasTrabajo: tecnicoStats.reduce((sum, tec) => sum + Number(tec.horasTrabajo || 0), 0),
      totalHorasTraslado: tecnicoStats.reduce((sum, tec) => sum + Number(tec.horasTraslado || 0), 0),
      totalNomina: tecnicoStats.reduce((sum, tec) => sum + Number(tec.pagoTotal || 0), 0),
      tecnicoMasHoras: tecnicoStats.reduce((max, tec) => {
        return Number(tec.horasTrabajo || 0) > Number(max.horasTrabajo || 0) ? tec : max;
      }, tecnicoStats[0] || {}),
      tecnicoMayorPago: tecnicoStats.reduce((max, tec) => {
        return Number(tec.pagoTotal || 0) > Number(max.pagoTotal || 0) ? tec : max;
      }, tecnicoStats[0] || {}),
    };

    const materiales = {};
    ordenesFiltradas.forEach((o) => {
      (o.materiales || []).forEach((m) => {
        const key = m.nombre || "Material sin nombre";
        if (!materiales[key]) materiales[key] = { nombre: key, cantidad: 0, costo: 0 };
        materiales[key].cantidad += Number(m.cantidad || 0);
        materiales[key].costo += Number(m.cantidad || 0) * Number(m.costo || 0);
      });
    });

    const consumoMateriales = Object.values(materiales).sort((a, b) => b.costo - a.costo);

    const valorInventario = inventario.reduce((sum, item) => sum + Number(item.cantidad || 0) * Number(item.costo || 0), 0);
    const stockBajo = inventario.filter((item) => Number(item.cantidad || 0) <= Number(item.stockMinimo || 0)).length;
    const herramientasAlerta = herramientas.filter((h) => ["Dañada", "Perdida"].includes(h.estado)).length;

    return {
      ordenesFiltradas,
      meses,
      mensual,
      tecnicoStats,
      resumenNomina,
      consumoMateriales,
      valorInventario,
      stockBajo,
      herramientasAlerta,
    };
  }, [ordenes, inventario, herramientas, tecnicos, obtenerTecnico, busqueda, periodo]);

  const completadas = data.ordenesFiltradas.filter((o) => o.estado === "Completado").length;
  const canceladas = data.ordenesFiltradas.filter((o) => o.estado === "Cancelada").length;
  const canceladasCliente = data.ordenesFiltradas.filter((o) => o.cancelTipo === "Cancelada por cliente").length;
  const canceladasEmpresa = data.ordenesFiltradas.filter((o) => o.cancelTipo === "Cancelada por empresa").length;
  const canceladasTecnico = data.ordenesFiltradas.filter((o) => o.cancelTipo === "Cancelada por técnico").length;
  const activas = data.ordenesFiltradas.length - completadas - canceladas;
  const materialesUsados = data.consumoMateriales.reduce((sum, m) => sum + Number(m.costo || 0), 0);

  const exportDashboard = () => {
    const rows = [
      ...data.mensual.map((m) => ({ Tipo: "Historial mensual", Nombre: formatMonth(m.mes), Total: m.total, Completadas: m.completadas, Canceladas: m.canceladas, Activas: m.activas })),
      ...data.tecnicoStats.map((t) => ({
        Tipo: "Rendimiento técnico",
        Nombre: t.tecnico,
        Total: t.total,
        Completadas: t.completadas,
        Canceladas: t.canceladas,
        Efectividad: `${t.efectividad}%`,
        HorasTrabajo: Number(t.horasTrabajo || 0).toFixed(2),
        HorasTraslado: Number(t.horasTraslado || 0).toFixed(2),
        PagoPorHora: Number(t.pagoPorHora || 0).toFixed(2),
        PagoTotal: Number(t.pagoTotal || 0).toFixed(2),
      })),
      ...data.consumoMateriales.map((m) => ({ Tipo: "Consumo materiales", Nombre: m.nombre, Cantidad: m.cantidad, Costo: m.costo })),
    ];

    exportarExcel(rows, "dashboard_reportes_hvac.xlsx", "Dashboard");
  };

  const imprimirDashboard = () => {
    window.print();
  };

  const maxTecnico = Math.max(...data.tecnicoStats.map((t) => t.total), 1);
  const maxMaterial = Math.max(...data.consumoMateriales.map((m) => m.costo), 1);

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/60 backdrop-blur">
        <div className="bg-slate-950 p-3 text-white">
          <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-300">Dashboard ejecutivo</p>
              <h2 className="mt-1 flex items-center gap-2 text-sm font-black">
                <BarChart3 size={24} />
                Dashboard reportes
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Finanzas internas, historial mensual, consumo de materiales e inventario.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button onClick={exportDashboard} className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-sm font-black text-white ring-1 ring-white/20">
                <FileSpreadsheet size={16} />
                Exportar Excel
              </button>
              <button onClick={imprimirDashboard} className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-3 py-2 text-sm font-black text-slate-950">
                <Printer size={16} />
                Imprimir/PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-2.5 bg-[radial-gradient(circle_at_top_right,_#22d3ee33,_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-3 lg:grid-cols-[1fr_220px] print:hidden">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por técnico, estado, prioridad o problema..."
              className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100">
            <option value="todos">Todos los meses</option>
            {data.meses.map((m) => <option key={m} value={m}>{formatMonth(m)}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Resumen principal</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Metric icon={ClipboardList} label="Órdenes" value={data.ordenesFiltradas.length} hint="Total filtrado" tone="from-slate-950 via-blue-950 to-cyan-800" />
            <Metric icon={TrendingUp} label="Completadas" value={completadas} hint="Trabajos cerrados" tone="from-emerald-700 via-teal-700 to-cyan-700" />
            <Metric icon={Users} label="Clientes" value={clientes.length} hint="Base actual" tone="from-blue-950 via-slate-950 to-indigo-900" />
            <Metric icon={Package} label="Materiales usados" value={money(materialesUsados)} hint="Costo del periodo" tone="from-cyan-700 via-blue-800 to-slate-900" />
          </div>
        </div>

        <InsightPanel
          completadas={completadas}
          canceladas={canceladas}
          total={data.ordenesFiltradas.length}
          stockBajo={data.stockBajo}
          herramientasAlerta={data.herramientasAlerta}
          valorInventario={data.valorInventario}
          money={money}
        />

        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-lg shadow-slate-200/70">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Detalle de cancelaciones</p>
              <p className="text-sm font-bold text-slate-500">Información interna para administración</p>
            </div>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${canceladas > 0 ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-500"}`}>
              {canceladas} total
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <SoftMetric icon={AlertTriangle} label="Canceladas" value={canceladas} alert={canceladas > 0} />
            <SoftMetric icon={AlertTriangle} label="Por cliente" value={canceladasCliente} alert={canceladasCliente > 0} />
            <SoftMetric icon={AlertTriangle} label="Por empresa" value={canceladasEmpresa} alert={canceladasEmpresa > 0} />
            <SoftMetric icon={AlertTriangle} label="Por técnico" value={canceladasTecnico} alert={canceladasTecnico > 0} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-xl shadow-slate-300/50 backdrop-blur">
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">Tendencia mensual</p>
                <h3 className="mt-1 flex items-center gap-2 text-xl font-black">
                  <CalendarDays size={22} />
                  Historial operativo
                </h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black ring-1 ring-white/20">
                {data.mensual.slice(0, 8).length} meses
              </span>
            </div>
          </div>

          <div className="space-y-4 p-5">
            {data.mensual.slice(0, 8).map((m) => {
              const percent = Math.max(6, Math.round((m.total / Math.max(...data.mensual.map((x) => x.total), 1)) * 100));
              const completadasPercent = m.total ? Math.round((m.completadas / m.total) * 100) : 0;

              return (
                <div key={m.mes} className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-md shadow-slate-200/70">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-slate-950">{formatMonth(m.mes)}</p>
                      <p className="text-xs font-semibold text-slate-500">{m.total} órdenes · {completadasPercent}% completadas</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{m.total}</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-800 via-cyan-500 to-emerald-400" style={{ width: `${percent}%` }} />
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-black">
                    <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700">Completadas {m.completadas}</div>
                    <div className="rounded-2xl bg-rose-50 p-2 text-rose-700">Canceladas {m.canceladas}</div>
                    <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">Activas {m.activas}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-xl shadow-slate-300/50 backdrop-blur">
          <div className="bg-gradient-to-br from-cyan-700 via-blue-800 to-slate-950 p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100">Consumo</p>
                <h3 className="mt-1 flex items-center gap-2 text-xl font-black">
                  <Package size={22} />
                  Materiales usados
                </h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black ring-1 ring-white/20">
                Top 10
              </span>
            </div>
          </div>

          <div className="space-y-3 p-5">
            {data.consumoMateriales.length === 0 && (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
                No hay materiales consumidos en las órdenes filtradas.
              </div>
            )}

            {data.consumoMateriales.slice(0, 10).map((mat, index) => {
              const percent = Math.max(5, Math.round((Number(mat.costo || 0) / Math.max(maxMaterial, 1)) * 100));

              return (
                <div key={mat.nombre} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-md shadow-slate-200/70">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-xs font-black text-white">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-black text-slate-950">{mat.nombre}</p>
                        <p className="text-xs font-semibold text-slate-500">{mat.cantidad} unidades usadas</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-black text-emerald-700">{money(mat.costo)}</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-600 via-blue-700 to-slate-950" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
