import { useEffect, useMemo, useState } from "react";
import { crearClienteSupabase, obtenerClientesSupabase } from "./services/clientesService";
import { obtenerTecnicosSupabase, crearTecnicoSupabase, actualizarTecnicoSupabase } from "./services/tecnicosService";
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
  ShieldAlert,
  PlayCircle,
  Route,
  Gauge,
  BadgeCheck,
  Boxes,
  Images,
  ClipboardCheck,
  Timer,
  Trash2,
  User,
  UserCog,
  Users,
  Wrench,

  TrendingUp,
  CalendarCheck2,
  Ban,
  MessageSquareWarning,
  X,
  CalendarClock,} from "lucide-react";
import ClientesPage from "./pages/ClientesPage.jsx";
import TecnicosPage from "./pages/TecnicosPage.jsx";
import CitasPage from "./pages/CitasPage.jsx";
import CalendarioPage from "./pages/CalendarioPage.jsx";
import OrdenesPage from "./pages/OrdenesPage.jsx";
import HistorialPage from "./pages/HistorialPage.jsx";
import InventarioGeneralPage from "./pages/InventarioGeneralPage.jsx";
import HerramientasPage from "./pages/HerramientasPage.jsx";
import ReportesClientesPage from "./pages/ReportesClientesPage.jsx";
import ReportesInventarioPage from "./pages/ReportesInventarioPage.jsx";
import ReportesDashboardPage from "./pages/ReportesDashboardPage.jsx";
import TecnicoCompactOrderCard from "./components/TecnicoCompactOrderCard.jsx";
import TecnicoCompactCitaCard from "./components/TecnicoCompactCitaCard.jsx";
import SignatureModal from "./components/SignatureModal.jsx";

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
  return <span className={`flex items-center justify-center gap-2 ${className}`}><Icon {...iconProps} />{children}</span>;
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
  const [cancelModalOrden, setCancelModalOrden] = useState(null);
  const [reprogramarCitaModal, setReprogramarCitaModal] = useState(null);
  const [firmaOrdenModal, setFirmaOrdenModal] = useState(null);
  const [adminPage, setAdminPage] = useState("clientes");
  const [tecnicoVista, setTecnicoVista] = useState("agenda");
  const [ordenAgendaAbiertaId, setOrdenAgendaAbiertaId] = useState(null);
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

  useEffect(() => {
    async function cargarClientesSupabase() {
      try {
        const clientesSupabase = await obtenerClientesSupabase();

        const normalizados = clientesSupabase.map((cliente) => {
          const direccionPrincipal =
            cliente.cliente_direcciones?.find((d) => d.principal) ||
            cliente.cliente_direcciones?.[0] ||
            {};

          return {
            id: cliente.id,
            nombre: cliente.nombre || "",
            telefono: cliente.telefono || "",
            email: cliente.email || "",
            direccion: direccionPrincipal.direccion || "",
            apartamento: direccionPrincipal.apartamento || "",
            calle: "",
            codigoAcceso: direccionPrincipal.codigo_acceso || "",
            edificio: direccionPrincipal.edificio || "",
            fechaCreacion: cliente.created_at || "",
          };
        });

        setClientes(normalizados);
      } catch (error) {
        console.error("Error cargando clientes desde Supabase:", error);
      }
    }

    cargarClientesSupabase();
  }, []);


  useEffect(() => {
    async function cargarTecnicosSupabase() {
      try {
        const tecnicosSupabase = await obtenerTecnicosSupabase();
        if (tecnicosSupabase.length > 0) {
          setTecnicos(tecnicosSupabase);
        }
      } catch (error) {
        console.error("Error cargando técnicos desde Supabase:", error);
      }
    }

    cargarTecnicosSupabase();
  }, []);

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

  const agregarCliente = async () => {
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

    let nuevo;

    try {
      const clienteSupabase = await crearClienteSupabase({
        ...clienteForm,
        telefono: formatPhoneUS(clienteForm.telefono),
      });

      nuevo = {
        id: clienteSupabase.id,
        nombre: clienteSupabase.nombre,
        telefono: clienteSupabase.telefono || "",
        email: clienteSupabase.email || "",
        direccion: clienteForm.direccion || "",
        apartamento: clienteForm.apartamento || "",
        calle: clienteForm.calle || "",
        codigoAcceso: clienteForm.codigoAcceso || "",
        edificio: clienteForm.edificio || "",
        fechaCreacion: clienteSupabase.created_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error guardando cliente en Supabase:", error);
      setMensaje("No se pudo guardar el cliente en Supabase. Revisa la conexión o permisos.");
      return;
    }

    setClientes((actual) => [...actual, nuevo]);
    setOrdenForm((actual) => ({ ...actual, clienteId: String(nuevo.id) }));
    setBusquedaClienteOrden(`${nuevo.nombre} - ${nuevo.telefono || ""}`);
    setCitaForm((actual) => ({ ...actual, clienteId: String(nuevo.id) }));
    setClienteForm({ nombre: "", telefono: "", email: "", direccion: "", apartamento: "", calle: "", codigoAcceso: "", edificio: "" });
    setClienteAccion(nuevo);
    setMensaje("Cliente creado correctamente. Elige qué deseas hacer ahora.");
  };

  const existeConflictoHorario = ({ tecnicoId, fecha, hora, ignorarCitaId = null, ignorarOrdenId = null }) => {
    if (!tecnicoId || !fecha || !hora) return false;

    const fechaKey = toDateKey(fecha);
    const horaKey = String(hora).slice(0, 5);

    const conflictoOrden = ordenes.some((orden) => {
      if (String(orden.id) === String(ignorarOrdenId)) return false;
      if (["Completado", "Cancelada"].includes(orden.estado)) return false;

      return (
        String(orden.tecnicoId) === String(tecnicoId) &&
        toDateKey(orden.fechaProgramada || orden.fecha || orden.fechaCreacion) === fechaKey &&
        String(orden.horaProgramada || "").slice(0, 5) === horaKey
      );
    });

    const conflictoCita = citas.some((cita) => {
      if (String(cita.id) === String(ignorarCitaId)) return false;
      if (cita.estado === "Convertida en orden") return false;

      return (
        String(cita.tecnicoId) === String(tecnicoId) &&
        toDateKey(cita.fecha || cita.fechaProgramada || cita.fechaCreacion) === fechaKey &&
        String(cita.hora || cita.horaProgramada || "").slice(0, 5) === horaKey
      );
    });

    return conflictoOrden || conflictoCita;
  };

  const crearOrden = () => {
    const tecnicoSeleccionado = obtenerTecnico(ordenForm.tecnicoId);

    if (!ordenForm.clienteId || !ordenForm.tecnicoId || !ordenForm.problema) {
      return setMensaje("Selecciona cliente, técnico y problema reportado.");
    }

    if (!tecnicoSeleccionado || tecnicoSeleccionado.activo === false) {
      return setMensaje("No puedes asignar una orden a un técnico dado de baja.");
    }

    if (ordenForm.fechaProgramada && ordenForm.horaProgramada && existeConflictoHorario({
      tecnicoId: ordenForm.tecnicoId,
      fecha: ordenForm.fechaProgramada,
      hora: ordenForm.horaProgramada,
    })) {
      return setMensaje("Este técnico ya tiene una orden o cita programada para esa misma fecha y hora.");
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

  const convertirCitaEnOrden = (cita) => {
    if (!cita) return;

    const clienteId = String(cita.clienteId || "");
    const tecnicoId = String(cita.tecnicoId || "");

    if (!clienteId || !tecnicoId) {
      alert("La cita necesita cliente y técnico para convertirse en orden.");
      return;
    }

    const yaConvertida = ordenes.some((orden) => String(orden.origenCitaId || "") === String(cita.id));

    if (yaConvertida) {
      alert("Esta cita ya fue convertida en orden.");
      return;
    }

    const fecha = new Date();

    const nuevaOrden = {
      id: Date.now(),
      clienteId,
      tecnicoId,
      problema: cita.motivo || "Trabajo creado desde cita programada",
      prioridad: "Media",
      estado: "Asignada",
      fecha: fecha.toLocaleDateString(),
      fechaCreacion: fecha.toISOString(),
      fechaProgramada: cita.fecha || "",
      horaProgramada: cita.hora || "",
      fechaCompletada: "",
      horaInicio: "",
      horaCierre: "",
      duracionHoras: "",
      materialesUsados: [],
      costoMateriales: 0,
      fotos: { antes: "", durante: "", despues: "" },
      notasTecnico: cita.notas ? `Creada desde cita. Nota cita: ${cita.notas}` : "Creada desde cita programada.",
      inventarioDescontado: false,
      cancelReason: "",
      origenCitaId: cita.id,
    };

    setOrdenes([...ordenes, nuevaOrden]);

    setCitas(citas.map((item) => (
      String(item.id) === String(cita.id)
        ? {
            ...item,
            estado: "Convertida en orden",
            ordenId: nuevaOrden.id,
            fechaConversion: fecha.toISOString(),
          }
        : item
    )));

    setMensaje("Cita convertida en orden correctamente.");
  };

  const reprogramarCita = (citaId, data) => {
    if (!data?.fecha || !data?.hora || !String(data?.motivo || "").trim()) {
      alert("Fecha, hora y motivo son obligatorios para reprogramar.");
      return;
    }

    const fechaCambio = new Date().toISOString();

    setCitas(citas.map((cita) => {
      if (String(cita.id) !== String(citaId)) return cita;

      const historial = cita.historialReprogramaciones || [];

      return {
        ...cita,
        fechaAnterior: cita.fecha,
        horaAnterior: cita.hora,
        fecha: data.fecha,
        hora: data.hora,
        estado: "Reprogramada",
        motivoReprogramacion: data.motivo,
        fechaUltimaReprogramacion: fechaCambio,
        historialReprogramaciones: [
          ...historial,
          {
            id: Date.now(),
            fechaAnterior: cita.fecha || "",
            horaAnterior: cita.hora || "",
            fechaNueva: data.fecha,
            horaNueva: data.hora,
            motivo: data.motivo,
            reprogramadaPor: session?.role || "usuario",
            reprogramadaPorNombre: session?.nombre || session?.usuario || "Usuario",
            fechaCambio,
          },
        ],
      };
    }));

    setReprogramarCitaModal(null);
    setMensaje("Cita reprogramada correctamente.");
  };

  const marcarEnRuta = (id) => setOrdenes(ordenes.map((o) => o.id === id ? { ...o, estado: "En ruta", horaEnRuta: o.horaEnRuta || new Date().toISOString() } : o));

  const marcarLlegada = (id) => {
    const ahora = new Date().toISOString();

    setOrdenes(ordenes.map((o) => {
      if (o.id !== id) return o;

      const horaLlegadaFinal = o.horaLlegada || ahora;
      const duracionTraslado = o.horaEnRuta
        ? calcularHoras(o.horaEnRuta, horaLlegadaFinal)
        : o.duracionTraslado || "";

      return {
        ...o,
        estado: o.estado === "Asignada" || o.estado === "En ruta" ? "En sitio" : o.estado,
        horaLlegada: horaLlegadaFinal,
        duracionTraslado,
      };
    }));

    setMensaje("Llegada registrada correctamente. Tiempo de traslado calculado.");
  };
  const iniciarTrabajo = (id) => setOrdenes(ordenes.map((o) => o.id === id ? { ...o, estado: "En proceso", horaInicio: o.horaInicio || new Date().toISOString() } : o));

  const marcarNecesitaSeguimiento = (id) => {
    const orden = ordenes.find((o) => o.id === id);
    if (!orden) return;

    if (["Completado", "Cancelada"].includes(orden.estado)) {
      return setMensaje("Esta orden ya está cerrada y no se puede modificar.");
    }

    const motivo = prompt(
      "Motivo por el que no se pudo completar:\n\nEjemplos: Técnico enfermo, faltó tiempo, falta material, cliente pidió continuar después, otro."
    );

    if (!motivo || !motivo.trim()) {
      return setMensaje("Debes escribir un motivo para marcar la orden como necesita seguimiento.");
    }

    const fechaSugerida = prompt("Fecha sugerida para regresar (opcional, formato YYYY-MM-DD):", "");

    setOrdenes(ordenes.map((o) => (
      o.id === id
        ? {
            ...o,
            estado: "Necesita seguimiento",
            seguimientoMotivo: motivo.trim(),
            seguimientoFechaSugerida: fechaSugerida || "",
            seguimientoFechaRegistro: new Date().toISOString(),
          }
        : o
    )));

    setMensaje("Orden marcada como Necesita seguimiento. Seguirá apareciendo en órdenes activas.");
  };
  const guardarFirmaCliente = (ordenId, firmaDataUrl) => {
    if (!firmaDataUrl) {
      alert("No hay firma para guardar.");
      return;
    }

    setOrdenes(ordenes.map((o) => (
      o.id === ordenId
        ? {
            ...o,
            firmaCliente: firmaDataUrl,
            fechaFirmaCliente: new Date().toISOString(),
          }
        : o
    )));

    setFirmaOrdenModal(null);
    setMensaje("Firma del cliente guardada correctamente.");
  };

  const cancelarOrden = (id, cancelData = {}) => {
    const motivo = String(cancelData.motivo || "").trim();

    if (!motivo) {
      alert("El motivo de cancelación es obligatorio.");
      return;
    }

    const fechaCancelacion = new Date().toISOString();

    setOrdenes(ordenes.map((o) => (
      o.id === id
        ? {
            ...o,
            estado: "Cancelada",
            cancelReason: motivo,
            cancelTipo: cancelData.tipo || getCancelTipoBySession(session),
            canceladoPor: cancelData.canceladoPor || session?.role || "sistema",
            canceladoPorNombre: cancelData.canceladoPorNombre || session?.nombre || session?.usuario || "Usuario",
            fechaCancelacion,
            fechaCompletada: fechaCancelacion,
          }
        : o
    )));

    setCancelModalOrden(null);
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
    const inicio = orden.horaInicio || cierre;
    const duracionTraslado = orden.duracionTraslado || (
      orden.horaEnRuta && orden.horaLlegada
        ? calcularHoras(orden.horaEnRuta, orden.horaLlegada)
        : ""
    );

    setOrdenes(ordenes.map((o) => o.id === id ? { ...o, estado: "Completado", horaInicio: inicio, horaCierre: cierre, duracionHoras: calcularHoras(inicio, cierre), duracionTraslado, fechaCompletada: cierre, costoMateriales: calcularCostoOrden(o), inventarioDescontado: true } : o));

    const capturarConfirmacion = window.confirm("Orden completada. ¿Deseas capturar firma y calificación del cliente?");
    if (capturarConfirmacion) {
      setFirmaOrdenModal({
        ...orden,
        estado: "Completado",
        horaInicio: inicio,
        horaCierre: cierre,
        duracionHoras: calcularHoras(inicio, cierre),
        duracionTraslado,
        fechaCompletada: cierre,
      });
    }
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
    const fecha = formatReportDate(orden.fechaCompletada || orden.fechaCreacion || orden.fecha);
    const fotos = ["antes", "durante", "despues"].filter((k) => orden.fotos?.[k]).length;

    return [
      "HVAC Manager - Service Report",
      "",
      `Orden: #${orden.id}`,
      `Estado: ${orden.estado || "Pendiente"}`,
      `Prioridad: ${orden.prioridad || "Media"}`,
      `Fecha: ${fecha}`,
      "",
      "CLIENTE",
      `Nombre: ${c?.nombre || ""}`,
      `Teléfono: ${formatPhoneDisplay(c?.telefono || "")}`,
      `Dirección: ${c?.direccion || ""}`,
      `Apt: ${c?.apartamento || "—"} | Edificio: ${c?.edificio || "—"} | Calle: ${c?.calle || "—"} | Access Code: ${c?.codigoAcceso || "—"}`,
      "",
      "TÉCNICO",
      `Nombre: ${tec?.nombre || "Sin técnico"}`,
      "",
      "SOLICITUD",
      `${orden.problema || "Sin problema reportado"}`,
      "",
      "DETALLE DEL SERVICIO",
      `${orden.notasTecnico || "Sin notas del técnico"}`,
      "",
      `Tiempo de trabajo: ${orden.duracionHoras || "0.00"} horas`,
      `Tiempo de traslado: ${orden.duracionTraslado || "0.00"} horas`,
      `Fotos adjuntas: ${fotos}/3`,
    ].join("\n");
  };

  const crearReporteHTML = (orden) => {
    const c = obtenerCliente(orden.clienteId);
    const tec = obtenerTecnico(orden.tecnicoId);
    const fecha = formatReportDate(orden.fechaCompletada || orden.fechaCreacion || orden.fecha);

    const fotos = [
      ["Antes", orden.fotos?.antes],
      ["Durante", orden.fotos?.durante],
      ["Después", orden.fotos?.despues],
    ].filter(([, src]) => src);

    const fotoHTML = fotos.length
      ? fotos.map(([label, src]) => `
        <figure class="photo-card">
          <div class="photo-frame">
            <img src="${src}" alt="${escapeHtml(label)}" />
          </div>
          <figcaption>${escapeHtml(label)}</figcaption>
        </figure>
      `).join("")
      : `<div class="empty">No se agregaron imágenes a esta orden.</div>`;

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>HVAC Manager - Service Report</title>
  <style>
    *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    body{margin:0;background:white;color:#0f172a;font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.45}
    .page{max-width:8.5in;margin:0 auto;background:white;padding:24px}
    .header{display:grid;grid-template-columns:1.2fr .8fr;gap:16px;align-items:start;border-bottom:3px solid #1d4ed8;padding-bottom:14px;margin-bottom:14px}
    .brand{display:flex;gap:18px;align-items:center}
    .logo{width:145px;height:82px;background:transparent;border:none;padding:0;display:flex;align-items:center;justify-content:center}
    .logo img{max-width:100%;max-height:100%;object-fit:contain}
    h1{margin:0;font-size:22px;line-height:1.05;letter-spacing:-.04em;color:#0f172a}
    .sub{margin-top:7px;color:#1d4ed8;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.1em}
    .meta{text-align:right;border-left:4px solid #06b6d4;padding-left:18px}
    .meta .id{font-size:22px;font-weight:900;color:#0f172a;letter-spacing:-.05em}
    .badge{display:inline-block;border-radius:999px;padding:6px 10px;font-size:11px;font-weight:900;text-transform:uppercase;border:2px solid #94a3b8;color:#334155}
    .badge.ok{border-color:#10b981;color:#047857}
    .badge.bad{border-color:#e11d48;color:#be123c}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
    .card{border:2px solid #dbeafe;border-radius:14px;padding:9px 10px;background:white}
    .card.soft{border-color:#93c5fd}
    .card h2{margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:.13em;color:#1d4ed8}
    .row{display:grid;grid-template-columns:80px 1fr;gap:6px;border-top:1px solid #e2e8f0;padding:4px 0}
    .row:first-of-type{border-top:0}
    .label{color:#64748b;font-weight:900;font-size:12px}
    .value{font-weight:900;color:#0f172a;word-break:break-word}
    .section{margin-top:10px}
    .section-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-left:5px solid #1d4ed8;padding-left:10px}
    .section-title h2{margin:0;font-size:13px;text-transform:uppercase;letter-spacing:.13em;color:#1d4ed8}
    .text-box{border:2px solid #dbeafe;border-radius:14px;padding:9px;min-height:30px;white-space:pre-wrap;font-weight:700}
    .photos{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    .photo-card{margin:0;border:2px solid #dbeafe;border-radius:18px;overflow:hidden;background:white}
    .photo-frame{height:92px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid #dbeafe}
    .photo-frame img{max-width:100%;max-height:100%;object-fit:contain}
    figcaption{padding:8px 10px;font-weight:900;font-size:12px;color:#1d4ed8}
    .empty{border:2px dashed #93c5fd;border-radius:18px;padding:16px;text-align:center;color:#64748b;font-weight:800}
    .footer{margin-top:12px;border-top:3px solid #1d4ed8;padding-top:8px;display:flex;justify-content:space-between;color:#64748b;font-size:11px;font-weight:800}
    @media print{
      @page{size:Letter;margin:8mm}
      body{background:white;font-size:12px}
      .page{margin:0;max-width:none;padding:0}
      .card,.text-box,.photo-card{break-inside:avoid}
      .photo-frame{height:115px}
    }
  
input.login-glass-input,
input.login-glass-input:-webkit-autofill,
input.login-glass-input:-webkit-autofill:hover,
input.login-glass-input:-webkit-autofill:focus,
input.login-glass-input:-webkit-autofill:active{
  -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.001) inset !important;
  box-shadow: 0 0 0 1000px rgba(255,255,255,0.001) inset !important;
  -webkit-text-fill-color: #ffffff !important;
  caret-color: #ffffff !important;
  color: #ffffff !important;
  background: transparent !important;
  background-color: transparent !important;
  transition: background-color 999999s ease-in-out 0s !important;
}

</style>
</head>
<body>
  <main class="page">
    <header class="header">
      <div class="brand">
        <div class="logo">
          <img src="/logo-hvac-premium.png" alt="HVAC Refrigeración Maldonado R" />
        </div>
        <div>
          <h1>HVAC Refrigeración Maldonado R</h1>
          <div class="sub">Service Report · HVAC Manager</div>
        </div>
      </div>
      <div class="meta">
        <div class="id">Orden #${escapeHtml(String(orden.id || ""))}</div>
        <div style="margin-top:10px">
          <span class="badge ${orden.estado === "Completado" ? "ok" : orden.estado === "Cancelada" ? "bad" : ""}">${escapeHtml(orden.estado || "Pendiente")}</span>
        </div>
        <div style="margin-top:10px;color:#64748b;font-weight:900">${escapeHtml(fecha)}</div>
      </div>
    </header>

    <section class="grid">
      <div class="card soft">
        <h2>Cliente</h2>
        <div class="row"><div class="label">Nombre</div><div class="value">${escapeHtml(c?.nombre || "")}</div></div>
        <div class="row"><div class="label">Teléfono</div><div class="value">${escapeHtml(formatPhoneDisplay(c?.telefono || ""))}</div></div>
        <div class="row"><div class="label">Dirección</div><div class="value">${escapeHtml(c?.direccion || "")}</div></div>
        <div class="row"><div class="label">Acceso</div><div class="value">Apt ${escapeHtml(c?.apartamento || "—")} · Edificio ${escapeHtml(c?.edificio || "—")} · Calle ${escapeHtml(c?.calle || "—")} · Código ${escapeHtml(c?.codigoAcceso || "—")}</div></div>
      </div>

      <div class="card">
        <h2>Técnico</h2>
        <div class="row"><div class="label">Nombre</div><div class="value">${escapeHtml(tec?.nombre || "Sin técnico")}</div></div>
        <div class="row"><div class="label">Prioridad</div><div class="value">${escapeHtml(orden.prioridad || "Media")}</div></div>
        <div class="row"><div class="label">Fecha</div><div class="value">${escapeHtml(fecha)}</div></div>
      </div>
    </section>

    <section class="section">
      <div class="section-title"><h2>Solicitud del cliente</h2></div>
      <div class="text-box">${escapeHtml(orden.problema || "Sin problema reportado.")}</div>
    </section>

    <section class="section">
      <div class="section-title"><h2>Detalle del servicio</h2></div>
      <div class="text-box">${escapeHtml(orden.notasTecnico || "Sin notas del técnico.")}</div>
    </section>

    <section class="section">
      <div class="section-title"><h2>Evidencia fotográfica</h2><span class="badge">${fotos.length}/3 fotos</span></div>
      <div class="photos">${fotoHTML}</div>
    </section>

    <footer class="footer">
      <div>Generado desde HVAC Manager</div>
      <div>${new Date().toLocaleString()}</div>
    </footer>
  </main>
</body>
</html>`;
  };

const compartirOrden = async (orden, metodo) => {
    const texto = crearTextoOrden(orden);
    const encoded = encodeURIComponent(texto);
    const titulo = `HVAC Manager - Orden #${orden.id || ""}`;

    if (metodo === "mensaje") {
      if (navigator.share) {
        return navigator.share({ title: titulo, text: texto });
      }
      return window.open(`sms:?&body=${encoded}`, "_blank");
    }

    if (metodo === "email") {
      return window.open(`mailto:?subject=${encodeURIComponent(titulo)}&body=${encoded}`);
    }

    if (metodo === "whatsapp") {
      return window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
    }

    if (metodo === "messenger") {
      return window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(window.location.href)}&app_id=966242223397117&redirect_uri=${encodeURIComponent(window.location.href)}`, "_blank", "noopener,noreferrer");
    }

    if (metodo === "imprimir") {
      const w = window.open("", "_blank");
      if (!w) return alert("Permite ventanas emergentes para imprimir el reporte.");
      w.document.write(crearReporteHTML(orden));
      w.document.close();
      w.focus();
      setTimeout(() => w.print(), 500);
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

  const guardarTecnico = async () => {
    const nombre = prompt("Nombre del técnico:");
    if (!nombre) return;
    const usuario = limpiarTexto(nombre).replace(/\s+/g, "-");

    try {
      const nuevo = await crearTecnicoSupabase({
        nombre,
        usuario,
        password: "1234",
        activo: true,
        telefono: "",
        direccion: "",
        fechaIngreso: "",
        fechaSalida: "",
        pagoHora: 0,
      });

      setTecnicos([...tecnicos, nuevo]);
    } catch (error) {
      console.error("Error guardando técnico en Supabase:", error);
      setMensaje("No se pudo guardar el técnico en Supabase.");
    }
  };

  const actualizarTecnico = async (id, campo, valor) => {
    setTecnicos(tecnicos.map((tec) => tec.id === id ? { ...tec, [campo]: valor } : tec));

    try {
      await actualizarTecnicoSupabase(id, { [campo]: valor });
    } catch (error) {
      console.error("Error actualizando técnico en Supabase:", error);
      setMensaje("No se pudo actualizar el técnico en Supabase.");
    }
  };

  const darDeBajaTecnico = async (id) => {
    const fecha = prompt("Fecha de salida:", new Date().toISOString().slice(0, 10));
    if (!fecha) return;

    setTecnicos(tecnicos.map((tec) => tec.id === id ? { ...tec, activo: false, fechaSalida: fecha } : tec));

    try {
      await actualizarTecnicoSupabase(id, { activo: false, fechaSalida: fecha });
    } catch (error) {
      console.error("Error dando de baja técnico en Supabase:", error);
      setMensaje("No se pudo dar de baja el técnico en Supabase.");
    }
  };

  const crearCita = () => {
    if (!citaForm.clienteId || !citaForm.tecnicoId || !citaForm.fecha || !citaForm.hora) return setMensaje("Completa cliente, técnico, fecha y hora de la cita.");

    if (existeConflictoHorario({
      tecnicoId: citaForm.tecnicoId,
      fecha: citaForm.fecha,
      hora: citaForm.hora,
    })) {
      return setMensaje("Este técnico ya tiene una orden o cita programada para esa misma fecha y hora.");
    }

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

  const colorEstado = (estado) => estado === "Completado" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : estado === "Cancelada" ? "bg-rose-100 text-rose-700 border-rose-200" : estado === "Necesita seguimiento" ? "bg-amber-100 text-amber-800 border-amber-200" : estado === "En proceso" ? "bg-sky-100 text-sky-700 border-sky-200" : estado === "En ruta" ? "bg-cyan-100 text-cyan-700 border-cyan-200" : estado === "Asignada" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-slate-100 text-slate-700 border-slate-200";
  const colorPrioridad = (p) => PRIORIDADES.find((x) => x.value === p)?.cls || "bg-slate-100 text-slate-700 border-slate-200";

  const ordenProps = { inventario, obtenerMaterial, obtenerTecnico, colorEstado, colorPrioridad, marcarEnRuta, marcarLlegada, iniciarTrabajo, marcarNecesitaSeguimiento, setFirmaOrdenModal, completarOrden, cancelarOrden, subirFoto, guardarNotaTecnico, urlGoogleMaps, urlAppleMaps, urlTelefono, agregarMaterialAOrden, actualizarMaterialOrden, eliminarMaterialOrden, calcularCostoOrden, materialesTexto, compartirOrden, convertirCitaEnOrden, reprogramarCita, setReprogramarCitaModal, cancelarOrden: (ordenOrId) => {
    const orden = typeof ordenOrId === "object" ? ordenOrId : ordenes.find((o) => o.id === ordenOrId);
    setCancelModalOrden(orden || null);
  }, t };

  if (!session) return <LoginScreen t={t} lang={lang} setLang={setLang} loginForm={loginForm} setLoginForm={setLoginForm} iniciarSesion={iniciarSesion} mensaje={mensaje} />;

  const adminNav = [
    ["clientes", t("customers"), Users],
    ["tecnicos", t("technicians"), UserCog],
    ["citas", t("appointments"), CalendarDays],
    ["calendario", "Calendario", CalendarCheck2],
    ["ordenes", t("orders"), ClipboardList],
    ["historial", "Historial", History],
    ["inventario", t("inventory"), Package],
    ["herramientas", t("tools"), Wrench],
    ["dashboardReportes", "Dashboard", TrendingUp],
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b pl-44 border-slate-900/10 bg-slate-950/90 text-white backdrop-blur-xl shadow-lg shadow-slate-300/40"><img src="/logo-hvac-premium.png" alt="HVAC Refrigeración Maldonado R" className="absolute left-3 top-1/2 h-24 w-auto -translate-y-1/2 rounded-xl bg-white px-2 py-1 shadow-md" />
        <div className="w-full px-3 2xl:px-8 py-2.5 2xl:py-4 flex flex-col 2xl:flex-row 2xl:items-center justify-center 2xl:justify-between gap-2.5 2xl:gap-4">
          <div><p className="text-[10px] 2xl:text-xs uppercase tracking-[0.24em] 2xl:tracking-[0.3em] text-slate-300 font-black">{t("app")}</p><h1 className="text-lg 2xl:text-lg font-black tracking-tight text-white">{session.role === "admin" ? t("adminPanel") : `${t("techPanel")}: ${session.nombre}`}</h1></div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-2 2xl:gap-3 xl:ml-auto">
            <button onClick={() => setLang(lang === "es" ? "en" : "es")} className="flex items-center justify-center justify-center gap-1.5 2xl:gap-2 rounded-xl 2xl:rounded-2xl bg-white px-3 2xl:px-5 py-2 2xl:py-3 text-xs 2xl:text-base text-slate-700 font-black border shadow-sm"><Languages {...iconProps} />{t("translate")}</button>
            {session.role === "admin" && <button onClick={() => setAdminPage("configuracion")} className="flex items-center justify-center justify-center gap-1.5 2xl:gap-2 rounded-xl 2xl:rounded-2xl bg-slate-950 px-3 2xl:px-5 py-2 2xl:py-3 text-xs 2xl:text-base text-white font-black shadow-lg shadow-slate-300/40 transition hover:-translate-y-0.5"><ShieldCheck {...iconProps} />{t("changePassword")}</button>}
            <TopInfo now={now} />
            <button onClick={cerrarSesion} className="flex items-center justify-center justify-center gap-1.5 2xl:gap-2 rounded-xl 2xl:rounded-2xl bg-slate-950 px-3 2xl:px-5 py-2 2xl:py-3 text-xs 2xl:text-base text-white font-black shadow-lg shadow-slate-300/40 transition hover:-translate-y-0.5"><LogOut {...iconProps} />{t("logout")}</button>
          </div>
        </div>
      </header>

      <main className="w-full min-w-0 px-2.5 2xl:px-6 py-3 2xl:py-5">

        {clienteAccion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white shadow-lg shadow-slate-950/40">
              <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 px-5 py-3 text-white">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-300">Cliente guardado</p>
                <h3 className="mt-2 text-lg font-black">{clienteAccion.nombre}</h3>
                <p className="mt-1 text-sm text-slate-200">¿Qué deseas hacer ahora con este cliente?</p>
              </div>

              <div className="grid gap-3 p-5">
                <button onClick={() => abrirCrearOrdenConCliente(clienteAccion)} className="flex items-center justify-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 font-black text-white shadow-lg">
                  <ClipboardList size={18} />
                  Crear orden
                </button>

                <button onClick={() => abrirProgramarCitaConCliente(clienteAccion)} className="flex items-center justify-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 font-black text-white shadow-lg">
                  <CalendarDays size={18} />
                  Programar cita
                </button>

                <button onClick={() => { setClienteAccion(null); setMensaje("Cliente guardado correctamente."); }} className="flex items-center justify-center justify-center gap-2 rounded-2xl border bg-white px-4 py-3 font-black text-slate-700">
                  Solo guardar
                </button>
              </div>
            </div>
          </div>
        )}
        {mensaje && <div className="mb-3 2xl:mb-5 rounded-2xl border border-blue-200 bg-blue-50/90 px-5 py-4 text-blue-800 font-semibold shadow-sm">{mensaje}</div>}

        {session.role === "admin" && (
          <>
            <nav className="sticky top-[66px] 2xl:top-[92px] z-10 mb-3 grid w-full grid-cols-9 gap-1.5 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-lg shadow-slate-300/40 backdrop-blur">
              {adminNav.map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setAdminPage(id)}
                  className={`
                    flex
                    w-full
                    items-center justify-center
                    gap-1.5
                    rounded-xl
                    px-2
                    py-2
                    text-[11px]
                    font-black
                    transition
                    ${
                      adminPage === id
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-300/40"
                        : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-200"
                    }
                  `}
                >
                  <Icon size={16} strokeWidth={2.2} />
                  {label}
                </button>
              ))}</nav>

            {adminPage === "clientes" && <ClientesPage t={t} clientes={clientes} setClientes={setClientes} ordenes={ordenes} citas={citas} clienteForm={clienteForm} setClienteForm={setClienteForm} agregarCliente={agregarCliente} abrirCrearOrdenConCliente={abrirCrearOrdenConCliente} abrirProgramarCitaConCliente={abrirProgramarCitaConCliente} urlGoogleMaps={urlGoogleMaps} urlAppleMaps={urlAppleMaps} urlTelefono={urlTelefono} />}
            {adminPage === "tecnicos" && <TecnicosPage t={t} tecnicos={tecnicos} actualizarTecnico={actualizarTecnico} guardarTecnico={guardarTecnico} darDeBajaTecnico={darDeBajaTecnico} setTecnicos={setTecnicos} />}
            {adminPage === "citas" && <CitasPage t={t} citas={citas} setCitas={setCitas} citaForm={citaForm} setCitaForm={setCitaForm} crearCita={crearCita} clientes={clientes} tecnicos={tecnicosActivos} obtenerCliente={obtenerCliente} obtenerTecnico={obtenerTecnico} />}
            {adminPage === "calendario" && <CalendarioPage citas={citas} ordenes={ordenes} clientes={clientes} tecnicos={tecnicosActivos} obtenerCliente={obtenerCliente} obtenerTecnico={obtenerTecnico} urlAppleMaps={urlAppleMaps} urlTelefono={urlTelefono} />}
            {adminPage === "ordenes" && <OrdenesPage t={t} ordenes={ordenesActivasAdmin} obtenerCliente={obtenerCliente} ordenProps={ordenProps} crearOrden={crearOrden} ordenForm={ordenForm} setOrdenForm={setOrdenForm} busquedaClienteOrden={busquedaClienteOrden} setBusquedaClienteOrden={setBusquedaClienteOrden} clientesFiltradosOrden={clientesFiltradosOrden} tecnicos={tecnicosActivos} />}
            {adminPage === "historial" && <HistorialPage t={t} ordenes={historialAdmin} obtenerCliente={obtenerCliente} ordenProps={ordenProps} />}
            {adminPage === "inventario" && <InventarioGeneralPage t={t} inventario={inventario} inventarioForm={inventarioForm} setInventarioForm={setInventarioForm} agregarInventario={agregarInventario} actualizarInventario={actualizarInventario} setInventario={setInventario} />}
            {adminPage === "herramientas" && <HerramientasPage t={t} herramientas={herramientas} herramientaForm={herramientaForm} setHerramientaForm={setHerramientaForm} agregarHerramienta={agregarHerramienta} actualizarHerramienta={actualizarHerramienta} setHerramientas={setHerramientas} tecnicos={tecnicosActivos} obtenerTecnico={obtenerTecnico} tecnicoHerramientasSeleccionado={tecnicoHerramientasSeleccionado} setTecnicoHerramientasSeleccionado={setTecnicoHerramientasSeleccionado} />}
            {adminPage === "dashboardReportes" && (
              <DashboardUnificadoPage
                t={t}
                clientes={clientes}
                ordenes={ordenes}
                inventario={inventario}
                herramientas={herramientas}
                tecnicos={tecnicos}
                obtenerCliente={obtenerCliente}
                obtenerTecnico={obtenerTecnico}
                exportarCSV={exportarCSV}
              />
            )}
            {adminPage === "configuracion" && <ConfiguracionPage t={t} adminPassword={adminPassword} setAdminPassword={setAdminPassword} setMensaje={setMensaje} />}
          </>
        )}

        <CancelOrderModal
          open={Boolean(cancelModalOrden)}
          orden={cancelModalOrden}
          cliente={cancelModalOrden ? obtenerCliente(cancelModalOrden.clienteId) : null}
          tecnico={cancelModalOrden ? obtenerTecnico(cancelModalOrden.tecnicoId) : null}
          onClose={() => setCancelModalOrden(null)}
          onConfirm={(payload) => cancelarOrden(cancelModalOrden.id, payload)}
          session={session}
        />

        <ReprogramCitaModal
          open={Boolean(reprogramarCitaModal)}
          cita={reprogramarCitaModal}
          cliente={reprogramarCitaModal ? obtenerCliente(reprogramarCitaModal.clienteId) : null}
          onClose={() => setReprogramarCitaModal(null)}
          onConfirm={(payload) => reprogramarCita(reprogramarCitaModal.id, payload)}
        />

        <SignatureModal
          open={Boolean(firmaOrdenModal)}
          orden={firmaOrdenModal}
          cliente={firmaOrdenModal ? obtenerCliente(firmaOrdenModal.clienteId) : null}
          onClose={() => setFirmaOrdenModal(null)}
          onSave={(firmaDataUrl) => guardarFirmaCliente(firmaOrdenModal.id, firmaDataUrl)}
        />

        {session.role === "tecnico" && (() => {
          const citasTecnico = citas.filter((c) => String(c.tecnicoId) === String(session.id));
          const herramientasTecnico = herramientas.filter((h) => h.tecnicoId === session.id);

          return (
            <>


              <section className="mb-3 overflow-hidden rounded-[1.4rem] border border-white/70 bg-white/80 shadow-md shadow-slate-400/30 backdrop-blur">
                <div className="relative overflow-hidden bg-slate-950 px-4 py-3 text-white">
                  <div className="absolute -right-10 -top-14 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
                  <div className="absolute -bottom-12 left-1/3 h-28 w-28 rounded-full bg-blue-500/20 blur-3xl" />

                  <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center justify-center sm:justify-between">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20">
                        <UserCog size={22} />
                      </div>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.28em] text-slate-300">
                          Panel del técnico
                        </p>
                        <h2 className="mt-0.5 text-base font-black leading-tight">
                          {session.nombre}
                        </h2>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/15">
                        <p className="text-lg font-black">
                          {
                            ordenesActivasTecnico.filter((orden) => {
                              const hoy = todayDateKey();
                              return [
                                orden.fechaProgramada,
                                orden.fecha,
                                orden.fechaCreacion,
                              ].map(toDateKey).filter(Boolean).includes(hoy);
                            }).length +
                            citasTecnico.filter((cita) => {
                              const hoy = todayDateKey();
                              return [
                                cita.fecha,
                                cita.fechaProgramada,
                                cita.fechaCreacion,
                              ].map(toDateKey).filter(Boolean).includes(hoy) &&
                              cita.estado !== "Convertida en orden";
                            }).length
                          }
                        </p>
                        <p className="text-[8px] font-black uppercase tracking-wide text-cyan-100">Hoy</p>
                      </div>

                      <div className="rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/15">
                        <p className="text-lg font-black">{ordenesActivasTecnico.length}</p>
                        <p className="text-[8px] font-black uppercase tracking-wide text-blue-100">Activas</p>
                      </div>

                      <div className="rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/15">
                        <p className="text-lg font-black">{historialTecnico.length}</p>
                        <p className="text-[8px] font-black uppercase tracking-wide text-emerald-100">Historial</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 bg-gradient-to-br from-slate-50 to-white p-2 sm:grid-cols-3">
                  <button
                    onClick={() => setTecnicoVista("agenda")}
                    className={
                      "group relative overflow-hidden rounded-2xl px-3 py-2.5 text-left transition-all " +
                      (tecnicoVista === "agenda"
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-400/30"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-md")
                    }
                  >
                    <div className="flex items-center justify-center justify-between gap-3">
                      <div className="flex items-center justify-center gap-2">
                        <span className={
                          "flex h-9 w-9 items-center justify-center justify-center rounded-xl " +
                          (tecnicoVista === "agenda" ? "bg-indigo-500/20 text-slate-300" : "bg-indigo-50 text-cyan-700")
                        }>
                          <CalendarDays size={18} />
                        </span>
                        <div>
                          <p className="text-sm font-black">Agenda</p>
                          <p className={tecnicoVista === "agenda" ? "text-[10px] font-bold text-slate-300" : "text-[10px] font-bold text-slate-500"}>
                            Hoy
                          </p>
                        </div>
                      </div>

                      <span className="text-2xl font-black">
                        {
                          ordenesActivasTecnico.filter((orden) => {
                            const hoy = todayDateKey();
                            return [
                              orden.fechaProgramada,
                              orden.fecha,
                              orden.fechaCreacion,
                            ].map(toDateKey).filter(Boolean).includes(hoy);
                          }).length +
                          citasTecnico.filter((cita) => {
                            const hoy = todayDateKey();
                            return [
                              cita.fecha,
                              cita.fechaProgramada,
                              cita.fechaCreacion,
                            ].map(toDateKey).filter(Boolean).includes(hoy) &&
                            cita.estado !== "Convertida en orden";
                          }).length
                        }
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setTecnicoVista("ordenes")}
                    className={
                      "group relative overflow-hidden rounded-2xl px-3 py-2.5 text-left transition-all " +
                      (tecnicoVista === "ordenes"
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-400/30"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-md")
                    }
                  >
                    <div className="flex items-center justify-center justify-between gap-3">
                      <div className="flex items-center justify-center gap-2">
                        <span className={
                          "flex h-9 w-9 items-center justify-center justify-center rounded-xl " +
                          (tecnicoVista === "ordenes" ? "bg-blue-500/20 text-blue-200" : "bg-blue-50 text-blue-700")
                        }>
                          <ClipboardList size={18} />
                        </span>
                        <div>
                          <p className="text-sm font-black">Órdenes</p>
                          <p className={tecnicoVista === "ordenes" ? "text-[10px] font-bold text-slate-300" : "text-[10px] font-bold text-slate-500"}>
                            Activas
                          </p>
                        </div>
                      </div>

                      <span className="text-2xl font-black">{ordenesActivasTecnico.length}</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setTecnicoVista("historial")}
                    className={
                      "group relative overflow-hidden rounded-2xl px-3 py-2.5 text-left transition-all " +
                      (tecnicoVista === "historial"
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-400/30"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-md")
                    }
                  >
                    <div className="flex items-center justify-center justify-between gap-3">
                      <div className="flex items-center justify-center gap-2">
                        <span className={
                          "flex h-9 w-9 items-center justify-center justify-center rounded-xl " +
                          (tecnicoVista === "historial" ? "bg-emerald-500/20 text-emerald-200" : "bg-emerald-50 text-emerald-700")
                        }>
                          <History size={18} />
                        </span>
                        <div>
                          <p className="text-sm font-black">Historial</p>
                          <p className={tecnicoVista === "historial" ? "text-[10px] font-bold text-slate-300" : "text-[10px] font-bold text-slate-500"}>
                            Cerradas
                          </p>
                        </div>
                      </div>

                      <span className="text-2xl font-black">{historialTecnico.length}</span>
                    </div>
                  </button>
                </div>
              </section>

              {tecnicoVista === "agenda" && (
                <TecnicoAssignedTodayPanel
                  ordenes={ordenesActivasTecnico}
                  citas={citasTecnico}
                  obtenerCliente={obtenerCliente}
                  ordenProps={ordenProps}
                  onAbrirOrden={(ordenId) => {
                    setOrdenAgendaAbiertaId(ordenId);
                    setTecnicoVista("ordenes");
                  }}
                />
              )}

              {tecnicoVista === "ordenes" && (
                <OrdenesGrid
                  ordenes={ordenesActivasTecnico}
                  obtenerCliente={obtenerCliente}
                  ordenProps={ordenProps}
                  ordenInicialAbiertaId={ordenAgendaAbiertaId}
                />
              )}

              {tecnicoVista === "historial" && (
                <TecnicoHistorialProfesional
                  ordenes={historialTecnico}
                  obtenerCliente={obtenerCliente}
                  ordenProps={ordenProps}
                />
              )}
            </>
          );
        })()}
      </main>
    </div>
  );
}

function TopInfo({ now }) {
  return (
    <div className="flex items-center justify-center gap-2 2xl:gap-6 bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-900 text-white px-3 2xl:px-6 py-2 2xl:py-4 rounded-xl 2xl:rounded-2xl shadow-lg shadow-indigo-200/40">
      <div className="flex items-center justify-center gap-1.5 2xl:gap-2">
        <CalendarDays className="w-3.5 h-3.5 2xl:w-5 2xl:h-5 text-slate-300" strokeWidth={2} />
        <span className="text-xs 2xl:text-base font-semibold">{now.toLocaleDateString()}</span>
      </div>
      <div className="flex items-center justify-center gap-1.5 2xl:gap-2">
        <Clock3 className="w-3.5 h-3.5 2xl:w-5 2xl:h-5 text-emerald-400" strokeWidth={2} />
        <span className="text-xs 2xl:text-base font-semibold">{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  );
}



function LoginScreen({ t, lang, setLang, loginForm, setLoginForm, iniciarSesion, mensaje }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 p-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,.18),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,.16),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,.12),transparent_40%),linear-gradient(135deg,#020617_0%,#0b1220_40%,#0f172a_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:54px_54px] opacity-40" />
      <div className="absolute left-[-8rem] top-24 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="absolute right-[-8rem] bottom-16 h-[28rem] w-[28rem] rounded-full bg-blue-500/15 blur-3xl" />

      <section className="relative w-full max-w-md overflow-hidden rounded-[2.75rem] border border-white/20 bg-white/[0.11] p-7 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-8">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="mb-8 text-center">
          <div className="mb-8 flex justify-center">
            <img
              src="/logo-hvac-premium.png"
              alt="HVAC Refrigeración Maldonado R"
              className="h-60 w-auto object-contain drop-shadow-[0_0_45px_rgba(34,211,238,.22)]"
            />
          </div>

          
<p className="text-[10px] font-black uppercase tracking-[0.42em] text-cyan-200">
  Premium HVAC Management Platform
</p>


          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Welcome Back
          </h1>

          <p className="mx-auto mt-2 max-w-[260px] text-xs font-semibold leading-relaxed text-white/45">
            Secure access for service orders, technicians, reports and field operations.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
              Username / Email
            </label>
            <div className="group flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 shadow-inner shadow-white/5 transition focus-within:border-cyan-300/70 focus-within:bg-white/[0.14] focus-within:shadow-[0_0_32px_rgba(34,211,238,.25)]">
              <User size={20} strokeWidth={2.6} className="shrink-0 text-cyan-200" />
              <input
                value={loginForm.usuario}
                onChange={(e) => setLoginForm({ ...loginForm, usuario: e.target.value })}
                placeholder={t("user")}
                className="login-glass-input w-full appearance-none rounded-xl border-0 bg-slate-950/45 px-3 py-2 text-base font-bold text-white placeholder:text-white/40 outline-none shadow-inner shadow-black/20 ring-0 focus:bg-slate-950/55 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
              Password
            </label>
            <div className="group flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 shadow-inner shadow-white/5 transition focus-within:border-orange-300/70 focus-within:bg-white/[0.14] focus-within:shadow-[0_0_32px_rgba(249,115,22,.22)]">
              <Lock size={20} strokeWidth={2.6} className="shrink-0 text-orange-200" />
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder={t("password")}
                className="login-glass-input w-full appearance-none rounded-xl border-0 bg-slate-950/45 px-3 py-2 text-base font-bold text-white placeholder:text-white/40 outline-none shadow-inner shadow-black/20 ring-0 focus:bg-slate-950/55 focus:outline-none focus:ring-0"
                onKeyDown={(e) => e.key === "Enter" && iniciarSesion()}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 font-semibold text-white/70">
              <input
                type="checkbox"
                className="h-5 w-5 rounded-md border border-white/25 bg-white/10 accent-cyan-400"
              />
              Remember me
            </label>

            <button
              type="button"
              className="font-black text-cyan-200 transition hover:text-white"
            >
              Forgot Password?
            </button>
          </div>

          <button
            onClick={iniciarSesion}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 px-5 py-4 font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:shadow-cyan-400/40"
          >
            <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition duration-700 group-hover:translate-x-[120%]" />
            <LogIn {...iconProps} />
            <span className="relative">{t("login")}</span>
          </button>
        </div>

        {mensaje && (
          <p className="mt-5 rounded-2xl border border-cyan-200/20 bg-cyan-300/10 p-4 text-sm font-bold text-cyan-100 backdrop-blur-md">
            {mensaje}
          </p>
        )}

        <div className="mt-8 border-t border-white/10 pt-5 text-center">
          <p className="text-[11px] font-bold text-white/45">
            Secure technician access · HVAC Refrigeración Maldonado R
          </p>
        </div>
      </section>
    </div>
  );
}


function StatsBar({ clientes, ordenes, inventario, herramientas }) {
  return (
    <div className="mb-3 grid grid-cols-5 gap-1.5 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
      <SoftStat icon={Users} titulo="Clientes" valor={clientes.length} accent="from-slate-950 via-slate-800 to-blue-900" />
      <SoftStat icon={ClipboardList} titulo="Órdenes" valor={ordenes.length} accent="from-zinc-950 via-slate-800 to-blue-800" />
      <SoftStat icon={CheckCircle2} titulo="Completadas" valor={ordenes.filter((o) => o.estado === "Completado").length} accent="from-emerald-950 via-green-800 to-teal-700" />
      <SoftStat icon={Package} titulo="Inventario" valor={inventario.length} accent="from-blue-950 via-sky-800 to-cyan-700" />
      <SoftStat icon={Wrench} titulo="Herramientas" valor={herramientas.length} accent="from-neutral-950 via-slate-900 to-blue-800" />
    </div>
  );
}

function SoftStat({ titulo, valor, icon: Icon, accent = "from-slate-950 to-blue-900" }) {
  return (
    <div className={`relative min-w-[118px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${accent} px-3 py-2.5 text-white shadow-md shadow-slate-900/20`}>
      <div className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-white/10 blur-xl" />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-400 to-transparent" />

      <div className="relative z-10 flex items-center justify-center justify-between gap-2">
        <div className="flex h-8 w-8 w-full items-center justify-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
          <Icon size={18} strokeWidth={2.4} />
        </div>

        <p className="text-3xl font-black leading-none tracking-tight text-white">
          {valor}
        </p>
      </div>

      <p className="relative z-10 mt-2 truncate text-[10px] font-black uppercase tracking-wide text-slate-700">
        {titulo}
      </p>
    </div>
  );
}


function getOrderDateKey(orden) {
  const raw = orden.fechaProgramada || orden.fecha || orden.fechaCreacion || "";
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(raw))) return String(raw);
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function todayDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function priorityWeight(value) {
  const map = { Urgente: 0, Alta: 1, Media: 2, Baja: 3 };
  return map[value] ?? 4;
}

function sortTechnicianOrders(a, b) {
  const dateA = getOrderDateKey(a) || "9999-99-99";
  const dateB = getOrderDateKey(b) || "9999-99-99";

  const dateCompare = String(dateA).localeCompare(String(dateB));
  if (dateCompare !== 0) return dateCompare;

  const normalizeTime = (value) => {
    const raw = String(value || "").trim();

    if (!raw) return "99:99";

    const ampm = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (ampm) {
      let hour = Number(ampm[1]);
      const minute = ampm[2];
      const suffix = ampm[3].toUpperCase();

      if (suffix === "PM" && hour !== 12) hour += 12;
      if (suffix === "AM" && hour === 12) hour = 0;

      return `${String(hour).padStart(2, "0")}:${minute}`;
    }

    const normal = raw.match(/^(\d{1,2}):(\d{2})/);
    if (normal) {
      return `${String(Number(normal[1])).padStart(2, "0")}:${normal[2]}`;
    }

    return "99:99";
  };

  const timeA = normalizeTime(a.horaProgramada || a.hora);
  const timeB = normalizeTime(b.horaProgramada || b.hora);

  const timeCompare = timeA.localeCompare(timeB);
  if (timeCompare !== 0) return timeCompare;

  const priorityCompare = priorityWeight(a.prioridad) - priorityWeight(b.prioridad);
  if (priorityCompare !== 0) return priorityCompare;

  return Number(a.id || 0) - Number(b.id || 0);
}

function groupTechnicianOrders(ordenes) {
  const today = todayDateKey();

  const groups = {
    atrasadas: [],
    hoy: [],
    proximas: [],
    sinFecha: [],
  };

  ordenes.forEach((orden) => {
    const key = getOrderDateKey(orden);

    if (!key) groups.sinFecha.push(orden);
    else if (key < today) groups.atrasadas.push(orden);
    else if (key === today) groups.hoy.push(orden);
    else groups.proximas.push(orden);
  });

  Object.keys(groups).forEach((key) => {
    groups[key] = groups[key].sort(sortTechnicianOrders);
  });

  return groups;
}

function TecnicoOrderGroup({ title, subtitle, icon: Icon, tone, ordenes, obtenerCliente, ordenProps }) {
  if (!ordenes.length) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/50">
      <div className={`flex flex-col gap-2 px-4 py-3 text-white sm:flex-row sm:items-center justify-center sm:justify-between ${tone}`}>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">{subtitle}</p>
          <h3 className="mt-1 flex items-center justify-center gap-2 text-lg font-black">
            <Icon size={19} />
            {title}
          </h3>
        </div>

        <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-black ring-1 ring-white/20">
          {ordenes.length} orden{ordenes.length === 1 ? "" : "es"}
        </span>
      </div>

      <div className="grid gap-3 p-3 md:grid-cols-2 xl:grid-cols-3">
        {ordenes.map((orden) => (
          <TecnicoCompactOrderCard
            key={orden.id}
            orden={orden}
            cliente={obtenerCliente(orden.clienteId)}
            ordenProps={ordenProps}
          />
        ))}
      </div>
    </section>
  );
}



function ReprogramCitaModal({ open, cita, cliente, onClose, onConfirm }) {
  const [fecha, setFecha] = useState(cita?.fecha || "");
  const [hora, setHora] = useState(cita?.hora || "");
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (open && cita) {
      setFecha(cita.fecha || "");
      setHora(cita.hora || "");
      setMotivo("");
    }
  }, [open, cita]);

  if (!open || !cita) return null;

  const confirmar = () => {
    if (!fecha || !hora || !motivo.trim()) {
      alert("Fecha, hora y motivo son obligatorios.");
      return;
    }

    onConfirm({ fecha, hora, motivo });
  };

  return (
    <div className="fixed inset-0 z-[980] flex items-center justify-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-white shadow-lg shadow-slate-950/50">
        <header className="flex items-center justify-center justify-between bg-gradient-to-br from-blue-950 via-cyan-800 to-teal-700 px-5 py-3 text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-100">Reprogramación</p>
            <h2 className="mt-1 flex items-center justify-center gap-2 text-lg font-black">
              <CalendarClock size={24} />
              Reprogramar cita
            </h2>
          </div>

          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <X size={20} />
          </button>
        </header>

        <main className="space-y-4 bg-[radial-gradient(circle_at_top_right,_#22d3ee33,_transparent_28%),linear-gradient(135deg,_#eff6ff_0%,_#ecfeff_55%,_#f8fafc_100%)] p-5">
          <div className="rounded-2xl border border-cyan-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-slate-950">{cliente?.nombre || "Cliente eliminado"}</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{cita.motivo || "Cita programada"}</p>
            <p className="mt-2 text-xs font-bold text-slate-500">
              Fecha actual: {cita.fecha || "Sin fecha"} · Hora actual: {cita.hora || "Sin hora"}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="block">
              <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">Nueva fecha</span>

              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("reprogramar-cita-fecha");
                  if (input?.showPicker) input.showPicker();
                  else input?.click();
                }}
                className="flex h-16 w-full items-center rounded-[1.35rem] border border-cyan-100 bg-white px-4 text-left shadow-md shadow-cyan-100/40"
              >
                <CalendarDays size={20} strokeWidth={2.6} className="mr-3 shrink-0 text-cyan-600" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Fecha</p>
                  <p className="text-base font-black text-slate-950">{fecha || "Seleccionar fecha"}</p>
                </div>
              </button>

              <input
                id="reprogramar-cita-fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="fixed left-[-100vw] top-[-100vh] h-1 w-1 opacity-0"
                tabIndex={-1}
              />
            </div>

            <div className="block">
              <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">Nueva hora</span>

              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("reprogramar-cita-hora");
                  if (input?.showPicker) input.showPicker();
                  else input?.click();
                }}
                className="flex h-16 w-full items-center rounded-[1.35rem] border border-cyan-100 bg-white px-4 text-left shadow-md shadow-cyan-100/40"
              >
                <Clock3 size={20} strokeWidth={2.6} className="mr-3 shrink-0 text-cyan-600" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Hora</p>
                  <p className="text-base font-black text-slate-950">{hora || "Seleccionar hora"}</p>
                </div>
              </button>

              <input
                id="reprogramar-cita-hora"
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="fixed left-[-100vw] top-[-100vh] h-1 w-1 opacity-0"
                tabIndex={-1}
              />
            </div>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">Motivo obligatorio</span>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej. Cliente pidió otro horario, técnico no disponible, clima, etc."
              className="min-h-28 w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3 text-xs font-bold text-blue-800">
            El sistema guardará la fecha/hora anterior y el motivo dentro del historial de reprogramaciones.
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button onClick={onClose} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700">
              Cancelar
            </button>
            <button onClick={confirmar} className="rounded-2xl bg-gradient-to-r from-indigo-700 to-slate-800 px-4 py-3 text-sm font-black text-white shadow-lg">
              Guardar reprogramación
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function getCancelTipoBySession(session) {
  if (session?.role === "tecnico") return "Cancelada por técnico";
  if (session?.role === "admin") return "Cancelada por empresa";
  return "Cancelada por cliente";
}

function CancelOrderModal({ open, orden, cliente, tecnico, onClose, onConfirm, session }) {
  const [motivo, setMotivo] = useState("");
  const [cancelTipoSeleccionado, setCancelTipoSeleccionado] = useState(getCancelTipoBySession(session));
  const [tipo, setTipo] = useState("Cliente ya no quiere servicio");

  if (!open || !orden) return null;

  const motivosCliente = [
    "Cliente ya no quiere servicio",
    "Cliente no respondió",
    "Cliente reprogramará",
    "Dirección incorrecta",
    "Precio no aprobado",
    "Orden duplicada",
    "Otro",
  ];

  const motivosEmpresa = [
    "Empresa no puede atender",
    "Falta de disponibilidad",
    "Error interno de programación",
    "Duplicada",
    "Servicio fuera de zona",
    "Otro",
  ];

  const motivosTecnico = [
    "Cliente no abrió",
    "Cliente no respondió",
    "No se pudo acceder",
    "Dirección incorrecta",
    "Condiciones inseguras",
    "Requiere reprogramación",
    "Otro",
  ];

  const motivos = cancelTipoSeleccionado === "Cancelada por técnico"
    ? motivosTecnico
    : cancelTipoSeleccionado === "Cancelada por empresa"
      ? motivosEmpresa
      : motivosCliente;

  const cambiarCancelTipo = (value) => {
    setCancelTipoSeleccionado(value);

    if (value === "Cancelada por cliente") {
      setTipo("Cliente ya no quiere servicio");
    } else if (value === "Cancelada por empresa") {
      setTipo("Empresa no puede atender");
    } else {
      setTipo("Cliente no abrió");
    }

    setMotivo("");
  };

  const confirmar = () => {
    const finalMotivo = tipo === "Otro" ? motivo : `${tipo}${motivo ? ` - ${motivo}` : ""}`;

    if (!finalMotivo.trim()) {
      alert("Escribe o selecciona un motivo de cancelación.");
      return;
    }

    onConfirm({
      motivo: finalMotivo,
      tipo: cancelTipoSeleccionado,
      canceladoPor: session?.role || "usuario",
      canceladoPorNombre: session?.nombre || session?.usuario || "Usuario",
    });

    setMotivo("");
    setCancelTipoSeleccionado(getCancelTipoBySession(session));
    setTipo("Cliente ya no quiere servicio");
  };

  return (
    <div className="fixed inset-0 z-[980] flex items-center justify-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-white shadow-lg shadow-slate-950/50">
        <header className="flex items-center justify-center justify-between bg-gradient-to-br from-rose-950 via-red-800 to-orange-700 px-5 py-3 text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-100">Cancelación formal</p>
            <h2 className="mt-1 flex items-center justify-center gap-2 text-lg font-black">
              <MessageSquareWarning size={24} />
              Cancelar orden
            </h2>
          </div>

          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <X size={20} />
          </button>
        </header>

        <main className="space-y-4 bg-[radial-gradient(circle_at_top_right,_#fb718533,_transparent_28%),linear-gradient(135deg,_#fff7ed_0%,_#fff1f2_55%,_#f8fafc_100%)] p-5">
          <div className="rounded-2xl border border-rose-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-slate-950">{cliente?.nombre || "Cliente eliminado"}</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{orden.problema || "Sin problema reportado"}</p>
            <p className="mt-2 text-xs font-bold text-slate-500">
              Técnico: {tecnico?.nombre || "Sin técnico"} · Orden #{orden.id}
            </p>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">
              ¿Quién originó la cancelación?
            </span>
            <select
              value={cancelTipoSeleccionado}
              onChange={(e) => cambiarCancelTipo(e.target.value)}
              className="w-full rounded-2xl border border-rose-300 bg-white p-3 text-sm font-black text-rose-900 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
            >
              <option value="Cancelada por cliente">Cancelada por cliente</option>
              <option value="Cancelada por empresa">Cancelada por empresa</option>
              <option value="Cancelada por técnico">Cancelada por técnico</option>
            </select>
          </label>

          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3">
            <p className="text-[10px] font-black uppercase tracking-wide text-rose-600">Tipo que se guardará en reportes</p>
            <p className="mt-1 text-sm font-black text-rose-950">{cancelTipoSeleccionado}</p>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">Motivo principal</span>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm font-bold outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
            >
              {motivos.map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">Nota adicional</span>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder={tipo === "Otro" ? "Escribe el motivo..." : "Opcional: agrega detalles de la cancelación"}
              className="min-h-28 w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
            />
          </label>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-800">
            Esta orden no será eliminada. Pasará a Historial completo como Cancelada con fecha, motivo, tipo y responsable.
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button onClick={onClose} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700">
              Volver
            </button>
            <button onClick={confirmar} className="rounded-2xl bg-gradient-to-r from-rose-700 to-red-700 px-4 py-3 text-sm font-black text-white shadow-lg">
              Confirmar cancelación
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function getCitaDateKey(cita) {
  return getOrderDateKey({ fechaProgramada: cita.fecha, fecha: cita.fecha, fechaCreacion: cita.fechaCreacion });
}

function formatTechTime(value) {
  if (!value) return "Sin hora";
  const match = String(value).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;
  let hour = Number(match[1]);
  const minute = match[2];
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute} ${suffix}`;
}

function groupTechnicianCitas(citas = []) {
  const today = todayDateKey();

  const groups = {
    hoy: [],
    proximas: [],
    atrasadas: [],
    sinFecha: [],
  };

  citas.filter((cita) => cita.estado !== "Convertida en orden").forEach((cita) => {
    const key = getCitaDateKey(cita);

    if (!key) groups.sinFecha.push(cita);
    else if (key < today) groups.atrasadas.push(cita);
    else if (key === today) groups.hoy.push(cita);
    else groups.proximas.push(cita);
  });

  Object.keys(groups).forEach((key) => {
    groups[key] = groups[key].sort((a, b) => `${getCitaDateKey(a)} ${a.hora || "99:99"}`.localeCompare(`${getCitaDateKey(b)} ${b.hora || "99:99"}`));
  });

  return groups;
}

function TecnicoCitaGroup({ title, subtitle, icon: Icon, tone, citas, obtenerCliente, ordenProps }) {
  if (!citas.length) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/50">
      <div className={`flex flex-col gap-2 px-4 py-3 text-white sm:flex-row sm:items-center justify-center sm:justify-between ${tone}`}>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">{subtitle}</p>
          <h3 className="mt-1 flex items-center justify-center gap-2 text-lg font-black">
            <Icon size={19} />
            {title}
          </h3>
        </div>

        <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-black ring-1 ring-white/20">
          {citas.length} cita{citas.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid gap-3 p-3 md:grid-cols-2 xl:grid-cols-3">
        {citas.map((cita) => (
          <TecnicoCompactCitaCard
            key={cita.id}
            cita={cita}
            cliente={obtenerCliente(cita.clienteId)}
            ordenProps={ordenProps}
          />
        ))}
      </div>
    </section>
  );
}



function TecnicoAssignedTodayPanel({ ordenes = [], citas = [], obtenerCliente, ordenProps, onAbrirOrden }) {
  const hoy = todayDateKey();

  const getKey = (item) =>
    [
      item.fechaProgramada,
      item.fecha,
      item.fechaCreacion,
    ].map(toDateKey).filter(Boolean)[0] || "";

  const normalizarHora = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "99:99";

    const ampm = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (ampm) {
      let hour = Number(ampm[1]);
      const minute = ampm[2];
      const suffix = ampm[3].toUpperCase();

      if (suffix === "PM" && hour !== 12) hour += 12;
      if (suffix === "AM" && hour === 12) hour = 0;

      return `${String(hour).padStart(2, "0")}:${minute}`;
    }

    const normal = raw.match(/^(\d{1,2}):(\d{2})/);
    if (normal) return `${String(Number(normal[1])).padStart(2, "0")}:${normal[2]}`;

    return "99:99";
  };

  const ordenarPorHora = (a, b) => {
    const horaCompare = normalizarHora(a.horaProgramada || a.hora).localeCompare(
      normalizarHora(b.horaProgramada || b.hora)
    );

    if (horaCompare !== 0) return horaCompare;

    return priorityWeight(a.prioridad) - priorityWeight(b.prioridad);
  };

  const ordenesHoy = ordenes
    .filter((orden) => getKey(orden) === hoy)
    .sort(ordenarPorHora);

  const ordenesVencidas = ordenes
    .filter((orden) => {
      const key = getKey(orden);
      return key && key < hoy;
    })
    .sort((a, b) => {
      const fechaCompare = getKey(a).localeCompare(getKey(b));
      if (fechaCompare !== 0) return fechaCompare;
      return ordenarPorHora(a, b);
    });

  const AgendaOrderCard = ({ orden, vencida = false }) => {
    const cliente = obtenerCliente(orden.clienteId);
    const direccion = cliente?.direccion || "";
    const telefono = cliente?.telefono || "";
    const hora = formatTechTime(orden.horaProgramada || orden.hora || "");
    const fecha = getKey(orden);

    return (
      <button
        type="button"
        onClick={() => onAbrirOrden?.(orden.id)}
        className={
          "grid w-full gap-3 rounded-[1.75rem] border p-4 text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-xl sm:grid-cols-[120px_minmax(0,1fr)] " +
          (vencida
            ? "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-amber-100/70 hover:border-amber-300"
            : "border-slate-200 bg-gradient-to-br from-white via-blue-50/40 to-cyan-50/40 shadow-slate-200/70 hover:border-cyan-300")
        }
      >
        <div
          className={
            "relative overflow-hidden rounded-3xl px-4 py-5 text-white shadow-xl ring-1 " +
            (vencida
              ? "bg-gradient-to-br from-amber-700 via-orange-700 to-red-700 shadow-orange-900/20 ring-orange-300/20"
              : "bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 shadow-cyan-900/20 ring-cyan-300/20")
          }
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
          <div className="relative text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.28em] text-white/65">
              {vencida ? "Vencida" : "Hora"}
            </p>
            <p className="mt-1 text-[2.15rem] font-black leading-none tracking-[-0.06em] tabular-nums">
              {hora}
            </p>
            {vencida && (
              <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-white/75">
                {fecha ? formatReportDate(fecha) : "Sin fecha"}
              </p>
            )}
          </div>
        </div>

        <div className="pointer-events-none relative z-10 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="pointer-events-none relative z-10 min-w-0">
              <h3 className="truncate text-2xl font-black text-slate-950">
                {cliente?.nombre || "Cliente eliminado"}
              </h3>

              <p className="mt-2 line-clamp-2 text-base font-black leading-snug text-slate-800">
                {orden.problema || "Sin problema reportado"}
              </p>
            </div>

            <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black ${ordenProps?.colorPrioridad?.(orden.prioridad) || "bg-blue-50 text-blue-700 border-blue-200"}`}>
              {orden.prioridad || "Media"}
            </span>
          </div>

          <p className="mt-3 line-clamp-1 text-sm font-bold text-slate-600">
            📍 {direccion || "Sin dirección"}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {telefono && (
              <a
                href={ordenProps?.urlTelefono?.(telefono)}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex h-12 min-w-[116px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 text-sm font-black text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5"
                title="Llamar al cliente"
              >
                <Phone size={17} strokeWidth={2.7} />
                Llamar
              </a>
            )}

            {telefono && (
              <a
                href={`sms:${telefono}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex h-12 min-w-[116px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5"
                title="Enviar mensaje"
              >
                <MessageCircle size={17} strokeWidth={2.7} />
                Mensaje
              </a>
            )}

            {direccion && (
              <a
                href={ordenProps?.urlAppleMaps?.(direccion)}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex h-12 min-w-[126px] items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5"
                title="Abrir dirección"
              >
                <Navigation size={17} strokeWidth={2.7} />
                Dirección
              </a>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-300/50">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-600">
              Agenda
            </p>
            <h2 className="text-2xl font-black text-slate-950">
              Órdenes de hoy
            </h2>
          </div>

          <span className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white">
            {ordenesHoy.length}
          </span>
        </div>

        {ordenesHoy.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-lg font-black text-slate-950">No tienes órdenes para hoy.</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Las órdenes asignadas aparecerán aquí ordenadas por hora.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {ordenesHoy.map((orden) => (
              <AgendaOrderCard key={orden.id} orden={orden} />
            ))}
          </div>
        )}
      </div>

      {ordenesVencidas.length > 0 && (
        <div className="rounded-3xl border border-amber-200 bg-white p-4 shadow-lg shadow-amber-100/60">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-600">
                Pendientes anteriores
              </p>
              <h2 className="text-2xl font-black text-slate-950">
                Órdenes vencidas
              </h2>
            </div>

            <span className="rounded-2xl bg-amber-600 px-4 py-2 text-sm font-black text-white">
              {ordenesVencidas.length}
            </span>
          </div>

          <div className="space-y-3">
            {ordenesVencidas.map((orden) => (
              <AgendaOrderCard key={orden.id} orden={orden} vencida />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function TecnicoOrdenesPanel({ ordenes, citas = [], obtenerCliente, ordenProps }) {
  const [vista, setVista] = useState("agenda");
  const grupos = groupTechnicianOrders(ordenes);
  const citasGrupos = groupTechnicianCitas(citas);

  const totalNoAtendidas = grupos.atrasadas.length;
  const totalHoy = grupos.hoy.length;
  const totalCitasHoy = citasGrupos.hoy.length;
  const totalCitas = citas.length;
  const totalProximas = grupos.proximas.length + citasGrupos.proximas.length;

  return (
    <section className="mb-6 space-y-4">
      <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-md shadow-slate-300/60 backdrop-blur">
        <div className="bg-slate-950 px-5 py-3 text-white">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center justify-center xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-300">Agenda del técnico</p>
              <h2 className="mt-1 flex items-center justify-center gap-2 text-lg font-black">
                <ClipboardList size={24} />
                Trabajo asignado
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Separado por órdenes no atendidas, trabajo de hoy, citas programadas y próximas visitas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-2xl bg-white/10 px-3 py-2 text-center ring-1 ring-white/20">
                <p className="text-lg font-black">{totalNoAtendidas}</p>
                <p className="text-[9px] font-black uppercase tracking-wide text-rose-200">No atendidas</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2 text-center ring-1 ring-white/20">
                <p className="text-lg font-black">{totalHoy}</p>
                <p className="text-[9px] font-black uppercase tracking-wide text-slate-300">Órdenes hoy</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2 text-center ring-1 ring-white/20">
                <p className="text-lg font-black">{totalCitasHoy}</p>
                <p className="text-[9px] font-black uppercase tracking-wide text-slate-300">Citas hoy</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2 text-center ring-1 ring-white/20">
                <p className="text-lg font-black">{totalProximas}</p>
                <p className="text-[9px] font-black uppercase tracking-wide text-blue-200">Próximas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center justify-between gap-3 bg-white p-3">
          <div className="text-sm font-semibold text-slate-500">
            Activas: <span className="font-black text-slate-950">{ordenes.length}</span>
            <span className="mx-2 text-slate-300">·</span>
            Citas: <span className="font-black text-slate-950">{totalCitas}</span>
          </div>

          <div className="flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setVista("agenda")}
              className={`rounded-xl px-3 py-2 text-xs font-black transition ${vista === "agenda" ? "bg-slate-950 text-white shadow" : "text-slate-600 hover:bg-white"}`}
            >
              Agenda clara
            </button>
            <button
              onClick={() => setVista("todas")}
              className={`rounded-xl px-3 py-2 text-xs font-black transition ${vista === "todas" ? "bg-slate-950 text-white shadow" : "text-slate-600 hover:bg-white"}`}
            >
              Todas las órdenes
            </button>
          </div>
        </div>
      </div>

      <TecnicoAssignedTodayPanel
        ordenes={ordenes}
        citas={citas}
        obtenerCliente={obtenerCliente}
        ordenProps={ordenProps}
      />

      {ordenes.length === 0 && citas.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-8 text-center text-sm font-semibold text-slate-500 shadow-md shadow-slate-300/50">
          No tienes órdenes ni citas activas asignadas.
        </div>
      )}

      {vista === "todas" ? (
        <OrdenesGrid ordenes={[...ordenes].sort(sortTechnicianOrders)} obtenerCliente={obtenerCliente} ordenProps={ordenProps} />
      ) : (
        <>
          <TecnicoOrderGroup
            title="No atendidas / visita pendiente"
            subtitle="Órdenes anteriores que siguen activas"
            icon={AlertTriangle}
            tone="bg-gradient-to-r from-rose-900 via-red-800 to-orange-700"
            ordenes={grupos.atrasadas}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />

          <TecnicoOrderGroup
            title="Órdenes para hoy"
            subtitle="Trabajo principal del día"
            icon={CalendarDays}
            tone="bg-gradient-to-r from-blue-900 via-cyan-800 to-teal-700"
            ordenes={grupos.hoy}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />

          <TecnicoCitaGroup
            title="Citas programadas para hoy"
            subtitle="Agenda de citas separada de órdenes"
            icon={CalendarDays}
            tone="bg-gradient-to-r from-cyan-900 via-sky-800 to-blue-700"
            citas={citasGrupos.hoy}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />

          <TecnicoCitaGroup
            title="Citas atrasadas"
            subtitle="Citas anteriores que requieren seguimiento"
            icon={AlertTriangle}
            tone="bg-gradient-to-r from-amber-900 via-orange-800 to-red-700"
            citas={citasGrupos.atrasadas}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />

          <TecnicoOrderGroup
            title="Próximas órdenes"
            subtitle="Trabajo programado para después"
            icon={Clock3}
            tone="bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-900"
            ordenes={grupos.proximas}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />

          <TecnicoCitaGroup
            title="Próximas citas"
            subtitle="Citas futuras"
            icon={Clock3}
            tone="bg-gradient-to-r from-indigo-950 via-blue-900 to-cyan-700"
            citas={citasGrupos.proximas}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />

          <TecnicoOrderGroup
            title="Órdenes sin fecha"
            subtitle="Requieren revisión administrativa"
            icon={ClipboardList}
            tone="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600"
            ordenes={grupos.sinFecha}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />

          <TecnicoCitaGroup
            title="Citas sin fecha"
            subtitle="Requieren revisión administrativa"
            icon={ClipboardList}
            tone="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500"
            citas={citasGrupos.sinFecha}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />
        </>
      )}
    </section>
  );
}

function OrdenesGrid({ ordenes, obtenerCliente, ordenProps, ordenInicialAbiertaId = null }) {
  const ordenesOrdenadas = [...ordenes].sort((a, b) => {
    if (ordenInicialAbiertaId && String(a.id) === String(ordenInicialAbiertaId)) return -1;
    if (ordenInicialAbiertaId && String(b.id) === String(ordenInicialAbiertaId)) return 1;

    const aKey = `${toDateKey(a.fechaProgramada || a.fecha || a.fechaCreacion) || "9999-99-99"} ${a.horaProgramada || "99:99"}`;
    const bKey = `${toDateKey(b.fechaProgramada || b.fecha || b.fechaCreacion) || "9999-99-99"} ${b.horaProgramada || "99:99"}`;
    return aKey.localeCompare(bKey);
  });

  const ordenAbierta = ordenInicialAbiertaId
    ? ordenesOrdenadas.find((orden) => String(orden.id) === String(ordenInicialAbiertaId))
    : null;

  return (
    <div className="grid w-full min-w-0 gap-4">
      {ordenAbierta && (
        <div className="overflow-hidden rounded-3xl border border-cyan-200 bg-white shadow-xl shadow-cyan-100/70">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-800 p-5 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
              Orden seleccionada desde Agenda
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Trabajar orden
            </h2>
            <p className="mt-1 text-sm font-bold text-white/60">
              Esta orden fue abierta desde la agenda por hora. Ya está lista para trabajar.
            </p>
          </div>
        </div>
      )}

      {ordenesOrdenadas.length === 0 && (
        <p className="rounded-2xl bg-white/90 p-4 text-sm font-semibold text-slate-500 shadow-sm">
          No hay órdenes activas.
        </p>
      )}

      {ordenesOrdenadas.map((o) => (
        <OrdenCard
          key={o.id}
          orden={o}
          cliente={obtenerCliente(o.clienteId)}
          compacta={false}
          abrirDetallesInicial={String(o.id) === String(ordenInicialAbiertaId)}
          {...ordenProps}
        />
      ))}
    </div>
  );
}




function abrirTraductorTexto(texto, destino = "en") {
  const limpio = String(texto || "").trim();

  if (!limpio) {
    alert("No hay texto para traducir.");
    return;
  }

  const url = `https://translate.google.com/?sl=auto&tl=${destino}&text=${encodeURIComponent(limpio)}&op=translate`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function OrdenCard({ orden, cliente, inventario, obtenerMaterial, obtenerTecnico, colorEstado, colorPrioridad, marcarEnRuta, marcarLlegada, iniciarTrabajo, marcarNecesitaSeguimiento, completarOrden, cancelarOrden, subirFoto, guardarNotaTecnico, urlGoogleMaps, urlAppleMaps, urlTelefono, compacta = false, agregarMaterialAOrden, actualizarMaterialOrden, eliminarMaterialOrden, calcularCostoOrden, materialesTexto, compartirOrden, t, abrirDetallesInicial = false }) {
  const [verDetalles, setVerDetalles] = useState(abrirDetallesInicial);

  useEffect(() => {
    if (abrirDetallesInicial) setVerDetalles(true);
  }, [abrirDetallesInicial]);

  const direccion = cliente?.direccion || "";
  const telefono = cliente?.telefono || "";
  const tecnico = obtenerTecnico(orden.tecnicoId);
  const hora = orden.horaProgramada || orden.hora || "";
  const horaTexto = hora ? formatTechTime(hora) : "Sin hora";
  const fechaTexto = orden.fechaProgramada || orden.fecha || orden.fechaCreacion || "";

  const tarjetaEstadoClase =
    orden.estado === "Necesita seguimiento"
      ? "bg-amber-50 border-amber-300"
      : orden.estado === "En proceso" || orden.estado === "En sitio"
        ? "bg-emerald-50 border-emerald-300"
        : orden.estado === "Esperando material"
          ? "bg-orange-50 border-orange-300"
          : orden.estado === "Reprogramada"
            ? "bg-violet-50 border-violet-300"
            : orden.estado === "En ruta"
              ? "bg-indigo-50 border-indigo-300"
              : "bg-blue-50 border-blue-200";

  if (compacta) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <p className="font-black text-slate-950">{cliente?.nombre || "Cliente eliminado"}</p>
        <p className="text-xs font-semibold text-slate-600">{orden.problema}</p>
      </div>
    );
  }

  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-300/70 transition hover:-translate-y-0.5 hover:shadow-2xl">
      <div className="h-2 bg-gradient-to-r from-blue-700 via-cyan-500 to-emerald-400" />

      <div className="p-4">
        <div className={`overflow-hidden rounded-[1.75rem] border ${tarjetaEstadoClase}`}>
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 p-5 text-white">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="inline-flex w-fit items-center gap-3 rounded-2xl bg-white/12 px-4 py-3 text-white ring-1 ring-white/15 shadow-lg">
                  <Clock3 size={22} strokeWidth={2.6} />
                  <span className="text-3xl font-black tracking-tight">{horaTexto}</span>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <span className={`rounded-full border px-3 py-1.5 text-xs font-black ${colorEstado(orden.estado)}`}>
                    {orden.estado}
                  </span>

                  <span className={`rounded-full border px-3 py-1.5 text-xs font-black ${colorPrioridad(orden.prioridad)}`}>
                    {orden.prioridad}
                  </span>

                  <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-slate-700 ring-1 ring-white/40">
                    #{orden.id}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="truncate text-4xl font-black tracking-tight text-white">
                  {cliente?.nombre || "Cliente eliminado"}
                </h3>

                <div className="mt-3 rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <p className="line-clamp-2 text-xl font-black leading-snug text-white">
                      {orden.problema || "Sin problema reportado"}
                    </p>

                    <button
                      type="button"
                      onClick={() => abrirTraductorTexto(orden.problema)}
                      className="inline-flex w-fit shrink-0 items-center gap-2 rounded-2xl bg-white/15 px-3 py-2 text-xs font-black text-cyan-100 ring-1 ring-white/15 transition hover:bg-white/20"
                    >
                      <Languages size={16} />
                      Traducir
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1.3fr_.7fr]">
                <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
                  <p className="flex items-center gap-2 text-lg font-black text-cyan-50">
                    <MapPin size={20} />
                    {direccion || "Sin dirección"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
                  <p className="flex items-center gap-2 text-sm font-black text-cyan-50">
                    <User size={17} />
                    {tecnico?.nombre || "Sin técnico"}
                    <span className="mx-1 text-white/30">·</span>
                    <Calendar size={17} />
                    {fechaTexto ? formatReportDate(fechaTexto) : "Sin fecha"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                {telefono && (
                  <a href={urlTelefono(telefono)} className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-base font-black text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5">
                    <Phone size={20} />
                    Llamar
                  </a>
                )}

                {direccion && (
                  <a href={urlAppleMaps(direccion)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-base font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5">
                    <Navigation size={20} />
                    Ruta
                  </a>
                )}

                <button onClick={() => setVerDetalles(!verDetalles)} className="flex min-w-[220px] flex-1 items-center justify-center gap-3 rounded-[1.35rem] bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 text-lg font-black text-white shadow-xl shadow-cyan-900/25 transition hover:-translate-y-0.5">
                  <ClipboardCheck size={24} strokeWidth={2.7} />
                  {verDetalles ? "Ocultar trabajo" : "Ver trabajo"}
                </button>
              </div>
            </div>
          </div>

          {orden.estado === "Necesita seguimiento" && orden.seguimientoMotivo && (
            <div className="m-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900 shadow-sm">
              Seguimiento: {orden.seguimientoMotivo}
            </div>
          )}

          {verDetalles && (
            <div className="m-4 space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-inner shadow-slate-100">
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 xl:grid-cols-6">
                <Info icon={ShieldAlert} titulo="Prioridad" valor={orden.prioridad} extra={colorPrioridad(orden.prioridad)} />
                <Info icon={Calendar} titulo="Fecha" valor={orden.fecha} />
                <Info icon={PlayCircle} titulo="Inicio" valor={orden.horaInicio ? new Date(orden.horaInicio).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }) : "Sin iniciar"} />
                <Info icon={CheckCircle2} titulo="Cierre" valor={orden.horaCierre ? new Date(orden.horaCierre).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }) : "Sin cerrar"} />
                <Info icon={Gauge} titulo="Trabajo" valor={`${orden.duracionHoras || "0.00"} h`} />
                <Info icon={Route} titulo="Traslado" valor={`${orden.duracionTraslado || "0.00"} h`} />
              </div>

              <Materiales orden={orden} inventario={inventario} agregarMaterialAOrden={agregarMaterialAOrden} actualizarMaterialOrden={actualizarMaterialOrden} eliminarMaterialOrden={eliminarMaterialOrden} />

              <div className="rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 shadow-sm">
                <p className="mb-3 flex items-center gap-2 text-base font-black text-slate-950">
                  <Images {...iconProps} />
                  {t("photos")}
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  <FotoUploader titulo="Antes" imagen={orden.fotos?.antes} onChange={(archivo) => subirFoto(orden.id, "antes", archivo)} />
                  <FotoUploader titulo="Durante" imagen={orden.fotos?.durante} onChange={(archivo) => subirFoto(orden.id, "durante", archivo)} />
                  <FotoUploader titulo="Después" imagen={orden.fotos?.despues} onChange={(archivo) => subirFoto(orden.id, "despues", archivo)} />
                </div>
              </div>

              <label className="flex items-center gap-2 text-base font-black text-slate-950">
                <ClipboardCheck {...iconProps} />
                {t("notes")}
              </label>

              <textarea
                value={orden.notasTecnico || ""}
                onChange={(e) => guardarNotaTecnico(orden.id, e.target.value)}
                placeholder="Detalles del trabajo realizado..."
                className="min-h-24 w-full rounded-2xl border border-cyan-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-3 text-sm font-semibold outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />

              <div className="flex flex-wrap gap-3 rounded-[1.75rem] border border-slate-100 bg-slate-50 p-5 shadow-inner">
                {orden.estado === "Asignada" && (
                  <button onClick={() => marcarEnRuta(orden.id)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5">
                    <Navigation {...iconProps} />
                    Salir al cliente
                  </button>
                )}

                {orden.estado === "En ruta" && (
                  <button onClick={() => marcarLlegada(orden.id)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5">
                    <MapPin {...iconProps} />
                    Llegué al sitio
                  </button>
                )}

                {(orden.estado === "En sitio" || orden.estado === "Necesita seguimiento") && (
                  <button onClick={() => iniciarTrabajo(orden.id)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5">
                    <Wrench {...iconProps} />
                    Comenzar trabajo
                  </button>
                )}

                {orden.estado === "En proceso" && (
                  <>
                    <button onClick={() => completarOrden(orden.id)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5">
                      <CheckCircle2 {...iconProps} />
                      Finalizar trabajo
                    </button>

                    <button onClick={() => marcarNecesitaSeguimiento(orden.id)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-amber-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-amber-200 transition hover:-translate-y-0.5">
                      <AlertTriangle {...iconProps} />
                      Requiere seguimiento
                    </button>
                  </>
                )}

                {orden.estado !== "Completado" && orden.estado !== "Cancelada" && (
                  <button onClick={() => cancelarOrden(orden)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5">
                    <Ban {...iconProps} />
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function Info({ titulo, valor, extra = "bg-white", icon: Icon = FileText }) {
  return (
    <div className={`group rounded-2xl border border-cyan-100 bg-white/90 p-3 shadow-md shadow-cyan-100/50 ring-1 ring-white transition hover:-translate-y-0.5 hover:shadow-lg ${extra}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-200">
          <Icon size={20} strokeWidth={2.4} />
        </div>

        <div className="pointer-events-none relative z-10 min-w-0">
          <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            {titulo}
          </p>

          <p className="mt-1 truncate text-xl font-black tracking-tight text-slate-950">
            {valor}
          </p>
        </div>
      </div>
    </div>
  );
}

function Materiales({ orden, inventario, agregarMaterialAOrden, actualizarMaterialOrden, eliminarMaterialOrden }) {
  return (
    <div className="mb-2 rounded-[1.75rem] border border-cyan-200 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-5 shadow-lg shadow-purple-100/60">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xl font-black text-slate-950">
          <Boxes {...iconProps} />
          Material usado
        </p>

        <button
          onClick={() => agregarMaterialAOrden(orden.id)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5"
        >
          <Plus {...iconProps} />
          Agregar material
        </button>
      </div>

      {(orden.materialesUsados || []).length === 0 && (
        <p className="rounded-2xl border border-dashed border-purple-200 bg-white/80 p-4 text-sm font-bold text-slate-500">
          No se ha agregado material.
        </p>
      )}

      <div className="space-y-3">
        {(orden.materialesUsados || []).map((m) => (
          <div
            key={m.id}
            className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-cyan-100 bg-white/90 p-3 shadow-md shadow-cyan-100/50 sm:grid-cols-[minmax(0,1fr)_110px_auto]"
          >
            <select
              value={m.inventarioId}
              onChange={(e) => actualizarMaterialOrden(orden.id, m.id, "inventarioId", e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="">Seleccionar material</option>
              {inventario.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nombre} ({i.cantidad} {i.unidad})
                </option>
              ))}
            </select>

            <input
              type="number"
              value={m.cantidad}
              onChange={(e) => actualizarMaterialOrden(orden.id, m.id, "cantidad", e.target.value)}
              placeholder="Cantidad"
              className="rounded-2xl border border-slate-200 bg-white p-3 text-sm font-bold outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />

            <button
              onClick={() => eliminarMaterialOrden(orden.id, m.id)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-red-50 px-4 py-3 text-sm font-black text-red-600"
            >
              <Trash2 {...iconProps} />
              Quitar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FotoUploader({ titulo, imagen, onChange }) {
  return (
    <div className="rounded-[1.5rem] border border-cyan-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 text-sm shadow-lg shadow-cyan-100/60">
      <p className="mb-3 text-base font-black text-slate-950">{titulo}</p>

      {imagen ? (
        <img
          src={imagen}
          alt={titulo}
          className="mb-3 h-32 w-full rounded-2xl border border-blue-100 object-cover shadow-sm"
        />
      ) : (
        <div className="mb-3 flex h-32 w-full items-center justify-center rounded-2xl border-2 border-dashed border-cyan-300 bg-gradient-to-br from-cyan-50 to-blue-100 text-sm font-black text-cyan-700">
          Sin foto
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files[0])}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-600"
      />
    </div>
  );
}


function DashboardUnificadoPage({
  t,
  clientes,
  ordenes,
  inventario,
  herramientas,
  tecnicos,
  obtenerCliente,
  obtenerTecnico,
  exportarCSV,
}) {
  const [tab, setTab] = useState("general");

  const completadas = ordenes.filter((o) => o.estado === "Completado").length;
  const canceladas = ordenes.filter((o) => o.estado === "Cancelada").length;
  const activas = ordenes.filter((o) => !["Completado", "Cancelada"].includes(o.estado)).length;

  const tabs = [
    { id: "general", label: "General", count: activas },
    { id: "clientes", label: "Clientes", count: clientes.length },
    { id: "inventario", label: "Inventario", count: inventario.length },
    { id: "tecnicos", label: "Técnicos", count: tecnicos.length },
  ];

  return (
    <section className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/50">
        <div className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-white px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-600">
            Centro de reportes
          </p>

          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Dashboard
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-blue-900/60">
                Reportes generales, clientes e inventario.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 text-[11px] font-black">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 ring-1 ring-blue-100">
                Activas {activas}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-100">
                Completadas {completadas}
              </span>
              <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700 ring-1 ring-rose-100">
                Canceladas {canceladas}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-2 bg-blue-50/60 p-2 sm:grid-cols-4">
          {tabs.map((item) => {
            const active = tab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={
                  "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-black transition " +
                  (active
                    ? "bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md shadow-blue-200"
                    : "bg-white text-slate-700 ring-1 ring-blue-100 hover:bg-blue-50")
                }
              >
                <span>{item.label}</span>
                <span className={active ? "text-white/80" : "text-blue-400"}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {tab === "general" && (
        <ReportesDashboardPage
          t={t}
          clientes={clientes}
          ordenes={ordenes}
          inventario={inventario}
          herramientas={herramientas}
          tecnicos={tecnicos}
          obtenerCliente={obtenerCliente}
          obtenerTecnico={obtenerTecnico}
          exportarCSV={exportarCSV}
        />
      )}

      {tab === "clientes" && (
        <ReportesClientesPage
          t={t}
          clientes={clientes}
          ordenes={ordenes}
          obtenerCliente={obtenerCliente}
          exportarCSV={exportarCSV}
        />
      )}

      {tab === "inventario" && (
        <ReportesInventarioPage
          t={t}
          inventario={inventario}
          herramientas={herramientas}
          obtenerTecnico={obtenerTecnico}
          exportarCSV={exportarCSV}
        />
      )}

      {tab === "tecnicos" && (
        <ReportePagoTecnicos
          tecnicos={tecnicos}
          ordenes={ordenes}
        />
      )}
    </section>
  );
}



function ReportePagoTecnicos({ tecnicos = [], ordenes = [] }) {
  const [periodo, setPeriodo] = useState("mes");

  const getFechaOrden = (orden) =>
    orden.fechaCompletada ||
    orden.horaCierre ||
    orden.fechaCreacion ||
    orden.fecha ||
    "";

  const estaEnPeriodo = (orden) => {
    if (periodo === "todo") return true;

    const raw = getFechaOrden(orden);
    const fecha = new Date(raw);
    if (Number.isNaN(fecha.getTime())) return false;

    const ahora = new Date();

    const mismoDia =
      fecha.getFullYear() === ahora.getFullYear() &&
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getDate() === ahora.getDate();

    const inicioSemana = new Date(ahora);
    inicioSemana.setDate(ahora.getDate() - ahora.getDay());
    inicioSemana.setHours(0, 0, 0, 0);

    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 7);

    const mismaSemana = fecha >= inicioSemana && fecha < finSemana;

    const mismoMes =
      fecha.getFullYear() === ahora.getFullYear() &&
      fecha.getMonth() === ahora.getMonth();

    const mismoAno = fecha.getFullYear() === ahora.getFullYear();

    if (periodo === "hoy") return mismoDia;
    if (periodo === "semana") return mismaSemana;
    if (periodo === "mes") return mismoMes;
    if (periodo === "ano") return mismoAno;

    return true;
  };

  const ordenesCerradasPeriodo = ordenes.filter(
    (orden) => orden.estado === "Completado" && estaEnPeriodo(orden)
  );

  const filas = tecnicos.map((tecnico) => {
    const ordenesTecnico = ordenesCerradasPeriodo.filter(
      (orden) => String(orden.tecnicoId) === String(tecnico.id)
    );

    const horasTrabajo = ordenesTecnico.reduce(
      (sum, orden) => sum + Number(orden.duracionHoras || 0),
      0
    );

    const horasTraslado = ordenesTecnico.reduce(
      (sum, orden) => sum + Number(orden.duracionTraslado || 0),
      0
    );

    const pagoHora = Number(tecnico.pagoHora || 0);
    const totalGanado = horasTrabajo * pagoHora;

    return {
      tecnico,
      ordenes: ordenesTecnico.length,
      horasTrabajo,
      horasTraslado,
      pagoHora,
      totalGanado,
    };
  });

  const totalHoras = filas.reduce((sum, row) => sum + row.horasTrabajo, 0);
  const totalTraslado = filas.reduce((sum, row) => sum + row.horasTraslado, 0);
  const totalPagado = filas.reduce((sum, row) => sum + row.totalGanado, 0);

  const periodos = [
    ["hoy", "Hoy"],
    ["semana", "Semana"],
    ["mes", "Mes"],
    ["ano", "Año"],
    ["todo", "Todo"],
  ];

  const hoyNomina = new Date();
  const inicioSemanaNomina = new Date(hoyNomina);
  inicioSemanaNomina.setDate(hoyNomina.getDate() - hoyNomina.getDay());

  const finSemanaNomina = new Date(inicioSemanaNomina);
  finSemanaNomina.setDate(inicioSemanaNomina.getDate() + 6);

  const formatoNomina = (fecha) =>
    fecha.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const periodoNominaLabel =
    periodo === "semana"
      ? `Semana consultada · ${formatoNomina(inicioSemanaNomina)} - ${formatoNomina(finSemanaNomina)}`
      : periodo === "hoy"
        ? `Hoy · ${formatoNomina(hoyNomina)}`
        : periodo === "mes"
          ? `Mes consultado · ${hoyNomina.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
          : periodo === "ano"
            ? `Año consultado · ${hoyNomina.getFullYear()}`
            : "Todo el historial";

  return (
    <section className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/50">
        <div className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-white px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-600">
            Nómina operativa
          </p>

          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Horas y pago por técnico
              </h2>
              <p className="mt-2 inline-flex rounded-full bg-blue-700 px-4 py-1.5 text-sm font-black text-white shadow-sm">
                {periodoNominaLabel}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-blue-900/60">
                Calculado solo con horas reales de trabajo, no traslado.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 text-[11px] font-black">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 ring-1 ring-blue-100">
                Trabajo {totalHoras.toFixed(2)} h
              </span>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700 ring-1 ring-indigo-100">
                Traslado {totalTraslado.toFixed(2)} h
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-100">
                Pago ${totalPagado.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto bg-blue-50/60 p-2">
          {periodos.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setPeriodo(id)}
              className={
                "shrink-0 rounded-xl px-3 py-2 text-xs font-black transition " +
                (periodo === id
                  ? "bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md shadow-blue-200"
                  : "bg-white text-slate-700 ring-1 ring-blue-100 hover:bg-blue-50")
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filas.map((row) => (
          <article
            key={row.tecnico.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/80 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-cyan-600 p-2.5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-black leading-tight">
                    {row.tecnico.nombre}
                  </p>
                  <p className="mt-1 text-xs font-bold text-blue-100">
                    {row.ordenes} órdenes completadas en este período
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-wide text-blue-100">
                    Ganado
                  </p>
                  <p className="text-lg font-black leading-tight">
                    ${row.totalGanado.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3">
              <div className="grid grid-cols-2 gap-2.5 text-xs font-black">
                <div className="rounded-xl bg-blue-50 p-1.5 text-blue-700">
                  <p className="text-[10px] uppercase tracking-wide text-blue-500">
                    Trabajo
                  </p>
                  <p className="mt-0.5 text-sm text-slate-950">
                    {row.horasTrabajo.toFixed(2)} h
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 p-1.5 text-indigo-700">
                  <p className="text-[10px] uppercase tracking-wide text-indigo-500">
                    Traslado
                  </p>
                  <p className="mt-0.5 text-sm text-slate-950">
                    {row.horasTraslado.toFixed(2)} h
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-1.5 text-slate-700">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    Pago por hora
                  </p>
                  <p className="mt-0.5 text-sm text-slate-950">
                    ${row.pagoHora.toFixed(2)} / h
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-1.5 text-emerald-700">
                  <p className="text-[10px] uppercase tracking-wide text-emerald-600">
                    Total
                  </p>
                  <p className="mt-0.5 text-sm text-slate-950">
                    ${row.totalGanado.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


function TecnicoHistorialProfesional({ ordenes = [], obtenerCliente, ordenProps }) {
  const [filtro, setFiltro] = useState("todas");
  const [periodo, setPeriodo] = useState("todo");
  const [busqueda, setBusqueda] = useState("");

  const getFechaOrden = (orden) => orden.fechaCompletada || orden.fechaCancelacion || orden.fechaCreacion || orden.fecha || "";

  const estaEnPeriodo = (orden) => {
    if (periodo === "todo") return true;

    const raw = getFechaOrden(orden);
    const fecha = new Date(raw);
    if (Number.isNaN(fecha.getTime())) return false;

    const ahora = new Date();

    const mismoDia =
      fecha.getFullYear() === ahora.getFullYear() &&
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getDate() === ahora.getDate();

    const inicioSemana = new Date(ahora);
    inicioSemana.setDate(ahora.getDate() - ahora.getDay());
    inicioSemana.setHours(0, 0, 0, 0);

    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 7);

    const mismaSemana = fecha >= inicioSemana && fecha < finSemana;

    const mismoMes =
      fecha.getFullYear() === ahora.getFullYear() &&
      fecha.getMonth() === ahora.getMonth();

    const mismoAno = fecha.getFullYear() === ahora.getFullYear();

    if (periodo === "hoy") return mismoDia;
    if (periodo === "semana") return mismaSemana;
    if (periodo === "mes") return mismoMes;
    if (periodo === "ano") return mismoAno;

    return true;
  };

  const ordenesPorPeriodo = ordenes.filter(estaEnPeriodo);

  const completadas = ordenesPorPeriodo.filter((o) => o.estado === "Completado");
  const canceladas = ordenesPorPeriodo.filter((o) => o.estado === "Cancelada");

  const ordenesFiltradas = ordenesPorPeriodo
    .filter((orden) => {
      if (filtro === "completadas" && orden.estado !== "Completado") return false;
      if (filtro === "canceladas" && orden.estado !== "Cancelada") return false;

      const cliente = obtenerCliente(orden.clienteId);
      const q = busqueda.toLowerCase().trim();

      if (!q) return true;

      return (
        String(cliente?.nombre || "").toLowerCase().includes(q) ||
        String(cliente?.telefono || "").toLowerCase().includes(q) ||
        String(orden.problema || "").toLowerCase().includes(q) ||
        String(orden.cancelReason || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const fa = a.fechaCompletada || a.fechaCancelacion || a.fechaCreacion || "";
      const fb = b.fechaCompletada || b.fechaCancelacion || b.fechaCreacion || "";
      return String(fb).localeCompare(String(fa));
    });

  const tabs = [
    { id: "todas", label: "Todas", count: ordenesPorPeriodo.length },
    { id: "completadas", label: "Completadas", count: completadas.length },
    { id: "canceladas", label: "Canceladas", count: canceladas.length },
  ];

  return (
    <section className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/50">
        <div className="bg-slate-950 px-5 py-3 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">
            Historial del técnico
          </p>
          <h2 className="mt-1 flex items-center justify-center gap-2 text-lg font-black">
            <History size={22} />
            Historial
          </h2>
          <p className="mt-1 text-xs font-semibold text-slate-300">
            Órdenes completadas y canceladas.
          </p>
        </div>

        <div className="space-y-3 bg-slate-50 p-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por cliente, teléfono, problema o motivo..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-semibold outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {[
              ["hoy", "Hoy"],
              ["semana", "Semana"],
              ["mes", "Mes"],
              ["ano", "Año"],
              ["todo", "Todo"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setPeriodo(id)}
                className={
                  "w-full rounded-xl px-3 py-2 text-xs font-black transition " +
                  (periodo === id
                    ? "bg-emerald-700 text-white shadow-lg"
                    : "bg-white text-slate-700 ring-1 ring-blue-100 hover:bg-blue-50")
                }
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFiltro(tab.id)}
                className={
                  "w-full rounded-xl px-3 py-2 text-xs font-black transition " +
                  (filtro === tab.id
                    ? "bg-slate-950 text-white shadow-lg"
                    : "bg-white text-slate-700 ring-1 ring-blue-100 hover:bg-blue-50")
                }
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {ordenesFiltradas.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 text-center text-sm font-semibold text-slate-500 shadow-md shadow-slate-300/50">
          No hay órdenes en este filtro.
        </div>
      ) : (
        <div className="grid gap-3">
          {ordenesFiltradas.map((orden) => {
            const cliente = obtenerCliente(orden.clienteId);
            const completada = orden.estado === "Completado";
            const fecha = orden.fechaCompletada || orden.fechaCancelacion || orden.fechaCreacion || orden.fecha;
            const hora = orden.horaCierre || orden.horaInicio || fecha || "";

            const cardClass = completada
              ? "border-emerald-300 bg-emerald-50"
              : "border-rose-300 bg-rose-50";

            const dotClass = completada
              ? "bg-emerald-500 ring-emerald-100"
              : "bg-rose-500 ring-rose-100";

            const badgeClass = completada
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white";

            return (
              <article key={orden.id} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/70">
                <div className="absolute bottom-3 left-[78px] top-3 hidden w-px bg-slate-200 sm:block" />

                <div className="grid gap-3 p-3 sm:grid-cols-[68px_24px_minmax(0,1fr)] sm:items-start">
                  <div className="text-sm font-black text-slate-700 sm:pt-4">
                    {fecha ? formatReportDate(fecha) : "Sin fecha"}
                  </div>

                  <div className="relative hidden justify-center sm:flex sm:pt-5">
                    <span className={`relative z-10 h-3.5 w-3.5 rounded-full ring-4 ${dotClass}`} />
                  </div>

                  <div className={`rounded-2xl border p-3 ${cardClass}`}>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="pointer-events-none relative z-10 min-w-0">
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${badgeClass}`}>
                            {completada ? "Completada" : "Cancelada"}
                          </span>

                          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black text-slate-700 ring-1 ring-slate-200">
                            #{orden.id}
                          </span>

                          {!completada && orden.cancelTipo && (
                            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black text-rose-700 ring-1 ring-rose-200">
                              {orden.cancelTipo}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 truncate text-2xl font-black tracking-tight text-slate-950">
                          {cliente?.nombre || "Cliente eliminado"}
                        </h3>

                        <p className="mt-2 line-clamp-2 rounded-2xl bg-white/80 px-3 py-2 text-sm font-black leading-relaxed text-slate-800 shadow-sm">
                          {orden.problema || "Sin problema reportado"}
                        </p>

                        <div className="mt-2 grid gap-1 text-[11px] font-semibold text-slate-500 sm:grid-cols-2">
                          {cliente?.telefono && (
                            <p className="flex items-center justify-center gap-1.5 truncate">
                              <Phone size={13} />
                              {cliente.telefono}
                            </p>
                          )}

                          <p className="flex items-center justify-center gap-1.5 truncate">
                            <Timer size={13} />
                            {orden.duracionHoras || "0.00"} h
                          </p>

                          {cliente?.direccion && (
                            <p className="flex items-center justify-center gap-1.5 truncate sm:col-span-2">
                              <MapPin size={13} />
                              {cliente.direccion}
                            </p>
                          )}
                        </div>

                        {!completada && (
                          <div className="mt-2 rounded-xl border border-rose-200 bg-white/70 p-2 text-xs font-bold text-rose-800">
                            Motivo: {orden.cancelReason || "Sin motivo registrado"}
                          </div>
                        )}

                        {orden.notasTecnico && (
                          <div className="mt-2 rounded-xl border border-blue-200 bg-white/70 p-2 text-xs font-bold text-blue-900">
                            Nota: {orden.notasTecnico}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 lg:justify-end">
                        {cliente?.telefono && (
                          <a
                            href={`tel:${cliente.telefono}`}
                            className="flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 px-4 py-3 text-sm font-black text-white"
                          >
                            <Phone size={14} />
                            Llamar
                          </a>
                        )}

                        {cliente?.direccion && (
                          <a
                            href={`https://maps.apple.com/?q=${encodeURIComponent(cliente.direccion)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-1.5 rounded-2xl bg-slate-950 shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 px-4 py-3 text-sm font-black text-white"
                          >
                            <Navigation size={14} />
                            Mapa
                          </a>
                        )}

                        {ordenProps?.compartirOrden && (
                          <button
                            onClick={() => ordenProps.compartirOrden(orden, "imprimir")}
                            className="flex items-center justify-center gap-1.5 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 px-4 py-3 text-sm font-black text-white"
                          >
                            <Printer size={14} />
                            Imprimir
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}


function TecnicoHistorialUnificado({ t, ordenes, obtenerCliente, ordenProps }) {
  const [filtro, setFiltro] = useState("todas");

  const getFechaOrden = (orden) => orden.fechaCompletada || orden.fechaCancelacion || orden.fechaCreacion || orden.fecha || "";

  const estaEnPeriodo = (orden) => {
    if (periodo === "todo") return true;

    const raw = getFechaOrden(orden);
    const fecha = new Date(raw);
    if (Number.isNaN(fecha.getTime())) return false;

    const ahora = new Date();

    const mismoDia =
      fecha.getFullYear() === ahora.getFullYear() &&
      fecha.getMonth() === ahora.getMonth() &&
      fecha.getDate() === ahora.getDate();

    const inicioSemana = new Date(ahora);
    inicioSemana.setDate(ahora.getDate() - ahora.getDay());
    inicioSemana.setHours(0, 0, 0, 0);

    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 7);

    const mismaSemana = fecha >= inicioSemana && fecha < finSemana;

    const mismoMes =
      fecha.getFullYear() === ahora.getFullYear() &&
      fecha.getMonth() === ahora.getMonth();

    const mismoAno = fecha.getFullYear() === ahora.getFullYear();

    if (periodo === "hoy") return mismoDia;
    if (periodo === "semana") return mismaSemana;
    if (periodo === "mes") return mismoMes;
    if (periodo === "ano") return mismoAno;

    return true;
  };

  const ordenesPorPeriodo = ordenes.filter(estaEnPeriodo);

  const completadas = ordenesPorPeriodo.filter((o) => o.estado === "Completado");
  const canceladas = ordenesPorPeriodo.filter((o) => o.estado === "Cancelada");

  const ordenesFiltradas =
    filtro === "completadas"
      ? completadas
      : filtro === "canceladas"
        ? canceladas
        : ordenes;

  const tabs = [
    { id: "todas", label: "Todas", count: ordenesPorPeriodo.length },
    { id: "completadas", label: "Completadas", count: completadas.length },
    { id: "canceladas", label: "Canceladas", count: canceladas.length },
  ];

  return (
    <section className="mt-6 space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/50">
        <div className="bg-slate-950 px-5 py-3 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-300">
            Historial del técnico
          </p>
          <h2 className="mt-1 flex items-center justify-center gap-2 text-lg font-black">
            <History size={24} />
            Historial
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Órdenes completadas y canceladas en un solo lugar.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto bg-slate-50 p-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFiltro(tab.id)}
              className={
                "rounded-xl px-3 py-2 text-xs font-black transition " +
                (filtro === tab.id
                  ? "bg-slate-950 text-white shadow-lg"
                  : "bg-white text-slate-700 ring-1 ring-slate-200")
              }
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <HistorialPage
        t={t}
        ordenes={ordenesFiltradas}
        obtenerCliente={obtenerCliente}
        ordenProps={ordenProps}
      />
    </section>
  );
}


function ConfiguracionPage({ t, adminPassword, setAdminPassword, setMensaje }) { const [actual, setActual] = useState(""); const [nueva, setNueva] = useState(""); const guardar = () => { if (actual !== adminPassword) return setMensaje("Contraseña actual incorrecta."); if (nueva.length < 4) return setMensaje("Mínimo 4 caracteres."); setAdminPassword(nueva); setActual(""); setNueva(""); setMensaje("Contraseña actualizada."); }; return <section className="rounded-2xl 2xl:rounded-[2rem] border border-white/70 bg-white/90 p-3 2xl:p-5 shadow-lg 2xl:shadow-md shadow-blue-100/70 backdrop-blur"><h2 className="mb-3 2xl:mb-5 flex items-center justify-center gap-2 text-xl 2xl:text-lg font-black"><ShieldCheck {...iconProps} />{t("settings")}</h2><div className="grid gap-4 md:grid-cols-3"><input type="password" value={actual} onChange={(e) => setActual(e.target.value)} placeholder="Contraseña actual" className="rounded-xl border p-2 text-xs" /><input type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} placeholder="Nueva contraseña" className="rounded-xl border p-2 text-xs" /><button onClick={guardar} className="rounded-2xl bg-slate-950 px-4 py-3 font-black text-white">Guardar</button></div></section>; }
