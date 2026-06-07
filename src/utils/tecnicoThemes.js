
export const TECNICO_COLOR_THEMES = {
  azul: {
    name: "Azul",
    label: "Azul",
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
    label: "Verde",
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
    label: "Morado",
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
    name: "Azul eléctrico",
    label: "Azul eléctrico",
    event: "border-blue-200 bg-blue-50 text-blue-950",
    dot: "bg-blue-600",
    header: "bg-gradient-to-r from-blue-950 via-blue-800 to-sky-500",
    chip: "bg-blue-300/25 text-blue-50 ring-blue-100/30",
    border: "border-blue-300",
    body: "bg-blue-50/80",
    buttonActive: "border-blue-400 bg-blue-50 text-blue-800 ring-4 ring-blue-100",
    buttonIdle: "border-blue-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50",
  },
  rosa: {
    name: "Rosa",
    label: "Rosa",
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
    name: "Grafito",
    label: "Grafito",
    event: "border-zinc-300 bg-zinc-100 text-zinc-950",
    dot: "bg-zinc-800",
    header: "bg-gradient-to-r from-zinc-950 via-slate-800 to-zinc-600",
    chip: "bg-zinc-300/25 text-zinc-50 ring-zinc-100/30",
    border: "border-zinc-400",
    body: "bg-zinc-100",
    buttonActive: "border-zinc-500 bg-zinc-100 text-zinc-950 ring-4 ring-zinc-200",
    buttonIdle: "border-zinc-300 bg-white text-slate-700 hover:border-zinc-500 hover:bg-zinc-100",
  },
  sinTecnico: {
    name: "Sin técnico",
    label: "Sin técnico",
    event: "border-slate-300 bg-slate-100 text-slate-950",
    dot: "bg-slate-700",
    header: "bg-gradient-to-r from-slate-950 via-slate-800 to-zinc-600",
    chip: "bg-slate-300/25 text-slate-50 ring-slate-100/30",
    border: "border-slate-400",
    body: "bg-slate-100",
    buttonActive: "border-slate-500 bg-slate-100 text-slate-950 ring-4 ring-slate-200",
    buttonIdle: "border-slate-300 bg-white text-slate-700 hover:border-slate-500 hover:bg-slate-100",
  },
};

export const TECNICO_COLOR_OPTIONS = [
  ["azul", "Azul"],
  ["verde", "Verde"],
  ["morado", "Morado"],
  ["naranja", "Azul eléctrico"],
  ["rosa", "Rosa"],
  ["gris", "Grafito"],
];

export function getTecnicoTheme(tecnico) {
  if (!tecnico) return TECNICO_COLOR_THEMES.sinTecnico;
  return TECNICO_COLOR_THEMES[tecnico.colorTema] || TECNICO_COLOR_THEMES.azul;
}

export function getTecnicoThemeById(tecnicos = [], tecnicoId) {
  const tecnicoIndex = tecnicos.findIndex((tec) => String(tec.id) === String(tecnicoId));
  const tecnico = tecnicoIndex >= 0 ? tecnicos[tecnicoIndex] : null;

  if (!tecnico) return TECNICO_COLOR_THEMES.sinTecnico;

  if (tecnico.colorTema && TECNICO_COLOR_THEMES[tecnico.colorTema]) {
    return TECNICO_COLOR_THEMES[tecnico.colorTema];
  }

  const fallbackColors = ["azul", "verde", "morado", "naranja", "rosa", "gris"];
  const fallbackColor = fallbackColors[tecnicoIndex % fallbackColors.length];

  return TECNICO_COLOR_THEMES[fallbackColor] || TECNICO_COLOR_THEMES.azul;
}
