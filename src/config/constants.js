export const ADMIN_RECOVERY_CODE = "HVAC-2026";

export const iconProps = { size: 18, strokeWidth: 2 };

export const DEFAULT_TECNICOS = [
  { id: "carlos", nombre: "Carlos", usuario: "carlos", password: "1234", telefono: "", direccion: "", fechaIngreso: "", fechaSalida: "", activo: true },
  { id: "miguel", nombre: "Miguel", usuario: "miguel", password: "1234", telefono: "", direccion: "", fechaIngreso: "", fechaSalida: "", activo: true },
  { id: "luis", nombre: "Luis", usuario: "luis", password: "1234", telefono: "", direccion: "", fechaIngreso: "", fechaSalida: "", activo: true },
  { id: "andres", nombre: "Andrés", usuario: "andres", password: "1234", telefono: "", direccion: "", fechaIngreso: "", fechaSalida: "", activo: true },
];

export const CATEGORIAS_HVAC = [
  "Unidades de aire acondicionado",
  "Condensadores",
  "Evaporadoras",
  "Minisplits",
  "Hornos / calefacción",
  "Termostatos",
  "Tornillos",
  "Cintas",
  "Cableado",
  "Tubos PVC",
  "Ductos",
  "Filtros",
  "Gas refrigerante",
  "Capacitores",
  "Contactores",
  "Breakers",
  "Fusibles",
  "Bases / soportes / accesorios",
  "Otros",
];

export const UNIDADES = ["pieza", "caja", "rollo", "libra", "galón", "pie", "metro", "unidad completa"];

export const PRIORIDADES = [
  { value: "Baja", help: "mantenimiento normal", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "Media", help: "servicio programado", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "Alta", help: "cliente sin aire o calefacción", cls: "bg-sky-50 text-sky-700 border-sky-200" },
  { value: "Urgente", help: "emergencia / sistema detenido", cls: "bg-rose-50 text-rose-700 border-rose-200" },
];

export const ESTADOS_ORDEN = ["Pendiente", "Asignada", "En ruta", "En proceso", "Completado", "Cancelada"];

export const TIPOS_INVENTARIO = ["Material consumible", "Herramienta / equipo", "Parte reutilizable"];
