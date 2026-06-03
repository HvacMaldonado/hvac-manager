import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownToLine,
  BarChart3,
  Calendar,
  CalendarDays,
  Camera,
  CheckCircle,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Clock3,
  Clock4,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  History,
  Languages,
  LoaderCircle,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  MapPinned,
  MessageCircle,
  Navigation,
  Package,
  PackageOpen,
  Pencil,
  Phone,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Timer,
  Trash2,
  User,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";

const ADMIN_RECOVERY_CODE = "HVAC-2026";
const iconProps = { size: 18, strokeWidth: 2 };

const DEFAULT_TECNICOS = [
  { id: "carlos", nombre: "Carlos", usuario: "carlos", password: "1234", telefono: "", direccion: "", fechaIngreso: "", fechaSalida: "", activo: true },
  { id: "miguel", nombre: "Miguel", usuario: "miguel", password: "1234", telefono: "", direccion: "", fechaIngreso: "", fechaSalida: "", activo: true },
  { id: "luis", nombre: "Luis", usuario: "luis", password: "1234", telefono: "", direccion: "", fechaIngreso: "", fechaSalida: "", activo: true },
  { id: "andres", nombre: "Andrés", usuario: "andres", password: "1234", telefono: "", direccion: "", fechaIngreso: "", fechaSalida: "", activo: true },
];

const CATEGORIAS_HVAC = [
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

const UNIDADES = ["pieza", "caja", "rollo", "libra", "galón", "pie", "metro", "unidad completa"];

const PRIORIDADES = [
  { value: "Baja", help: "mantenimiento normal", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "Media", help: "servicio programado", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "Alta", help: "cliente sin aire o calefacción", cls: "bg-sky-50 text-sky-700 border-sky-200" },
  { value: "Urgente", help: "emergencia / sistema detenido", cls: "bg-rose-50 text-rose-700 border-rose-200" },
];

const ESTADOS_ORDEN = ["Pendiente", "Asignada", "En ruta", "En proceso", "Completado", "Cancelada"];

const TIPOS_INVENTARIO = ["Material consumible", "Herramienta / equipo", "Parte reutilizable"];

const TEXT = {
  es: {
    app: "HVAC Manager",
    login: "Ingresar",
    user: "Usuario",
    password: "Contraseña",
    adminPanel: "Panel del Administrador",
    techPanel: "Panel del Técnico",
    logout: "Cerrar sesión",
    changePassword: "Cambiar contraseña",
    customers: "Clientes",
    technicians: "Técnicos",
    appointments: "Citas",
    orders: "Órdenes",
    completedHistory: "Historial completado",
    inventory: "Inventario general",
    tools: "Herramientas técnico",
    reportsCustomers: "Reportes clientes",
    reportsInventory: "Reportes inventario",
    settings: "Configuración",
    activeOrders: "Órdenes activas",
    createOrder: "Crear orden",
    searchCustomer: "Buscar cliente",
    reportedProblem: "Problema reportado",
    assignTech: "Asignar técnico",
    priority: "Prioridad",
    create: "Crear",
    add: "Agregar",
    edit: "Editar",
    save: "Guardar",
    delete: "Eliminar",
    call: "Llamar",
    share: "Compartir",
    print: "Imprimir",
    email: "Email",
    whatsapp: "WhatsApp",
    message: "Mensaje",
    messenger: "Messenger",
    materials: "Materiales",
    notes: "Notas",
    photos: "Fotos",
    start: "Iniciar",
    complete: "Completar",
    filters: "Filtros",
    clearFilters: "Limpiar filtros",
    scheduledDate: "Fecha programada",
    scheduledTime: "Hora programada",
    orderStatus: "Estado de orden",
    assigned: "Asignada",
    onRoute: "En ruta",
    canceled: "Cancelada",
    editCustomer: "Editar cliente",
    customerHistory: "Historial del cliente",
    saveChanges: "Guardar cambios",
    createAppointment: "Programar cita",
    onlySave: "Solo guardar",
    duplicateCustomer: "Cliente posiblemente duplicado",
    materialType: "Tipo de inventario",
    consumable: "Material consumible",
    reusableTool: "Herramienta / equipo",
    returnTool: "Devolver herramienta",
    translate: "Traducir",
  },
  en: {
    app: "HVAC Manager",
    login: "Sign in",
    user: "User",
    password: "Password",
    adminPanel: "Administrator Panel",
    techPanel: "Technician Panel",
    logout: "Log out",
    changePassword: "Change password",
    customers: "Customers",
    technicians: "Technicians",
    appointments: "Appointments",
    orders: "Orders",
    completedHistory: "Completed history",
    inventory: "General inventory",
    tools: "Technician tools",
    reportsCustomers: "Customer reports",
    reportsInventory: "Inventory reports",
    settings: "Settings",
    activeOrders: "Active orders",
    createOrder: "Create order",
    searchCustomer: "Search customer",
    reportedProblem: "Reported problem",
    assignTech: "Assign technician",
    priority: "Priority",
    create: "Create",
    add: "Add",
    edit: "Edit",
    save: "Save",
    delete: "Delete",
    call: "Call",
    share: "Share",
    print: "Print",
    email: "Email",
    whatsapp: "WhatsApp",
    message: "Message",
    messenger: "Messenger",
    materials: "Materials",
    notes: "Notes",
    photos: "Photos",
    start: "Start",
    complete: "Complete",
    filters: "Filters",
    clearFilters: "Clear filters",
    scheduledDate: "Scheduled date",
    scheduledTime: "Scheduled time",
    orderStatus: "Order status",
    assigned: "Assigned",
    onRoute: "On route",
    canceled: "Canceled",
    editCustomer: "Edit customer",
    customerHistory: "Customer history",
    saveChanges: "Save changes",
    createAppointment: "Schedule appointment",
    onlySave: "Only save",
    duplicateCustomer: "Possible duplicate customer",
    materialType: "Inventory type",
    consumable: "Consumable material",
    reusableTool: "Tool / equipment",
    returnTool: "Return tool",
    translate: "Translate",
  },
};

function IconText({ icon: Icon, children, className = "" }) {
  return <span className={`inline-flex items-center gap-2 ${className}`}><Icon {...iconProps} />{children}</span>;
}

function getStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function formatPhoneUS(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  return digits;
}

function phoneIsValidUS(value) {
  return String(value || "").replace(/\D/g, "").length === 10;
}

function buildAddressFromPrediction(prediction) {
  return prediction?.description || "";
}


function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPhoneDisplay(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length !== 10) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatReportDate(value) {
  if (!value) return new Date().toLocaleDateString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

function toDateKey(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return String(value);
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayKey() {
  return toDateKey(new Date());
}

function isTodayValue(value) {
  return toDateKey(value) === todayKey();
}

function isFutureValue(value) {
  const key = toDateKey(value);
  return key && key > todayKey();
}

function getDayName(value = new Date(), lang = "es") {
  const date = value instanceof Date ? value : new Date(value);
  const locale = lang === "en" ? "en-US" : "es-US";
  const day = date.toLocaleDateString(locale, { weekday: "long" });
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function sortByDateTime(a, b) {
  const aKey = `${a.fechaProgramada || a.fecha || toDateKey(a.fechaCreacion || a.fechaCompletada)} ${a.horaProgramada || a.hora || ""}`;
  const bKey = `${b.fechaProgramada || b.fecha || toDateKey(b.fechaCreacion || b.fechaCompletada)} ${b.horaProgramada || b.hora || ""}`;
  return aKey.localeCompare(bKey);
}

function normalizeOrden(orden) {
  return {
    ...orden,
    estado: orden.estado === "Pendiente" && orden.tecnicoId ? "Asignada" : orden.estado,
    fechaProgramada: orden.fechaProgramada || "",
    horaProgramada: orden.horaProgramada || "",
    cancelReason: orden.cancelReason || "",
  };
}

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("hvacLang") || "es");
  const t = (key) => TEXT[lang]?.[key] || TEXT.es[key] || key;

  const [session, setSession] = useState(() => getStorage("hvacSession", null));
  const [adminPage, setAdminPage] = useState("clientes");
  const [loginForm, setLoginForm] = useState({ usuario: "", password: "" });
  const [mensaje, setMensaje] = useState("");
  const [clienteAccion, setClienteAccion] = useState(null);
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem("adminPassword") || "admin123");
  const [clientes, setClientes] = useState(() => getStorage("clientes", []));
  const [ordenes, setOrdenes] = useState(() => getStorage("ordenes", []));
  const [inventario, setInventario] = useState(() => getStorage("inventarioHVAC", []));
  const [herramientas, setHerramientas] = useState(() => getStorage("herramientasHVAC", []));
  const [tecnicos, setTecnicos] = useState(() => getStorage("tecnicosHVAC", DEFAULT_TECNICOS));
  const [citas, setCitas] = useState(() => getStorage("citasHVAC", []));

  const [now, setNow] = useState(new Date());
  const [busquedaClienteOrden, setBusquedaClienteOrden] = useState("");
  const [clienteForm, setClienteForm] = useState({ nombre: "", telefono: "", email: "", direccion: "", apartamento: "", calle: "", codigoAcceso: "", edificio: "" });
  const [ordenForm, setOrdenForm] = useState({ clienteId: "", problema: "", tecnicoId: "", prioridad: "Media", fechaProgramada: "", horaProgramada: "" });
  const [inventarioForm, setInventarioForm] = useState({ nombre: "", categoria: "Unidades de aire acondicionado", tipo: "Material consumible", cantidad: "", unidad: "pieza", costo: "", stockMinimo: "1" });
  const [herramientaForm, setHerramientaForm] = useState({ nombre: "", tecnicoId: "", cantidad: "", estado: "Disponible", notas: "" });
  const [tecnicoHerramientasSeleccionado, setTecnicoHerramientasSeleccionado] = useState("");
  const [citaForm, setCitaForm] = useState({ clienteId: "", tecnicoId: "", fecha: "", hora: "", motivo: "", notas: "" });
  const [reporteFiltro, setReporteFiltro] = useState({ texto: "", tecnicoId: "", clienteId: "", estado: "", fechaInicio: "", fechaFin: "" });

  useEffect(() => localStorage.setItem("clientes", JSON.stringify(clientes)), [clientes]);
  useEffect(() => localStorage.setItem("ordenes", JSON.stringify(ordenes)), [ordenes]);
  useEffect(() => localStorage.setItem("inventarioHVAC", JSON.stringify(inventario)), [inventario]);
  useEffect(() => localStorage.setItem("herramientasHVAC", JSON.stringify(herramientas)), [herramientas]);
  useEffect(() => localStorage.setItem("tecnicosHVAC", JSON.stringify(tecnicos)), [tecnicos]);
  useEffect(() => localStorage.setItem("citasHVAC", JSON.stringify(citas)), [citas]);
  useEffect(() => localStorage.setItem("adminPassword", adminPassword), [adminPassword]);
  useEffect(() => localStorage.setItem("hvacLang", lang), [lang]);
  useEffect(() => { session ? localStorage.setItem("hvacSession", JSON.stringify(session)) : localStorage.removeItem("hvacSession"); }, [session]);
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer); }, []);

  const obtenerCliente = (id) => clientes.find((c) => String(c.id) === String(id));
  const obtenerTecnico = (id) => tecnicos.find((tt) => String(tt.id) === String(id));
  const obtenerMaterial = (id) => inventario.find((i) => String(i.id) === String(id));
  const limpiarTexto = (v) => String(v || "").toLowerCase().trim();
  const limpiarTelefono = (v) => String(v || "").replace(/\D/g, "");
  const urlGoogleMaps = (direccion) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion || "")}`;
  const urlAppleMaps = (direccion) => `https://maps.apple.com/?q=${encodeURIComponent(direccion || "")}`;
  const urlTelefono = (telefono) => `tel:${telefono || ""}`;

  const clientesFiltradosOrden = useMemo(() => {
    const q = limpiarTexto(busquedaClienteOrden);
    const phone = limpiarTelefono(busquedaClienteOrden);
    if (!q) return [];
    return clientes.filter((c) => {
      return limpiarTexto(c.nombre).includes(q) || limpiarTexto(c.email).includes(q) || limpiarTexto(c.direccion).includes(q) || (phone && limpiarTelefono(c.telefono).includes(phone));
    }).slice(0, 10);
  }, [busquedaClienteOrden, clientes]);

  const tecnicosActivos = useMemo(() => tecnicos.filter((tec) => tec.activo !== false), [tecnicos]);

  const iniciarSesion = () => {
    const usuario = limpiarTexto(loginForm.usuario);
    if (usuario === "admin" && loginForm.password === adminPassword) {
      setSession({ role: "admin", id: "admin", nombre: "Administrador" });
      setLoginForm({ usuario: "", password: "" });
      setMensaje("");
      return;
    }
    const tecnico = tecnicos.find((tecnico) => tecnico.activo !== false && limpiarTexto(tecnico.usuario || tecnico.nombre) === usuario && tecnico.password === loginForm.password);
    if (tecnico) {
      setSession({ role: "tecnico", id: tecnico.id, nombre: tecnico.nombre });
      setLoginForm({ usuario: "", password: "" });
      setMensaje("");
      return;
    }
    setMensaje("Usuario o contraseña incorrectos.");
  };

  const cerrarSesion = () => { setSession(null); setAdminPage("clientes"); setMensaje(""); setClienteAccion(null); };

  const abrirCrearOrdenConCliente = (cliente) => {
    if (!cliente) return;
    setOrdenForm((actual) => ({ ...actual, clienteId: String(cliente.id) }));
    setBusquedaClienteOrden(`${cliente.nombre} - ${cliente.telefono || ""}`);
    setAdminPage("ordenes");
    setClienteAccion(null);
    setMensaje("");
  };

  const abrirProgramarCitaConCliente = (cliente) => {
    if (!cliente) return;
    setCitaForm((actual) => ({ ...actual, clienteId: String(cliente.id) }));
    setAdminPage("citas");
    setClienteAccion(null);
    setMensaje("");
  };

  const clienteExiste = (datos) => {
    const phone = limpiarTelefono(datos.telefono);
    const email = limpiarTexto(datos.email);
    const nombre = limpiarTexto(datos.nombre);
    const direccion = limpiarTexto(datos.direccion);
    return clientes.find((c) => {
      return (phone && limpiarTelefono(c.telefono) === phone) || (email && limpiarTexto(c.email) === email) || (nombre && direccion && limpiarTexto(c.nombre) === nombre && limpiarTexto(c.direccion) === direccion);
    });
  };

  const agregarCliente = () => {
    if (!clienteForm.nombre || !clienteForm.telefono || !clienteForm.direccion) {
      return setMensaje("Nombre, teléfono y dirección son obligatorios.");
    }

    if (!phoneIsValidUS(clienteForm.telefono)) {
      return setMensaje("El teléfono debe tener exactamente 10 dígitos. Formato: ___-___-____.");
    }

    const existente = clienteExiste(clienteForm);

    if (existente) {
      setOrdenForm((actual) => ({ ...actual, clienteId: String(existente.id) }));
      setBusquedaClienteOrden(`${existente.nombre} - ${existente.telefono || ""}`);
      setCitaForm((actual) => ({ ...actual, clienteId: String(existente.id) }));
      setClienteAccion(existente);
      setMensaje("Este cliente ya existe. Elige si deseas crear una orden, programar una cita o solo guardarlo.");
      return;
    }

    const nuevo = {
      id: Date.now(),
      ...clienteForm,
      telefono: formatPhoneUS(clienteForm.telefono),
      fechaCreacion: new Date().toISOString(),
    };

    setClientes((actual) => [...actual, nuevo]);
    setOrdenForm((actual) => ({ ...actual, clienteId: String(nuevo.id) }));
    setBusquedaClienteOrden(`${nuevo.nombre} - ${nuevo.telefono || ""}`);
    setCitaForm((actual) => ({ ...actual, clienteId: String(nuevo.id) }));
    setClienteForm({ nombre: "", telefono: "", email: "", direccion: "", apartamento: "", calle: "", codigoAcceso: "", edificio: "" });
    setClienteAccion(nuevo);
    setMensaje("Cliente creado correctamente. Elige qué deseas hacer ahora.");
  };

  const crearOrden = () => {
    const tecnicoSeleccionado = obtenerTecnico(ordenForm.tecnicoId);

    if (!ordenForm.clienteId || !ordenForm.tecnicoId || !ordenForm.problema) {
      return setMensaje("Selecciona cliente, técnico y problema reportado.");
    }

    if (!tecnicoSeleccionado || tecnicoSeleccionado.activo === false) {
      return setMensaje("No puedes asignar una orden a un técnico dado de baja.");
    }

    const fecha = new Date();
    const orden = {
      id: Date.now(),
      clienteId: String(ordenForm.clienteId),
      tecnicoId: String(ordenForm.tecnicoId),
      problema: ordenForm.problema,
      prioridad: ordenForm.prioridad,
      estado: "Asignada",
      fecha: fecha.toLocaleDateString(),
      fechaCreacion: fecha.toISOString(),
      fechaProgramada: ordenForm.fechaProgramada || "",
      horaProgramada: ordenForm.horaProgramada || "",
      fechaCompletada: "",
      horaInicio: "",
      horaCierre: "",
      duracionHoras: "",
      materialesUsados: [],
      costoMateriales: 0,
      fotos: { antes: "", durante: "", despues: "" },
      notasTecnico: "",
      inventarioDescontado: false,
      cancelReason: "",
    };

    setOrdenes([...ordenes, orden]);
    setOrdenForm({ clienteId: String(ordenForm.clienteId), problema: "", tecnicoId: "", prioridad: "Media", fechaProgramada: "", horaProgramada: "" });
    setMensaje("Orden asignada correctamente. Ahora aparecerá en el panel del técnico seleccionado.");
  };

  const marcarEnRuta = (id) => setOrdenes(ordenes.map((o) => o.id === id ? { ...o, estado: "En ruta" } : o));
  const iniciarTrabajo = (id) => setOrdenes(ordenes.map((o) => o.id === id ? { ...o, estado: "En proceso", horaInicio: o.horaInicio || new Date().toISOString() } : o));
  const cancelarOrden = (id) => {
    const reason = prompt("Motivo de cancelación:");
    if (!reason) return;
    setOrdenes(ordenes.map((o) => o.id === id ? { ...o, estado: "Cancelada", cancelReason: reason, fechaCompletada: new Date().toISOString() } : o));
  };
  const calcularHoras = (inicio, cierre) => (!inicio || !cierre ? "" : Math.max(0, (new Date(cierre) - new Date(inicio)) / 3600000).toFixed(2));
  const agregarMaterialAOrden = (ordenId) => setOrdenes(ordenes.map((o) => o.id === ordenId ? { ...o, materialesUsados: [...(o.materialesUsados || []), { id: Date.now(), inventarioId: "", cantidad: "" }] } : o));
  const actualizarMaterialOrden = (ordenId, materialId, campo, valor) => setOrdenes(ordenes.map((o) => o.id === ordenId ? { ...o, materialesUsados: (o.materialesUsados || []).map((m) => m.id === materialId ? { ...m, [campo]: valor } : m) } : o));
  const eliminarMaterialOrden = (ordenId, materialId) => setOrdenes(ordenes.map((o) => o.id === ordenId ? { ...o, materialesUsados: (o.materialesUsados || []).filter((m) => m.id !== materialId) } : o));
  const calcularCostoOrden = (orden) => (orden.materialesUsados || []).reduce((total, m) => total + Number(m.cantidad || 0) * Number(obtenerMaterial(m.inventarioId)?.costo || 0), 0);

  const descontarInventario = (orden) => {
    const usados = (orden.materialesUsados || []).filter((m) => m.inventarioId && Number(m.cantidad) > 0);
    if (usados.length === 0) return window.confirm("Esta orden no tiene materiales agregados. ¿Deseas completarla sin descontar inventario?");
    const sinStock = usados.find((m) => !obtenerMaterial(m.inventarioId) || Number(m.cantidad) > Number(obtenerMaterial(m.inventarioId).cantidad));
    if (sinStock) { alert("No hay suficiente inventario para uno de los materiales."); return false; }
    setInventario((actual) => actual.map((item) => {
      const usado = usados.filter((m) => String(m.inventarioId) === String(item.id)).reduce((sum, m) => sum + Number(m.cantidad), 0);
      return usado ? { ...item, cantidad: Number(item.cantidad) - usado } : item;
    }));
    return true;
  };

  const completarOrden = (id) => {
    const orden = ordenes.find((o) => o.id === id);
    if (!orden) return;
    if (!orden.inventarioDescontado && !descontarInventario(orden)) return;
    const cierre = new Date().toISOString();
    const inicio = orden.horaInicio || orden.fechaCreacion || cierre;
    setOrdenes(ordenes.map((o) => o.id === id ? { ...o, estado: "Completado", horaInicio: inicio, horaCierre: cierre, duracionHoras: calcularHoras(inicio, cierre), fechaCompletada: cierre, costoMateriales: calcularCostoOrden(o), inventarioDescontado: true } : o));
  };

  const subirFoto = (id, tipo, archivo) => {
    if (!archivo) return;
    const reader = new FileReader();
    reader.onloadend = () => setOrdenes((actual) => actual.map((o) => o.id === id ? { ...o, fotos: { ...o.fotos, [tipo]: reader.result } } : o));
    reader.readAsDataURL(archivo);
  };
  const guardarNotaTecnico = (id, nota) => setOrdenes(ordenes.map((o) => o.id === id ? { ...o, notasTecnico: nota } : o));

  const materialesTexto = (orden) => (orden.materialesUsados || []).filter((m) => m.inventarioId && Number(m.cantidad) > 0).map((m) => `${obtenerMaterial(m.inventarioId)?.nombre || "Material"} (${m.cantidad} ${obtenerMaterial(m.inventarioId)?.unidad || ""})`).join("; ");

  const crearTextoOrden = (orden) => {
    const c = obtenerCliente(orden.clienteId);
    const tec = obtenerTecnico(orden.tecnicoId);
    return `HVAC Manager\n\nCliente: ${c?.nombre || ""}\nTeléfono: ${formatPhoneDisplay(c?.telefono || "")}\nDirección: ${c?.direccion || ""}\nDate: ${formatReportDate(orden.fechaCompletada || orden.fechaCreacion || orden.fecha)}\nApt: ${c?.apartamento || ""}   Edificio: ${c?.edificio || ""}   Calle: ${c?.calle || ""}   Access Code: ${c?.codigoAcceso || ""}\nTécnico: ${tec?.nombre || ""}\n\nService Request:\n${orden.problema || ""}\n\nService Details:\n${orden.notasTecnico || ""}\n\nMateriales:\n${materialesTexto(orden) || "Sin materiales"}`;
  };

  const crearReporteHTML = (orden) => {
    const c = obtenerCliente(orden.clienteId);
    const tec = obtenerTecnico(orden.tecnicoId);
    const fotos = [
      ["Antes", orden.fotos?.antes],
      ["Durante", orden.fotos?.durante],
      ["Después", orden.fotos?.despues],
    ].filter(([, src]) => src);
    const fotoHTML = fotos.length
      ? fotos.map(([label, src]) => `<figure><img src="${src}" alt="${escapeHtml(label)}" /><figcaption>${escapeHtml(label)}</figcaption></figure>`).join("")
      : `<div class="empty">No se agregaron imágenes a esta orden.</div>`;
    return `<!doctype html><html><head><meta charset="utf-8"/><title>HVAC Manager - Service Report</title><style>
      *{box-sizing:border-box} body{margin:0;background:#e5e7eb;color:#0f172a;font-family:Inter,Arial,sans-serif}.page{max-width:920px;margin:24px auto;background:white;border-radius:28px;overflow:hidden;box-shadow:0 24px 70px rgba(15,23,42,.18)}.hero{background:linear-gradient(135deg,#020617,#1e3a8a 62%,#0e7490);color:white;padding:34px}.brand{font-size:30px;font-weight:900;letter-spacing:.04em}.sub{opacity:.78;margin-top:6px}.content{padding:28px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.field{border:1px solid #e2e8f0;border-radius:18px;padding:14px;background:#f8fafc}.field b{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin-bottom:5px}.wide{grid-column:1/-1}.mini{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:16px 0}.section{margin-top:22px}.section h2{font-size:15px;text-transform:uppercase;letter-spacing:.1em;color:#1e3a8a;margin:0 0 10px}.box{border:1px solid #e2e8f0;border-radius:20px;padding:18px;background:white;white-space:pre-wrap;line-height:1.55}.media{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.media figure{margin:0;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;background:#f8fafc}.media img{width:100%;height:190px;object-fit:cover;display:block}.media figcaption{padding:10px 12px;font-weight:800;color:#334155}.empty{border:1px dashed #94a3b8;border-radius:18px;padding:18px;color:#64748b;background:#f8fafc}.footer{margin-top:26px;padding-top:16px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px}@media print{body{background:white}.page{margin:0;box-shadow:none;border-radius:0}.no-print{display:none}.media img{height:160px}}
    </style></head><body><main class="page"><header class="hero"><div class="brand">HVAC Manager</div><div class="sub">Modern Service Report</div></header><section class="content"><div class="grid"><div class="field"><b>Cliente</b>${escapeHtml(c?.nombre || "")}</div><div class="field"><b>Teléfono</b>${escapeHtml(formatPhoneDisplay(c?.telefono || ""))}</div><div class="field wide"><b>Dirección</b>${escapeHtml(c?.direccion || "")}</div><div class="field"><b>Date</b>${escapeHtml(formatReportDate(orden.fechaCompletada || orden.fechaCreacion || orden.fecha))}</div><div class="field"><b>Técnico</b>${escapeHtml(tec?.nombre || "")}</div></div><div class="mini"><div class="field"><b>Apt</b>${escapeHtml(c?.apartamento || "")}</div><div class="field"><b>Edificio</b>${escapeHtml(c?.edificio || "")}</div><div class="field"><b>Calle</b>${escapeHtml(c?.calle || "")}</div><div class="field"><b>Access Code</b>${escapeHtml(c?.codigoAcceso || "")}</div></div><div class="section"><h2>Service Request</h2><div class="box">${escapeHtml(orden.problema || "")}</div></div><div class="section"><h2>Media</h2><div class="media">${fotoHTML}</div></div><div class="section"><h2>Service Details</h2><div class="box">${escapeHtml(orden.notasTecnico || "")}</div></div><div class="section"><h2>Materiales</h2><div class="box">${escapeHtml(materialesTexto(orden) || "Sin materiales")}</div></div><div class="footer">Generated by HVAC Manager</div></section></main><script>window.onload=()=>setTimeout(()=>window.print(),250);</script></body></html>`;
  };

  const compartirOrden = async (orden, metodo) => {
    const texto = crearTextoOrden(orden);
    const encoded = encodeURIComponent(texto);
    if (metodo === "mensaje" && navigator.share) return navigator.share({ title: "HVAC Manager - Service Report", text: texto });
    if (metodo === "email") return window.open(`mailto:?subject=HVAC Manager - Service Report&body=${encoded}`);
    if (metodo === "whatsapp") return window.open(`https://wa.me/?text=${encoded}`, "_blank");
    if (metodo === "messenger") return window.open(`https://www.messenger.com/t/?text=${encoded}`, "_blank");
    if (metodo === "imprimir") {
      const w = window.open("", "_blank");
      w.document.write(crearReporteHTML(orden));
      w.document.close();
    }
  };

  const agregarInventario = () => {
    if (!inventarioForm.nombre || !inventarioForm.cantidad) return;
    setInventario([...inventario, { id: Date.now(), ...inventarioForm, tipo: inventarioForm.tipo || "Material consumible", cantidad: Number(inventarioForm.cantidad), costo: Number(inventarioForm.costo || 0), stockMinimo: Number(inventarioForm.stockMinimo || 0) }]);
    setInventarioForm({ nombre: "", categoria: "Unidades de aire acondicionado", tipo: "Material consumible", cantidad: "", unidad: "pieza", costo: "", stockMinimo: "1" });
  };
  const actualizarInventario = (id, campo, valor) => setInventario(inventario.map((i) => i.id === id ? { ...i, [campo]: ["cantidad", "costo", "stockMinimo"].includes(campo) ? Number(valor) : valor } : i));

  const agregarHerramienta = () => {
    if (!herramientaForm.nombre || !herramientaForm.tecnicoId) return;
    setHerramientas([...herramientas, { id: Date.now(), ...herramientaForm, cantidad: Number(herramientaForm.cantidad || 1) }]);
    setHerramientaForm({ nombre: "", tecnicoId: "", cantidad: "", estado: "Disponible", notas: "" });
  };
  const actualizarHerramienta = (id, campo, valor) => setHerramientas(herramientas.map((h) => h.id === id ? { ...h, [campo]: campo === "cantidad" ? Number(valor) : valor } : h));

  const guardarTecnico = () => {
    const nombre = prompt("Nombre del técnico:");
    if (!nombre) return;
    const usuario = limpiarTexto(nombre).replace(/\s+/g, "-");
    setTecnicos([...tecnicos, { id: `${usuario}-${Date.now()}`, nombre, usuario, password: "1234", activo: true, telefono: "", direccion: "", fechaIngreso: "", fechaSalida: "" }]);
  };
  const actualizarTecnico = (id, campo, valor) => setTecnicos(tecnicos.map((tec) => tec.id === id ? { ...tec, [campo]: valor } : tec));
  const darDeBajaTecnico = (id) => { const fecha = prompt("Fecha de salida:", new Date().toISOString().slice(0, 10)); if (fecha) setTecnicos(tecnicos.map((tec) => tec.id === id ? { ...tec, activo: false, fechaSalida: fecha } : tec)); };

  const crearCita = () => {
    if (!citaForm.clienteId || !citaForm.tecnicoId || !citaForm.fecha || !citaForm.hora) return setMensaje("Completa cliente, técnico, fecha y hora de la cita.");
    setCitas([...citas, { id: Date.now(), ...citaForm, estado: "Programada", fechaCreacion: new Date().toISOString() }]);
    setCitaForm({ clienteId: "", tecnicoId: "", fecha: "", hora: "", motivo: "", notas: "" });
  };

  const exportarCSV = (filas, nombre) => {
    if (!filas.length) return alert("No hay datos para exportar.");
    const headers = Object.keys(filas[0]);
    const csv = [headers.join(","), ...filas.map((fila) => headers.map((h) => `"${String(fila[h] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = nombre; a.click(); URL.revokeObjectURL(url);
  };

  const ordenesActivasAdmin = ordenes.map(normalizeOrden).filter((o) => !["Completado", "Cancelada"].includes(o.estado));
  const historialAdmin = ordenes.map(normalizeOrden).filter((o) => ["Completado", "Cancelada"].includes(o.estado));
  const ordenesActivasTecnico = session?.role === "tecnico" ? ordenes.map(normalizeOrden).filter((o) => o.tecnicoId === session.id && !["Completado", "Cancelada"].includes(o.estado)) : [];
  const historialTecnico = session?.role === "tecnico" ? ordenes.map(normalizeOrden).filter((o) => o.tecnicoId === session.id && ["Completado", "Cancelada"].includes(o.estado)) : [];

  const colorEstado = (estado) => estado === "Completado" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : estado === "Cancelada" ? "bg-rose-100 text-rose-700 border-rose-200" : estado === "En proceso" ? "bg-sky-100 text-sky-700 border-sky-200" : estado === "En ruta" ? "bg-cyan-100 text-cyan-700 border-cyan-200" : estado === "Asignada" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-slate-100 text-slate-700 border-slate-200";
  const colorPrioridad = (p) => PRIORIDADES.find((x) => x.value === p)?.cls || "bg-slate-100 text-slate-700 border-slate-200";

  const ordenProps = { inventario, obtenerMaterial, obtenerTecnico, colorEstado, colorPrioridad, marcarEnRuta, iniciarTrabajo, completarOrden, cancelarOrden, subirFoto, guardarNotaTecnico, urlGoogleMaps, urlAppleMaps, urlTelefono, agregarMaterialAOrden, actualizarMaterialOrden, eliminarMaterialOrden, calcularCostoOrden, materialesTexto, compartirOrden, t };

  if (!session) return <LoginScreen t={t} lang={lang} setLang={setLang} loginForm={loginForm} setLoginForm={setLoginForm} iniciarSesion={iniciarSesion} mensaje={mensaje} />;

  const adminNav = [
    ["clientes", t("customers"), Users], ["tecnicos", t("technicians"), UserCog], ["citas", t("appointments"), CalendarDays], ["ordenes", t("orders"), ClipboardList], ["historial", t("completedHistory"), History], ["inventario", t("inventory"), Package], ["herramientas", t("tools"), Wrench], ["reportesClientes", t("reportsCustomers"), BarChart3], ["reportesInventario", t("reportsInventory"), FileSpreadsheet],
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_#0f172a55,_transparent_30%),radial-gradient(circle_at_top_right,_#0284c733,_transparent_28%),radial-gradient(circle_at_bottom_left,_#1e40af2e,_transparent_30%),linear-gradient(135deg,_#e2e8f0_0%,_#cbd5e1_48%,_#94a3b8_100%)] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-900/10 bg-slate-950/90 text-white backdrop-blur-xl shadow-2xl shadow-slate-900/30">
        <div className="w-full px-3 2xl:px-8 py-2.5 2xl:py-4 flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-2.5 2xl:gap-4">
          <div><p className="text-[10px] 2xl:text-xs uppercase tracking-[0.24em] 2xl:tracking-[0.3em] text-cyan-300 font-black">{t("app")}</p><h1 className="text-lg 2xl:text-3xl font-black tracking-tight text-white">{session.role === "admin" ? t("adminPanel") : `${t("techPanel")}: ${session.nombre}`}</h1></div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 2xl:gap-3 xl:ml-auto">
            <button onClick={() => setLang(lang === "es" ? "en" : "es")} className="inline-flex items-center justify-center gap-1.5 2xl:gap-2 rounded-xl 2xl:rounded-2xl bg-white px-3 2xl:px-5 py-2 2xl:py-3 text-xs 2xl:text-base text-slate-700 font-black border shadow-sm"><Languages {...iconProps} />{t("translate")}</button>
            {session.role === "admin" && <button onClick={() => setAdminPage("configuracion")} className="inline-flex items-center justify-center gap-1.5 2xl:gap-2 rounded-xl 2xl:rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-400 px-3 2xl:px-5 py-2 2xl:py-3 text-xs 2xl:text-base text-white font-black shadow-lg shadow-cyan-900/25 transition hover:-translate-y-0.5"><ShieldCheck {...iconProps} />{t("changePassword")}</button>}
            <TopInfo now={now} />
            <button onClick={cerrarSesion} className="inline-flex items-center justify-center gap-1.5 2xl:gap-2 rounded-xl 2xl:rounded-2xl bg-gradient-to-r from-slate-900 to-black px-3 2xl:px-5 py-2 2xl:py-3 text-xs 2xl:text-base text-white font-black shadow-lg shadow-black/30 transition hover:-translate-y-0.5"><LogOut {...iconProps} />{t("logout")}</button>
          </div>
        </div>
      </header>

      <main className="w-full min-w-0 px-2.5 2xl:px-6 py-3 2xl:py-5">

        {clienteAccion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl shadow-slate-950/40">
              <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 p-5 text-white">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-200">Cliente guardado</p>
                <h3 className="mt-2 text-2xl font-black">{clienteAccion.nombre}</h3>
                <p className="mt-1 text-sm text-slate-200">¿Qué deseas hacer ahora con este cliente?</p>
              </div>

              <div className="grid gap-3 p-5">
                <button onClick={() => abrirCrearOrdenConCliente(clienteAccion)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 font-black text-white shadow-lg">
                  <ClipboardList size={18} />
                  Crear orden
                </button>

                <button onClick={() => abrirProgramarCitaConCliente(clienteAccion)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 font-black text-white shadow-lg">
                  <CalendarDays size={18} />
                  Programar cita
                </button>

                <button onClick={() => { setClienteAccion(null); setMensaje("Cliente guardado correctamente."); }} className="inline-flex items-center justify-center gap-2 rounded-2xl border bg-white px-4 py-3 font-black text-slate-700">
                  Solo guardar
                </button>
              </div>
            </div>
          </div>
        )}
        {mensaje && <div className="mb-3 2xl:mb-5 rounded-3xl border border-blue-200 bg-blue-50/90 px-5 py-4 text-blue-800 font-semibold shadow-sm">{mensaje}</div>}

        {session.role === "admin" && (
          <>
            <StatsBar clientes={clientes} ordenes={ordenes} inventario={inventario} herramientas={herramientas} />
            <nav className="sticky top-[66px] 2xl:top-[92px] z-10 mb-3 2xl:mb-3 2xl:mb-5 flex gap-1 overflow-x-auto 2xl:flex-wrap rounded-xl 2xl:rounded-[1.75rem] border border-slate-700/30 bg-slate-950/85 p-1.5 2xl:p-3 shadow-lg 2xl:shadow-2xl shadow-slate-900/25 backdrop-blur [-webkit-overflow-scrolling:touch]">
              {adminNav.map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setAdminPage(id)}
                  className={`
                    inline-flex
                    shrink-0
                    items-center
                    gap-1
                    2xl:gap-2 2xl:gap-3
                    rounded-lg
                    2xl:rounded-2xl
                    px-2
                    2xl:px-6
                    py-1.5
                    2xl:py-4
                    text-[9px]
                    2xl:text-lg
                    font-black
                    transition
                    ${
                      adminPage === id
                        ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-lg shadow-cyan-900/25"
                        : "bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border border-slate-700"
                    }
                  `}
                >
                  <Icon size={9} strokeWidth={2.2} className="2xl:hidden" />
                  <Icon size={20} strokeWidth={2.2} className="hidden 2xl:block" />
                  {label}
                </button>
              ))}</nav>

            {adminPage === "clientes" && <ClientesPage t={t} clientes={clientes} setClientes={setClientes} ordenes={ordenes} citas={citas} clienteForm={clienteForm} setClienteForm={setClienteForm} agregarCliente={agregarCliente} abrirCrearOrdenConCliente={abrirCrearOrdenConCliente} abrirProgramarCitaConCliente={abrirProgramarCitaConCliente} urlGoogleMaps={urlGoogleMaps} urlAppleMaps={urlAppleMaps} urlTelefono={urlTelefono} />}
            {adminPage === "tecnicos" && <TecnicosPage t={t} tecnicos={tecnicos} actualizarTecnico={actualizarTecnico} guardarTecnico={guardarTecnico} darDeBajaTecnico={darDeBajaTecnico} setTecnicos={setTecnicos} />}
            {adminPage === "citas" && <CitasPage t={t} citas={citas} setCitas={setCitas} citaForm={citaForm} setCitaForm={setCitaForm} crearCita={crearCita} clientes={clientes} tecnicos={tecnicosActivos} obtenerCliente={obtenerCliente} obtenerTecnico={obtenerTecnico} />}
            {adminPage === "ordenes" && <OrdenesAdminPage t={t} ordenes={ordenesActivasAdmin} obtenerCliente={obtenerCliente} ordenProps={ordenProps} crearOrden={crearOrden} ordenForm={ordenForm} setOrdenForm={setOrdenForm} busquedaClienteOrden={busquedaClienteOrden} setBusquedaClienteOrden={setBusquedaClienteOrden} clientesFiltradosOrden={clientesFiltradosOrden} tecnicos={tecnicosActivos} />}
            {adminPage === "historial" && <HistorialPage t={t} ordenes={historialAdmin} obtenerCliente={obtenerCliente} ordenProps={ordenProps} />}
            {adminPage === "inventario" && <InventarioGeneralPage t={t} inventario={inventario} inventarioForm={inventarioForm} setInventarioForm={setInventarioForm} agregarInventario={agregarInventario} actualizarInventario={actualizarInventario} setInventario={setInventario} />}
            {adminPage === "herramientas" && <HerramientasPage t={t} herramientas={herramientas} herramientaForm={herramientaForm} setHerramientaForm={setHerramientaForm} agregarHerramienta={agregarHerramienta} actualizarHerramienta={actualizarHerramienta} setHerramientas={setHerramientas} tecnicos={tecnicosActivos} obtenerTecnico={obtenerTecnico} tecnicoHerramientasSeleccionado={tecnicoHerramientasSeleccionado} setTecnicoHerramientasSeleccionado={setTecnicoHerramientasSeleccionado} />}
            {adminPage === "reportesClientes" && <ReportesClientesPage t={t} clientes={clientes} ordenes={ordenes} obtenerCliente={obtenerCliente} exportarCSV={exportarCSV} />}
            {adminPage === "reportesInventario" && <ReportesInventarioPage t={t} inventario={inventario} herramientas={herramientas} obtenerTecnico={obtenerTecnico} exportarCSV={exportarCSV} />}
            {adminPage === "configuracion" && <ConfiguracionPage t={t} adminPassword={adminPassword} setAdminPassword={setAdminPassword} setMensaje={setMensaje} />}
          </>
        )}

        {session.role === "tecnico" && (
          <>
            <StatsBar clientes={clientes} ordenes={ordenesActivasTecnico} inventario={inventario} herramientas={herramientas.filter((h) => h.tecnicoId === session.id)} />
            <section className="w-full min-w-0 rounded-2xl 2xl:rounded-[2rem] border border-white/70 bg-white/90 p-3 2xl:p-6 shadow-lg 2xl:shadow-xl shadow-blue-100/70 backdrop-blur mb-6"><h2 className="flex items-center gap-2 text-xl 2xl:text-2xl font-black mb-1"><ClipboardList {...iconProps} />{t("activeOrders")}</h2><OrdenesGrid ordenes={ordenesActivasTecnico} obtenerCliente={obtenerCliente} ordenProps={ordenProps} /></section>
            <HistorialPage t={t} ordenes={historialTecnico} obtenerCliente={obtenerCliente} ordenProps={ordenProps} />
          </>
        )}
      </main>
    </div>
  );
}

function TopInfo({ now }) {
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

function LoginScreen({ t, lang, setLang, loginForm, setLoginForm, iniciarSesion, mensaje }) {
  return <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_#1e3a8a22,_transparent_34%),radial-gradient(circle_at_bottom_right,_#0284c724,_transparent_28%),linear-gradient(135deg,_#f8fafc,_#e5e7eb,_#cbd5e1)] flex items-center justify-center p-4"><section className="relative w-full max-w-md rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-2xl shadow-slate-300/60 backdrop-blur-xl"><div className="mb-8 text-center"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl shadow-cyan-200"><span className="text-xl 2xl:text-2xl font-black">HV</span></div><p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-600">HVAC Manager</p><h1 className="mt-2 text-3xl font-black text-slate-950">{t("login")}</h1></div><div className="space-y-4"><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" {...iconProps} /><input value={loginForm.usuario} onChange={(e) => setLoginForm({ ...loginForm, usuario: e.target.value })} placeholder={t("user")} className="w-full rounded-2xl border border-slate-200 bg-white/90 px-12 py-4 outline-none shadow-sm transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" /></div><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" {...iconProps} /><input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} placeholder={t("password")} className="w-full rounded-2xl border border-slate-200 bg-white/90 px-12 py-4 outline-none shadow-sm transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" onKeyDown={(e) => e.key === "Enter" && iniciarSesion()} /></div><button onClick={iniciarSesion} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4 font-black text-white shadow-xl shadow-cyan-200 transition hover:-translate-y-0.5"><LogIn {...iconProps} />{t("login")}</button><button onClick={() => setLang(lang === "es" ? "en" : "es")} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-black text-slate-700 border"><Languages {...iconProps} />{t("translate")}</button></div>{mensaje && <p className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-800">{mensaje}</p>}</section></div>;
}

function StatsBar({ clientes, ordenes, inventario, herramientas }) {
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

function SoftStat({ titulo, valor, icon: Icon, accent = "from-slate-950 to-blue-900", glow = "shadow-slate-900/25" }) {
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
function PriorityChips({ value, onChange }) { return <div className="grid grid-cols-2 2xl:grid-cols-4 gap-2">{PRIORIDADES.map((p) => <button key={p.value} type="button" onClick={() => onChange(p.value)} className={`rounded-2xl border px-3 py-3 text-left transition ${value === p.value ? `${p.cls} ring-4 ring-slate-100 shadow-md` : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}><div className="flex items-center gap-2 font-black"><AlertTriangle {...iconProps} />{p.value}</div><div className="text-xs opacity-75">{p.help}</div></button>)}</div>; }
function AddressInput({ value, onChange }) {
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

function ClientesPage({ t, clientes, setClientes, ordenes = [], citas = [], clienteForm, setClienteForm, agregarCliente, abrirCrearOrdenConCliente, abrirProgramarCitaConCliente, urlAppleMaps, urlTelefono }) {
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [clienteEdit, setClienteEdit] = useState(null);
  const [ordenVista, setOrdenVista] = useState("recientes");

  const ordenesCliente = (id) => ordenes.filter((o) => String(o.clienteId) === String(id));
  const citasCliente = (id) => citas.filter((c) => String(c.clienteId) === String(id));

  const getUltimaFechaCliente = (cliente) => {
    const movimientos = [
      ...(ordenesCliente(cliente.id) || []).map((o) => o.fechaCompletada || o.fechaCreacion || o.fecha || ""),
      ...(citasCliente(cliente.id) || []).map((c) => c.fecha || c.fechaCreacion || ""),
      cliente.fechaCreacion || "",
    ].filter(Boolean);

    return movimientos.sort().at(-1) || "";
  };

  const getTecnicoPrincipalCliente = (cliente) => {
    const ultimaOrden = [...ordenesCliente(cliente.id)]
      .sort((a, b) => String(b.fechaCreacion || b.fecha || "").localeCompare(String(a.fechaCreacion || a.fecha || "")))[0];

    return ultimaOrden?.tecnicoId || "";
  };

  const visibles = useMemo(() => {
    const q = String(busqueda || "").toLowerCase().trim();

    let lista = clientes.filter((c) => {
      if (!q) return true;
      return [c.nombre, c.telefono, c.email, c.direccion, c.apartamento, c.edificio, c.calle, c.codigoAcceso]
        .some((v) => String(v || "").toLowerCase().includes(q));
    });

    if (ordenVista === "nombre") {
      lista = [...lista].sort((a, b) => String(a.nombre || "").localeCompare(String(b.nombre || "")));
    } else if (ordenVista === "fecha") {
      lista = [...lista].sort((a, b) => String(getUltimaFechaCliente(b)).localeCompare(String(getUltimaFechaCliente(a))));
    } else if (ordenVista === "tecnico") {
      lista = [...lista].sort((a, b) => String(getTecnicoPrincipalCliente(a)).localeCompare(String(getTecnicoPrincipalCliente(b))));
    } else {
      lista = [...lista].sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
    }

    return lista;
  }, [clientes, ordenes, citas, busqueda, ordenVista]);

  const iniciarEdicion = (cliente) => {
    setEditandoId(cliente.id);
    setClienteEdit({ ...cliente });
  };

  const guardarEdicion = () => {
    if (!clienteEdit?.nombre || !clienteEdit?.telefono || !clienteEdit?.direccion) {
      return alert("Nombre, teléfono y dirección son obligatorios.");
    }

    setClientes(clientes.map((c) => String(c.id) === String(clienteEdit.id) ? { ...clienteEdit, telefono: formatPhoneUS(clienteEdit.telefono) } : c));
    setEditandoId(null);
    setClienteEdit(null);
  };

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-2xl 2xl:rounded-[2rem] border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-4 text-white">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
                Gestión de clientes
              </p>
              <h2 className="mt-1 flex items-center gap-2 text-xl 2xl:text-2xl font-black">
                <Users size={22} />
                Clientes
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur">
                <p className="text-2xl font-black">{clientes.length}</p>
                <p className="text-[9px] font-black uppercase tracking-wide text-cyan-200">Clientes</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur">
                <p className="text-2xl font-black">{clientes.filter((c) => ordenesCliente(c.id).some((o) => !["Completado", "Cancelada"].includes(o.estado))).length}</p>
                <p className="text-[9px] font-black uppercase tracking-wide text-cyan-200">Activos</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur">
                <p className="text-2xl font-black">{clientes.filter((c) => citasCliente(c.id).length > 0).length}</p>
                <p className="text-[9px] font-black uppercase tracking-wide text-cyan-200">Citas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-[1px]">
          <div className="relative rounded-none bg-gradient-to-br from-white via-blue-50/60 to-cyan-50 p-3 2xl:p-5">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-200/50 blur-3xl" />
            <div className="relative">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-700">Nuevo registro</p>
                  <h3 className="flex items-center gap-2 text-lg 2xl:text-xl font-black text-slate-950">
                    <Plus {...iconProps} />
                    Agregar cliente
                  </h3>
                </div>
                <span className="rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-[10px] font-black uppercase text-cyan-800">
                  Nombre · Teléfono · Dirección
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 2xl:gap-4 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <label className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">Nombre</label>
                  <input value={clienteForm.nombre} onChange={(e) => setClienteForm({ ...clienteForm, nombre: e.target.value })} placeholder="Nombre del cliente" className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 bg-white/90 p-2 2xl:p-3 text-sm 2xl:text-base outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
                </div>

                <div className="lg:col-span-4">
                  <label className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">Teléfono</label>
                  <input type="tel" inputMode="numeric" maxLength={10} pattern="[0-9]{10}" value={clienteForm.telefono} onChange={(e) => setClienteForm({ ...clienteForm, telefono: formatPhoneUS(e.target.value) })} placeholder="___-___-____" className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 bg-white/90 p-2 2xl:p-3 text-sm 2xl:text-base outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
                </div>

                <div className="lg:col-span-4">
                  <label className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">Email</label>
                  <input type="email" value={clienteForm.email} onChange={(e) => setClienteForm({ ...clienteForm, email: e.target.value })} placeholder="correo@cliente.com" className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 bg-white/90 p-2 2xl:p-3 text-sm 2xl:text-base outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
                </div>

                <div className="lg:col-span-12">
                  <label className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">Dirección completa</label>
                  <AddressInput value={clienteForm.direccion} onChange={(v) => setClienteForm({ ...clienteForm, direccion: v })} />
                </div>

                <div className="lg:col-span-3">
                  <label className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">Apt</label>
                  <input value={clienteForm.apartamento} onChange={(e) => setClienteForm({ ...clienteForm, apartamento: e.target.value })} placeholder="Apt" className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 bg-white/90 p-2 2xl:p-3 text-sm 2xl:text-base outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
                </div>

                <div className="lg:col-span-3">
                  <label className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">Edificio</label>
                  <input value={clienteForm.edificio} onChange={(e) => setClienteForm({ ...clienteForm, edificio: e.target.value })} placeholder="Edificio" className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 bg-white/90 p-2 2xl:p-3 text-sm 2xl:text-base outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
                </div>

                <div className="lg:col-span-3">
                  <label className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">Calle</label>
                  <input value={clienteForm.calle} onChange={(e) => setClienteForm({ ...clienteForm, calle: e.target.value })} placeholder="Calle" className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 bg-white/90 p-2 2xl:p-3 text-sm 2xl:text-base outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
                </div>

                <div className="lg:col-span-3">
                  <label className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">Access Code</label>
                  <input value={clienteForm.codigoAcceso} onChange={(e) => setClienteForm({ ...clienteForm, codigoAcceso: e.target.value })} placeholder="Código" className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 bg-white/90 p-2 2xl:p-3 text-sm 2xl:text-base outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
                </div>
              </div>

              <button onClick={agregarCliente} className="mt-5 inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-gradient-to-r from-slate-950 via-blue-900 to-cyan-700 px-4 2xl:px-5 py-2.5 2xl:py-3 text-sm 2xl:text-base font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5">
                <Plus {...iconProps} />
                Agregar cliente
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl 2xl:rounded-[2rem] border border-slate-200 bg-white/95 p-3 2xl:p-5 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-700">Lista compacta</p>
            <h3 className="flex items-center gap-2 text-lg 2xl:text-xl font-black text-slate-950">
              <Users size={20} />
              Clientes registrados
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-[320px_210px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar cliente..."
                className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <select
              value={ordenVista}
              onChange={(e) => setOrdenVista(e.target.value)}
              className="rounded-xl 2xl:rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            >
              <option value="recientes">Más recientes</option>
              <option value="nombre">Nombre A-Z</option>
              <option value="fecha">Fecha / último movimiento</option>
              <option value="tecnico">Técnico</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="hidden grid-cols-[1.1fr_0.9fr_1.4fr_0.8fr_0.8fr_220px] gap-3 bg-slate-950 px-4 py-3 text-[11px] font-black uppercase tracking-wide text-white 2xl:grid">
            <span>Cliente</span>
            <span>Teléfono</span>
            <span>Dirección</span>
            <span>Estado</span>
            <span>Último</span>
            <span>Acciones</span>
          </div>

          <div className="divide-y divide-slate-200">
            {visibles.length === 0 && (
              <div className="p-6 text-center text-slate-500">No se encontraron clientes.</div>
            )}

            {visibles.map((c) => {
              const isEdit = String(editandoId) === String(c.id);
              const data = isEdit ? clienteEdit : c;
              const hist = ordenesCliente(c.id);
              const citasC = citasCliente(c.id);
              const activas = hist.filter((o) => !["Completado", "Cancelada"].includes(o.estado));
              const ultimaOrden = hist[hist.length - 1];

              return (
                <article key={c.id} className="grid grid-cols-1 gap-2 px-3 py-3 transition hover:bg-blue-50/50 2xl:grid-cols-[1.1fr_0.9fr_1.4fr_0.8fr_0.8fr_220px] 2xl:items-center 2xl:gap-3">
                  <div className="min-w-0">
                    {isEdit ? (
                      <input value={data.nombre || ""} onChange={(e) => setClienteEdit({ ...clienteEdit, nombre: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white p-2 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100" />
                    ) : (
                      <>
                        <p className="truncate text-sm font-black text-slate-950">{c.nombre}</p>
                        <p className="text-[11px] text-slate-500">ID: {c.id}</p>
                      </>
                    )}
                  </div>

                  <div className="min-w-0">
                    {isEdit ? (
                      <input value={data.telefono || ""} onChange={(e) => setClienteEdit({ ...clienteEdit, telefono: formatPhoneUS(e.target.value) })} className="w-full rounded-xl border border-slate-300 bg-white p-2 text-sm outline-none focus:ring-4 focus:ring-blue-100" />
                    ) : (
                      <p className="truncate text-sm font-bold text-slate-700">{formatPhoneDisplay(c.telefono)}</p>
                    )}
                  </div>

                  <div className="min-w-0">
                    {isEdit ? (
                      <input value={data.direccion || ""} onChange={(e) => setClienteEdit({ ...clienteEdit, direccion: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white p-2 text-sm outline-none focus:ring-4 focus:ring-blue-100" />
                    ) : (
                      <>
                        <p className="line-clamp-1 text-sm text-slate-700">{c.direccion}</p>
                        <p className="text-[11px] text-slate-500">{c.email || "Sin email"}</p>
                      </>
                    )}
                  </div>

                  <div>
                    <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-black ${
                      activas.length > 0
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : citasC.length > 0
                          ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}>
                      {activas.length > 0 ? "Orden activa" : citasC.length > 0 ? "Con cita" : "Sin orden"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      {ultimaOrden ? formatReportDate(ultimaOrden.fechaCompletada || ultimaOrden.fechaCreacion || ultimaOrden.fecha) : "Sin historial"}
                    </p>
                    <p className="text-[11px] text-slate-500">Órdenes {hist.length} · Citas {citasC.length}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {isEdit ? (
                      <>
                        <button onClick={guardarEdicion} className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-2.5 py-1.5 text-[11px] font-black text-white">
                          <Save size={12} />
                          Guardar
                        </button>
                        <button onClick={() => { setEditandoId(null); setClienteEdit(null); }} className="rounded-xl border bg-white px-2.5 py-1.5 text-[11px] font-black text-slate-700">
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button onClick={() => iniciarEdicion(c)} className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-2.5 py-1.5 text-[11px] font-black text-white">
                        <Pencil size={12} />
                        Editar
                      </button>
                    )}

                    <button onClick={() => abrirCrearOrdenConCliente(c)} className="inline-flex items-center gap-1 rounded-xl bg-slate-950 px-2.5 py-1.5 text-[11px] font-black text-white">
                      <ClipboardList size={12} />
                      Orden
                    </button>

                    <button onClick={() => abrirProgramarCitaConCliente(c)} className="inline-flex items-center gap-1 rounded-xl bg-cyan-700 px-2.5 py-1.5 text-[11px] font-black text-white">
                      <CalendarDays size={12} />
                      Cita
                    </button>

                    {c.telefono && (
                      <a href={urlTelefono(c.telefono)} className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-2.5 py-1.5 text-[11px] font-black text-white">
                        <Phone size={12} />
                      </a>
                    )}

                    {c.direccion && (
                      <a href={urlAppleMaps(c.direccion)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl border bg-white px-2.5 py-1.5 text-[11px] font-black text-slate-700">
                        <Navigation size={12} />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


function OrdenesAdminPage({ t, ordenes, obtenerCliente, ordenProps, crearOrden, ordenForm, setOrdenForm, busquedaClienteOrden, setBusquedaClienteOrden, clientesFiltradosOrden, tecnicos }) {
  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [periodoOrdenes, setPeriodoOrdenes] = useState("semana");

  const seleccionarCliente = (c) => {
    setOrdenForm({ ...ordenForm, clienteId: String(c.id) });
    setBusquedaClienteOrden(`${c.nombre} - ${c.telefono || ""}`);
    setMostrarClientes(false);
  };

  return (
    <section className="grid w-full min-w-0 grid-cols-1 gap-5 2xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
      <section className="h-fit rounded-2xl 2xl:rounded-[2rem] border border-white/70 bg-white/90 p-3 2xl:p-5 shadow-lg 2xl:shadow-xl shadow-blue-100/70 backdrop-blur">
        <h2 className="flex items-center gap-2 text-xl 2xl:text-2xl font-black">
          <ClipboardList {...iconProps} />
          Crear orden
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Crea la orden, asigna técnico activo y programa fecha/hora. El técnico será quien complete el trabajo.
        </p>

        <div className="mt-3 2xl:mt-5 space-y-3 2xl:space-y-4">
          <div className="relative">
            <label className="flex items-center gap-2 text-sm font-black">
              <Search {...iconProps} />
              {t("searchCustomer")}
            </label>

            <input
              value={busquedaClienteOrden}
              onFocus={() => setMostrarClientes(Boolean(busquedaClienteOrden.trim()))}
              onChange={(e) => {
                setBusquedaClienteOrden(e.target.value);
                setMostrarClientes(Boolean(e.target.value.trim()));
              }}
              placeholder="Nombre, teléfono, email o dirección"
              className="mt-1 w-full rounded-xl 2xl:rounded-2xl border bg-white p-2 2xl:p-3 text-sm 2xl:text-base outline-none focus:ring-4 focus:ring-blue-100"
            />

            {mostrarClientes && clientesFiltradosOrden.length > 0 && (
              <div className="absolute left-0 right-0 z-20 mt-2 max-h-64 overflow-auto rounded-3xl border bg-white shadow-xl">
                {clientesFiltradosOrden.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => seleccionarCliente(c)}
                    className="block w-full px-4 py-3 text-left hover:bg-blue-50"
                  >
                    <p className="font-black">{c.nombre}</p>
                    <p className="text-xs text-slate-500">{c.telefono} · {c.direccion}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-black uppercase tracking-wide text-slate-500">Fecha programada</label>
              <input
                type="date"
                value={ordenForm.fechaProgramada || ""}
                onChange={(e) => setOrdenForm({ ...ordenForm, fechaProgramada: e.target.value })}
                className="mt-1 w-full rounded-xl border bg-white p-2 text-sm outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wide text-slate-500">Hora</label>
              <input
                type="time"
                value={ordenForm.horaProgramada || ""}
                onChange={(e) => setOrdenForm({ ...ordenForm, horaProgramada: e.target.value })}
                className="mt-1 w-full rounded-xl border bg-white p-2 text-sm outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <textarea
            value={ordenForm.problema}
            onChange={(e) => setOrdenForm({ ...ordenForm, problema: e.target.value })}
            placeholder={t("reportedProblem")}
            className="w-full min-h-32 rounded-xl 2xl:rounded-2xl border bg-white p-2 2xl:p-3 text-sm 2xl:text-base outline-none focus:ring-4 focus:ring-blue-100"
          />

          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-black">
              <Wrench {...iconProps} />
              {t("assignTech")}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {tecnicos.map((tec) => (
                <button
                  key={tec.id}
                  disabled={!ordenForm.clienteId || tec.activo === false}
                  onClick={() => setOrdenForm({ ...ordenForm, tecnicoId: tec.id })}
                  className={`rounded-2xl border px-3 py-3 text-left font-bold disabled:opacity-40 ${
                    ordenForm.tecnicoId === tec.id
                      ? "border-blue-300 bg-blue-50 text-blue-700 ring-4 ring-blue-100"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <IconText icon={UserCog}>{tec.nombre}</IconText>
                </button>
              ))}
            </div>
          </div>

          <PriorityChips value={ordenForm.prioridad} onChange={(p) => setOrdenForm({ ...ordenForm, prioridad: p })} />

          <button
            onClick={crearOrden}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl 2xl:rounded-2xl bg-emerald-600 px-3 2xl:px-4 py-2.5 2xl:py-3 text-sm 2xl:text-base font-black text-white"
          >
            <Send {...iconProps} />
            Asignar al técnico
          </button>
        </div>
      </section>

      <section className="min-w-0 rounded-2xl 2xl:rounded-[2rem] border border-white/70 bg-white/90 p-3 2xl:p-6 shadow-lg 2xl:shadow-xl shadow-blue-100/70 backdrop-blur">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-700">Seguimiento administrativo</p>
            <h2 className="flex items-center gap-2 text-xl 2xl:text-2xl font-black">
              <ShieldCheck {...iconProps} />
              Lista de órdenes generadas
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Aquí solo se revisan las órdenes. La ejecución queda en el perfil del técnico asignado.
            </p>
          </div>

          <div className="flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
            {[
              ["semana", "Semana"],
              ["mes", "Mes"],
              ["ano", "Año"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setPeriodoOrdenes(id)}
                className={`rounded-xl px-3 py-2 text-xs font-black transition ${
                  periodoOrdenes === id
                    ? "bg-slate-950 text-white shadow"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <AdminOrdenesRegistro
          ordenes={ordenes}
          obtenerCliente={obtenerCliente}
          ordenProps={ordenProps}
          periodo={periodoOrdenes}
        />
      </section>
    </section>
  );
}


function getOrdenDate(orden) {
  return orden.fechaProgramada || orden.fechaCreacion || orden.fechaCompletada || orden.fecha || "";
}

function getStartOfWeek(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

function getGroupKeyByPeriod(orden, periodo) {
  const raw = getOrdenDate(orden);
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "Sin fecha";

  if (periodo === "semana") {
    const start = getStartOfWeek(d);
    return `Semana de ${formatReportDate(start)}`;
  }

  if (periodo === "mes") {
    return d.toLocaleDateString("es-US", { month: "long", year: "numeric" });
  }

  return String(d.getFullYear());
}

function AdminOrdenesRegistro({ ordenes, obtenerCliente, ordenProps, periodo }) {
  const grupos = useMemo(() => {
    const result = {};

    ordenes.forEach((orden) => {
      const key = getGroupKeyByPeriod(orden, periodo);
      if (!result[key]) result[key] = [];
      result[key].push(orden);
    });

    return Object.entries(result).map(([key, lista]) => ({
      key,
      lista: lista.sort((a, b) => String(getOrdenDate(b)).localeCompare(String(getOrdenDate(a)))),
    }));
  }, [ordenes, periodo]);

  if (ordenes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
        No hay órdenes generadas todavía.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {grupos.map((grupo) => (
        <section key={grupo.key} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-4 py-3 text-white">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">Registro</p>
              <h3 className="text-base font-black capitalize">{grupo.key}</h3>
            </div>

            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black">
              {grupo.lista.length} órdenes
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {grupo.lista.map((orden) => (
              <AdminOrdenRow
                key={orden.id}
                orden={orden}
                cliente={obtenerCliente(orden.clienteId)}
                ordenProps={ordenProps}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function AdminOrdenRow({ orden, cliente, ordenProps }) {
  const tecnico = ordenProps.obtenerTecnico(orden.tecnicoId);
  const direccion = cliente?.direccion || "";
  const telefono = cliente?.telefono || "";

  return (
    <article className="grid grid-cols-1 gap-3 p-3 transition hover:bg-blue-50/50 xl:grid-cols-[minmax(0,1.3fr)_180px_150px_220px] xl:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-base font-black text-slate-950">{cliente?.nombre || "Cliente eliminado"}</p>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${ordenProps.colorEstado(orden.estado)}`}>
            {orden.estado}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${ordenProps.colorPrioridad(orden.prioridad)}`}>
            {orden.prioridad}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{orden.problema}</p>
        <p className="mt-1 text-xs text-slate-500">Orden #{orden.id}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Técnico</p>
        <p className="truncate text-sm font-black text-slate-900">{tecnico?.nombre || "Sin asignar"}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-2">
        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Programado</p>
        <p className="text-xs font-bold text-slate-700">{orden.fechaProgramada || orden.fecha || "Sin fecha"}</p>
        <p className="text-xs text-slate-500">{orden.horaProgramada || "Sin hora"}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {telefono && (
          <a href={ordenProps.urlTelefono(telefono)} className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-2.5 py-1.5 text-[11px] font-bold text-white">
            <Phone size={12} />
            Llamar
          </a>
        )}

        {direccion && (
          <a href={ordenProps.urlAppleMaps(direccion)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl bg-slate-950 px-2.5 py-1.5 text-[11px] font-bold text-white">
            <Navigation size={12} />
            Mapa
          </a>
        )}

        <span className="inline-flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700">
          <Send size={12} />
          Asignada
        </span>
      </div>
    </article>
  );
}


function OrdenesGrid({ ordenes, obtenerCliente, ordenProps }) { return <div className="grid w-full min-w-0 gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">{ordenes.length === 0 && <p className="text-slate-500 py-6">No hay órdenes activas.</p>}{ordenes.map((o) => <OrdenCard key={o.id} orden={o} cliente={obtenerCliente(o.clienteId)} compacta={false} {...ordenProps} />)}</div>; }

function OrdenCard({ orden, cliente, inventario, obtenerMaterial, obtenerTecnico, colorEstado, colorPrioridad, marcarEnRuta, iniciarTrabajo, completarOrden, cancelarOrden, subirFoto, guardarNotaTecnico, urlGoogleMaps, urlAppleMaps, urlTelefono, compacta = false, agregarMaterialAOrden, actualizarMaterialOrden, eliminarMaterialOrden, calcularCostoOrden, materialesTexto, compartirOrden, t }) {
  const direccion = cliente?.direccion || ""; const telefono = cliente?.telefono || ""; const tecnico = obtenerTecnico(orden.tecnicoId);
  if (compacta) return <div className="rounded-2xl 2xl:rounded-3xl border border-slate-200 bg-white p-3 2xl:p-4 shadow-sm"><div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-2 2xl:gap-3"><div><p className="font-black text-slate-950">{cliente?.nombre || "Cliente eliminado"}</p><p className="text-sm text-slate-600">{orden.problema}</p><p className="text-xs 2xl:text-sm text-slate-500">Técnico: {tecnico?.nombre || ""}</p><p className="mt-1 text-sm font-bold text-emerald-700">Completada: {orden.fechaCompletada ? new Date(orden.fechaCompletada).toLocaleDateString() : ""}</p><p className="text-xs text-slate-500">Horas: {orden.duracionHoras || "0.00"} | Materiales: {materialesTexto(orden) || "Sin materiales"}</p></div><ShareButtons orden={orden} compartirOrden={compartirOrden} t={t} /></div></div>;
  return <div className="w-full max-w-full min-w-0 rounded-2xl 2xl:rounded-3xl border border-white/70 bg-white p-2.5 2xl:p-5 shadow-lg shadow-slate-200/70"><div className="mb-2 2xl:mb-3 flex justify-between gap-2 2xl:gap-4"><div><p className="text-base 2xl:text-lg font-black">{cliente?.nombre || "Cliente eliminado"}</p><p className="text-sm 2xl:text-base text-slate-600">{orden.problema}</p><p className="text-xs 2xl:text-sm text-slate-500">Técnico: {tecnico?.nombre || "Sin asignar"}</p><p className="text-xs 2xl:text-sm text-slate-500">{telefono}</p><p className="text-xs 2xl:text-sm text-slate-500">{direccion}</p></div><span className={`h-fit rounded-full border px-2 2xl:px-3 py-0.5 2xl:py-1 text-xs 2xl:text-sm font-bold ${colorEstado(orden.estado)}`}>{orden.estado}</span></div><div className="mb-4 flex flex-wrap gap-2"><a href={urlAppleMaps(direccion)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-2 2xl:px-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm font-bold text-white shadow-md shadow-cyan-100"><Navigation {...iconProps} />Apple Maps</a><a href={urlTelefono(telefono)} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-emerald-600 px-2 2xl:px-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm font-bold text-white"><Phone {...iconProps} />{t("call")}</a></div><div className="mb-3 2xl:mb-4 grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-5 gap-1.5 2xl:gap-2 text-xs 2xl:text-sm"><Info icon={AlertTriangle} titulo="Prioridad" valor={orden.prioridad} extra={colorPrioridad(orden.prioridad)} /><Info icon={Calendar} titulo="Fecha" valor={orden.fecha} /><Info icon={Clock3} titulo="Inicio" valor={orden.horaInicio ? new Date(orden.horaInicio).toLocaleTimeString() : "Sin iniciar"} /><Info icon={Clock4} titulo="Cierre" valor={orden.horaCierre ? new Date(orden.horaCierre).toLocaleTimeString() : "Sin cerrar"} /><Info icon={Timer} titulo="Horas" valor={orden.duracionHoras || "0.00"} /></div><Materiales orden={orden} inventario={inventario} agregarMaterialAOrden={agregarMaterialAOrden} actualizarMaterialOrden={actualizarMaterialOrden} eliminarMaterialOrden={eliminarMaterialOrden} /><div className="mb-4 rounded-2xl 2xl:rounded-3xl border bg-slate-50 p-3 2xl:p-4"><p className="mb-3 flex items-center gap-2 font-black"><Camera {...iconProps} />{t("photos")}</p><div className="grid grid-cols-1 2xl:grid-cols-3 gap-2 2xl:gap-3"><FotoUploader titulo="Antes" imagen={orden.fotos?.antes} onChange={(archivo) => subirFoto(orden.id, "antes", archivo)} /><FotoUploader titulo="Durante" imagen={orden.fotos?.durante} onChange={(archivo) => subirFoto(orden.id, "durante", archivo)} /><FotoUploader titulo="Después" imagen={orden.fotos?.despues} onChange={(archivo) => subirFoto(orden.id, "despues", archivo)} /></div></div><label className="mb-2 flex items-center gap-2 text-sm font-black"><FileText {...iconProps} />{t("notes")}</label><textarea value={orden.notasTecnico || ""} onChange={(e) => guardarNotaTecnico(orden.id, e.target.value)} placeholder="Detalles del trabajo realizado..." className="mb-4 min-h-24 w-full rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base outline-none focus:ring-4 focus:ring-blue-100" /><div className="flex flex-wrap gap-2"><button onClick={() => iniciarTrabajo(orden.id)} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-blue-600 px-2 2xl:px-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm font-bold text-white"><LoaderCircle {...iconProps} />{t("start")}</button><button onClick={() => completarOrden(orden.id)} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-emerald-600 px-2 2xl:px-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm font-bold text-white"><CheckCircle2 {...iconProps} />{t("complete")}</button></div></div>;
}
function Info({ titulo, valor, extra = "bg-white", icon: Icon = FileText }) { return <div className={`rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base ${extra}`}><p className="flex items-center gap-2 text-slate-400"><Icon {...iconProps} />{titulo}</p><p className="truncate font-bold">{valor}</p></div>; }
function Materiales({ orden, inventario, agregarMaterialAOrden, actualizarMaterialOrden, eliminarMaterialOrden }) { return <div className="mb-4 rounded-2xl 2xl:rounded-3xl border bg-slate-50 p-3 2xl:p-4"><div className="mb-3 flex items-center justify-between"><p className="flex items-center gap-2 font-black"><PackageOpen {...iconProps} />Material usado</p><button onClick={() => agregarMaterialAOrden(orden.id)} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-purple-600 px-2 2xl:px-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm font-bold text-white"><Plus {...iconProps} />Agregar material</button></div>{(orden.materialesUsados || []).length === 0 && <p className="text-xs 2xl:text-sm text-slate-500">No se ha agregado material.</p>}<div className="space-y-2">{(orden.materialesUsados || []).map((m) => <div key={m.id} className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_80px_auto] 2xl:grid-cols-[minmax(0,1fr)_120px_auto] gap-2 items-center"><select value={m.inventarioId} onChange={(e) => actualizarMaterialOrden(orden.id, m.id, "inventarioId", e.target.value)} className="rounded-xl 2xl:rounded-2xl border p-1.5 2xl:p-2 text-sm 2xl:text-base"><option value="">Seleccionar material</option>{inventario.map((i) => <option key={i.id} value={i.id}>{i.nombre} ({i.cantidad} {i.unidad})</option>)}</select><input type="number" value={m.cantidad} onChange={(e) => actualizarMaterialOrden(orden.id, m.id, "cantidad", e.target.value)} placeholder="Cantidad" className="rounded-xl 2xl:rounded-2xl border p-1.5 2xl:p-2 text-sm 2xl:text-base" /><button onClick={() => eliminarMaterialOrden(orden.id, m.id)} className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold text-red-600"><Trash2 {...iconProps} />Quitar</button></div>)}</div></div>; }
function FotoUploader({ titulo, imagen, onChange }) { return <div className="rounded-xl 2xl:rounded-2xl border bg-white p-2 2xl:p-3 text-sm 2xl:text-base"><p className="mb-2 text-sm font-bold">{titulo}</p>{imagen ? <img src={imagen} alt={titulo} className="mb-2 h-24 2xl:h-32 w-full rounded-xl border object-cover" /> : <div className="mb-2 flex h-24 2xl:h-32 w-full items-center justify-center rounded-xl border border-dashed bg-slate-50 text-sm text-slate-400">Sin foto</div>}<input type="file" accept="image/*" onChange={(e) => onChange(e.target.files[0])} className="w-full text-xs" /></div>; }
function ShareButtons({ orden, compartirOrden, t }) { return <div className="flex max-w-full flex-wrap gap-1.5 2xl:gap-2 h-fit"><button onClick={() => compartirOrden(orden, "imprimir")} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-gradient-to-r from-slate-950 to-blue-900 px-2 2xl:px-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm font-bold text-white shadow-md shadow-slate-300"><Printer {...iconProps} />Reporte moderno</button><button onClick={() => compartirOrden(orden, "mensaje")} className="inline-flex items-center gap-2 rounded-2xl bg-blue-800 px-3 py-2 text-sm font-bold text-white"><Share2 {...iconProps} />{t("message")}</button><button onClick={() => compartirOrden(orden, "email")} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-slate-100 px-2 2xl:px-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm font-bold"><Mail {...iconProps} />{t("email")}</button><button onClick={() => compartirOrden(orden, "whatsapp")} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-emerald-800 px-2.5 2xl:px-3 py-1.5 2xl:py-2 text-sm font-bold text-white"><MessageCircle {...iconProps} />{t("whatsapp")}</button><button onClick={() => compartirOrden(orden, "messenger")} className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-3 py-2 text-sm font-bold text-white"><Send {...iconProps} />{t("messenger")}</button></div>; }

function HistorialPage({ t, ordenes, obtenerCliente, ordenProps }) { return <section className="rounded-2xl 2xl:rounded-[2rem] border border-white/70 bg-white/90 p-3 2xl:p-5 shadow-lg 2xl:shadow-xl shadow-blue-100/70 backdrop-blur"><h2 className="mb-3 2xl:mb-5 flex items-center gap-2 text-xl 2xl:text-2xl font-black"><History {...iconProps} />{t("completedHistory")}</h2><div className="space-y-3">{ordenes.length === 0 && <p className="text-slate-500">No hay órdenes completadas.</p>}{ordenes.map((o) => <OrdenCard key={o.id} orden={o} cliente={obtenerCliente(o.clienteId)} compacta {...ordenProps} />)}</div></section>; }
function TecnicosPage({ t, tecnicos, actualizarTecnico, guardarTecnico, darDeBajaTecnico, setTecnicos }) {
  const activos = tecnicos.filter((tec) => tec.activo !== false);
  const dadosDeBaja = tecnicos.filter((tec) => tec.activo === false);

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-2xl 2xl:rounded-[2rem] border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-4 text-white">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] 2xl:text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                VISTA NUEVA · Técnicos separados
              </p>
              <h2 className="flex items-center gap-2 text-xl 2xl:text-2xl font-black">
                <UserCog size={22} />
                Técnicos activos y dados de baja
              </h2>
              <p className="mt-1 text-xs 2xl:text-sm text-slate-300">
                Los técnicos activos aparecen en una tarjeta principal. Los dados de baja quedan separados en historial.
              </p>
            </div>

            <button
              onClick={guardarTecnico}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-cyan-900/25"
            >
              <Plus size={16} />
              Agregar técnico
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-blue-900 p-3 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <Users size={20} />
              <p className="text-2xl font-black">{tecnicos.length}</p>
            </div>
            <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-slate-100">Total técnicos</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-600 p-3 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <CheckCircle2 size={20} />
              <p className="text-2xl font-black">{activos.length}</p>
            </div>
            <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-emerald-50">Activos</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-slate-700 to-slate-950 p-3 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <LogOut size={20} />
              <p className="text-2xl font-black">{dadosDeBaja.length}</p>
            </div>
            <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-slate-100">Dados de baja</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,440px)]">
        <section className="rounded-2xl 2xl:rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-white via-emerald-50/40 to-cyan-50 p-3 2xl:p-5 shadow-xl shadow-emerald-100/60">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] 2xl:text-xs font-black uppercase tracking-[0.2em] text-emerald-700">En servicio</p>
              <h3 className="flex items-center gap-2 text-lg 2xl:text-xl font-black text-slate-950">
                <CheckCircle2 size={20} className="text-emerald-700" />
                Técnicos activos
              </h3>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">{activos.length}</span>
          </div>

          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            {activos.length === 0 && (
              <div className="rounded-2xl border border-dashed border-emerald-300 bg-white/70 p-5 text-center text-sm text-slate-500">
                No hay técnicos activos.
              </div>
            )}

            {activos.map((tec) => (
              <TecnicoCardSeparada
                key={tec.id}
                tec={tec}
                activo
                actualizarTecnico={actualizarTecnico}
                darDeBajaTecnico={darDeBajaTecnico}
                setTecnicos={setTecnicos}
                tecnicos={tecnicos}
              />
            ))}
          </div>
        </section>

        <section className="rounded-2xl 2xl:rounded-[2rem] border border-slate-300 bg-gradient-to-br from-white via-slate-50 to-slate-200/70 p-3 2xl:p-5 shadow-xl shadow-slate-300/60">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] 2xl:text-xs font-black uppercase tracking-[0.2em] text-slate-500">Historial</p>
              <h3 className="flex items-center gap-2 text-lg 2xl:text-xl font-black text-slate-950">
                <LogOut size={20} className="text-slate-600" />
                Técnicos dados de baja
              </h3>
            </div>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-black text-slate-700">{dadosDeBaja.length}</span>
          </div>

          <div className="space-y-3">
            {dadosDeBaja.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-center text-sm text-slate-500">
                No hay técnicos dados de baja.
              </div>
            )}

            {dadosDeBaja.map((tec) => (
              <TecnicoCardSeparada
                key={tec.id}
                tec={tec}
                activo={false}
                actualizarTecnico={actualizarTecnico}
                darDeBajaTecnico={darDeBajaTecnico}
                setTecnicos={setTecnicos}
                tecnicos={tecnicos}
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function TecnicoCardSeparada({ tec, activo, actualizarTecnico, darDeBajaTecnico, setTecnicos, tecnicos }) {
  const estadoClase = activo
    ? "border-emerald-200 bg-gradient-to-br from-white via-emerald-50/60 to-cyan-50"
    : "border-slate-300 bg-gradient-to-br from-white via-slate-50 to-slate-200/80 opacity-90";

  return (
    <article className={`relative overflow-hidden rounded-2xl border ${estadoClase} p-3 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl`}>
      <div className={`absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl ${activo ? "bg-emerald-200/70" : "bg-slate-300/80"}`} />

      <div className="relative">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-base font-black text-slate-950">{tec.nombre}</p>
            <p className="text-[11px] font-semibold text-slate-500">@{tec.usuario || tec.nombre}</p>
          </div>

          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-black ${
            activo ? "border-emerald-200 bg-emerald-100 text-emerald-800" : "border-slate-300 bg-slate-200 text-slate-700"
          }`}>
            {activo ? "Activo" : "Baja"}
          </span>
        </div>

        <div className="grid gap-2">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wide text-slate-500">Nombre</label>
            <input
              value={tec.nombre || ""}
              onChange={(e) => actualizarTecnico(tec.id, "nombre", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white/90 p-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-500">Usuario</label>
              <input
                value={tec.usuario || ""}
                onChange={(e) => actualizarTecnico(tec.id, "usuario", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white/90 p-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-500">Password</label>
              <input
                value={tec.password || ""}
                onChange={(e) => actualizarTecnico(tec.id, "password", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white/90 p-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wide text-slate-500">Teléfono</label>
            <input
              value={tec.telefono || ""}
              onChange={(e) => actualizarTecnico(tec.id, "telefono", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white/90 p-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wide text-slate-500">Dirección</label>
            <input
              value={tec.direccion || ""}
              onChange={(e) => actualizarTecnico(tec.id, "direccion", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white/90 p-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-500">Ingreso</label>
              <input
                type="date"
                value={tec.fechaIngreso || ""}
                onChange={(e) => actualizarTecnico(tec.id, "fechaIngreso", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white/90 p-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-500">Salida</label>
              <input
                type="date"
                value={tec.fechaSalida || ""}
                disabled={activo}
                onChange={(e) => actualizarTecnico(tec.id, "fechaSalida", e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white/90 p-2 text-sm outline-none disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {activo ? (
            <button
              onClick={() => darDeBajaTecnico(tec.id)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white"
            >
              <LogOut size={14} />
              Dar de baja
            </button>
          ) : (
            <button
              onClick={() => actualizarTecnico(tec.id, "activo", true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-black text-white"
            >
              <CheckCircle2 size={14} />
              Reactivar
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm(`¿Eliminar permanentemente a ${tec.nombre}?`)) {
                setTecnicos(tecnicos.filter((x) => String(x.id) !== String(tec.id)));
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700"
          >
            <Trash2 size={14} />
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}


function CitasPage({ t, citas, setCitas, citaForm, setCitaForm, crearCita, clientes, tecnicos, obtenerCliente, obtenerTecnico }) { return <section className="rounded-2xl 2xl:rounded-[2rem] border border-white/70 bg-white/90 p-3 2xl:p-5 shadow-lg 2xl:shadow-xl shadow-blue-100/70 backdrop-blur"><h2 className="mb-3 2xl:mb-5 flex items-center gap-2 text-xl 2xl:text-2xl font-black"><CalendarDays {...iconProps} />{t("appointments")}</h2><div className="mb-5 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-6 gap-2 2xl:gap-3 rounded-2xl 2xl:rounded-3xl border bg-white p-3 2xl:p-4"><select value={citaForm.clienteId} onChange={(e) => setCitaForm({ ...citaForm, clienteId: e.target.value })} className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base"><option value="">Cliente</option>{clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select><select value={citaForm.tecnicoId} onChange={(e) => setCitaForm({ ...citaForm, tecnicoId: e.target.value })} className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base"><option value="">Técnico</option>{tecnicos.map((tec) => <option key={tec.id} value={tec.id}>{tec.nombre}</option>)}</select><input type="date" value={citaForm.fecha} onChange={(e) => setCitaForm({ ...citaForm, fecha: e.target.value })} className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base" /><input type="time" value={citaForm.hora} onChange={(e) => setCitaForm({ ...citaForm, hora: e.target.value })} className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base" /><input value={citaForm.motivo} onChange={(e) => setCitaForm({ ...citaForm, motivo: e.target.value })} placeholder="Motivo" className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base" /><button onClick={crearCita} className="rounded-xl 2xl:rounded-2xl bg-blue-600 px-3 2xl:px-4 py-2.5 2xl:py-3 text-sm 2xl:text-base font-black text-white">Programar</button></div><div className="overflow-auto rounded-3xl border bg-white"><table className="min-w-[560px] 2xl:min-w-[760px] w-full text-xs 2xl:text-sm"><thead className="bg-slate-100"><tr><th className="p-2 2xl:p-3 text-left">Cliente</th><th className="p-2 2xl:p-3 text-left">Técnico</th><th className="p-2 2xl:p-3 text-left">Fecha</th><th className="p-2 2xl:p-3 text-left">Hora</th><th className="p-2 2xl:p-3 text-left">Motivo</th><th className="p-2 2xl:p-3 text-left">Estado</th></tr></thead><tbody>{citas.map((c) => <tr key={c.id} className="border-t"><td className="p-2 2xl:p-3">{obtenerCliente(c.clienteId)?.nombre}</td><td className="p-2 2xl:p-3">{obtenerTecnico(c.tecnicoId)?.nombre}</td><td className="p-2 2xl:p-3">{c.fecha}</td><td className="p-2 2xl:p-3">{c.hora}</td><td className="p-2 2xl:p-3">{c.motivo}</td><td className="p-2 2xl:p-3">{c.estado}</td></tr>)}</tbody></table></div></section>; }
function InventarioGeneralPage({ t, inventario, inventarioForm, setInventarioForm, agregarInventario, actualizarInventario, setInventario }) { return <section className="rounded-2xl 2xl:rounded-[2rem] border border-white/70 bg-white/90 p-3 2xl:p-5 shadow-lg 2xl:shadow-xl shadow-blue-100/70 backdrop-blur"><h2 className="mb-3 2xl:mb-5 flex items-center gap-2 text-xl 2xl:text-2xl font-black"><Package {...iconProps} />{t("inventory")}</h2><div className="mb-5 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-8 gap-2 2xl:gap-3 rounded-2xl 2xl:rounded-3xl border bg-white p-3 2xl:p-4"><input value={inventarioForm.nombre} onChange={(e) => setInventarioForm({ ...inventarioForm, nombre: e.target.value })} placeholder="Material" className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base 2xl:col-span-2" /><select value={inventarioForm.categoria} onChange={(e) => setInventarioForm({ ...inventarioForm, categoria: e.target.value })} className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base 2xl:col-span-2">{CATEGORIAS_HVAC.map((c) => <option key={c}>{c}</option>)}</select><input type="number" value={inventarioForm.cantidad} onChange={(e) => setInventarioForm({ ...inventarioForm, cantidad: e.target.value })} placeholder="Cantidad" className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base" /><select value={inventarioForm.unidad} onChange={(e) => setInventarioForm({ ...inventarioForm, unidad: e.target.value })} className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base">{UNIDADES.map((u) => <option key={u}>{u}</option>)}</select><input type="number" step="0.01" value={inventarioForm.costo} onChange={(e) => setInventarioForm({ ...inventarioForm, costo: e.target.value })} placeholder="$0.00" className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base" /><button onClick={agregarInventario} className="rounded-2xl bg-purple-600 px-4 py-3 font-black text-white">Agregar</button></div><InventoryTable items={inventario} update={actualizarInventario} remove={(id) => setInventario(inventario.filter((i) => i.id !== id))} /></section>; }
function InventoryTable({ items, update, remove }) { const [edit, setEdit] = useState(null); return <div className="overflow-auto rounded-3xl border bg-white"><table className="min-w-[560px] 2xl:min-w-[760px] w-full text-xs 2xl:text-sm"><thead className="bg-slate-100"><tr><th className="p-2 2xl:p-3 text-left">Material</th><th className="p-2 2xl:p-3 text-left">Categoría</th><th className="p-2 2xl:p-3 text-left">Cantidad</th><th className="p-2 2xl:p-3 text-left">Unidad</th><th className="p-2 2xl:p-3 text-left">Costo</th><th className="p-2 2xl:p-3 text-left">Estado</th><th className="p-2 2xl:p-3 text-left">Acciones</th></tr></thead><tbody>{items.map((i) => { const editing = edit === i.id; const bajo = Number(i.cantidad) <= Number(i.stockMinimo || 0); return <tr key={i.id} className="border-t"><td className="p-1.5 2xl:p-2">{editing ? <input value={i.nombre} onChange={(e) => update(i.id, "nombre", e.target.value)} className="rounded-lg 2xl:rounded-xl border p-1.5 2xl:p-2 text-sm 2xl:text-base" /> : i.nombre}</td><td className="p-1.5 2xl:p-2">{editing ? <select value={i.categoria} onChange={(e) => update(i.id, "categoria", e.target.value)} className="rounded-lg 2xl:rounded-xl border p-1.5 2xl:p-2 text-sm 2xl:text-base">{CATEGORIAS_HVAC.map((c) => <option key={c}>{c}</option>)}</select> : i.categoria}</td><td className="p-1.5 2xl:p-2">{editing ? <input type="number" value={i.cantidad} onChange={(e) => update(i.id, "cantidad", e.target.value)} className="rounded-lg 2xl:rounded-xl border p-1.5 2xl:p-2 text-sm 2xl:text-base" /> : i.cantidad}</td><td className="p-1.5 2xl:p-2">{editing ? <select value={i.unidad} onChange={(e) => update(i.id, "unidad", e.target.value)} className="rounded-lg 2xl:rounded-xl border p-1.5 2xl:p-2 text-sm 2xl:text-base">{UNIDADES.map((u) => <option key={u}>{u}</option>)}</select> : i.unidad}</td><td className="p-1.5 2xl:p-2">{editing ? <input type="number" step="0.01" value={i.costo} onChange={(e) => update(i.id, "costo", e.target.value)} className="rounded-lg 2xl:rounded-xl border p-1.5 2xl:p-2 text-sm 2xl:text-base" /> : `$${Number(i.costo || 0).toFixed(2)}`}</td><td className="p-1.5 2xl:p-2"><span className={`rounded-full px-3 py-1 font-bold ${bajo ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700"}`}>{bajo ? "Stock bajo" : "Disponible"}</span></td><td className="p-1.5 2xl:p-2"><div className="flex gap-2"><button onClick={() => setEdit(editing ? null : i.id)} className="rounded-xl bg-slate-950 px-3 py-2 text-white font-bold">{editing ? "Guardar" : "Editar"}</button><button onClick={() => remove(i.id)} className="rounded-xl bg-red-600 px-3 py-2 text-white font-bold">Eliminar</button></div></td></tr>; })}</tbody></table></div>; }
function HerramientasPage({ t, herramientas, herramientaForm, setHerramientaForm, agregarHerramienta, actualizarHerramienta, setHerramientas, tecnicos, obtenerTecnico, tecnicoHerramientasSeleccionado, setTecnicoHerramientasSeleccionado }) {
  const [editando, setEditando] = useState(null);
  const herramientasFiltradas = herramientas.filter((h) => !tecnicoHerramientasSeleccionado || String(h.tecnicoId) === String(tecnicoHerramientasSeleccionado));
  const tecnicoActual = obtenerTecnico(tecnicoHerramientasSeleccionado);

  const seleccionarTecnico = (id) => {
    setTecnicoHerramientasSeleccionado(id);
    setHerramientaForm({ ...herramientaForm, tecnicoId: id || herramientaForm.tecnicoId });
  };

  return <section className="rounded-2xl 2xl:rounded-[2rem] border border-white/70 bg-white/90 p-3 2xl:p-5 shadow-lg 2xl:shadow-xl shadow-blue-100/70 backdrop-blur">
    <div className="mb-3 2xl:mb-5 flex flex-col gap-2 2xl:gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="flex items-center gap-2 text-xl 2xl:text-2xl font-black"><Wrench {...iconProps} />{t("tools")}</h2>
        <p className="text-xs 2xl:text-sm text-slate-500">Selecciona un técnico para ver solo las herramientas asignadas a esa persona.</p>
      </div>
      <select value={tecnicoHerramientasSeleccionado} onChange={(e) => seleccionarTecnico(e.target.value)} className="rounded-xl 2xl:rounded-2xl border bg-white p-2 2xl:p-3 text-sm 2xl:text-base font-bold">
        <option value="">Todos los técnicos activos</option>
        {tecnicos.map((tec) => <option key={tec.id} value={tec.id}>{tec.nombre}</option>)}
      </select>
    </div>

    <div className="mb-3 2xl:mb-5 rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/60 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2 2xl:gap-3">
        <p className="flex items-center gap-2 font-black"><Plus {...iconProps} />Agregar herramienta {tecnicoActual ? `a ${tecnicoActual.nombre}` : ""}</p>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">{herramientasFiltradas.length} item(s)</span>
      </div>
      <div className="grid grid-cols-1 2xl:grid-cols-5 gap-2 2xl:gap-3">
        <input value={herramientaForm.nombre} onChange={(e) => setHerramientaForm({ ...herramientaForm, nombre: e.target.value })} placeholder="Herramienta" className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base" />
        <select value={herramientaForm.tecnicoId || tecnicoHerramientasSeleccionado} onChange={(e) => setHerramientaForm({ ...herramientaForm, tecnicoId: e.target.value })} className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base">
          <option value="">Técnico activo</option>
          {tecnicos.map((tec) => <option key={tec.id} value={tec.id}>{tec.nombre}</option>)}
        </select>
        <input type="number" min="1" value={herramientaForm.cantidad} onChange={(e) => setHerramientaForm({ ...herramientaForm, cantidad: e.target.value })} placeholder="Cantidad" className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base" />
        <select value={herramientaForm.estado} onChange={(e) => setHerramientaForm({ ...herramientaForm, estado: e.target.value })} className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base"><option>Disponible</option><option>Asignada</option><option>Dañada</option><option>Perdida</option></select>
        <button onClick={agregarHerramienta} className="rounded-xl 2xl:rounded-2xl bg-blue-600 px-3 2xl:px-4 py-2.5 2xl:py-3 text-sm 2xl:text-base font-black text-white">Agregar</button>
      </div>
      <textarea value={herramientaForm.notas} onChange={(e) => setHerramientaForm({ ...herramientaForm, notas: e.target.value })} placeholder="Notas de la herramienta" className="mt-3 min-h-20 w-full rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base" />
    </div>

    <div className="overflow-auto rounded-3xl border bg-white">
      <table className="min-w-[560px] 2xl:min-w-[760px] w-full text-xs 2xl:text-sm">
        <thead className="bg-slate-100"><tr><th className="p-2 2xl:p-3 text-left">Herramienta</th><th className="p-2 2xl:p-3 text-left">Técnico</th><th className="p-2 2xl:p-3 text-left">Cantidad</th><th className="p-2 2xl:p-3 text-left">Estado</th><th className="p-2 2xl:p-3 text-left">Notas</th><th className="p-2 2xl:p-3 text-left">Acciones</th></tr></thead>
        <tbody>{herramientasFiltradas.map((h) => {
          const editing = editando === h.id;
          return <tr key={h.id} className="border-t align-top">
            <td className="p-1.5 2xl:p-2">{editing ? <input value={h.nombre} onChange={(e) => actualizarHerramienta(h.id, "nombre", e.target.value)} className="rounded-lg 2xl:rounded-xl border p-1.5 2xl:p-2 text-sm 2xl:text-base" /> : <span className="font-bold">{h.nombre}</span>}</td>
            <td className="p-1.5 2xl:p-2">{editing ? <select value={h.tecnicoId} onChange={(e) => actualizarHerramienta(h.id, "tecnicoId", e.target.value)} className="rounded-lg 2xl:rounded-xl border p-1.5 2xl:p-2 text-sm 2xl:text-base">{tecnicos.map((tec) => <option key={tec.id} value={tec.id}>{tec.nombre}</option>)}</select> : obtenerTecnico(h.tecnicoId)?.nombre}</td>
            <td className="p-1.5 2xl:p-2">{editing ? <input type="number" min="1" value={h.cantidad} onChange={(e) => actualizarHerramienta(h.id, "cantidad", e.target.value)} className="w-24 rounded-xl border p-2" /> : h.cantidad}</td>
            <td className="p-1.5 2xl:p-2">{editing ? <select value={h.estado} onChange={(e) => actualizarHerramienta(h.id, "estado", e.target.value)} className="rounded-lg 2xl:rounded-xl border p-1.5 2xl:p-2 text-sm 2xl:text-base"><option>Disponible</option><option>Asignada</option><option>Dañada</option><option>Perdida</option></select> : <span className="rounded-full bg-slate-100 px-3 py-1 font-bold">{h.estado}</span>}</td>
            <td className="p-1.5 2xl:p-2">{editing ? <input value={h.notas || ""} onChange={(e) => actualizarHerramienta(h.id, "notas", e.target.value)} className="rounded-lg 2xl:rounded-xl border p-1.5 2xl:p-2 text-sm 2xl:text-base" /> : (h.notas || "—")}</td>
            <td className="p-1.5 2xl:p-2"><div className="flex gap-2"><button onClick={() => setEditando(editing ? null : h.id)} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-white font-bold"><Pencil {...iconProps} />{editing ? "Guardar" : "Editar"}</button><button onClick={() => setHerramientas(herramientas.filter((x) => x.id !== h.id))} className="rounded-xl bg-red-600 px-3 py-2 text-white font-bold">Eliminar</button></div></td>
          </tr>;
        })}</tbody>
      </table>
      {herramientasFiltradas.length === 0 && <p className="p-5 text-slate-500">No hay herramientas asignadas para este técnico.</p>}
    </div>
  </section>;
}
function ReportesClientesPage({ t, clientes, ordenes, obtenerCliente, exportarCSV }) { const filas = clientes.map((c) => ({ Cliente: c.nombre, Telefono: c.telefono, Email: c.email, Direccion: c.direccion, Ordenes: ordenes.filter((o) => String(o.clienteId) === String(c.id)).length })); return <ReportTable title={t("reportsCustomers")} icon={Users} rows={filas} exportar={() => exportarCSV(filas, "reporte_clientes.csv")} />; }
function ReportesInventarioPage({ t, inventario, herramientas, obtenerTecnico, exportarCSV }) { const filas = inventario.map((i) => ({ Tipo: "Inventario", Nombre: i.nombre, Categoria: i.categoria, Cantidad: i.cantidad, Unidad: i.unidad, Costo: i.costo })); const filasHerr = herramientas.map((h) => ({ Tipo: "Herramienta", Nombre: h.nombre, Categoria: obtenerTecnico(h.tecnicoId)?.nombre || "", Cantidad: h.cantidad, Unidad: h.estado, Costo: "" })); return <ReportTable title={t("reportsInventory")} icon={FileSpreadsheet} rows={[...filas, ...filasHerr]} exportar={() => exportarCSV([...filas, ...filasHerr], "reporte_inventario_herramientas.csv")} />; }
function ReportTable({ title, icon: Icon, rows, exportar }) { return <section className="rounded-2xl 2xl:rounded-[2rem] border border-white/70 bg-white/90 p-3 2xl:p-5 shadow-lg 2xl:shadow-xl shadow-blue-100/70 backdrop-blur"><div className="mb-3 2xl:mb-5 flex items-center justify-between"><h2 className="flex items-center gap-2 text-xl 2xl:text-2xl font-black"><Icon {...iconProps} />{title}</h2><button onClick={exportar} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-emerald-600 px-3 2xl:px-4 py-2.5 2xl:py-3 text-sm 2xl:text-base font-black text-white"><FileSpreadsheet {...iconProps} />Exportar</button></div><div className="overflow-auto rounded-3xl border bg-white"><table className="min-w-[560px] 2xl:min-w-[760px] w-full text-xs 2xl:text-sm"><thead className="bg-slate-100"><tr>{Object.keys(rows[0] || { SinDatos: "" }).map((h) => <th key={h} className="p-2 2xl:p-3 text-left">{h}</th>)}</tr></thead><tbody>{rows.map((row, idx) => <tr key={idx} className="border-t">{Object.values(row).map((v, i) => <td key={i} className="p-2 2xl:p-3">{v}</td>)}</tr>)}</tbody></table></div></section>; }
function ConfiguracionPage({ t, adminPassword, setAdminPassword, setMensaje }) { const [actual, setActual] = useState(""); const [nueva, setNueva] = useState(""); const guardar = () => { if (actual !== adminPassword) return setMensaje("Contraseña actual incorrecta."); if (nueva.length < 4) return setMensaje("Mínimo 4 caracteres."); setAdminPassword(nueva); setActual(""); setNueva(""); setMensaje("Contraseña actualizada."); }; return <section className="rounded-2xl 2xl:rounded-[2rem] border border-white/70 bg-white/90 p-3 2xl:p-5 shadow-lg 2xl:shadow-xl shadow-blue-100/70 backdrop-blur"><h2 className="mb-3 2xl:mb-5 flex items-center gap-2 text-xl 2xl:text-2xl font-black"><ShieldCheck {...iconProps} />{t("settings")}</h2><div className="grid grid-cols-1 2xl:grid-cols-3 gap-2 2xl:gap-3"><input type="password" value={actual} onChange={(e) => setActual(e.target.value)} placeholder="Contraseña actual" className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base" /><input type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} placeholder="Nueva contraseña" className="rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base" /><button onClick={guardar} className="rounded-2xl bg-slate-950 px-4 py-3 font-black text-white">Guardar</button></div></section>; }
