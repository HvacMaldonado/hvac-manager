import {
  CalendarDays,
  Camera,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  MapPin,
  PenLine,
  Phone,
  UserCog,
  Wrench,
} from "lucide-react";

function formatDate(value) {
  if (!value) return "Sin fecha";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length !== 10) return value || "—";
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function PhotoBox({ title, src }) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-3">
      <p className="mb-2 flex items-center gap-1 text-xs font-black uppercase tracking-wide text-slate-600">
        <Camera size={13} />
        {title}
      </p>

      {src ? (
        <img src={src} alt={title} className="h-44 w-full rounded-xl border object-cover" />
      ) : (
        <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs font-bold text-slate-400">
          Sin foto
        </div>
      )}
    </div>
  );
}

function TimelineRow({ label, value, done }) {
  return (
    <div className="grid grid-cols-[34px_1fr] gap-2">
      <div className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full ${done ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"}`}>
        <CheckCircle2 size={15} />
      </div>
      <div className="border-b border-slate-200 pb-3">
        <p className="text-sm font-black text-slate-950">{label}</p>
        <p className="mt-0.5 text-xs font-semibold text-slate-600">{value}</p>
      </div>
    </div>
  );
}

export default function PrintableOrderReport({ orden, cliente, tecnico }) {
  if (!orden) return null;

  const fotos = orden.fotos || {};
  const materiales = orden.materialesUsados || orden.materiales || [];
  const isCancelada = orden.estado === "Cancelada";
  const isCompletada = orden.estado === "Completado";

  return (
    <div id="printable-order-report" className="hidden print:block">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          #printable-order-report,
          #printable-order-report * {
            visibility: visible !important;
          }

          #printable-order-report {
            display: block !important;
            position: absolute;
            inset: 0;
            width: 100%;
            background: white;
            color: #0f172a;
            padding: 24px;
            font-family: Arial, sans-serif;
          }

          @page {
            size: letter;
            margin: 0.45in;
          }

          .no-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[900px] bg-white text-slate-950">
        <header className="mb-5 flex items-start justify-between border-b-4 border-slate-950 pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Reporte de servicio HVAC</p>
            <h1 className="mt-1 text-3xl font-black">Orden #{orden.id}</h1>
            <p className="mt-1 text-sm font-bold text-slate-600">
              Estado: {orden.estado || "Sin estado"} · Prioridad: {orden.prioridad || "Media"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xl font-black">HVAC Manager</p>
            <p className="text-xs font-bold text-slate-500">Reporte para cliente</p>
            <p className="mt-2 text-xs font-bold text-slate-500">{formatDate(new Date())}</p>
          </div>
        </header>

        <section className="no-break mb-4 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-300 p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-600">
              <MapPin size={14} />
              Cliente
            </p>
            <p className="text-lg font-black">{cliente?.nombre || "Cliente eliminado"}</p>
            <p className="mt-1 text-sm font-bold">{formatPhone(cliente?.telefono)}</p>
            <p className="mt-2 text-sm text-slate-700">{cliente?.direccion || "Sin dirección"}</p>
            <p className="mt-1 text-xs text-slate-500">
              Apt {cliente?.apartamento || "—"} · Edificio {cliente?.edificio || "—"} · Código {cliente?.codigoAcceso || "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-300 p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-600">
              <UserCog size={14} />
              Técnico
            </p>
            <p className="text-lg font-black">{tecnico?.nombre || "Sin técnico"}</p>
            <p className="mt-1 text-sm font-bold">{formatPhone(tecnico?.telefono)}</p>
            <p className="mt-2 text-sm text-slate-700">{tecnico?.direccion || "Sin dirección"}</p>
          </div>
        </section>

        <section className="no-break mb-4 rounded-2xl border border-slate-300 p-4">
          <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-600">
            <ClipboardList size={14} />
            Problema reportado
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
            {orden.problema || "Sin problema reportado."}
          </p>
        </section>

        <section className="no-break mb-4 rounded-2xl border border-slate-300 p-4">
          <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-600">
            <FileText size={14} />
            Notas del técnico
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
            {orden.notasTecnico || "Sin notas registradas."}
          </p>
        </section>

        <section className="no-break mb-4 rounded-2xl border border-slate-300 p-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-600">
            <CalendarDays size={14} />
            Timeline resumido
          </p>

          <div className="grid gap-2">
            <TimelineRow label="Orden creada" value={formatDate(orden.fechaCreacion || orden.fecha)} done={Boolean(orden.fechaCreacion || orden.fecha)} />
            <TimelineRow label="Programada" value={`${orden.fechaProgramada || "Sin fecha"} · ${orden.horaProgramada || "Sin hora"}`} done={Boolean(orden.fechaProgramada || orden.horaProgramada)} />
            <TimelineRow label="Técnico llegó" value={formatDate(orden.horaLlegada)} done={Boolean(orden.horaLlegada)} />
            <TimelineRow label="Trabajo iniciado" value={formatDate(orden.horaInicio)} done={Boolean(orden.horaInicio)} />
            <TimelineRow label="Trabajo completado" value={formatDate(orden.fechaCompletada)} done={isCompletada} />
            {isCancelada && (
              <TimelineRow label={orden.cancelTipo || "Cancelada"} value={`${orden.cancelReason || "Sin motivo"} · ${formatDate(orden.fechaCancelacion || orden.fechaCompletada)}`} done />
            )}
          </div>
        </section>

        <section className="no-break mb-4 rounded-2xl border border-slate-300 p-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-600">
            <Wrench size={14} />
            Materiales usados
          </p>

          {materiales.length === 0 ? (
            <p className="text-sm font-semibold text-slate-500">Sin materiales registrados.</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="border border-slate-300 p-2 text-left">Material</th>
                  <th className="border border-slate-300 p-2 text-left">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {materiales.map((m, index) => (
                  <tr key={index}>
                    <td className="border border-slate-300 p-2 font-bold">{m.nombre || m.inventarioId || "Material"}</td>
                    <td className="border border-slate-300 p-2">{m.cantidad || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="mb-4 grid grid-cols-3 gap-3">
          <PhotoBox title="Antes" src={fotos.antes} />
          <PhotoBox title="Durante" src={fotos.durante} />
          <PhotoBox title="Después" src={fotos.despues} />
        </section>

        <section className="no-break mb-4 rounded-2xl border border-slate-300 p-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-600">
            <PenLine size={14} />
            Firma del cliente
          </p>

          {orden.firmaCliente ? (
            <div>
              <img src={orden.firmaCliente} alt="Firma del cliente" className="h-28 w-full rounded-xl border object-contain" />
              <p className="mt-2 text-xs font-bold text-slate-500">Firmado: {formatDate(orden.fechaFirmaCliente)}</p>
            </div>
          ) : (
            <p className="text-sm font-semibold text-slate-500">Esta orden no tiene firma registrada.</p>
          )}
        </section>

        <footer className="mt-6 border-t border-slate-300 pt-3 text-center text-xs font-bold text-slate-500">
          Reporte generado desde HVAC Manager · Información interna de costos excluida.
        </footer>
      </div>
    </div>
  );
}
