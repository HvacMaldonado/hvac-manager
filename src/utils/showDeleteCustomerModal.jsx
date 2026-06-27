import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ShieldAlert,
  X,
  Trash2,
  ClipboardList,
  CalendarDays,
  Building2,
} from "lucide-react";

function DeleteCustomerModal({
  cliente,
  ordenes = 0,
  citas = 0,
  onConfirm,
  onClose,
}) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => ordenes + citas, [ordenes, citas]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => setVisible(true));

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !loading) handleClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [loading]);

  const handleClose = () => {
    if (loading) return;
    setVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 180);
  };

  const handleConfirm = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await onConfirm?.();
      setVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 180);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div
      className={
        "fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 transition-all duration-200 " +
        (visible ? "bg-slate-950/70 backdrop-blur-md" : "bg-slate-950/0 backdrop-blur-0")
      }
      onClick={handleClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={
          "relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,15,35,0.95),rgba(11,33,57,0.92),rgba(12,49,74,0.88))] text-white shadow-[0_35px_120px_rgba(0,0,0,0.45)] transition-all duration-200 " +
          (visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-[0.98] opacity-0")
        }
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-[-80px] h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -right-16 bottom-[-80px] h-56 w-56 rounded-full bg-red-400/10 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-white/70 backdrop-blur-xl transition hover:scale-[1.02] hover:bg-white/[0.14] hover:text-white"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        <div className="relative px-6 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-8">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] border border-white/10 bg-white/[0.09] shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <ShieldAlert size={28} className="text-cyan-300" />
            </div>

            <div className="pr-10">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-cyan-300/90">
                Eliminación de cliente
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-[2rem]">
                Confirmar eliminación
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/68 sm:text-[15px]">
                Vas a eliminar permanentemente este cliente y sus registros relacionados.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/[0.06] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-cyan-200">
                <Building2 size={18} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/40">
                  Cliente
                </p>
                <p className="text-lg font-black text-white">
                  {cliente?.nombre || "Sin nombre"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.08] text-cyan-200">
                  <ClipboardList size={16} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
                  Órdenes
                </p>
                <p className="mt-1 text-2xl font-black text-white">{ordenes}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.08] text-cyan-200">
                  <CalendarDays size={16} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
                  Citas
                </p>
                <p className="mt-1 text-2xl font-black text-white">{citas}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.08] text-red-300">
                  <Trash2 size={16} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
                  Total afectado
                </p>
                <p className="mt-1 text-2xl font-black text-white">{total}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-red-400/15 bg-red-500/8 px-4 py-3 text-sm leading-6 text-white/72">
              Esta acción es permanente y no se puede deshacer.
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="inline-flex min-w-[130px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-black text-white/82 backdrop-blur-xl transition hover:bg-white/[0.11]"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-2xl border border-red-300/15 bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 text-sm font-black text-white shadow-[0_16px_34px_rgba(239,68,68,0.32)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Trash2 size={16} />
              {loading ? "Eliminando..." : "Eliminar cliente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function showDeleteCustomerModal({
  cliente,
  ordenes = 0,
  citas = 0,
  onConfirm,
}) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);

  const cleanup = () => {
    setTimeout(() => {
      root.unmount();
      container.remove();
    }, 10);
  };

  root.render(
    <DeleteCustomerModal
      cliente={cliente}
      ordenes={ordenes}
      citas={citas}
      onConfirm={onConfirm}
      onClose={cleanup}
    />
  );
}
