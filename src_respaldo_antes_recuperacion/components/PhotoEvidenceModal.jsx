import { Camera, ChevronLeft, ChevronRight, Download, ImageOff, Maximize2, X } from "lucide-react";
import { useMemo, useState } from "react";

const PHOTO_STEPS = [
  { key: "antes", label: "Antes del trabajo", short: "Antes" },
  { key: "durante", label: "Durante el trabajo", short: "Durante" },
  { key: "despues", label: "Después del trabajo", short: "Después" },
];

function getPhotoSrc(photo) {
  if (!photo) return "";
  if (typeof photo === "string") return photo;
  return photo.url || photo.src || photo.preview || photo.dataUrl || "";
}

function getPhotoNote(photo) {
  if (!photo || typeof photo === "string") return "";
  return photo.nota || photo.note || photo.descripcion || photo.description || "";
}

function getPhotoDate(photo) {
  if (!photo || typeof photo === "string") return "";
  const raw = photo.fecha || photo.date || photo.createdAt || "";
  if (!raw) return "";
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? String(raw) : d.toLocaleString();
}

export default function PhotoEvidenceModal({ open, onClose, orden, cliente, tecnico }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const photos = useMemo(() => {
    return PHOTO_STEPS.map((step) => {
      const photo = orden?.fotos?.[step.key];
      return {
        ...step,
        photo,
        src: getPhotoSrc(photo),
        note: getPhotoNote(photo),
        date: getPhotoDate(photo),
      };
    });
  }, [orden]);

  if (!open || !orden) return null;

  const active = photos[activeIndex] || photos[0];
  const completedCount = photos.filter((item) => item.src).length;

  const goPrevious = () => {
    setActiveIndex((current) => (current === 0 ? photos.length - 1 : current - 1));
  };

  const goNext = () => {
    setActiveIndex((current) => (current === photos.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm">
      <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl shadow-slate-950/50">
        <header className="flex flex-col gap-3 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-4 text-white lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">Evidencia fotográfica</p>
            <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
              <Camera size={24} />
              Orden #{orden.id}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              {cliente?.nombre || "Cliente eliminado"} · {tecnico?.nombre || "Sin técnico"} · Fotos {completedCount}/3
            </p>
          </div>

          <button
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20"
            aria-label="Cerrar galería"
          >
            <X size={22} />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border-b border-slate-200 bg-slate-50 p-3 lg:border-b-0 lg:border-r">
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
              {photos.map((item, index) => (
                <button
                  key={item.key}
                  onClick={() => setActiveIndex(index)}
                  className={`overflow-hidden rounded-2xl border text-left transition ${
                    activeIndex === index
                      ? "border-blue-300 bg-blue-50 ring-4 ring-blue-100"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="aspect-video bg-slate-100">
                    {item.src ? (
                      <img src={item.src} alt={item.label} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <ImageOff size={24} />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-black text-slate-950">{item.short}</p>
                    <p className="text-[10px] font-semibold text-slate-500">{item.src ? "Foto cargada" : "Sin foto"}</p>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <main className="min-h-0 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#22d3ee22,_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-4">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-700">{active.short}</p>
                <h3 className="text-xl font-black text-slate-950">{active.label}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={goPrevious} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={goNext} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm">
                  <ChevronRight size={20} />
                </button>
                {active.src && (
                  <a href={active.src} download className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                    <Download size={18} />
                  </a>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40">
              <div className="flex min-h-[360px] items-center justify-center bg-slate-100">
                {active.src ? (
                  <img src={active.src} alt={active.label} className="max-h-[58vh] w-full object-contain" />
                ) : (
                  <div className="p-10 text-center text-slate-500">
                    <ImageOff size={42} className="mx-auto mb-3" />
                    <p className="text-lg font-black text-slate-700">No hay foto cargada</p>
                    <p className="text-sm">El técnico todavía no ha subido imagen para esta etapa.</p>
                  </div>
                )}
              </div>

              <div className="grid gap-3 border-t border-slate-200 p-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Cliente</p>
                  <p className="mt-1 font-black text-slate-950">{cliente?.nombre || "Cliente eliminado"}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Técnico</p>
                  <p className="mt-1 font-black text-slate-950">{tecnico?.nombre || "Sin técnico"}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Fecha foto</p>
                  <p className="mt-1 font-black text-slate-950">{active.date || "Sin fecha"}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3 md:col-span-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Nota</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{active.note || "Sin nota agregada."}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
              <Maximize2 size={14} />
              Usa las flechas para revisar Antes, Durante y Después.
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
