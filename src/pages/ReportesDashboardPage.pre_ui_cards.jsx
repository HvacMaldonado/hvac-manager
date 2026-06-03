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

function Metric({ icon: Icon, label, value, tone }) {
  return (
    <div className={`flex min-w-[135px] items-center gap-2.5 rounded-2xl bg-gradient-to-br ${tone} px-3 py-2 text-white shadow-sm`}>
      <Icon size={18} />
      <div>
        <p className="text-sm font-black leading-none">{value}</p>
        <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-white/75">{label}</p>
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

export default function ReportesDashboardPage({ clientes, ordenes, inventario, herramientas, tecnicos, obtenerTecnico, exportarCSV }) {
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
                Finanzas internas, historial mensual, consumo de materiales y rendimiento por técnico.
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

      <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={ClipboardList} label="Órdenes" value={data.ordenesFiltradas.length} tone="from-slate-950 to-blue-900" />
        <Metric icon={TrendingUp} label="Completadas" value={completadas} tone="from-emerald-800 to-teal-600" />
        <Metric icon={AlertTriangle} label="Canceladas" value={canceladas} tone="from-rose-800 to-red-700" />
        <Metric icon={AlertTriangle} label="Por cliente" value={canceladasCliente} tone="from-orange-800 to-amber-600" />
        <Metric icon={AlertTriangle} label="Por empresa" value={canceladasEmpresa} tone="from-slate-800 to-slate-950" />
        <Metric icon={AlertTriangle} label="Por técnico" value={canceladasTecnico} tone="from-red-800 to-rose-700" />
        <Metric icon={Package} label="Materiales usados" value={money(materialesUsados)} tone="from-cyan-800 to-blue-700" />
        <Metric icon={Users} label="Clientes" value={clientes.length} tone="from-slate-800 to-slate-950" />
        <Metric icon={Wrench} label="Herramientas alerta" value={data.herramientasAlerta} tone="from-amber-700 to-orange-600" />
        <Metric icon={Package} label="Stock bajo" value={data.stockBajo} tone="from-amber-700 to-red-600" />
        <Metric icon={Download} label="Valor inventario" value={money(data.valorInventario)} tone="from-emerald-800 to-teal-600" />
      </div>

      <div className="grid gap-2.5 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-md shadow-slate-300/50">
          <h3 className="mb-4 flex items-center gap-2 text-base font-black text-slate-950">
            <CalendarDays size={20} />
            Historial mensual
          </h3>

          <div className="space-y-3">
            {data.mensual.slice(0, 8).map((m) => (
              <div key={m.mes} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-black text-slate-950">{formatMonth(m.mes)}</p>
                  <p className="text-sm font-black text-blue-700">{m.total} órdenes</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
                  <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">Completadas {m.completadas}</div>
                  <div className="rounded-xl bg-rose-50 p-2 text-rose-700">Canceladas {m.canceladas}</div>
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-700">Activas {m.activas}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-md shadow-slate-300/50">
          <h3 className="mb-4 flex items-center gap-2 text-base font-black text-slate-950">
            <UserCog size={20} />
            Rendimiento por técnico
          </h3>

          <div className="mb-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-wide text-blue-700">Horas trabajadas</p>
              <p className="mt-1 text-xl font-black text-slate-950">{data.resumenNomina.totalHorasTrabajo.toFixed(2)} h</p>
            </div>

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">Horas traslado</p>
              <p className="mt-1 text-xl font-black text-slate-950">{data.resumenNomina.totalHorasTraslado.toFixed(2)} h</p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 sm:col-span-2 xl:col-span-1">
              <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700">Nómina total</p>
              <p className="mt-1 text-xl font-black text-slate-950">{money(data.resumenNomina.totalNomina)}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Más horas</p>
              <p className="mt-1 truncate text-sm font-black text-slate-950">
                {data.resumenNomina.tecnicoMasHoras?.tecnico || "Sin datos"}
              </p>
              <p className="text-xs font-black text-blue-700">
                {Number(data.resumenNomina.tecnicoMasHoras?.horasTrabajo || 0).toFixed(2)} h
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Mayor ingreso</p>
              <p className="mt-1 truncate text-sm font-black text-slate-950">
                {data.resumenNomina.tecnicoMayorPago?.tecnico || "Sin datos"}
              </p>
              <p className="text-xs font-black text-emerald-700">
                {money(data.resumenNomina.tecnicoMayorPago?.pagoTotal || 0)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {data.tecnicoStats.slice(0, 8).map((tec) => (
              <div key={tec.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between gap-2.5">
                  <p className="truncate font-black text-slate-950">{tec.tecnico}</p>
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-black text-blue-700">{tec.efectividad}%</span>
                </div>

                <div className="mb-3 grid grid-cols-2 gap-2 text-xs font-black">
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-700">
                    Trabajo {tec.horasTrabajo.toFixed(2)} h
                  </div>
                  <div className="rounded-xl bg-cyan-50 p-2 text-cyan-700">
                    Traslado {tec.horasTraslado.toFixed(2)} h
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2 text-slate-700">
                    {money(tec.pagoPorHora)} / h
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                    Ganado {money(tec.pagoTotal)}
                  </div>
                </div>

                <SimpleBar label={`${tec.completadas} completadas · ${tec.canceladas} canceladas`} value={tec.total} max={maxTecnico} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-md shadow-slate-300/50 xl:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 text-base font-black text-slate-950">
            <Package size={20} />
            Consumo de materiales
          </h3>

          <div className="grid gap-2.5 md:grid-cols-2">
            {data.consumoMateriales.length === 0 && (
              <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500 md:col-span-2">
                No hay materiales consumidos en las órdenes filtradas.
              </div>
            )}

            {data.consumoMateriales.slice(0, 10).map((mat) => (
              <div key={mat.nombre} className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between gap-2.5">
                  <p className="truncate font-black text-slate-950">{mat.nombre}</p>
                  <span className="text-sm font-black text-emerald-700">{money(mat.costo)}</span>
                </div>
                <SimpleBar label={`${mat.cantidad} unidades usadas`} value={mat.costo} max={maxMaterial} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
