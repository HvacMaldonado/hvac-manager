import {
  Camera,
  CalendarDays,
  ClipboardList,
  FileText,
  MapPin,
  Navigation,
  Phone,
  Printer,
  UserCog,
  Wrench,
  X,
} from "lucide-react";
import PhotoEvidenceModal from "./PhotoEvidenceModal.jsx";
import OrderTimeline from "./OrderTimeline.jsx";
import PrintableOrderReport from "./PrintableOrderReport.jsx";
import { useState } from "react";

function formatPhoneDisplay(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length !== 10) return digits || "—";
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function StatBox({ icon: Icon, label, value, tone = "bg-slate-50 text-slate-800 border-slate-200" }) {
  return (
    <div className={`rounded-2xl border p-3 ${tone}`}>
      <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide opacity-70">
        <Icon size={13} />
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black">{value || "—"}</p>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-blue-700">
        <Icon size={17} />
        {title}
      </p>
      {children}
    </section>
  );
}

export default function OrderDetailModal({ open, onClose, orden, cliente, tecnico, ordenProps }) {
  const [showPhotos, setShowPhotos] = useState(false);

  if (!open || !orden) return null;

  const materiales = orden.materiales || orden.materialesUsados || [];
  const fotosCount = ["antes", "durante", "despues"].filter((k) => orden.fotos?.[k]).length;

  return (
    <div className="fixed inset-0 z-[950] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm">
      <div className="max-h-[94vh] w-full max-w-7xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl shadow-slate-950/50">
        <header className="flex flex-col gap-3 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">Detalle completo</p>
            <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
              <FileText size={24} />
              Orden #{orden.id}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              {orden.estado || "Sin estado"} · {orden.prioridad || "Media"} · {formatDate(orden.fechaCompletada || orden.fechaCreacion || orden.fecha)}
            </p>
          </div>

          <button onClick={onClose} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20">
            <X size={22} />
          </button>
        </header>

        <main className="max-h-[calc(94vh-92px)] overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#22d3ee22,_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-4">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <StatBox icon={ClipboardList} label="Estado" value={orden.estado || "Sin estado"} tone="bg-blue-50 text-blue-900 border-blue-200" />
                <StatBox icon={CalendarDays} label="Prioridad" value={orden.prioridad || "Media"} tone="bg-cyan-50 text-cyan-900 border-cyan-200" />
                <StatBox icon={CalendarDays} label="Fecha" value={formatDate(orden.fechaProgramada || orden.fechaCreacion || orden.fecha)} />
                <StatBox icon={Camera} label="Fotos" value={`${fotosCount}/3`} tone="bg-purple-50 text-purple-900 border-purple-200" />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <SectionCard title="Cliente" icon={MapPin}>
                  <p className="text-xl font-black text-slate-950">{cliente?.nombre || "Cliente eliminado"}</p>
                  <p className="mt-1 text-sm font-bold text-slate-600">{formatPhoneDisplay(cliente?.telefono)}</p>
                  <p className="mt-2 text-sm text-slate-600">{cliente?.direccion || "Sin dirección"}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Apt {cliente?.apartamento || "—"} · Edificio {cliente?.edificio || "—"} · Código {cliente?.codigoAcceso || "—"}
                  </p>
                </SectionCard>

                <SectionCard title="Técnico" icon={UserCog}>
                  <p className="text-xl font-black text-slate-950">{tecnico?.nombre || "Sin técnico"}</p>
                  <p className="mt-1 text-sm font-bold text-slate-600">{formatPhoneDisplay(tecnico?.telefono)}</p>
                  <p className="mt-2 text-sm text-slate-600">{tecnico?.direccion || "Sin dirección"}</p>
                </SectionCard>
              </div>

              <SectionCard title="Problema reportado" icon={ClipboardList}>
                <p className="whitespace-pre-wrap text-sm font-semibold leading-relaxed text-slate-700">
                  {orden.problema || "Sin problema reportado."}
                </p>
              </SectionCard>

              <SectionCard title="Notas del técnico" icon={FileText}>
                <p className="whitespace-pre-wrap text-sm font-semibold leading-relaxed text-slate-700">
                  {orden.notasTecnico || "Sin notas registradas."}
                </p>
              </SectionCard>

              <SectionCard title="Firma del cliente" icon={FileText}>
                {orden.firmaCliente ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <img src={orden.firmaCliente} alt="Firma del cliente" className="max-h-28 w-full object-contain" />
                    <p className="mt-2 text-xs font-bold text-slate-500">
                      Firmado: {formatDate(orden.fechaFirmaCliente)}
                    </p>
                  </div>
                ) : (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                    Esta orden todavía no tiene firma del cliente.
                  </p>
                )}
              </SectionCard>

              <SectionCard title="Materiales usados" icon={Wrench}>
                {materiales.length === 0 ? (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                    No hay materiales registrados en esta orden.
                  </p>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <div className="grid grid-cols-[1fr_110px] bg-slate-950 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white">
                      <span>Material</span>
                      <span>Cantidad</span>
                    </div>
                    {materiales.map((m, index) => (
                      <div key={index} className="grid grid-cols-[1fr_110px] border-t border-slate-200 px-3 py-2 text-sm">
                        <span className="font-bold text-slate-800">{m.nombre || m.inventarioId || "Material"}</span>
                        <span className="font-black text-slate-950">{m.cantidad || "—"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              <OrderTimeline orden={orden} />
            </section>

            <aside className="space-y-4">
              <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-3 text-sm font-black uppercase tracking-wide text-blue-700">Acciones rápidas</p>

                <div className="grid grid-cols-2 gap-2">
                  {cliente?.telefono && (
                    <a href={ordenProps?.urlTelefono?.(cliente.telefono) || `tel:${cliente.telefono}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-3 text-sm font-black text-white shadow-sm">
                      <Phone size={16} />
                      Llamar
                    </a>
                  )}

                  {cliente?.direccion && (
                    <a href={ordenProps?.urlAppleMaps?.(cliente.direccion)} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-3 text-sm font-black text-white shadow-sm">
                      <Navigation size={16} />
                      Mapa
                    </a>
                  )}

                  <button onClick={() => window.print()} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-700 px-3 text-sm font-black text-white shadow-sm">
                    <Printer size={16} />
                    PDF
                  </button>

                  <button onClick={() => setShowPhotos(true)} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-purple-700 px-3 text-sm font-black text-white shadow-sm">
                    <Camera size={16} />
                    Fotos
                  </button>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-3 text-sm font-black uppercase tracking-wide text-blue-700">Resumen operativo</p>

                <div className="grid gap-2">
                  <StatBox icon={ClipboardList} label="Estado" value={orden.estado || "Sin estado"} />
                  <StatBox icon={CalendarDays} label="Prioridad" value={orden.prioridad || "Media"} />
                  <StatBox icon={CalendarDays} label="Programada" value={`${orden.fechaProgramada || "Sin fecha"} · ${orden.horaProgramada || "Sin hora"}`} />
                  <StatBox icon={Camera} label="Evidencia" value={`${fotosCount}/3 fotos`} />
                </div>
              </section>

              {orden.estado === "Cancelada" && (
                <section className="rounded-3xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
                  <p className="mb-2 text-sm font-black uppercase tracking-wide text-rose-700">Cancelación</p>
                  <p className="text-sm font-black text-rose-950">{orden.cancelTipo || "Cancelada"}</p>
                  <p className="mt-1 text-sm font-semibold text-rose-800">{orden.cancelReason || "Sin motivo registrado"}</p>
                  <p className="mt-2 text-xs font-bold text-rose-700">
                    Por: {orden.canceladoPorNombre || orden.canceladoPor || "Sin responsable"}
                  </p>
                </section>
              )}
            </aside>
          </div>
        </main>
      </div>

      <PrintableOrderReport orden={orden} cliente={cliente} tecnico={tecnico} t={ordenProps?.t || ((key) => key)} />

      <PhotoEvidenceModal
        open={showPhotos}
        onClose={() => setShowPhotos(false)}
        orden={orden}
        cliente={cliente}
        tecnico={tecnico}
      />
    </div>
  );
}
