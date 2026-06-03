export const TECNICO_COLOR_THEMES = {
  azul: {
    name: "Azul",
    event: "border-cyan-200 bg-cyan-50 text-cyan-900",
    dot: "bg-cyan-500",
    header: "bg-gradient-to-r from-blue-950 via-blue-800 to-cyan-600",
    chip: "bg-cyan-300/25 text-cyan-50 ring-cyan-100/30",
    border: "border-cyan-300",
    body: "bg-cyan-50/70",
    buttonActive: "border-cyan-400 bg-cyan-50 text-cyan-800 ring-4 ring-cyan-100",
    buttonIdle: "border-cyan-200 bg-white text-slate-700 hover:border-cyan-400 hover:bg-cyan-50",
  },

  verde: {
    name: "Verde",
    event: "border-emerald-200 bg-emerald-50 text-emerald-900",
    dot: "bg-emerald-500",
    header: "bg-gradient-to-r from-emerald-950 via-emerald-800 to-lime-600",
    chip: "bg-lime-300/25 text-lime-50 ring-lime-100/30",
    border: "border-emerald-300",
    body: "bg-emerald-50/75",
    buttonActive: "border-emerald-400 bg-emerald-50 text-emerald-800 ring-4 ring-emerald-100",
    buttonIdle: "border-emerald-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50",
  },

  morado: {
    name: "Morado",
    event: "border-violet-200 bg-violet-50 text-violet-900",
    dot: "bg-violet-500",
    header: "bg-gradient-to-r from-violet-950 via-purple-800 to-fuchsia-600",
    chip: "bg-fuchsia-300/25 text-fuchsia-50 ring-fuchsia-100/30",
    border: "border-violet-300",
    body: "bg-violet-50/75",
    buttonActive: "border-violet-400 bg-violet-50 text-violet-800 ring-4 ring-violet-100",
    buttonIdle: "border-violet-200 bg-white text-slate-700 hover:border-violet-400 hover:bg-violet-50",
  },

  naranja: {
    name: "Naranja",
    event: "border-orange-200 bg-orange-50 text-orange-900",
    dot: "bg-orange-500",
    header: "bg-gradient-to-r from-orange-950 via-orange-800 to-amber-500",
    chip: "bg-amber-300/30 text-amber-50 ring-amber-100/30",
    border: "border-orange-300",
    body: "bg-orange-50/80",
    buttonActive: "border-orange-400 bg-orange-50 text-orange-800 ring-4 ring-orange-100",
    buttonIdle: "border-orange-200 bg-white text-slate-700 hover:border-orange-400 hover:bg-orange-50",
  },

  rosa: {
    name: "Rosa",
    event: "border-rose-200 bg-rose-50 text-rose-900",
    dot: "bg-rose-500",
    header: "bg-gradient-to-r from-pink-950 via-rose-800 to-red-600",
    chip: "bg-rose-300/25 text-rose-50 ring-rose-100/30",
    border: "border-rose-300",
    body: "bg-rose-50/75",
    buttonActive: "border-rose-400 bg-rose-50 text-rose-800 ring-4 ring-rose-100",
    buttonIdle: "border-rose-200 bg-white text-slate-700 hover:border-rose-400 hover:bg-rose-50",
  },

  gris: {
    name: "Gris",
    event: "border-slate-200 bg-slate-50 text-slate-900",
    dot: "bg-slate-500",
    header: "bg-gradient-to-r from-slate-950 via-slate-800 to-zinc-600",
    chip: "bg-slate-300/25 text-slate-50 ring-slate-100/30",
    border: "border-slate-300",
    body: "bg-slate-100",
    buttonActive: "border-slate-400 bg-slate-100 text-slate-900 ring-4 ring-slate-200",
    buttonIdle: "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100",
  },
};

export const TECNICO_COLOR_OPTIONS = [
  ["azul", "Azul"],
  ["verde", "Verde"],
  ["morado", "Morado"],
  ["naranja", "Naranja"],
  ["rosa", "Rosa"],
  ["gris", "Gris"],
];

export function getTecnicoTheme(tecnico) {
  if (!tecnico) return TECNICO_COLOR_THEMES.azul;
  return TECNICO_COLOR_THEMES[tecnico.colorTema] || TECNICO_COLOR_THEMES.azul;
}
