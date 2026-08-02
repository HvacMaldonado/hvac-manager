import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Eye,
  Search,
} from "lucide-react";

const PAGE_SIZE = 20;

export default function InformesStartupPage({
  lang = "es",
  informes = [],
  ordenes = [],
  abrirInforme,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [pagina, setPagina] = useState(1);

  const en = lang === "en";

  const textos = {
    eyebrow: en ? "SERVICE DOCUMENTS" : "DOCUMENTOS DEL SERVICIO",
    title: en ? "Start-Up Reports" : "Informes Start-Up",
    description: en
      ? "Search, review, print and share equipment commissioning reports."
      : "Busca, consulta, imprime y comparte informes de puesta en marcha.",
    search: en
      ? "Search report, customer, address or technician..."
      : "Buscar informe, cliente, dirección o técnico...",
    all: en ? "All" : "Todos",
    signed: en ? "Signed" : "Firmados",
    drafts: en ? "Drafts" : "Borradores",
    report: en ? "Report" : "Informe",
    customer: en ? "Customer" : "Cliente",
    location: en ? "Service location" : "Ubicación del servicio",
    technician: en ? "Technician" : "Técnico",
    date: en ? "Date" : "Fecha",
    status: en ? "Status" : "Estado",
    actions: en ? "Actions" : "Acciones",
    view: en ? "View" : "Ver",
    noReports: en
      ? "No Start-Up reports match the selected filters."
      : "No hay informes Start-Up con los filtros seleccionados.",
    previous: en ? "Previous" : "Anterior",
    next: en ? "Next" : "Siguiente",
    page: en ? "Page" : "Página",
    of: en ? "of" : "de",
    records: en ? "records" : "registros",
  };

  const firmados = informes.filter(
    (item) =>
      String(item.estado || "").trim().toLowerCase() === "firmado"
  ).length;

  const borradores = informes.length - firmados;

  const visibles = useMemo(() => {
    const q = String(busqueda || "").trim().toLowerCase();

    return [...informes]
      .filter((informe) => {
        const estado = String(informe.estado || "")
          .trim()
          .toLowerCase();

        if (
          filtroEstado !== "todos" &&
          estado !== filtroEstado
        ) {
          return false;
        }

        if (!q) return true;

        return [
          informe.numeroInforme,
          informe.clienteNombre,
          informe.direccionTrabajo,
          informe.ubicacionEtiqueta,
          informe.tecnicoNombre,
          informe.datos?.building,
          informe.datos?.apartment,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) =>
        String(b.createdAt || b.fecha || "").localeCompare(
          String(a.createdAt || a.fecha || "")
        )
      );
  }, [informes, busqueda, filtroEstado]);

  useEffect(() => {
    setPagina(1);
  }, [busqueda, filtroEstado]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(visibles.length / PAGE_SIZE)
  );

  const paginaSegura = Math.min(pagina, totalPaginas);

  const filas = visibles.slice(
    (paginaSegura - 1) * PAGE_SIZE,
    paginaSegura * PAGE_SIZE
  );

  const abrir = (informe) => {
    const orden =
      ordenes.find(
        (item) =>
          String(item.id) === String(informe.ordenId)
      ) || {
        id: informe.ordenId,
        clienteId: informe.clienteId,
        tecnicoId: informe.tecnicoId,
        direccionId: informe.ubicacionId,
        direccionTrabajo: informe.direccionTrabajo,
        estado: "Completado",
      };

    abrirInforme?.(orden);
  };

  return (
    <section className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/70">
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-4 py-3 text-white">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-cyan-300">
                {textos.eyebrow}
              </p>
              <h2 className="mt-0.5 text-lg font-black">
                {textos.title}
              </h2>
              <p className="text-[11px] font-semibold text-white/65">
                {textos.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 text-[10px] font-black">
              <span className="rounded-full bg-white/10 px-2.5 py-1 ring-1 ring-white/15">
                {informes.length} {textos.all}
              </span>
              <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-100 ring-1 ring-emerald-300/20">
                {firmados} {textos.signed}
              </span>
              <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-amber-100 ring-1 ring-amber-300/20">
                {borradores} {textos.drafts}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-2 bg-slate-50 p-2 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
            <Search size={15} className="shrink-0 text-blue-700" />
            <input
              value={busqueda}
              onChange={(event) =>
                setBusqueda(event.target.value)
              }
              placeholder={textos.search}
              className="min-w-0 flex-1 bg-transparent py-2 text-xs font-semibold outline-none"
            />
          </label>

          <div className="grid grid-cols-3 gap-1 rounded-xl bg-blue-50 p-1">
            {[
              ["todos", textos.all, informes.length],
              ["firmado", textos.signed, firmados],
              ["borrador", textos.drafts, borradores],
            ].map(([id, label, count]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFiltroEstado(id)}
                className={
                  "rounded-lg px-3 py-1.5 text-[11px] font-black transition " +
                  (filtroEstado === id
                    ? "bg-blue-700 text-white shadow-sm"
                    : "bg-white text-slate-600")
                }
              >
                {label} · {count}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/70">
        <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <div className="min-w-[1100px]">
            <div className="grid grid-cols-[150px_1.15fr_1.7fr_1fr_120px_105px_90px] gap-3 bg-slate-950 px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.12em] text-white">
              <span>{textos.report}</span>
              <span>{textos.customer}</span>
              <span>{textos.location}</span>
              <span>{textos.technician}</span>
              <span>{textos.date}</span>
              <span>{textos.status}</span>
              <span className="text-right">{textos.actions}</span>
            </div>

            {filas.length === 0 ? (
              <div className="border-t border-slate-200 p-8 text-center text-sm font-bold text-slate-500">
                {textos.noReports}
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filas.map((informe) => {
                  const firmado =
                    String(informe.estado || "")
                      .trim()
                      .toLowerCase() === "firmado";

                  const ubicacion = [
                    informe.direccionTrabajo,
                    informe.datos?.building,
                    informe.datos?.apartment,
                  ]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <article
                      key={informe.id}
                      className="grid grid-cols-[150px_1.15fr_1.7fr_1fr_120px_105px_90px] items-center gap-3 px-4 py-2.5 text-xs transition hover:bg-blue-50/70"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className={
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white " +
                          (firmado
                            ? "bg-emerald-600"
                            : "bg-amber-500")
                        }>
                          <ClipboardCheck size={15} />
                        </span>
                        <span className="truncate font-black text-slate-800">
                          {informe.numeroInforme || "START-UP"}
                        </span>
                      </div>

                      <p className="truncate font-black text-slate-950">
                        {informe.clienteNombre || "—"}
                      </p>

                      <p
                        title={ubicacion}
                        className="truncate font-semibold text-slate-600"
                      >
                        {ubicacion || "—"}
                      </p>

                      <p className="truncate font-bold text-slate-700">
                        {informe.tecnicoNombre || "—"}
                      </p>

                      <p className="font-bold text-slate-600">
                        {informe.fecha || "—"}
                      </p>

                      <span className={
                        "w-fit rounded-full px-2.5 py-1 text-[9px] font-black uppercase " +
                        (firmado
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800")
                      }>
                        {firmado ? textos.signed : textos.drafts}
                      </span>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => abrir(informe)}
                          title={textos.view}
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-3 text-[11px] font-black text-white shadow-sm transition hover:bg-blue-600"
                        >
                          <Eye size={13} />
                          {textos.view}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] font-bold text-slate-500">
            {visibles.length} {textos.records} · {textos.page}{" "}
            {paginaSegura} {textos.of} {totalPaginas}
          </p>

          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={paginaSegura === 1}
              onClick={() =>
                setPagina((current) => Math.max(1, current - 1))
              }
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-black text-slate-700 disabled:opacity-40"
            >
              <ChevronLeft size={13} />
              {textos.previous}
            </button>

            <button
              type="button"
              disabled={paginaSegura === totalPaginas}
              onClick={() =>
                setPagina((current) =>
                  Math.min(totalPaginas, current + 1)
                )
              }
              className="inline-flex items-center gap-1 rounded-lg bg-slate-950 px-3 py-1.5 text-[11px] font-black text-white disabled:opacity-40"
            >
              {textos.next}
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
