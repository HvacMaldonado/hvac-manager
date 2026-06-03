import { Eraser, PenLine, Save, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function SignatureModal({ open, orden, cliente, onClose, onSave }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (!open) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    ctx.scale(ratio, ratio);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#0f172a";

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    setHasSignature(false);
  }, [open]);

  if (!open || !orden) return null;

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const source = event.touches?.[0] || event;

    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top,
    };
  };

  const startDrawing = (event) => {
    event.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const point = getPoint(event);

    drawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const draw = (event) => {
    if (!drawingRef.current) return;

    event.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const point = getPoint(event);

    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    drawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const saveSignature = () => {
    if (!hasSignature) {
      alert("El cliente debe firmar antes de guardar.");
      return;
    }

    onSave(canvasRef.current.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 z-[990] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl shadow-slate-950/50">
        <header className="flex items-center justify-between bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300">Confirmación del cliente</p>
            <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
              <PenLine size={24} />
              Firma del cliente
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Orden #{orden.id} · {cliente?.nombre || "Cliente eliminado"}
            </p>
          </div>

          <button onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <X size={20} />
          </button>
        </header>

        <main className="space-y-4 bg-[radial-gradient(circle_at_top_right,_#22d3ee33,_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_55%,_#ecfeff_100%)] p-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-2 text-sm font-black uppercase tracking-wide text-slate-600">
              Área de firma
            </p>

            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="h-56 w-full touch-none rounded-2xl border-2 border-dashed border-slate-300 bg-white"
            />

            <p className="mt-2 text-xs font-semibold text-slate-500">
              El cliente puede firmar con mouse, trackpad o dedo en pantalla táctil.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button onClick={clearSignature} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700">
              <Eraser size={16} />
              Limpiar
            </button>

            <button onClick={onClose} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700">
              Cancelar
            </button>

            <button onClick={saveSignature} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-700 px-4 py-3 text-sm font-black text-white shadow-lg">
              <Save size={16} />
              Guardar firma
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
