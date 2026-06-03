import { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Clock3,
  Languages,
  Lock,
  LogIn,
  LogOut,
  MapPin,
  Package,
  Search,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";
import {
  iconProps,
  PRIORIDADES,
  buildAddressFromPrediction,
} from "../../lib/shared.jsx";

export function TopInfo({ now }) {
  return (
    <div className="flex items-center gap-2 2xl:gap-6 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 text-white px-3 2xl:px-6 py-2 2xl:py-4 rounded-xl 2xl:rounded-2xl shadow-lg shadow-cyan-200/40">
      <div className="flex items-center gap-1.5 2xl:gap-2">
        <CalendarDays className="w-3.5 h-3.5 2xl:w-5 2xl:h-5 text-cyan-400" strokeWidth={2} />
        <span className="text-xs 2xl:text-base font-semibold">{now.toLocaleDateString()}</span>
      </div>
      <div className="flex items-center gap-1.5 2xl:gap-2">
        <Clock3 className="w-3.5 h-3.5 2xl:w-5 2xl:h-5 text-emerald-400" strokeWidth={2} />
        <span className="text-xs 2xl:text-base font-semibold">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  );
}

export function LoginScreen({ t, lang, setLang, loginForm, setLoginForm, iniciarSesion, mensaje }) {
  return <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_#1e3a8a22,_transparent_34%),radial-gradient(circle_at_bottom_right,_#0284c724,_transparent_28%),linear-gradient(135deg,_#f8fafc,_#e5e7eb,_#cbd5e1)] flex items-center justify-center p-4"><section className="relative w-full max-w-md rounded-[2rem] border border-white/70 bg-gradient-to-br from-white via-slate-50 to-blue-50/50 p-8 shadow-2xl shadow-slate-300/60 backdrop-blur-xl"><div className="mb-8 text-center"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl shadow-cyan-200"><span className="text-xl 2xl:text-2xl font-black">HV</span></div><p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-600">HVAC Manager</p><h1 className="mt-2 text-3xl font-black text-slate-950">{t("login")}</h1></div><div className="space-y-4"><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" {...iconProps} /><input value={loginForm.usuario} onChange={(e) => setLoginForm({ ...loginForm, usuario: e.target.value })} placeholder={t("user")} className="w-full rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-cyan-50/50 px-12 py-4 outline-none shadow-sm transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" /></div><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" {...iconProps} /><input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} placeholder={t("password")} className="w-full rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-cyan-50/50 px-12 py-4 outline-none shadow-sm transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" onKeyDown={(e) => e.key === "Enter" && iniciarSesion()} /></div><button onClick={iniciarSesion} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4 font-black text-white shadow-xl shadow-cyan-200 transition hover:-translate-y-0.5"><LogIn {...iconProps} />{t("login")}</button></div>{mensaje && <p className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-800">{mensaje}</p>}</section></div>;
}

export function StatsBar({ clientes, ordenes, inventario, herramientas }) {
  return (
    <div className="mb-3 grid grid-cols-5 gap-1.5 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
      <SoftStat icon={Users} titulo="Clientes" valor={clientes.length} accent="from-slate-950 via-slate-800 to-blue-900" glow="shadow-blue-950/25" />
      <SoftStat icon={ClipboardList} titulo="Órdenes" valor={ordenes.length} accent="from-zinc-950 via-slate-800 to-blue-800" glow="shadow-blue-950/20" />
      <SoftStat icon={CheckCircle2} titulo="Completadas" valor={ordenes.filter((o) => o.estado === "Completado").length} accent="from-emerald-950 via-green-800 to-teal-700" glow="shadow-emerald-950/25" />
      <SoftStat icon={Package} titulo="Inventario" valor={inventario.length} accent="from-blue-950 via-sky-800 to-cyan-700" glow="shadow-cyan-950/25" />
      <SoftStat icon={Wrench} titulo="Herramientas" valor={herramientas.length} accent="from-neutral-950 via-slate-900 to-blue-800" glow="shadow-slate-950/30" />
    </div>
  );
}

export function SoftStat({ titulo, valor, icon: Icon, accent = "from-slate-950 to-blue-900", glow = "shadow-slate-900/25" }) {
  return (
    <div className={`relative min-w-[92px] 2xl:min-w-0 overflow-hidden rounded-lg 2xl:rounded-[1.35rem] border border-white/10 bg-gradient-to-br ${accent} px-2 py-2 2xl:px-4 2xl:py-4 text-white shadow-md 2xl:shadow-xl ${glow} backdrop-blur`}>
      <div className="absolute -right-5 -top-5 h-10 w-10 2xl:h-28 2xl:w-28 rounded-full bg-white/10 2xl:bg-white/12 blur-md" />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] 2xl:h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-transparent" />

      <div className="flex items-center justify-between gap-1.5 2xl:gap-2 2xl:gap-3">
        <div className="inline-flex h-5 w-5 2xl:h-14 2xl:w-14 shrink-0 items-center justify-center rounded-md 2xl:rounded-2xl bg-white/15 text-white ring-1 ring-white/20 shadow-sm 2xl:shadow-xl">
          <Icon size={11} strokeWidth={2.3} className="2xl:hidden" />
          <Icon size={30} strokeWidth={2.4} className="hidden 2xl:block" />
        </div>

        <p className="min-w-0 font-black leading-none tracking-tight text-white text-2xl 2xl:text-6xl drop-shadow">
          {valor}
        </p>
      </div>

      <p className="mt-1 2xl:mt-3 truncate text-[8px] 2xl:text-[15px] font-black uppercase tracking-wide text-slate-100">
        {titulo}
      </p>
    </div>
  );
}

export function PriorityChips({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {PRIORIDADES.map((p) => {
        const activo = value === p.value;

        return (
          <button
            key={p.value}
            type="button"
            onClick={() => onChange(p.value)}
            className={`
              group
              flex
              w-full
              items-center
              justify-between
              gap-3
              rounded-xl
              border
              px-3
              py-2.5
              text-left
              transition
              ${
                activo
                  ? `${p.cls} ring-4 ring-cyan-100 shadow-md`
                  : "border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:bg-cyan-50"
              }
            `}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`
                  inline-flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  ${
                    activo
                      ? "bg-white/70"
                      : "bg-slate-100 text-slate-500 group-hover:bg-cyan-100 group-hover:text-cyan-700"
                  }
                `}
              >
                <AlertTriangle size={15} />
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-black">{p.value}</p>
                <p className="truncate text-[11px] opacity-75">{p.help}</p>
              </div>
            </div>

            <span
              className={`
                h-3
                w-3
                shrink-0
                rounded-full
                border
                ${
                  activo
                    ? "border-cyan-600 bg-cyan-600"
                    : "border-slate-300 bg-white"
                }
              `}
            />
          </button>
        );
      })}
    </div>
  );
}

export function AddressInput({ value, onChange }) {
  return (
    <div className="relative md:col-span-3">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Dirección completa"
        autoComplete="street-address"
        className="w-full rounded-xl 2xl:rounded-2xl border border-slate-700/20 bg-white p-2 2xl:p-3 pr-10 2xl:pr-12 text-sm 2xl:text-base outline-none shadow-sm transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
      />
      <MapPin className="absolute right-3 top-3.5 text-slate-500" {...iconProps} />
    </div>
  );
}
