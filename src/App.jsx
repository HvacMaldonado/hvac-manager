import { useEffect, useMemo, useState } from "react";
import { crearClienteSupabase, obtenerClientesSupabase } from "./services/clientesService";
import { obtenerTecnicosSupabase, crearTecnicoSupabase, actualizarTecnicoSupabase } from "./services/tecnicosService";
import { obtenerCitasSupabase, crearCitaSupabase, actualizarCitaSupabase } from "./services/citasService";
import { obtenerOrdenesSupabase, crearOrdenSupabase, actualizarOrdenSupabase } from "./services/ordenesService";
import { obtenerHerramientasSupabase, crearHerramientaSupabase, actualizarHerramientaSupabase, eliminarHerramientaSupabase } from "./services/herramientasService";
import { obtenerInventarioSupabase, crearInventarioSupabase, actualizarInventarioSupabase, eliminarInventarioSupabase } from "./services/inventarioService";
import { obtenerMaterialesOrdenesSupabase, crearOrdenMaterialSupabase, actualizarOrdenMaterialSupabase, eliminarOrdenMaterialSupabase } from "./services/ordenMaterialesService";
import { obtenerFirmasOrdenesSupabase, guardarFirmaOrdenSupabase } from "./services/ordenFirmasService";
import { obtenerFotosOrdenesSupabase, guardarFotoOrdenSupabase } from "./services/ordenFotosService";
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
    chargedPrice: "Precio cobrado",
    chargedPriceDescription: "Monto cobrado al cliente para calcular rentabilidad.",
    customers: "Clientes",
    technicians: "Técnicos",
    appointments: "Citas",
    orders: "Órdenes",
    completedHistory: "Historial completado",
    inventory: "Inventario general",
    generalInventoryDescription: "Control de materiales, costos internos y stock mínimo.",
    generalInventoryTitle: "Inventario general",
    newMaterial: "Nuevo material",
    addInventory: "Agregar inventario",
    materialNamePlaceholder: "Nombre del material",
    searchInventoryPlaceholder: "Buscar material, categoría o unidad...",
    allCategories: "Todas las categorías",
    airConditioningUnits: "Unidades de aire acondicionado",
    thermostats: "Termostatos",
    filters: "Filtros",
    capacitors: "Capacitores",
    contactors: "Contactores",
    motors: "Motores",
    refrigerant: "Refrigerante",
    ductsAndVentilation: "Ductos y ventilación",
    electricalMaterial: "Material eléctrico",
    others: "Otros",
    piece: "pieza",
    unitSingle: "unidad",
    box: "caja",
    roll: "rollo",
    pound: "libra",
    gallon: "galón",
    foot: "pie",
    set: "set",
    addMaterial: "Agregar material",
    internalCost: "Costo interno",
    minimumStock: "Stock mínimo",
    valueLabel: "Valor",
    inventorySideDescription: "Agrega materiales consumibles, controla cantidades y detecta stock bajo.",
    available: "Disponible",
    minimum: "Mínimo",
    noMaterialsRegistered: "No hay materiales registrados.",
    tools: "Herramientas técnico",
    toolsAssignment: "Asignación",
    technicianToolsTitle: "Herramientas técnico",
    technicianToolsDescription: "Control de herramientas asignadas, devueltas, dañadas o perdidas por técnico.",
    availableTools: "Disponibles",
    assignedTools: "Asignadas",
    returnedTools: "Devueltas",
    selectedTechnician: "Técnico seleccionado",
    selectTechnician: "Seleccionar técnico",
    selectTechnicianShort: "Selecciona técnico",
    selectedTechnicianDescription: "El selector principal define a quién se asignará la herramienta. No se repite el técnico dentro del formulario.",
    modernForm: "Formulario moderno",
    addTool: "Agregar herramienta",
    technicianAssignment: "Asignación por técnico",
    tool: "Herramienta",
    quantity: "Cantidad",
    status: "Estado",
    notes: "Notas",
    toolPlaceholder: "Ej. Manifold, taladro, bomba...",
    notesPlaceholder: "Condición o comentario",
    assignTool: "Asignar herramienta",
    searchToolsPlaceholder: "Buscar herramienta, técnico, estado o notas...",
    allStatuses: "Todos los estados",
    technician: "Técnico",
    actions: "Acciones",
    noToolsFilters: "No hay herramientas con esos filtros.",
    noName: "Sin nombre",
    noTechnician: "Sin técnico",
    noNotes: "Sin notas",
    save: "Guardar",
    edit: "Editar",
    return: "Devolver",
    selectTechnicianAlert: "Selecciona un técnico antes de agregar herramientas.",
    enterToolNameAlert: "Ingresa el nombre de la herramienta.",
    statusAvailable: "Disponible",
    statusAssigned: "Asignada",
    statusDamaged: "Dañada",
    statusLost: "Perdida",
    statusReturned: "Devuelta",
    reportsCustomers: "Reportes clientes",
    customerReportsTitle: "Reportes clientes",
    customerReportsDescription: "Resumen por cliente con órdenes, citas, actividad y acciones rápidas.",
    withHistory: "Con historial",
    withAppointments: "Con citas",
    withAppointment: "Con cita",
    lastActivity: "Última actividad",
    noCustomersFilters: "No hay clientes con esos filtros.",
    noEmail: "Sin email",
    noAddress: "Sin dirección",
    export: "Exportar",
    reportsInventory: "Reportes inventario",
    inventoryReportsTitle: "Reportes inventario",
    inventoryReportsDescription: "Vista consolidada de materiales, herramientas, alertas y valor interno.",
    alerts: "Alertas",
    categories: "Categorías",
    value: "Valor",
    searchInventoryReport: "Buscar material, herramienta, responsable, categoría...",
    allStatuses: "Todos los estados",
    onlyAlerts: "Solo alertas",
    internalValue: "Valor interno",
    type: "Tipo",
    itemName: "Nombre",
    category: "Categoría",
    quantityShort: "Cant.",
    unitStatus: "Unidad/Estado",
    responsible: "Responsable",
    noRecordsFilters: "No hay registros con esos filtros.",
    noName: "Sin nombre",
    noCategory: "Sin categoría",
    warehouse: "Almacén",
    available: "Disponible",
    assignedStatus: "Asignada",
    damaged: "Dañada",
    lost: "Perdida",
    stockLow: "Stock bajo",
    technicalTool: "Herramienta técnico",
    unit: "unidad",
    reportsCenter: "Centro de reportes",
    dashboardUnifiedDescription: "Reportes generales, clientes e inventario.",
    inventoryShort: "Inventario",
    general: "General",
    settings: "Configuración",
    createOrder: "Crear orden",
    searchCustomer: "Buscar cliente",
    customerManagement: "Gestión de clientes",
    customersLabel: "Clientes",
    activeCustomersLabel: "Activos",
    appointmentsLabel: "Citas",
    quickRegistration: "Registro rápido",
    newLabel: "Nuevo",
    contactDescription: "Nombre, teléfono y email",
    locationDescription: "Dirección del servicio",
    accessDescription: "Apt, edificio y código",
    createNewCustomer: "Crear nuevo cliente",
    saveCustomer: "Guardar cliente",
    registeredCustomers: "Clientes registrados",
    contact: "Contacto",
    contactDescription: "Nombre, teléfono y email",
    location: "Ubicación",
    locationDescription: "Dirección del servicio",
    access: "Acceso",
    accessDescription: "Apt, edificio y código",
    mainInformation: "Información principal",
    basicContactData: "Datos básicos de contacto",
    serviceLocation: "Ubicación del servicio",
    serviceLocationDescription: "Dirección donde se realizará el trabajo",
    accessDetails: "Detalles de acceso",
    accessDetailsDescription: "Información útil para llegar sin retrasos",
    customerName: "Nombre del cliente",
    customerNamePlaceholder: "Ej. Luis Martínez",
    emailPlaceholder: "correo@cliente.com",
    fullAddress: "Dirección completa",
    addressPlaceholder: "Empieza a escribir la dirección...",
    compactTable: "Tabla compacta",
    searchCustomerPlaceholder: "Buscar cliente...",
    mostRecent: "Más recientes",
    nameAZ: "Nombre A-Z",
    dateLastMovement: "Fecha / último movimiento",
    noHistory: "Sin historial",
    noEmail: "Sin email",
    noAddress: "Sin dirección",
    activeOrder: "Orden activa",
    noOrder: "Sin orden",
    customerRequiredAlert: "Nombre, teléfono y dirección son obligatorios.",
    ordersCountLabel: "Órdenes",
    appointmentsCountLabel: "Citas",
    orderAction: "Orden",
    appointmentAction: "Cita",
    building: "Edificio",
    street: "Calle",
    accessCode: "Código de acceso",
    geoapifyHelp: "Autocompletado con Geoapify. Escribe mínimo 3 letras y selecciona una dirección.",
    reportedProblem: "Problema reportado",
    assignTech: "Asignar técnico",
    priority: "Prioridad",
    create: "Crear",
    add: "Agregar",
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
    calendar: "Calendario",
    visualAgenda: "Agenda visual",
    calendarDescription: "Visualiza citas y órdenes programadas por día, semana, técnico y prioridad.",
    events: "Eventos",
    today: "Hoy",
    allTechnicians: "Todos los técnicos",
    month: "Mes",
    week: "Semana",
    monthlyView: "Vista mensual",
    weeklyView: "Vista semanal",
    colorsByTechnician: "Colores por técnico",
    activeTeam: "Equipo activo",
    low: "Baja",
    medium: "Media",
    high: "Alta",
    urgent: "Urgente",
    historyTitle: "Historial de órdenes",
    historyDescription: "Consulta en un solo lugar las órdenes completadas y canceladas, con filtros y acciones rápidas.",
    total: "Total",
    records: "registros",
    orderRecords: "Registros de órdenes",
    completedAndCancelled: "Completadas y canceladas",
    searchHistoryPlaceholder: "Buscar por cliente, técnico, problema, dirección o estado...",
    all: "Todos",
    mostRecent: "Más recientes",
    oldest: "Más antiguos",
    noHistoryOrders: "No hay órdenes en historial con esos filtros.",
    deletedCustomer: "Cliente eliminado",
    noPhone: "Sin teléfono",
    noTechnician: "Sin técnico",
    noDate: "Sin fecha",
    noTime: "Sin hora",
    scheduledAppointment: "Cita programada",
    workOrderFallback: "Orden de trabajo",
    weekOf: "Semana de",
    noAssignedTechnician: "Sin técnico asignado",
    noGeneratedOrdersYet: "No hay órdenes generadas todavía.",
    quickActions: "Acciones rápidas",
    noMaterials: "Sin materiales",
    viewOrder: "Ver orden",
    sendReport: "Enviar reporte",
    serviceReportTitle: "Reporte de servicio HVAC",
    customerReport: "Reporte para cliente",
    technicianNotes: "Notas del técnico",
    noRegisteredMaterials: "Sin materiales registrados.",
    customerSignature: "Firma del cliente",
    noPhotosAdded: "No se agregaron imágenes a esta orden.",
    noCustomerSignatureCaptured: "No se capturó firma del cliente.",
    customerRequest: "Solicitud del cliente",
    serviceDetails: "Detalle del servicio",
    photoEvidence: "Evidencia fotográfica",
    generatedFromHVACManager: "Generado desde HVAC Manager",
    generatedReportFooter: "Reporte generado desde HVAC Manager · Información interna de costos excluida.",
    reportStatus: "Estado",
    noStatus: "Sin estado",
    reportPriority: "Prioridad",
    accessDetailsShort: "Acceso",
    reportedProblemTitle: "Problema reportado",
    noReportedProblemSentence: "Sin problema reportado.",
    summarizedTimeline: "Timeline resumido",
    orderCreated: "Orden creada",
    technicianArrived: "Técnico llegó",
    workStarted: "Trabajo iniciado",
    workCompleted: "Trabajo completado",
    noReason: "Sin motivo",
    usedMaterials: "Materiales usados",
    before: "Antes",
    during: "Durante",
    after: "Después",
    signed: "Firmado",
    noCustomerSignature: "Esta orden no tiene firma registrada.",
    adminCorrection: "Corrección administrativa",
    newTechnician: "Nuevo técnico",
    addTechnician: "Agregar técnico",
    technicianCreateDescription: "Crea usuarios técnicos para asignar órdenes, citas y herramientas.",
    active: "Activo",
    entry: "Ingreso",
    quickForm: "Formulario rápido",
    technicianData: "Datos del técnico",
    userPasswordContact: "Usuario · Password · Contacto",
    name: "Nombre",
    technicianName: "Nombre del técnico",
    passwordLabel: "Password",
    entryDate: "Fecha ingreso",
    exitDate: "Fecha salida",
    hourlyPay: "Pago por hora ($)",
    payrollOperational: "Nómina operativa",
    technicianHoursPay: "Horas y pago por técnico",
    realWorkOnly: "Calculado solo con horas reales de trabajo, no traslado.",
    consultedWeek: "Semana consultada",
    consultedDay: "Hoy",
    consultedMonth: "Mes consultado",
    consultedYear: "Año consultado",
    allHistory: "Todo el historial",
    work: "Trabajo",
    travel: "Traslado",
    pay: "Pago",
    earned: "Ganado",
    completedOrdersPeriod: "órdenes completadas en este período",
    hourlyPayShort: "Pago por hora",
    totalPay: "Total",
    technicianActiveLogin: "El técnico quedará activo y podrá iniciar sesión con su usuario y contraseña.",
    editTechnician: "Editar técnico",
    cancel: "Cancelar",
    enterTechnicianName: "Ingresa el nombre del técnico.",
    saveTechnicianError: "No se pudo guardar el técnico en Supabase.",
    agenda: "Agenda",
    todayOrders: "Órdenes de hoy",
    noOrdersToday: "No tienes órdenes ni citas para hoy.",
    assignedOrdersAppearHere: "Las órdenes y citas asignadas aparecerán aquí ordenadas por hora.",
    previousPending: "Pendientes anteriores",
    overdueOrders: "Órdenes vencidas",
    upcoming: "Próximas",
    new: "Nueva",
    quickAgenda: "Agenda rápida",
    createAppointmentTitle: "Crear cita",
    appointmentCreateDescription: "Selecciona cliente, técnico, fecha y motivo para dejar la visita programada.",
    whoReceivesService: "Quién recibirá el servicio",
    whoHandlesAppointment: "Quién atenderá la cita",
    dateAndTime: "Fecha y hora",
    clearScheduling: "Programación clara",
    modernForm: "Formulario moderno",
    appointmentData: "Datos de la cita",
    saveAppointment: "Guardar cita",
    customerAndTechnician: "Cliente y técnico",
    selectCustomerAndTechnician: "Selecciona quién recibe y quién atiende",
    searchCustomerAppointment: "Buscar cliente, teléfono, email o dirección...",
    selectedCustomer: "Cliente seleccionado",
    change: "Cambiar",
    noCustomersFound: "No se encontraron clientes.",
    selectTechnician: "Seleccionar técnico",
    scheduling: "Programación",
    visitDateAndTime: "Fecha y hora de la visita",
    visitDetail: "Detalle de la visita",
    describeAppointmentReason: "Describe el motivo de la cita",
    reason: "Motivo",
    reasonPlaceholder: "Ej. Revisión de aire acondicionado",
    dynamicTable: "Tabla dinámica",
    appointmentsList: "Listado de citas",
    searchAppointment: "Buscar cita...",
    allAppointments: "Todas",
    scheduledPlural: "Programadas",
    completedPlural: "Completadas",
    cancelledPlural: "Canceladas",
    dateTime: "Fecha / Hora",
    noAppointments: "No hay citas para mostrar.",
    noReason: "Sin motivo",
    createOrderAction: "Crear orden",
    quickOrder: "Orden rápida",
    quickOrderDescription: "Crea y asigna una orden de trabajo en pocos pasos.",
    selectCustomerForOrder: "Busca y selecciona el cliente para esta orden",
    customerSearchPlaceholder: "Nombre, teléfono, email o dirección",
    schedulingDescription: "Define fecha y hora para la visita",
    reportedProblemDescription: "Describe lo que necesita revisar el técnico",
    assignedTechnician: "Técnico asignado",
    assignedTechnicianDescription: "El administrador asigna, el técnico completa",
    priorityDescription: "Define qué tan urgente es el servicio",
    administrativeTracking: "Seguimiento administrativo",
    administrativeTrackingDescription: "Órdenes activas agrupadas por técnico, prioridad y periodo.",
    year: "Año",
    assignedTechnicianLabel: "Técnico asignado",
    ordersLabel: "órdenes",
    urgentPlural: "Urgentes",
    overduePlural: "Atrasadas",
    period: "Periodo",
    orderSingular: "orden",
    orderPlural: "órdenes",
    orderId: "Orden",
    noReportedProblem: "Sin problema reportado",
    unassigned: "Sin asignar",
    scheduledLabel: "Programado",
    closeShareMenu: "Cerrar menú de compartir",
    systemShare: "Compartir sistema",
    createOrderTitle: "Crear orden",
    createOrderDescription: "Crea, programa y asigna el trabajo al técnico correcto.",
    generatedOrdersList: "Lista de órdenes generadas",
    generatedOrdersDescription: "Aquí solo se revisan las órdenes. La ejecución queda en el perfil del técnico asignado.",
    operationalHealth: "Salud operativa",
    visualIndicators: "Indicadores visuales",
    selectedPeriodSummary: "Resumen interno del periodo seleccionado",
    completedOrders: "Órdenes completadas",
    cancellations: "Cancelaciones",
    inventoryValue: "Valor de inventario",
    lowStock: "Stock bajo",
    toolAlerts: "Herramientas",
    dashboardExecutive: "Panel ejecutivo",
    dashboardReports: "Reportes del panel",
    exportExcel: "Exportar Excel",
    printPdf: "Imprimir/PDF",
    searchDashboardPlaceholder: "Buscar por técnico, estado, prioridad o problema...",
    allMonths: "Todos los meses",
    filteredTotal: "Total filtrado",
    currentBase: "Base actual",
    usedMaterials: "Materiales usados",
    periodCost: "Costo del periodo",
    mainSummary: "Resumen principal",
    completedJobs: "Completadas",
    closedJobs: "Trabajos cerrados",
    cancellationDetails: "Detalle de cancelaciones",
    internalAdminInfo: "Información interna para administración",
    byCustomer: "Por cliente",
    byCompany: "Por empresa",
    byTechnician: "Por técnico",
    monthlyTrend: "Tendencia mensual",
    activeOrders: "Activas",
    consumption: "Consumo",
    unitsUsed: "unidades usadas",
    operationalHistory: "Historial operativo",
    months: "meses",
    noMaterialsFiltered: "No hay materiales consumidos en las órdenes filtradas.",
    noNamedMaterial: "Material sin nombre",
    topTen: "Top 10",
    totalLabel: "total",
    recordsCount: "registros",
    of: "de",
    themeLabel: "Tema",
    teamLabel: "Equipo",
    normalMaintenance: "mantenimiento normal",
    scheduledService: "servicio programado",
    customerNoAcHeat: "cliente sin aire o calefacción",
    emergencySystemStopped: "emergencia / sistema detenido",
    assignToTechnician: "Asignar al técnico",
    blue: "Azul",
    green: "Verde",
    purple: "Morado",
    orange: "Naranja",
    pink: "Rosa",
    gray: "Gris",
    deleteAppointmentConfirm: "¿Eliminar esta cita?",
    scheduled: "Programada",
    completedAppointment: "Completada",
    convertedToOrder: "Convertida en orden",
    activeTechnicians: "Técnicos activos",
    inactiveHistory: "Historial de bajas",
    inService: "En servicio",
    inactiveData: "Datos de baja",
    actions: "Acciones",
    contact: "Contacto",
    color: "Color",
    startDate: "Start Date",
    exit: "Exit",
    inactive: "Baja",
    deactivate: "Dar de baja",
    reactivate: "Reactivar",
    remove: "Eliminar",
    edit: "Editar",
    searchTechnician: "Buscar técnico...",
    deleteTechnicianConfirm: "¿Eliminar permanentemente a",
    dayDetail: "Detalle del día",
    noEventsDay: "No hay eventos para este día.",
    noActiveTechnicians: "No hay técnicos activos.",
    history: "Historial",
    dashboard: "Panel",
    searchCalendarPlaceholder: "Buscar cliente, técnico, dirección o trabajo...",
    technician: "Técnico",
    customer: "Cliente",
    address: "Dirección",
    phone: "Teléfono",
    status: "Estado",
    completed: "Completado",
    cancelled: "Cancelada",
    needsFollowUp: "Necesita seguimiento",
    time: "Hora",
    map: "Mapa",
    noAddress: "Sin dirección",
    appointment: "Cita",
    overdue: "Vencida",
    workOrder: "Orden",
    technicianAgenda: "Agenda del técnico",
    assignedWork: "Trabajo asignado",
    assignedWorkDescription: "Separado por órdenes no atendidas, trabajo de hoy, citas programadas y próximas visitas.",
    clearAgenda: "Agenda clara",
    allOrders: "Todas las órdenes",
    unattended: "No atendidas",
    ordersToday: "Órdenes hoy",
    appointmentsToday: "Citas hoy",
    activeLabel: "Activas",
    closedLabel: "Cerradas",
    appointmentsLabelShort: "Citas",
    noAssignedActiveWork: "No tienes órdenes ni citas activas asignadas.",
    hideWork: "Ocultar trabajo",
    viewWork: "Ver trabajo",
    closeLabel: "Cierre",
    notClosed: "Sin cerrar",
    materialUsed: "Material usado",
    noMaterialAdded: "No se ha agregado material.",
    noPhoto: "Sin foto",
    selectPhoto: "Seleccionar foto",
    technicianHistoryTitle: "Historial del técnico",
    technicianHistoryDescription: "Órdenes completadas y canceladas.",
    searchTechnicianHistoryPlaceholder: "Buscar por cliente, teléfono, problema o motivo...",
    noOrdersInFilter: "No hay órdenes en este filtro.",
    reasonLabel: "Motivo",
    noReasonRegistered: "Sin motivo registrado",
    noteLabel: "Nota",
    customRange: "Personalizado",
    fromDate: "Desde",
    toDate: "Hasta",
    activeRange: "Rango activo",
    clearRange: "Limpiar rango",
    exportCsv: "Exportar CSV",
    deletedCustomer: "Cliente eliminado",
    noReportedProblem: "Sin problema reportado",
    noTechnician: "Sin técnico",
    noDate: "Sin fecha",
    call: "Llamar",
    route: "Ruta",
    followUpLabel: "Seguimiento",
    priorityLabel: "Prioridad",
    dateLabel: "Fecha",
    startLabel: "Inicio",
    notStarted: "Sin iniciar",
    workLabel: "Trabajo",
    travelLabel: "Traslado",
    workDetailsPlaceholder: "Detalles del trabajo realizado...",
    goToCustomer: "Salir al cliente",
    arrivedOnSite: "Llegué al sitio",
    startWork: "Comenzar trabajo",
    finishWork: "Finalizar trabajo",
    requiresFollowUp: "Requiere seguimiento",
    unattendedVisitPending: "No atendidas / visita pendiente",
    previousActiveOrders: "Órdenes anteriores que siguen activas",
    ordersForToday: "Órdenes para hoy",
    mainWorkDay: "Trabajo principal del día",
    scheduledAppointmentsToday: "Citas programadas para hoy",
    separateAppointmentsAgenda: "Agenda de citas separada de órdenes",
    overdueAppointments: "Citas atrasadas",
    previousAppointmentsNeedFollowUp: "Citas anteriores que requieren seguimiento",
    upcomingOrders: "Próximas órdenes",
    scheduledWorkLater: "Trabajo programado para después",
    upcomingAppointments: "Próximas citas",
    futureAppointments: "Citas futuras",
    undatedOrders: "Órdenes sin fecha",
    undatedAppointments: "Citas sin fecha",
    needsAdminReview: "Requieren revisión administrativa",
    sundayShort: "Dom",
    mondayShort: "Lun",
    tuesdayShort: "Mar",
    wednesdayShort: "Mié",
    thursdayShort: "Jue",
    fridayShort: "Vie",
    saturdayShort: "Sáb",
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
    chargedPrice: "Charged price",
    chargedPriceDescription: "Amount charged to the customer to calculate profitability.",
    customers: "Customers",
    technicians: "Technicians",
    appointments: "Appointments",
    orders: "Orders",
    completedHistory: "Completed history",
    inventory: "General inventory",
    generalInventoryDescription: "Control materials, internal costs, and minimum stock.",
    generalInventoryTitle: "General inventory",
    newMaterial: "New material",
    addInventory: "Add inventory",
    materialNamePlaceholder: "Material name",
    searchInventoryPlaceholder: "Search material, category, or unit...",
    allCategories: "All categories",
    airConditioningUnits: "Air conditioning units",
    thermostats: "Thermostats",
    filters: "Filters",
    capacitors: "Capacitors",
    contactors: "Contactors",
    motors: "Motors",
    refrigerant: "Refrigerant",
    ductsAndVentilation: "Ducts and ventilation",
    electricalMaterial: "Electrical material",
    others: "Others",
    piece: "piece",
    unitSingle: "unit",
    box: "box",
    roll: "roll",
    pound: "pound",
    gallon: "gallon",
    foot: "foot",
    set: "set",
    addMaterial: "Add material",
    internalCost: "Internal cost",
    minimumStock: "Minimum stock",
    valueLabel: "Value",
    inventorySideDescription: "Add consumable materials, control quantities, and detect low stock.",
    available: "Available",
    minimum: "Minimum",
    noMaterialsRegistered: "No materials registered.",
    tools: "Technician tools",
    toolsAssignment: "Assignment",
    technicianToolsTitle: "Technician tools",
    technicianToolsDescription: "Track tools assigned, returned, damaged, or lost by technician.",
    availableTools: "Available",
    assignedTools: "Assigned",
    returnedTools: "Returned",
    selectedTechnician: "Selected technician",
    selectTechnician: "Select technician",
    selectTechnicianShort: "Select technician",
    selectedTechnicianDescription: "The main selector defines who the tool will be assigned to. The technician is not repeated inside the form.",
    modernForm: "Modern form",
    addTool: "Add tool",
    technicianAssignment: "Technician assignment",
    tool: "Tool",
    quantity: "Quantity",
    status: "Status",
    notes: "Notes",
    toolPlaceholder: "Ex. Manifold, drill, pump...",
    notesPlaceholder: "Condition or comment",
    assignTool: "Assign tool",
    searchToolsPlaceholder: "Search tool, technician, status, or notes...",
    allStatuses: "All statuses",
    technician: "Technician",
    actions: "Actions",
    noToolsFilters: "No tools match those filters.",
    noName: "No name",
    noTechnician: "No technician",
    noNotes: "No notes",
    save: "Save",
    edit: "Edit",
    return: "Return",
    selectTechnicianAlert: "Select a technician before adding tools.",
    enterToolNameAlert: "Enter the tool name.",
    statusAvailable: "Available",
    statusAssigned: "Assigned",
    statusDamaged: "Damaged",
    statusLost: "Lost",
    statusReturned: "Returned",
    reportsCustomers: "Customer reports",
    customerReportsTitle: "Customer reports",
    customerReportsDescription: "Customer summary with orders, appointments, activity, and quick actions.",
    withHistory: "With history",
    withAppointments: "With appointments",
    withAppointment: "With appointment",
    lastActivity: "Last activity",
    noCustomersFilters: "No customers match those filters.",
    noEmail: "No email",
    noAddress: "No address",
    export: "Export",
    contact: "Contact",
    activity: "Activity",
    actions: "Actions",
    activePlural: "Active",
    customerReportsSearchPlaceholder: "Search customer, phone, email, or address...",
    withOrders: "With orders",
    noActivity: "No activity",
    nameSort: "Name",
    mostOrders: "Most orders",
    reportsInventory: "Inventory reports",
    inventoryReportsTitle: "Inventory reports",
    inventoryReportsDescription: "Consolidated view of materials, tools, alerts, and internal value.",
    alerts: "Alerts",
    categories: "Categories",
    value: "Value",
    searchInventoryReport: "Search material, tool, person responsible, or category...",
    allStatuses: "All statuses",
    onlyAlerts: "Only alerts",
    internalValue: "Internal value",
    type: "Type",
    itemName: "Name",
    category: "Category",
    quantityShort: "Qty.",
    unitStatus: "Unit/Status",
    responsible: "Responsible",
    noRecordsFilters: "No records match those filters.",
    noName: "No name",
    noCategory: "No category",
    warehouse: "Warehouse",
    available: "Available",
    assignedStatus: "Assigned",
    damaged: "Damaged",
    lost: "Lost",
    stockLow: "Low stock",
    technicalTool: "Technician tool",
    unit: "unit",
    reportsCenter: "Reports center",
    dashboardUnifiedDescription: "General, customer, and inventory reports.",
    inventoryShort: "Inventory",
    general: "General",
    settings: "Settings",
    createOrder: "Create order",
    searchCustomer: "Search customer",
    customerManagement: "Customer management",
    customersLabel: "Customers",
    activeCustomersLabel: "Active",
    appointmentsLabel: "Appointments",
    quickRegistration: "Quick registration",
    newLabel: "New",
    contactDescription: "Name, phone, and email",
    locationDescription: "Service address",
    accessDescription: "Apt, building, and code",
    createNewCustomer: "Create new customer",
    saveCustomer: "Save customer",
    registeredCustomers: "Registered customers",
    contact: "Contact",
    contactDescription: "Name, phone, and email",
    location: "Location",
    locationDescription: "Service address",
    access: "Access",
    accessDescription: "Apt, building, and code",
    mainInformation: "Main information",
    basicContactData: "Basic contact details",
    serviceLocation: "Service location",
    serviceLocationDescription: "Address where the work will be performed",
    accessDetails: "Access details",
    accessDetailsDescription: "Useful information to arrive without delays",
    customerName: "Customer name",
    customerNamePlaceholder: "Ex. Luis Martinez",
    emailPlaceholder: "customer@email.com",
    fullAddress: "Full address",
    addressPlaceholder: "Start typing the address...",
    compactTable: "Compact table",
    searchCustomerPlaceholder: "Search customer...",
    mostRecent: "Most recent",
    nameAZ: "Name A-Z",
    dateLastMovement: "Date / last activity",
    noHistory: "No history",
    noEmail: "No email",
    noAddress: "No address",
    activeOrder: "Active order",
    noOrder: "No order",
    customerRequiredAlert: "Name, phone, and address are required.",
    ordersCountLabel: "Orders",
    appointmentsCountLabel: "Appointments",
    orderAction: "Order",
    appointmentAction: "Appointment",
    building: "Building",
    street: "Street",
    accessCode: "Access code",
    geoapifyHelp: "Autocomplete with Geoapify. Type at least 3 letters and select an address.",
    reportedProblem: "Reported problem",
    assignTech: "Assign technician",
    priority: "Priority",
    create: "Create",
    add: "Add",
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
    calendar: "Calendar",
    visualAgenda: "Visual agenda",
    calendarDescription: "View appointments and scheduled work orders by day, week, technician, and priority.",
    events: "Events",
    today: "Today",
    allTechnicians: "All technicians",
    month: "Month",
    week: "Week",
    monthlyView: "Monthly view",
    weeklyView: "Weekly view",
    colorsByTechnician: "Technician colors",
    activeTeam: "Active team",
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
    historyTitle: "Order history",
    historyDescription: "View completed and canceled work orders in one place, with filters and quick actions.",
    total: "Total",
    records: "records",
    orderRecords: "Order records",
    completedAndCancelled: "Completed and canceled",
    searchHistoryPlaceholder: "Search by customer, technician, issue, address, or status...",
    all: "All",
    mostRecent: "Most recent",
    oldest: "Oldest",
    noHistoryOrders: "No history orders match those filters.",
    deletedCustomer: "Deleted customer",
    noPhone: "No phone",
    noTechnician: "No technician",
    noDate: "No date",
    noTime: "No time",
    scheduledAppointment: "Scheduled appointment",
    workOrderFallback: "Work order",
    quickActions: "Quick actions",
    noMaterials: "No materials",
    viewOrder: "View order",
    sendReport: "Send report",
    serviceReportTitle: "HVAC service report",
    customerReport: "Customer report",
    technicianNotes: "Technician notes",
    noRegisteredMaterials: "No materials registered.",
    customerSignature: "Customer signature",
    noPhotosAdded: "No images were added to this order.",
    noCustomerSignatureCaptured: "No customer signature was captured.",
    customerRequest: "Customer request",
    serviceDetails: "Service details",
    photoEvidence: "Photo evidence",
    generatedFromHVACManager: "Generated from HVAC Manager",
    generatedReportFooter: "Report generated from HVAC Manager · Internal cost information excluded.",
    reportStatus: "Status",
    noStatus: "No status",
    reportPriority: "Priority",
    accessDetailsShort: "Access",
    reportedProblemTitle: "Reported problem",
    noReportedProblemSentence: "No reported problem.",
    summarizedTimeline: "Summary timeline",
    orderCreated: "Order created",
    technicianArrived: "Technician arrived",
    workStarted: "Work started",
    workCompleted: "Work completed",
    noReason: "No reason",
    usedMaterials: "Used materials",
    before: "Before",
    during: "During",
    after: "After",
    signed: "Signed",
    noCustomerSignature: "This order does not have a registered customer signature.",
    adminCorrection: "Administrative correction",
    newTechnician: "New technician",
    addTechnician: "Add technician",
    technicianCreateDescription: "Create technician users to assign work orders, appointments, and tools.",
    active: "Active",
    entry: "Start date",
    quickForm: "Quick form",
    technicianData: "Technician data",
    userPasswordContact: "User · Password · Contact",
    name: "Name",
    technicianName: "Technician name",
    passwordLabel: "Password",
    entryDate: "Start date",
    exitDate: "Exit date",
    hourlyPay: "Hourly pay ($)",
    payrollOperational: "Operational payroll",
    technicianHoursPay: "Technician hours and pay",
    realWorkOnly: "Calculated only with real work hours, not travel.",
    consultedWeek: "Selected week",
    consultedDay: "Today",
    consultedMonth: "Selected month",
    consultedYear: "Selected year",
    allHistory: "All history",
    work: "Work",
    travel: "Travel",
    pay: "Pay",
    earned: "Earned",
    completedOrdersPeriod: "completed orders in this period",
    hourlyPayShort: "Hourly pay",
    totalPay: "Total",
    technicianActiveLogin: "The technician will remain active and can sign in with their username and password.",
    editTechnician: "Edit technician",
    cancel: "Cancel",
    enterTechnicianName: "Enter the technician name.",
    saveTechnicianError: "Could not save the technician in Supabase.",
    agenda: "Schedule",
    todayOrders: "Today's orders",
    noOrdersToday: "You have no orders or appointments today.",
    assignedOrdersAppearHere: "Assigned orders and appointments will appear here ordered by time.",
    previousPending: "Previous pending",
    overdueOrders: "Overdue orders",
    upcoming: "Upcoming",
    new: "New",
    quickAgenda: "Quick agenda",
    createAppointmentTitle: "Create appointment",
    appointmentCreateDescription: "Select customer, technician, date, and reason to schedule the visit.",
    whoReceivesService: "Who will receive the service",
    whoHandlesAppointment: "Who will handle the appointment",
    dateAndTime: "Date and time",
    clearScheduling: "Clear scheduling",
    modernForm: "Modern form",
    appointmentData: "Appointment data",
    saveAppointment: "Save appointment",
    customerAndTechnician: "Customer and technician",
    selectCustomerAndTechnician: "Select who receives and who handles it",
    searchCustomerAppointment: "Search customer, phone, email, or address...",
    selectedCustomer: "Selected customer",
    change: "Change",
    noCustomersFound: "No customers found.",
    selectTechnician: "Select technician",
    scheduling: "Scheduling",
    visitDateAndTime: "Visit date and time",
    visitDetail: "Visit details",
    describeAppointmentReason: "Describe the appointment reason",
    reason: "Reason",
    reasonPlaceholder: "Ex. Air conditioner inspection",
    dynamicTable: "Dynamic table",
    appointmentsList: "Appointments list",
    searchAppointment: "Search appointment...",
    allAppointments: "All",
    scheduledPlural: "Scheduled",
    completedPlural: "Completed",
    cancelledPlural: "Cancelled",
    dateTime: "Date / Time",
    noAppointments: "No appointments to show.",
    noReason: "No reason",
    createOrderAction: "Create order",
    quickOrder: "Quick order",
    quickOrderDescription: "Create and assign a work order in a few steps.",
    selectCustomerForOrder: "Search and select the customer for this order",
    customerSearchPlaceholder: "Name, phone, email, or address",
    schedulingDescription: "Set the date and time for the visit",
    reportedProblemDescription: "Describe what the technician needs to check",
    assignedTechnician: "Assigned technician",
    assignedTechnicianDescription: "The administrator assigns it, the technician completes it",
    priorityDescription: "Define how urgent the service is",
    administrativeTracking: "Administrative tracking",
    administrativeTrackingDescription: "Active work orders grouped by technician, priority, and period.",
    year: "Year",
    assignedTechnicianLabel: "Assigned technician",
    ordersLabel: "orders",
    weekOf: "Week of",
    noAssignedTechnician: "No assigned technician",
    noGeneratedOrdersYet: "No orders generated yet.",
    urgentPlural: "Urgent",
    overduePlural: "Overdue",
    period: "Period",
    orderSingular: "order",
    orderPlural: "orders",
    orderId: "Order",
    noReportedProblem: "No reported problem",
    unassigned: "Unassigned",
    scheduledLabel: "Scheduled",
    closeShareMenu: "Close share menu",
    systemShare: "System share",
    createOrderTitle: "Create order",
    createOrderDescription: "Create, schedule, and assign the job to the right technician.",
    generatedOrdersList: "Generated work orders",
    generatedOrdersDescription: "Orders are reviewed here. Execution stays in the assigned technician profile.",
    operationalHealth: "Operational health",
    visualIndicators: "Visual indicators",
    selectedPeriodSummary: "Internal summary for the selected period",
    completedOrders: "Completed orders",
    cancellations: "Cancellations",
    inventoryValue: "Inventory value",
    lowStock: "Low stock",
    toolAlerts: "Tools",
    dashboardExecutive: "Executive dashboard",
    dashboardReports: "Dashboard reports",
    exportExcel: "Export Excel",
    printPdf: "Print/PDF",
    searchDashboardPlaceholder: "Search by technician, status, priority, or issue...",
    allMonths: "All months",
    filteredTotal: "Filtered total",
    currentBase: "Current base",
    usedMaterials: "Used materials",
    periodCost: "Period cost",
    mainSummary: "Main summary",
    completedJobs: "Completed",
    closedJobs: "Closed jobs",
    cancellationDetails: "Cancellation details",
    internalAdminInfo: "Internal administration information",
    byCustomer: "By customer",
    byCompany: "By company",
    byTechnician: "By technician",
    monthlyTrend: "Monthly trend",
    activeOrders: "Active",
    consumption: "Consumption",
    unitsUsed: "units used",
    operationalHistory: "Operational history",
    months: "months",
    noMaterialsFiltered: "No materials consumed in the filtered orders.",
    noNamedMaterial: "Unnamed material",
    topTen: "Top 10",
    totalLabel: "total",
    recordsCount: "records",
    of: "of",
    themeLabel: "Theme",
    teamLabel: "Team",
    normalMaintenance: "normal maintenance",
    scheduledService: "scheduled service",
    customerNoAcHeat: "customer without AC or heat",
    emergencySystemStopped: "emergency / stopped system",
    assignToTechnician: "Assign to technician",
    blue: "Blue",
    green: "Green",
    purple: "Purple",
    orange: "Orange",
    pink: "Pink",
    gray: "Gray",
    deleteAppointmentConfirm: "Delete this appointment?",
    scheduled: "Scheduled",
    completedAppointment: "Completed",
    convertedToOrder: "Converted to work order",
    activeTechnicians: "Active technicians",
    inactiveHistory: "Inactive history",
    inService: "In service",
    inactiveData: "Inactive records",
    actions: "Actions",
    contact: "Contact",
    color: "Color",
    startDate: "Start Date",
    exit: "Exit",
    inactive: "Inactive",
    deactivate: "Deactivate",
    reactivate: "Reactivate",
    remove: "Delete",
    edit: "Edit",
    searchTechnician: "Search technician...",
    deleteTechnicianConfirm: "Permanently delete",
    dayDetail: "Day details",
    noEventsDay: "No events for this day.",
    noActiveTechnicians: "No active technicians.",
    history: "History",
    dashboard: "Dashboard",
    searchCalendarPlaceholder: "Search customer, technician, address, or work...",
    technician: "Technician",
    customer: "Customer",
    address: "Address",
    phone: "Phone",
    status: "Status",
    completed: "Completed",
    cancelled: "Canceladas",
    needsFollowUp: "Follow-up needed",
    time: "Time",
    map: "Map",
    noAddress: "No address",
    appointment: "Appointment",
    overdue: "Overdue",
    workOrder: "Work order",
    technicianAgenda: "Technician agenda",
    assignedWork: "Assigned work",
    assignedWorkDescription: "Separated by unattended orders, today\'s work, scheduled appointments, and upcoming visits.",
    clearAgenda: "Clear agenda",
    allOrders: "All orders",
    unattended: "Unattended",
    ordersToday: "Orders today",
    appointmentsToday: "Appointments today",
    activeLabel: "Active",
    closedLabel: "Closed",
    appointmentsLabelShort: "Appointments",
    noAssignedActiveWork: "You have no active assigned orders or appointments.",
    hideWork: "Hide work",
    viewWork: "View work",
    closeLabel: "Closing",
    notClosed: "Not closed",
    materialUsed: "Material used",
    noMaterialAdded: "No material has been added.",
    noPhoto: "No photo",
    selectPhoto: "Choose photo",
    technicianHistoryTitle: "Technician history",
    technicianHistoryDescription: "Completed and cancelled orders.",
    searchTechnicianHistoryPlaceholder: "Search by customer, phone, problem, or reason...",
    noOrdersInFilter: "No orders in this filter.",
    reasonLabel: "Reason",
    noReasonRegistered: "No reason registered",
    noteLabel: "Note",
    customRange: "Custom",
    fromDate: "From",
    toDate: "To",
    activeRange: "Active range",
    clearRange: "Clear range",
    exportCsv: "Export CSV",
    deletedCustomer: "Deleted customer",
    noReportedProblem: "No reported problem",
    noTechnician: "No technician",
    noDate: "No date",
    call: "Call",
    route: "Route",
    followUpLabel: "Follow-up",
    priorityLabel: "Priority",
    dateLabel: "Date",
    startLabel: "Start",
    notStarted: "Not started",
    workLabel: "Work",
    travelLabel: "Travel",
    workDetailsPlaceholder: "Details of the work performed...",
    goToCustomer: "Go to customer",
    arrivedOnSite: "Arrived on site",
    startWork: "Start work",
    finishWork: "Finish work",
    requiresFollowUp: "Requires follow-up",
    unattendedVisitPending: "Unattended / pending visit",
    previousActiveOrders: "Previous orders that are still active",
    ordersForToday: "Orders for today",
    mainWorkDay: "Main work for the day",
    scheduledAppointmentsToday: "Scheduled appointments today",
    separateAppointmentsAgenda: "Appointments agenda separated from work orders",
    overdueAppointments: "Overdue appointments",
    previousAppointmentsNeedFollowUp: "Previous appointments that need follow-up",
    upcomingOrders: "Upcoming orders",
    scheduledWorkLater: "Work scheduled for later",
    upcomingAppointments: "Upcoming appointments",
    futureAppointments: "Future appointments",
    undatedOrders: "Undated orders",
    undatedAppointments: "Undated appointments",
    needsAdminReview: "Needs administrative review",
    sundayShort: "Sun",
    mondayShort: "Mon",
    tuesdayShort: "Tue",
    wednesdayShort: "Wed",
    thursdayShort: "Thu",
    fridayShort: "Fri",
    saturdayShort: "Sat",
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
  const [ordenForm, setOrdenForm] = useState({ clienteId: "", problema: "", tecnicoId: "", prioridad: "Media", fechaProgramada: "", horaProgramada: "", precioCobrado: "" });
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


  useEffect(() => {
    async function cargarCitasSupabase() {
      try {
        const citasSupabase = await obtenerCitasSupabase();
        setCitas(citasSupabase);
      } catch (error) {
        console.error("Error cargando citas desde Supabase:", error);
      }
    }

    cargarCitasSupabase();
  }, []);


  useEffect(() => {
    async function cargarOrdenesSupabase() {
      try {
        const ordenesSupabase = await obtenerOrdenesSupabase();
        setOrdenes(ordenesSupabase);
      } catch (error) {
        console.error("Error cargando órdenes desde Supabase:", error);
      }
    }

    cargarOrdenesSupabase();
  }, []);



  useEffect(() => {
    async function cargarMaterialesOrdenesSupabase() {
      try {
        const materialesSupabase = await obtenerMaterialesOrdenesSupabase();

        if (!materialesSupabase.length) return;

        setOrdenes((actual) =>
          actual.map((orden) => ({
            ...orden,
            materialesUsados: materialesSupabase
              .filter((m) => String(m.ordenId) === String(orden.id))
              .map((m) => ({
                id: m.id,
                inventarioId: m.inventarioId,
                cantidad: m.cantidad,
                costoUnitario: m.costoUnitario,
              })),
          }))
        );
      } catch (error) {
        console.error("Error cargando materiales de órdenes desde Supabase:", error);
      }
    }

    cargarMaterialesOrdenesSupabase();
  }, []);

  useEffect(() => {
    async function cargarFirmasSupabase() {
      try {
        const firmasSupabase = await obtenerFirmasOrdenesSupabase();

        if (!firmasSupabase.length) return;

        setOrdenes((actual) =>
          actual.map((orden) => {
            const firma = firmasSupabase.find((f) => String(f.ordenId) === String(orden.id));
            return firma
              ? {
                  ...orden,
                  firmaCliente: firma.firmaCliente,
                  fechaFirmaCliente: firma.fechaFirmaCliente,
                  calificacionCliente: firma.calificacion,
                  comentarioCliente: firma.comentario,
                }
              : orden;
          })
        );
      } catch (error) {
        console.error("Error cargando firmas desde Supabase:", error);
      }
    }

    cargarFirmasSupabase();
  }, []);


  useEffect(() => {
    async function cargarFotosSupabase() {
      try {
        const fotosSupabase = await obtenerFotosOrdenesSupabase();

        if (!fotosSupabase.length) return;

        setOrdenes((actual) =>
          actual.map((orden) => {
            const fotosOrden = fotosSupabase.filter((f) => String(f.ordenId) === String(orden.id));

            if (!fotosOrden.length) return orden;

            const fotos = { ...(orden.fotos || {}) };

            fotosOrden.forEach((foto) => {
              if (foto.tipo) fotos[foto.tipo] = foto.url;
            });

            return { ...orden, fotos };
          })
        );
      } catch (error) {
        console.error("Error cargando fotos desde Supabase:", error);
      }
    }

    cargarFotosSupabase();
  }, []);


  useEffect(() => {
    async function cargarHerramientasSupabase() {
      try {
        const herramientasSupabase = await obtenerHerramientasSupabase();
        setHerramientas(herramientasSupabase);
      } catch (error) {
        console.error("Error cargando herramientas desde Supabase:", error);
      }
    }

    cargarHerramientasSupabase();
  }, []);

  useEffect(() => {
    async function cargarInventarioSupabase() {
      try {
        const inventarioSupabase = await obtenerInventarioSupabase();
        setInventario(inventarioSupabase);
      } catch (error) {
        console.error("Error cargando inventario desde Supabase:", error);
      }
    }

    cargarInventarioSupabase();
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
    if (!clienteForm.nombre || !clienteForm.telefono) {
      return setMensaje("Nombre y teléfono son obligatorios.");
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

  const crearOrden = async () => {
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
      precioCobrado: Number(ordenForm.precioCobrado || 0),
      fotos: { antes: "", durante: "", despues: "" },
      notasTecnico: "",
      inventarioDescontado: false,
      cancelReason: "",
    };

    try {
      const nuevaOrden = await crearOrdenSupabase(orden);
      setOrdenes([...ordenes, nuevaOrden]);
      setOrdenForm({ clienteId: String(ordenForm.clienteId), problema: "", tecnicoId: "", prioridad: "Media", fechaProgramada: "", horaProgramada: "", precioCobrado: "" });
      setMensaje("Orden asignada correctamente. Ahora aparecerá en el panel del técnico seleccionado.");
    } catch (error) {
      console.error("Error guardando orden en Supabase:", error);
      alert(JSON.stringify(error, null, 2));
      setMensaje("No se pudo guardar la orden en Supabase.");
    }
  };

  const convertirCitaEnOrden = async (cita) => {
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

    const nuevaOrdenBase = {
      clienteId,
      tecnicoId,
      origenCitaId: cita.id,
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
    };

    try {
      const nuevaOrden = await crearOrdenSupabase(nuevaOrdenBase);

      await actualizarCitaSupabase(cita.id, {
        estado: "Convertida en orden",
        ordenId: nuevaOrden.id,
        fechaConversion: fecha.toISOString(),
      });

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
    } catch (error) {
      console.error("Error convirtiendo cita en orden:", error);
      alert(JSON.stringify(error, null, 2));
      setMensaje("No se pudo convertir la cita en orden.");
    }
  };

  const cerrarCitaSinOrden = async (cita) => {
    if (!cita) return;

    const motivo = window.prompt(
      "Motivo para cerrar la cita sin orden:\n\nEjemplos: Diagnóstico realizado, cotización entregada, cliente canceló, no hubo acceso.",
      "Diagnóstico realizado"
    );

    if (motivo === null) return;

    const finalMotivo = String(motivo || "").trim() || "Cita cerrada sin orden";

    try {
      const citaActualizada = await actualizarCitaSupabase(cita.id, {
        estado: "Finalizada",
        motivo: cita.motivo || "Cita programada",
        historialReprogramaciones: [
          ...(cita.historialReprogramaciones || []),
          {
            tipo: "Cierre sin orden",
            motivo: finalMotivo,
            fechaCambio: new Date().toISOString(),
          },
        ],
      });

      setCitas(citas.map((item) => (
        String(item.id) === String(cita.id) ? citaActualizada : item
      )));

      setMensaje("Cita cerrada sin crear orden.");
    } catch (error) {
      console.error("Error cerrando cita:", error);
      alert(JSON.stringify(error, null, 2));
      setMensaje("No se pudo cerrar la cita.");
    }
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

  const marcarEnRuta = async (id) => {
    const orden = ordenes.find((o) => o.id === id);
    if (!orden) return;

    const cambios = {
      estado: "En ruta",
      horaEnRuta: orden.horaEnRuta || new Date().toISOString(),
    };

    setOrdenes(ordenes.map((o) => o.id === id ? { ...o, ...cambios } : o));

    try {
      await actualizarOrdenSupabase(id, cambios);
    } catch (error) {
      console.error("Error actualizando En ruta en Supabase:", error);
      setMensaje("No se pudo guardar el estado En ruta en Supabase.");
    }
  };

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
  const iniciarTrabajo = async (id) => {
    const orden = ordenes.find((o) => o.id === id);
    if (!orden) return;

    const cambios = {
      estado: "En proceso",
      horaInicio: orden.horaInicio || new Date().toISOString(),
    };

    setOrdenes(ordenes.map((o) => o.id === id ? { ...o, ...cambios } : o));

    try {
      await actualizarOrdenSupabase(id, cambios);
    } catch (error) {
      console.error("Error iniciando trabajo en Supabase:", error);
      setMensaje("No se pudo guardar el inicio de trabajo en Supabase.");
    }
  };

  const marcarNecesitaSeguimiento = async (id) => {
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

    const cambios = {
      estado: "Necesita seguimiento",
      seguimientoMotivo: motivo.trim(),
      seguimientoFechaSugerida: fechaSugerida || "",
      seguimientoFechaRegistro: new Date().toISOString(),
    };

    setOrdenes(ordenes.map((o) => (
      o.id === id ? { ...o, ...cambios } : o
    )));

    try {
      await actualizarOrdenSupabase(id, cambios);
      setMensaje("Orden marcada como Necesita seguimiento. Seguirá apareciendo en órdenes activas.");
    } catch (error) {
      console.error("Error guardando seguimiento en Supabase:", error);
      alert(JSON.stringify(error, null, 2));
      setMensaje("No se pudo guardar el seguimiento en Supabase.");
    }
  };
  const guardarFirmaCliente = async (ordenId, firmaDataUrl) => {
    if (!firmaDataUrl) {
      alert("No hay firma para guardar.");
      return;
    }

    const cliente = firmaOrdenModal ? obtenerCliente(firmaOrdenModal.clienteId) : null;

    try {
      const firmaGuardada = await guardarFirmaOrdenSupabase({
        ordenId,
        firmaCliente: firmaDataUrl,
        nombreCliente: cliente?.nombre || "",
        calificacion: 0,
        comentario: "",
      });

      setOrdenes(ordenes.map((o) => (
        o.id === ordenId
          ? {
              ...o,
              firmaCliente: firmaGuardada.firmaCliente,
              fechaFirmaCliente: firmaGuardada.fechaFirmaCliente,
              calificacionCliente: firmaGuardada.calificacion,
              comentarioCliente: firmaGuardada.comentario,
            }
          : o
      )));

      setFirmaOrdenModal(null);
      setMensaje("Firma del cliente guardada correctamente.");
    } catch (error) {
      console.error("Error guardando firma en Supabase:", error);
      alert(JSON.stringify(error, null, 2));
      setMensaje("No se pudo guardar la firma en Supabase.");
    }
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
  const esUUID = (v) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(v || ""));

  const agregarMaterialAOrden = async (ordenId) => {
    if (!esUUID(ordenId)) {
      alert("Esta orden fue creada antes de Supabase. Crea una orden nueva para guardar materiales persistentes.");
      return;
    }

    try {
      const nuevoMaterial = await crearOrdenMaterialSupabase({
        ordenId,
        inventarioId: "",
        cantidad: 0,
        costoUnitario: 0,
      });

      setOrdenes(ordenes.map((o) => (
        o.id === ordenId
          ? { ...o, materialesUsados: [...(o.materialesUsados || []), nuevoMaterial] }
          : o
      )));
    } catch (error) {
      console.error("Error agregando material a orden:", error);
      alert(JSON.stringify(error, null, 2));
    }
  };

  const actualizarMaterialOrden = async (ordenId, materialId, campo, valor) => {
    const materialActual = ordenes
      .find((o) => o.id === ordenId)
      ?.materialesUsados
      ?.find((m) => m.id === materialId);

    const cambios = { [campo]: valor };

    if (campo === "inventarioId") {
      const item = obtenerMaterial(valor);
      cambios.costoUnitario = Number(item?.costo || 0);
    }

    setOrdenes(ordenes.map((o) => (
      o.id === ordenId
        ? {
            ...o,
            materialesUsados: (o.materialesUsados || []).map((m) =>
              m.id === materialId ? { ...m, ...cambios } : m
            ),
          }
        : o
    )));

    if (!esUUID(materialId)) {
      return;
    }

    try {
      await actualizarOrdenMaterialSupabase(materialId, {
        ...cambios,
        cantidad: campo === "cantidad" ? Number(valor || 0) : materialActual?.cantidad,
      });
    } catch (error) {
      console.error("Error actualizando material de orden:", error);
      alert(JSON.stringify(error, null, 2));
    }
  };

  const eliminarMaterialOrden = async (ordenId, materialId) => {
    setOrdenes(ordenes.map((o) => (
      o.id === ordenId
        ? { ...o, materialesUsados: (o.materialesUsados || []).filter((m) => m.id !== materialId) }
        : o
    )));

    if (!esUUID(materialId)) {
      return;
    }

    try {
      await eliminarOrdenMaterialSupabase(materialId);
    } catch (error) {
      console.error("Error eliminando material de orden:", error);
      alert(JSON.stringify(error, null, 2));
    }
  };
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

  const completarOrden = async (id) => {
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

    const cambiosOrdenCompletada = {
      estado: "Completado",
      horaInicio: inicio,
      horaCierre: cierre,
      duracionHoras: calcularHoras(inicio, cierre),
      duracionTraslado,
      fechaCompletada: cierre,
      costoMateriales: calcularCostoOrden(orden),
      inventarioDescontado: true,
    };

    setOrdenes(ordenes.map((o) => o.id === id ? { ...o, ...cambiosOrdenCompletada } : o));

    try {
      await actualizarOrdenSupabase(id, cambiosOrdenCompletada);
    } catch (error) {
      console.error("Error completando orden en Supabase:", error);
      alert(JSON.stringify(error, null, 2));
      setMensaje("La orden se completó localmente, pero no se pudo actualizar en Supabase.");
    }

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

  const subirFoto = async (id, tipo, archivo) => {
    if (!archivo) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const fotoDataUrl = reader.result;

      setOrdenes((actual) =>
        actual.map((o) =>
          o.id === id ? { ...o, fotos: { ...o.fotos, [tipo]: fotoDataUrl } } : o
        )
      );

      try {
        await guardarFotoOrdenSupabase({
          ordenId: id,
          tipo,
          url: fotoDataUrl,
        });
      } catch (error) {
        console.error("Error guardando foto en Supabase:", error);
        alert(JSON.stringify(error, null, 2));
      }
    };

    reader.readAsDataURL(archivo);
  };
  const guardarNotaTecnico = async (id, nota) => {
    setOrdenes(ordenes.map((o) => o.id === id ? { ...o, notasTecnico: nota } : o));

    try {
      await actualizarOrdenSupabase(id, { notasTecnico: nota });
    } catch (error) {
      console.error("Error guardando nota técnica en Supabase:", error);
      setMensaje("No se pudo guardar la nota técnica en Supabase.");
    }
  };

  const corregirOrdenAdmin = async (id) => {
    const orden = ordenes.find((o) => String(o.id) === String(id));
    if (!orden) return;

    const motivo = prompt("Motivo obligatorio de la corrección:");
    if (!motivo || !motivo.trim()) {
      return setMensaje("Debes escribir un motivo para corregir la orden.");
    }

    const nuevoInicio = prompt("Hora inicio corregida en formato ISO o vacío para no cambiar:", orden.horaInicio || "");
    const nuevoCierre = prompt("Hora cierre corregida en formato ISO o vacío para no cambiar:", orden.horaCierre || "");
    const nuevaDuracionTraslado = prompt("Tiempo de traslado corregido o vacío para no cambiar:", orden.duracionTraslado || "");
    const nuevaNota = prompt("Nota técnica corregida o vacío para no cambiar:", orden.notasTecnico || "");
    const nuevoEstado = prompt("Estado corregido: Completado o Necesita seguimiento. Vacío para no cambiar:", orden.estado || "");

    const cambios = {};
    const historialNuevo = [...(orden.historialAdmin || [])];

    const registrarCambio = (campo, anterior, nuevo) => {
      if (String(anterior || "") === String(nuevo || "")) return;

      cambios[campo] = nuevo;
      historialNuevo.push({
        fecha: new Date().toISOString(),
        usuario: session?.nombre || session?.usuario || "Admin",
        rol: session?.role || "admin",
        campo,
        anterior: anterior || "",
        nuevo: nuevo || "",
        motivo: motivo.trim(),
      });
    };

    if (nuevoInicio !== null && nuevoInicio !== "") {
      registrarCambio("horaInicio", orden.horaInicio || "", nuevoInicio);
    }

    if (nuevoCierre !== null && nuevoCierre !== "") {
      registrarCambio("horaCierre", orden.horaCierre || "", nuevoCierre);
    }

    if (nuevaDuracionTraslado !== null && nuevaDuracionTraslado !== "") {
      registrarCambio("duracionTraslado", orden.duracionTraslado || "", nuevaDuracionTraslado);
    }

    if (nuevaNota !== null && nuevaNota !== "") {
      registrarCambio("notasTecnico", orden.notasTecnico || "", nuevaNota);
    }

    if (nuevoEstado !== null && nuevoEstado !== "") {
      if (!["Completado", "Necesita seguimiento"].includes(nuevoEstado)) {
        return setMensaje("Estado inválido. Solo puedes usar Completado o Necesita seguimiento.");
      }

      registrarCambio("estado", orden.estado || "", nuevoEstado);
    }

    const inicioFinal = cambios.horaInicio || orden.horaInicio;
    const cierreFinal = cambios.horaCierre || orden.horaCierre;

    if (inicioFinal && cierreFinal) {
      const nuevaDuracion = calcularHoras(inicioFinal, cierreFinal);
      registrarCambio("duracionHoras", orden.duracionHoras || "", nuevaDuracion);
    }

    if (historialNuevo.length === (orden.historialAdmin || []).length) {
      return setMensaje("No se realizó ningún cambio.");
    }

    cambios.historialAdmin = historialNuevo;

    setOrdenes(ordenes.map((o) => (
      String(o.id) === String(id) ? { ...o, ...cambios } : o
    )));

    try {
      await actualizarOrdenSupabase(id, cambios);
      setMensaje("Orden corregida por admin. Cambio registrado en auditoría interna.");
    } catch (error) {
      console.error("Error corrigiendo orden como admin:", error);
      alert(JSON.stringify(error, null, 2));
      setMensaje("No se pudo guardar la corrección en Supabase.");
    }
  };

  const materialesTexto = (orden) => (orden.materialesUsados || []).filter((m) => m.inventarioId && Number(m.cantidad) > 0).map((m) => `${obtenerMaterial(m.inventarioId)?.nombre || "Material"} (${m.cantidad} ${obtenerMaterial(m.inventarioId)?.unidad || ""})`).join("; ");

  const crearTextoOrden = (orden) => {
    const c = obtenerCliente(orden.clienteId);
    const tec = obtenerTecnico(orden.tecnicoId);
    const fecha = formatReportDate(orden.fechaCompletada || orden.fechaCreacion || orden.fecha);
    const ordenIdCompleto = String(orden.id || "");
    const ordenIdCorto = ordenIdCompleto ? ordenIdCompleto.slice(0, 8) : "";
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
      `${orden.problema || t("noReportedProblem")}`,
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
    const ordenIdCompleto = String(orden.id || "");
    const ordenIdCorto = ordenIdCompleto ? ordenIdCompleto.slice(0, 8) : "";

    const fotos = [
      [t("before"), orden.fotos?.antes],
      [t("during"), orden.fotos?.durante],
      [t("after"), orden.fotos?.despues],
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
      : `${`<div class="empty">${t("noPhotosAdded")}</div>`}`;

    const firmaHTML = orden.firmaCliente
      ? `<div class="signature-box">
          <img src="${orden.firmaCliente}" alt="${t("customerSignature")}" />
          <p>${t("customerSignature")}</p>
          <small>${escapeHtml(formatReportDate(orden.fechaFirmaCliente || ""))}</small>
        </div>`
      : `${`<div class="empty">${t("noCustomerSignatureCaptured")}</div>`}`;

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
    .signature-box{border:2px solid #dbeafe;border-radius:18px;padding:14px;background:white;text-align:center}
    .signature-box img{max-width:360px;max-height:120px;width:100%;object-fit:contain;border-bottom:1px solid #cbd5e1;padding-bottom:8px}
    .signature-box p{margin:8px 0 2px;font-weight:900;color:#0f172a}
    .signature-box small{color:#64748b;font-weight:800}
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
        <div style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.18em;color:#64748b">${t("order")}</div><div class="id">#${escapeHtml(ordenIdCorto)}</div>
        <div style="margin-top:10px">
          <span class="badge ${orden.estado === "Completado" ? "ok" : orden.estado === "Cancelada" ? "bad" : ""}">${escapeHtml(({ Pendiente: t("pending"), Asignada: t("assigned"), "En ruta": t("onRoute"), "En proceso": t("inProgress"), Completado: t("completed"), Cancelada: t("cancelled"), "Necesita seguimiento": t("needsFollowUp") }[orden.estado] || orden.estado || t("pending")))}</span>
        </div>
        <div style="margin-top:10px;color:#64748b;font-weight:900">${escapeHtml(fecha)}</div>
      </div>
    </header>

    <section class="section">
      <div class="card soft">
        <h2>${t("customer")}</h2>
        <div class="row"><div class="label">${t("name")}</div><div class="value">${escapeHtml(c?.nombre || "")}</div></div>
        <div class="row"><div class="label">${t("phone")}</div><div class="value">${escapeHtml(formatPhoneDisplay(c?.telefono || ""))}</div></div>
        <div class="row"><div class="label">${t("address")}</div><div class="value">${escapeHtml(c?.direccion || "")}</div></div>
        <div class="row">
          <div class="label">Access</div>
          <div class="value">
            Apt: ${escapeHtml(c?.apartamento || "—")}<br/>
            ${t("building")}: ${escapeHtml(c?.edificio || "—")}<br/>
            ${t("accessCode")}: ${escapeHtml(c?.codigoAcceso || "—")}
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-title"><h2>${t("customerRequest")}</h2></div>
      <div class="text-box">${escapeHtml(orden.problema || "Sin problema reportado.")}</div>
    </section>

    <section class="section">
      <div class="section-title"><h2>${t("serviceDetails")}</h2></div>
      <div class="text-box">${escapeHtml(orden.notasTecnico || "Sin notas del técnico.")}</div>
    </section>

    <section class="section">
      <div class="section-title"><h2>${t("photoEvidence")}</h2><span class="badge">${fotos.length}/3 ${t("photos").toLowerCase()}</span></div>
      <div class="photos">${fotoHTML}</div>
    </section>

    <section class="section">
      <div class="section-title"><h2>Firma del cliente</h2></div>
      ${firmaHTML}
    </section>

    <footer class="footer">
      <div>${t("generatedFromHVACManager")}</div>
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

  const agregarInventario = async () => {
    if (!inventarioForm.nombre || !inventarioForm.cantidad) return;

    try {
      const nuevoItem = await crearInventarioSupabase({
        ...inventarioForm,
        tipo: inventarioForm.tipo || "Material consumible",
        cantidad: Number(inventarioForm.cantidad),
        costo: Number(inventarioForm.costo || 0),
        stockMinimo: Number(inventarioForm.stockMinimo || 0),
      });

      setInventario([...inventario, nuevoItem]);
      setInventarioForm({ nombre: "", categoria: "Unidades de aire acondicionado", tipo: "Material consumible", cantidad: "", unidad: "pieza", costo: "", stockMinimo: "1" });
    } catch (error) {
      console.error("Error guardando inventario en Supabase:", error);
      alert(JSON.stringify(error, null, 2));
      setMensaje("No se pudo guardar el inventario en Supabase.");
    }
  };

  const eliminarInventario = async (id) => {
    try {
      await eliminarInventarioSupabase(id);
      setInventario(inventario.filter((i) => String(i.id) !== String(id)));
    } catch (error) {
      console.error("Error eliminando inventario en Supabase:", error);
      alert(JSON.stringify(error, null, 2));
    }
  };

  const actualizarInventario = async (id, campo, valor) => {
    const finalValue = ["cantidad", "costo", "stockMinimo"].includes(campo) ? Number(valor) : valor;

    setInventario(inventario.map((i) => i.id === id ? { ...i, [campo]: finalValue } : i));

    try {
      await actualizarInventarioSupabase(id, { [campo]: finalValue });
    } catch (error) {
      console.error("Error actualizando inventario en Supabase:", error);
      setMensaje("No se pudo actualizar el inventario en Supabase.");
    }
  };

  const agregarHerramienta = async () => {
    console.log("CREAR HERRAMIENTA", JSON.stringify(herramientaForm, null, 2));
    if (!herramientaForm.nombre || !herramientaForm.tecnicoId) return;

    try {
      const nuevaHerramienta = await crearHerramientaSupabase({
        ...herramientaForm,
        cantidad: Number(herramientaForm.cantidad || 1),
      });

      setHerramientas([...herramientas, nuevaHerramienta]);
      setHerramientaForm({ nombre: "", tecnicoId: "", cantidad: "", estado: "Disponible", notas: "" });
    } catch (error) {
      console.error("Error guardando herramienta en Supabase:", error);
      alert(JSON.stringify(error, null, 2));
      setMensaje("No se pudo guardar la herramienta en Supabase.");
    }
  };

  const eliminarHerramienta = async (id) => {
    try {
      await eliminarHerramientaSupabase(id);
      setHerramientas(herramientas.filter((h) => String(h.id) !== String(id)));
    } catch (error) {
      console.error("Error eliminando herramienta en Supabase:", error);
      alert(JSON.stringify(error, null, 2));
    }
  };

  const actualizarHerramienta = async (id, campo, valor) => {
    const finalValue = campo === "cantidad" ? Number(valor) : valor;

    setHerramientas(herramientas.map((h) => h.id === id ? { ...h, [campo]: finalValue } : h));

    try {
      await actualizarHerramientaSupabase(id, { [campo]: finalValue });
    } catch (error) {
      console.error("Error actualizando herramienta en Supabase:", error);
      setMensaje("No se pudo actualizar la herramienta en Supabase.");
    }
  };

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

  const crearCita = async () => {
    if (!citaForm.clienteId || !citaForm.tecnicoId || !citaForm.fecha || !citaForm.hora) return setMensaje("Completa cliente, técnico, fecha y hora de la cita.");

    if (existeConflictoHorario({
      tecnicoId: citaForm.tecnicoId,
      fecha: citaForm.fecha,
      hora: citaForm.hora,
    })) {
      return setMensaje("Este técnico ya tiene una orden o cita programada para esa misma fecha y hora.");
    }

    try {
      const nuevaCita = await crearCitaSupabase({
        ...citaForm,
        estado: "Programada",
      });

      setCitas([...citas, nuevaCita]);
      setCitaForm({ clienteId: "", tecnicoId: "", fecha: "", hora: "", motivo: "", notas: "" });
    } catch (error) {
      console.error("ERROR COMPLETO SUPABASE:", error);
      alert(JSON.stringify(error, null, 2));
      setMensaje("No se pudo guardar la cita en Supabase.");
    }
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

  const ordenProps = { inventario, obtenerMaterial, obtenerTecnico, colorEstado, colorPrioridad, marcarEnRuta, marcarLlegada, iniciarTrabajo, marcarNecesitaSeguimiento, setFirmaOrdenModal, completarOrden, cancelarOrden, subirFoto, guardarNotaTecnico, corregirOrdenAdmin, session, urlGoogleMaps, urlAppleMaps, urlTelefono, agregarMaterialAOrden, actualizarMaterialOrden, eliminarMaterialOrden, calcularCostoOrden, materialesTexto, compartirOrden, convertirCitaEnOrden, reprogramarCita, setReprogramarCitaModal, cancelarOrden: (ordenOrId) => {
    const orden = typeof ordenOrId === "object" ? ordenOrId : ordenes.find((o) => o.id === ordenOrId);
    setCancelModalOrden(orden || null);
  }, t };

  if (!session) return <LoginScreen t={t} lang={lang} setLang={setLang} loginForm={loginForm} setLoginForm={setLoginForm} iniciarSesion={iniciarSesion} mensaje={mensaje} />;

  const adminNav = [
    ["clientes", t("customers"), Users],
    ["tecnicos", t("technicians"), UserCog],
    ["citas", t("appointments"), CalendarDays],
    ["calendario", t("calendar"), CalendarCheck2],
    ["ordenes", t("orders"), ClipboardList],
    ["historial", t("history"), History],
    ["inventario", t("inventory"), Package],
    ["herramientas", t("tools"), Wrench],
    ["dashboardReportes", t("dashboard"), TrendingUp],
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b pl-44 border-slate-900/10 bg-slate-950/90 text-white backdrop-blur-xl shadow-lg shadow-slate-300/40"><img src="/logo-hvac-premium.png" alt="HVAC Refrigeración Maldonado R" className="absolute left-3 top-1/2 h-24 w-auto -translate-y-1/2 rounded-xl bg-white px-2 py-1 shadow-md" />
        <div className="w-full px-3 2xl:px-8 py-2.5 2xl:py-4 flex flex-col 2xl:flex-row 2xl:items-center justify-center 2xl:justify-between gap-2.5 2xl:gap-4">
          <div><p className="text-[10px] 2xl:text-xs uppercase tracking-[0.24em] 2xl:tracking-[0.3em] text-slate-300 font-black">{t("app")}</p><h1 className="text-lg 2xl:text-lg font-black tracking-tight text-white">{session.role === "admin" ? t("adminPanel") : `${t("techPanel")}: ${session.nombre}`}</h1></div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-2 2xl:gap-3 xl:ml-auto">
            <button
              title={t("translate")}
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className={`h-12 w-12 flex items-center justify-center rounded-2xl border transition-all duration-200 ${
                lang === "en"
                  ? "bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/40"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Languages size={22} />
            </button>
            {session.role === "admin" && (
              <button
                title={t("changePassword")}
                onClick={() => setAdminPage("configuracion")}
                className={`h-12 w-12 flex items-center justify-center rounded-2xl border transition-all duration-200 ${
                  adminPage === "configuracion"
                    ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/40"
                    : "bg-slate-950 text-white border-slate-800 hover:bg-slate-800"
                }`}
              >
                <ShieldCheck size={22} />
              </button>
            )}
            <TopInfo now={now} />
            <button onClick={cerrarSesion} className="flex items-center justify-center justify-center gap-1.5 2xl:gap-2 rounded-xl 2xl:rounded-2xl min-w-[150px] 2xl:min-w-[190px] bg-slate-950 px-3 2xl:px-5 py-2 2xl:py-3 text-xs 2xl:text-base text-white font-black shadow-lg shadow-slate-300/40 transition hover:-translate-y-0.5"><LogOut {...iconProps} />{t("logout")}</button>
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
            <nav className="sticky top-[66px] 2xl:top-[92px] z-10 mb-4 grid w-full grid-cols-9 gap-2 rounded-[1.6rem] border border-white/70 bg-gradient-to-r from-white/95 via-blue-50/90 to-cyan-50/90 p-2 shadow-xl shadow-slate-300/50 backdrop-blur-xl">
              {adminNav.map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setAdminPage(id)}
                  className={`
                    flex
                    w-full
                    min-w-[150px]
                    2xl:min-w-[170px]
                    items-center justify-center
                    gap-1.5
                    rounded-[1.25rem]
                    px-3
                    py-3
                    text-[12px]
                    font-black
                    transition
                    ${
                      adminPage === id
                        ? "bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white shadow-xl shadow-blue-900/30 ring-1 ring-cyan-300/30"
                        : "border border-slate-200 bg-white/85 text-slate-700 shadow-md shadow-slate-200/60 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:text-slate-950 hover:shadow-xl"
                    }
                  `}
                >
                  <Icon size={16} strokeWidth={2.2} />
                  <span className="truncate">{label}</span>
                </button>
              ))}</nav>

            {adminPage === "clientes" && <ClientesPage t={t} clientes={clientes} setClientes={setClientes} ordenes={ordenes} citas={citas} clienteForm={clienteForm} setClienteForm={setClienteForm} agregarCliente={agregarCliente} abrirCrearOrdenConCliente={abrirCrearOrdenConCliente} abrirProgramarCitaConCliente={abrirProgramarCitaConCliente} urlGoogleMaps={urlGoogleMaps} urlAppleMaps={urlAppleMaps} urlTelefono={urlTelefono} />}
            {adminPage === "tecnicos" && <TecnicosPage t={t} tecnicos={tecnicos} actualizarTecnico={actualizarTecnico} guardarTecnico={guardarTecnico} darDeBajaTecnico={darDeBajaTecnico} setTecnicos={setTecnicos} />}
            {adminPage === "citas" && <CitasPage t={t} citas={citas} setCitas={setCitas} citaForm={citaForm} setCitaForm={setCitaForm} crearCita={crearCita} convertirCitaEnOrden={convertirCitaEnOrden} clientes={clientes} tecnicos={tecnicosActivos} obtenerCliente={obtenerCliente} obtenerTecnico={obtenerTecnico} />}
            {adminPage === "calendario" && <CalendarioPage t={t} lang={lang} citas={citas} ordenes={ordenes} clientes={clientes} tecnicos={tecnicosActivos} obtenerCliente={obtenerCliente} obtenerTecnico={obtenerTecnico} urlAppleMaps={urlAppleMaps} urlTelefono={urlTelefono} />}
            {adminPage === "ordenes" && <OrdenesPage t={t} ordenes={ordenesActivasAdmin} obtenerCliente={obtenerCliente} ordenProps={ordenProps} crearOrden={crearOrden} ordenForm={ordenForm} setOrdenForm={setOrdenForm} busquedaClienteOrden={busquedaClienteOrden} setBusquedaClienteOrden={setBusquedaClienteOrden} clientesFiltradosOrden={clientesFiltradosOrden} tecnicos={tecnicosActivos} />}
            {adminPage === "historial" && <HistorialPage t={t} lang={lang} ordenes={historialAdmin} obtenerCliente={obtenerCliente} ordenProps={ordenProps} />}
            {adminPage === "inventario" && <InventarioGeneralPage t={t} inventario={inventario} inventarioForm={inventarioForm} setInventarioForm={setInventarioForm} agregarInventario={agregarInventario} actualizarInventario={actualizarInventario} setInventario={setInventario} eliminarInventario={eliminarInventario} />}
            {adminPage === "herramientas" && <HerramientasPage t={t} herramientas={herramientas} herramientaForm={herramientaForm} setHerramientaForm={setHerramientaForm} agregarHerramienta={agregarHerramienta} actualizarHerramienta={actualizarHerramienta} setHerramientas={setHerramientas} tecnicos={tecnicosActivos} obtenerTecnico={obtenerTecnico} tecnicoHerramientasSeleccionado={tecnicoHerramientasSeleccionado} setTecnicoHerramientasSeleccionado={setTecnicoHerramientasSeleccionado} eliminarHerramienta={eliminarHerramienta} />}
            {adminPage === "dashboardReportes" && (
              <DashboardUnificadoPage
                t={t}
                lang={lang}
                lang={lang}
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
                          {t("techPanel")}
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
                              !["Convertida en orden", "Finalizada"].includes(cita.estado);
                            }).length
                          }
                        </p>
                        <p className="text-[8px] font-black uppercase tracking-wide text-cyan-100">{t("today")}</p>
                      </div>

                      <div className="rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/15">
                        <p className="text-lg font-black">{ordenesActivasTecnico.length}</p>
                        <p className="text-[8px] font-black uppercase tracking-wide text-blue-100">{t("activeOrders")}</p>
                      </div>

                      <div className="rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/15">
                        <p className="text-lg font-black">{historialTecnico.length}</p>
                        <p className="text-[8px] font-black uppercase tracking-wide text-emerald-100">{t("history")}</p>
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
                          <p className="text-sm font-black">{t("agenda")}</p>
                          <p className={tecnicoVista === "agenda" ? "text-[10px] font-bold text-slate-300" : "text-[10px] font-bold text-slate-500"}>
                            {t("today")}
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
                            !["Convertida en orden", "Finalizada"].includes(cita.estado);
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
                          <p className="text-sm font-black">{t("orders")}</p>
                          <p className={tecnicoVista === "ordenes" ? "text-[10px] font-bold text-slate-300" : "text-[10px] font-bold text-slate-500"}>
                            {t("activeOrders")}
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
                          <p className="text-sm font-black">{t("history")}</p>
                          <p className={tecnicoVista === "historial" ? "text-[10px] font-bold text-slate-300" : "text-[10px] font-bold text-slate-500"}>
                            {t("closedLabel")}
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
                  onConvertirCita={convertirCitaEnOrden}
                  onCerrarCita={cerrarCitaSinOrden}
                  t={t}
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
                  t={t}
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
            <p className="text-sm font-black text-slate-950">{cliente?.nombre || t("deletedCustomer")}</p>
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
            <p className="text-sm font-black text-slate-950">{cliente?.nombre || t("deletedCustomer")}</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{orden.problema || t("noReportedProblem")}</p>
            <p className="mt-2 text-xs font-bold text-slate-500">
              Técnico: {tecnico?.nombre || t("noTechnician")} · Orden #{orden.id}
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

  citas.filter((cita) => !["Convertida en orden", "Finalizada"].includes(cita.estado)).forEach((cita) => {
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



function TecnicoAssignedTodayPanel({ ordenes = [], citas = [], obtenerCliente, ordenProps, onAbrirOrden, onConvertirCita, onCerrarCita, t }) {
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

  const citaYaTieneOrden = (cita) => {
    let ordenesRespaldo = [];

    try {
      ordenesRespaldo = JSON.parse(localStorage.getItem("ordenes") || "[]");
    } catch {
      ordenesRespaldo = [];
    }

    const ordenesParaComparar = [...ordenes, ...ordenesRespaldo];

    return ordenesParaComparar.some((orden) => {
      const mismaCita = String(orden.origenCitaId || "") === String(cita.id);

      const mismosDatos =
        String(orden.clienteId || "") === String(cita.clienteId || "") &&
        String(orden.tecnicoId || "") === String(cita.tecnicoId || "") &&
        toDateKey(orden.fechaProgramada || orden.fecha || "") === toDateKey(cita.fecha || cita.fechaProgramada || "") &&
        String(orden.horaProgramada || orden.hora || "").slice(0, 5) === String(cita.hora || cita.horaProgramada || "").slice(0, 5);

      return mismaCita || mismosDatos;
    });
  };

  const citaVisibleAgenda = (cita) =>
    !["Convertida en orden", "Finalizada"].includes(cita.estado) &&
    !cita.ordenId &&
    !citaYaTieneOrden(cita);

  const citasHoy = citas
    .filter((cita) => getKey(cita) === hoy && citaVisibleAgenda(cita))
    .sort((a, b) => normalizarHora(a.horaProgramada || a.hora).localeCompare(normalizarHora(b.horaProgramada || b.hora)));

  const citasVencidas = citas
    .filter((cita) => {
      const key = getKey(cita);
      return key && key < hoy && citaVisibleAgenda(cita);
    })
    .sort((a, b) => {
      const fechaCompare = getKey(a).localeCompare(getKey(b));
      if (fechaCompare !== 0) return fechaCompare;
      return normalizarHora(a.horaProgramada || a.hora).localeCompare(normalizarHora(b.horaProgramada || b.hora));
    });

  const AgendaCitaCard = ({ cita }) => {
    const cliente = obtenerCliente(cita.clienteId);
    const direccion = cliente?.direccion || "";
    const telefono = cliente?.telefono || "";
    const hora = formatTechTime(cita.horaProgramada || cita.hora || "");
    const fecha = getKey(cita);
    const convertirCita = onConvertirCita || ordenProps?.convertirCitaEnOrden;

    return (
      <div className="grid w-full gap-3 rounded-[1.75rem] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-4 text-left shadow-md shadow-violet-100/70 transition hover:-translate-y-0.5 hover:shadow-xl sm:grid-cols-[120px_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-800 via-purple-700 to-fuchsia-600 px-4 py-5 text-white shadow-xl shadow-violet-900/20 ring-1 ring-violet-300/20">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
          <div className="relative text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.28em] text-white/65">
              Cita
            </p>
            <p className="mt-1 text-[2.15rem] font-black leading-none tracking-[-0.06em] tabular-nums">
              {hora}
            </p>
          </div>
        </div>

        <div className="relative z-10 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-2xl font-black text-slate-950">
                {cliente?.nombre || t("deletedCustomer")}
              </h3>

              <p className="mt-2 line-clamp-2 text-base font-black leading-snug text-slate-800">
                {cita.motivo || "Cita programada"}
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-violet-200 bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">
              Cita
            </span>
          </div>

          <p className="mt-3 line-clamp-1 text-sm font-bold text-slate-600">
            📍 {direccion || t("noAddress")}
          </p>

          <p className="mt-1 text-xs font-bold text-slate-500">
            📅 {fecha ? formatReportDate(fecha) : t("noDate")}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {telefono && (
              <a
                href={ordenProps?.urlTelefono?.(telefono)}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex h-11 min-w-[100px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 text-xs font-black text-white shadow-md shadow-emerald-200 transition hover:-translate-y-0.5"
                title={t("call")}
              >
                <Phone size={17} strokeWidth={2.7} />
                {t("call")}
              </a>
            )}

            {telefono && (
              <a
                href={`sms:${telefono}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex h-11 min-w-[100px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-black text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5"
                title={t("message")}
              >
                <MessageCircle size={17} strokeWidth={2.7} />
                {t("message")}
              </a>
            )}

            {direccion && (
              <a
                href={ordenProps?.urlAppleMaps?.(direccion)}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex h-11 min-w-[105px] items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white shadow-md shadow-slate-300 transition hover:-translate-y-0.5"
                title={t("address")}
              >
                <Navigation size={17} strokeWidth={2.7} />
                {t("address")}
              </a>
            )}

            <button
              type="button"
              onClick={() => convertirCita?.(cita)}
              className="inline-flex h-11 min-w-[170px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-4 text-xs font-black text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5"
            >
              Crear orden
            </button>
          </div>
        </div>
      </div>
    );
  };

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
              {vencida ? t("overdue") : t("time")}
            </p>
            <p className="mt-1 text-[2.15rem] font-black leading-none tracking-[-0.06em] tabular-nums">
              {hora}
            </p>
            {vencida && (
              <p className="mt-2 text-[10px] font-black uppercase tracking-wide text-white/75">
                {fecha ? formatReportDate(fecha) : t("noDate")}
              </p>
            )}
          </div>
        </div>

        <div className="pointer-events-none relative z-10 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="pointer-events-none relative z-10 min-w-0">
              <h3 className="truncate text-2xl font-black text-slate-950">
                {cliente?.nombre || t("deletedCustomer")}
              </h3>

              <p className="mt-2 line-clamp-2 text-base font-black leading-snug text-slate-800">
                {orden.problema || t("noReportedProblem")}
              </p>
            </div>

            <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black ${ordenProps?.colorPrioridad?.(orden.prioridad) || "bg-blue-50 text-blue-700 border-blue-200"}`}>
              {t({ Baja: "low", Media: "medium", Alta: "high", Urgente: "urgent" }[orden.prioridad] || "medium")}
            </span>
          </div>

          <p className="mt-3 line-clamp-1 text-sm font-bold text-slate-600">
            📍 {direccion || t("noAddress")}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {telefono && (
              <a
                href={ordenProps?.urlTelefono?.(telefono)}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex h-11 min-w-[100px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 text-xs font-black text-white shadow-md shadow-emerald-200 transition hover:-translate-y-0.5"
                title={t("call")}
              >
                <Phone size={17} strokeWidth={2.7} />
                {t("call")}
              </a>
            )}

            {telefono && (
              <a
                href={`sms:${telefono}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex h-12 min-w-[116px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5"
                title={t("message")}
              >
                <MessageCircle size={17} strokeWidth={2.7} />
                {t("message")}
              </a>
            )}

            {direccion && (
              <a
                href={ordenProps?.urlAppleMaps?.(direccion)}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex h-11 min-w-[105px] items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white shadow-md shadow-slate-300 transition hover:-translate-y-0.5"
                title={t("address")}
              >
                <Navigation size={17} strokeWidth={2.7} />
                {t("address")}
              </a>
            )}
            <span className="inline-flex h-11 min-w-[150px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 px-4 text-xs font-black text-white shadow-md shadow-blue-200">
              {t("workOrder")}
            </span>
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
              {t("agenda")}
            </p>
            <h2 className="text-2xl font-black text-slate-950">
              {t("todayOrders")}
            </h2>
          </div>

          <span className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white">
            {ordenesHoy.length + citasHoy.length}
          </span>
        </div>

        {ordenesHoy.length + citasHoy.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-lg font-black text-slate-950">{t("noOrdersToday")}</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {t("assignedOrdersAppearHere")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {ordenesHoy.map((orden) => (
              <AgendaOrderCard key={`orden-${orden.id}`} orden={orden} />
            ))}

            {citasHoy.map((cita) => (
              <AgendaCitaCard key={`cita-${cita.id}`} cita={cita} />
            ))}
          </div>
        )}
      </div>

      {ordenesVencidas.length + citasVencidas.length > 0 && (
        <div className="rounded-3xl border border-amber-200 bg-white p-4 shadow-lg shadow-amber-100/60">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-600">
                {t("previousPending")}
              </p>
              <h2 className="text-2xl font-black text-slate-950">
                {t("overdueOrders")}
              </h2>
            </div>

            <span className="rounded-2xl bg-amber-600 px-4 py-2 text-sm font-black text-white">
              {ordenesVencidas.length + citasVencidas.length}
            </span>
          </div>

          <div className="space-y-3">
            {ordenesVencidas.map((orden) => (
              <AgendaOrderCard key={`orden-vencida-${orden.id}`} orden={orden} vencida />
            ))}

            {citasVencidas.map((cita) => (
              <AgendaCitaCard key={`cita-vencida-${cita.id}`} cita={cita} />
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
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-300">{t("technicianAgenda")}</p>
              <h2 className="mt-1 flex items-center justify-center gap-2 text-lg font-black">
                <ClipboardList size={24} />
                {t("assignedWork")}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                {t("assignedWorkDescription")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-2xl bg-white/10 px-3 py-2 text-center ring-1 ring-white/20">
                <p className="text-lg font-black">{totalNoAtendidas}</p>
                <p className="text-[9px] font-black uppercase tracking-wide text-rose-200">{t("unattended")}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2 text-center ring-1 ring-white/20">
                <p className="text-lg font-black">{totalHoy}</p>
                <p className="text-[9px] font-black uppercase tracking-wide text-slate-300">{t("ordersToday")}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2 text-center ring-1 ring-white/20">
                <p className="text-lg font-black">{totalCitasHoy}</p>
                <p className="text-[9px] font-black uppercase tracking-wide text-slate-300">{t("appointmentsToday")}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2 text-center ring-1 ring-white/20">
                <p className="text-lg font-black">{totalProximas}</p>
                <p className="text-[9px] font-black uppercase tracking-wide text-blue-200">{t("upcoming")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center justify-between gap-3 bg-white p-3">
          <div className="text-sm font-semibold text-slate-500">
            {t("activeLabel")}: <span className="font-black text-slate-950">{ordenes.length}</span>
            <span className="mx-2 text-slate-300">·</span>
            {t("appointmentsLabelShort")}: <span className="font-black text-slate-950">{totalCitas}</span>
          </div>

          <div className="flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setVista("agenda")}
              className={`rounded-xl px-3 py-2 text-xs font-black transition ${vista === "agenda" ? "bg-slate-950 text-white shadow" : "text-slate-600 hover:bg-white"}`}
            >
              {t("clearAgenda")}
            </button>
            <button
              onClick={() => setVista("todas")}
              className={`rounded-xl px-3 py-2 text-xs font-black transition ${vista === "todas" ? "bg-slate-950 text-white shadow" : "text-slate-600 hover:bg-white"}`}
            >
              {t("allOrders")}
            </button>
          </div>
        </div>
      </div>

      <TecnicoAssignedTodayPanel
        ordenes={ordenes}
        citas={citas}
        obtenerCliente={obtenerCliente}
        ordenProps={ordenProps}
        onConvertirCita={ordenProps?.convertirCitaEnOrden}
        t={ordenProps?.t}
      />

      {ordenes.length === 0 && citas.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-8 text-center text-sm font-semibold text-slate-500 shadow-md shadow-slate-300/50">
          {t("noAssignedActiveWork")}
        </div>
      )}

      {vista === "todas" ? (
        <OrdenesGrid ordenes={[...ordenes].sort(sortTechnicianOrders)} obtenerCliente={obtenerCliente} ordenProps={ordenProps} />
      ) : (
        <>
          <TecnicoOrderGroup
            title={t("unattendedVisitPending")}
            subtitle={t("previousActiveOrders")}
            icon={AlertTriangle}
            tone="bg-gradient-to-r from-rose-900 via-red-800 to-orange-700"
            ordenes={grupos.atrasadas}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />

          <TecnicoOrderGroup
            title={t("ordersForToday")}
            subtitle={t("mainWorkDay")}
            icon={CalendarDays}
            tone="bg-gradient-to-r from-blue-900 via-cyan-800 to-teal-700"
            ordenes={grupos.hoy}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />

          <TecnicoCitaGroup
            title={t("scheduledAppointmentsToday")}
            subtitle={t("separateAppointmentsAgenda")}
            icon={CalendarDays}
            tone="bg-gradient-to-r from-cyan-900 via-sky-800 to-blue-700"
            citas={citasGrupos.hoy}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />

          <TecnicoCitaGroup
            title={t("overdueAppointments")}
            subtitle={t("previousAppointmentsNeedFollowUp")}
            icon={AlertTriangle}
            tone="bg-gradient-to-r from-amber-900 via-orange-800 to-red-700"
            citas={citasGrupos.atrasadas}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />

          <TecnicoOrderGroup
            title={t("upcomingOrders")}
            subtitle={t("scheduledWorkLater")}
            icon={Clock3}
            tone="bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-900"
            ordenes={grupos.proximas}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />

          <TecnicoCitaGroup
            title={t("upcomingAppointments")}
            subtitle={t("futureAppointments")}
            icon={Clock3}
            tone="bg-gradient-to-r from-indigo-950 via-blue-900 to-cyan-700"
            citas={citasGrupos.proximas}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />

          <TecnicoOrderGroup
            title={t("undatedOrders")}
            subtitle={t("needsAdminReview")}
            icon={ClipboardList}
            tone="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600"
            ordenes={grupos.sinFecha}
            obtenerCliente={obtenerCliente}
            ordenProps={ordenProps}
          />

          <TecnicoCitaGroup
            title={t("undatedAppointments")}
            subtitle={t("needsAdminReview")}
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
        <p className="font-black text-slate-950">{cliente?.nombre || t("deletedCustomer")}</p>
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
                    {({
                      "Pendiente": t("pending"),
                      "Asignada": t("assigned"),
                      "En ruta": t("onRoute"),
                      "En sitio": t("onSite"),
                      "En proceso": t("inProgress"),
                      "Completado": t("completed"),
                      "Cancelada": t("cancelled"),
                      "Necesita seguimiento": t("needsFollowUp"),
                    }[orden.estado] || orden.estado)}
                  </span>

                  <span className={`rounded-full border px-3 py-1.5 text-xs font-black ${colorPrioridad(orden.prioridad)}`}>
                    {t({ Baja: "low", Media: "medium", Alta: "high", Urgente: "urgent" }[orden.prioridad] || "medium")}
                  </span>

                  <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-slate-700 ring-1 ring-white/40">
                    #{orden.id}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="truncate text-4xl font-black tracking-tight text-white">
                  {cliente?.nombre || t("deletedCustomer")}
                </h3>

                <div className="mt-3 rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <p className="line-clamp-2 text-xl font-black leading-snug text-white">
                      {orden.problema || t("noReportedProblem")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">

                <div className="grid gap-3 lg:grid-cols-[1.3fr_.7fr]">
                  <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
                    <p className="flex items-center gap-2 text-lg font-black text-cyan-50">
                      <MapPin size={20} />
                      {direccion || t("noAddress")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
                    <p className="flex items-center gap-2 text-sm font-black text-cyan-50">
                      <User size={17} />
                      {tecnico?.nombre || t("noTechnician")}
                      <span className="mx-1 text-white/30">·</span>
                      <Calendar size={17} />
                      {fechaTexto ? formatReportDate(fechaTexto) : t("noDate")}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-cyan-200">
                    {t("accessDetails")}
                  </p>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">

                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-[10px] font-black uppercase text-cyan-200">
                        {t("apt")}
                      </p>

                      <p className="text-sm font-bold text-white">
                        {cliente?.apartamento || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-[10px] font-black uppercase text-cyan-200">
                        {t("building")}
                      </p>

                      <p className="text-sm font-bold text-white">
                        {cliente?.edificio || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-[10px] font-black uppercase text-cyan-200">
                        {t("street")}
                      </p>

                      <p className="text-sm font-bold text-white">
                        {cliente?.calle || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-[10px] font-black uppercase text-cyan-200">
                        {t("accessCode")}
                      </p>

                      <p className="text-sm font-bold text-white">
                        {cliente?.codigoAcceso || "—"}
                      </p>
                    </div>

                  </div>
                </div>

              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                {telefono && (
                  <a href={urlTelefono(telefono)} className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-base font-black text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5">
                    <Phone size={20} />
                    {t("call")}
                  </a>
                )}

                {direccion && (
                  <a href={urlAppleMaps(direccion)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-base font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5">
                    <Navigation size={20} />
                    {t("route")}
                  </a>
                )}

                <button onClick={() => setVerDetalles(!verDetalles)} className="flex min-w-[220px] flex-1 items-center justify-center gap-3 rounded-[1.35rem] bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 text-lg font-black text-white shadow-xl shadow-cyan-900/25 transition hover:-translate-y-0.5">
                  <ClipboardCheck size={24} strokeWidth={2.7} />
                  {verDetalles ? t("hideWork") : t("viewWork")}
                </button>
              </div>
            </div>
          </div>

          {orden.estado === "Necesita seguimiento" && orden.seguimientoMotivo && (
            <div className="m-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900 shadow-sm">
              {t("followUpLabel")}: {orden.seguimientoMotivo}
            </div>
          )}

          {verDetalles && (
            <div className="m-4 space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-inner shadow-slate-100">
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 xl:grid-cols-6">
                <Info icon={ShieldAlert} titulo={t("priorityLabel")} valor={t({ Baja: "low", Media: "medium", Alta: "high", Urgente: "urgent" }[orden.prioridad] || "medium")} extra={colorPrioridad(orden.prioridad)} />
                <Info icon={Calendar} titulo={t("dateLabel")} valor={orden.fecha} />
                <Info icon={PlayCircle} titulo={t("startLabel")} valor={orden.horaInicio ? new Date(orden.horaInicio).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }) : t("notStarted")} />
                <Info icon={CheckCircle2} titulo={t("closeLabel")} valor={orden.horaCierre ? new Date(orden.horaCierre).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }) : t("notClosed")} />
                <Info icon={Gauge} titulo={t("workLabel")} valor={`${orden.duracionHoras || "0.00"} h`} />
                <Info icon={Route} titulo={t("travelLabel")} valor={`${orden.duracionTraslado || "0.00"} h`} />
              </div>

              <Materiales orden={orden} inventario={inventario} agregarMaterialAOrden={agregarMaterialAOrden} actualizarMaterialOrden={actualizarMaterialOrden} eliminarMaterialOrden={eliminarMaterialOrden} t={t} />

              <div className="rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 shadow-sm">
                <p className="mb-3 flex items-center gap-2 text-base font-black text-slate-950">
                  <Images {...iconProps} />
                  {t("photos")}
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  <FotoUploader titulo={t("before")} imagen={orden.fotos?.antes} onChange={(archivo) => subirFoto(orden.id, "antes", archivo)} t={t} />
                  <FotoUploader titulo={t("during")} imagen={orden.fotos?.durante} onChange={(archivo) => subirFoto(orden.id, "durante", archivo)} t={t} />
                  <FotoUploader titulo={t("after")} imagen={orden.fotos?.despues} onChange={(archivo) => subirFoto(orden.id, "despues", archivo)} t={t} />
                </div>
              </div>

              <label className="flex items-center gap-2 text-base font-black text-slate-950">
                <ClipboardCheck {...iconProps} />
                {t("notes")}
              </label>

              <textarea
                value={orden.notasTecnico || ""}
                onChange={(e) => guardarNotaTecnico(orden.id, e.target.value)}
                placeholder={t("workDetailsPlaceholder")}
                className="min-h-24 w-full rounded-2xl border border-cyan-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-3 text-sm font-semibold outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />

              <div className="flex flex-wrap gap-3 rounded-[1.75rem] border border-slate-100 bg-slate-50 p-5 shadow-inner">
                {orden.estado === "Asignada" && (
                  <button onClick={() => marcarEnRuta(orden.id)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5">
                    <Navigation {...iconProps} />
                    {t("goToCustomer")}
                  </button>
                )}

                {orden.estado === "En ruta" && (
                  <button onClick={() => marcarLlegada(orden.id)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5">
                    <MapPin {...iconProps} />
                    {t("arrivedOnSite")}
                  </button>
                )}

                {(orden.estado === "En sitio" || orden.estado === "Necesita seguimiento") && (
                  <button onClick={() => iniciarTrabajo(orden.id)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5">
                    <Wrench {...iconProps} />
                    {t("startWork")}
                  </button>
                )}

                {orden.estado === "En proceso" && (
                  <>
                    <button onClick={() => completarOrden(orden.id)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5">
                      <CheckCircle2 {...iconProps} />
                      {t("finishWork")}
                    </button>

                    <button onClick={() => marcarNecesitaSeguimiento(orden.id)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-amber-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-amber-200 transition hover:-translate-y-0.5">
                      <AlertTriangle {...iconProps} />
                      {t("requiresFollowUp")}
                    </button>
                  </>
                )}

                {orden.estado !== "Completado" && orden.estado !== "Cancelada" && (
                  <button onClick={() => cancelarOrden(orden)} className="flex items-center justify-center gap-1.5 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5">
                    <Ban {...iconProps} />
                    {t("cancel")}
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

function Materiales({ orden, inventario, agregarMaterialAOrden, actualizarMaterialOrden, eliminarMaterialOrden, t }) {
  const ordenTieneUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(orden?.id || ""));

  if (!ordenTieneUUID) {
    return (
      <div className="mb-2 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 text-sm font-bold text-amber-800">
        Esta orden fue creada antes de conectar Supabase. Para guardar materiales persistentes, crea una orden nueva desde Admin.
      </div>
    );
  }

  return (
    <div className="mb-2 rounded-[1.75rem] border border-cyan-200 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-5 shadow-lg shadow-purple-100/60">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xl font-black text-slate-950">
          <Boxes {...iconProps} />
          {t("materialUsed")}
        </p>

        <button
          onClick={() => agregarMaterialAOrden(orden.id)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5"
        >
          <Plus {...iconProps} />
          {t("addMaterial")}
        </button>
      </div>

      {(orden.materialesUsados || []).length === 0 && (
        <p className="rounded-2xl border border-dashed border-purple-200 bg-white/80 p-4 text-sm font-bold text-slate-500">
          {t("noMaterialAdded")}
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

function FotoUploader({ titulo, imagen, onChange, t }) {
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
          {t("noPhoto")}
        </div>
      )}

      <label className="flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-black text-slate-700 transition hover:bg-white">
        {t("selectPhoto")}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e.target.files[0])}
          className="hidden"
        />
      </label>
    </div>
  );
}


function DashboardUnificadoPage({
  t,
  lang,
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
    { id: "general", label: t("general") || "General", count: activas },
    { id: "clientes", label: t("customers") || "Clientes", count: clientes.length },
    { id: "inventario", label: t("inventoryShort") || "Inventario", count: inventario.length },
    { id: "tecnicos", label: t("technicians") || "Técnicos", count: tecnicos.length },
  ];

  return (
    <section className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/50">
        <div className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-white px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-600">
            {t("reportsCenter")}
          </p>

          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                {t("dashboard")}
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-blue-900/60">
                {t("dashboardUnifiedDescription")}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 text-[11px] font-black">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 ring-1 ring-blue-100">
                {t("activeOrders")} {activas}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-100">
                {t("completedJobs")} {completadas}
              </span>
              <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700 ring-1 ring-rose-100">
                {t("cancelledPlural")} {canceladas}
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
          lang={lang}
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
          t={t}
          lang={lang}
          tecnicos={tecnicos}
          ordenes={ordenes}
        />
      )}
    </section>
  );
}



function ReportePagoTecnicos({ t = (key) => key, lang = "es", tecnicos = [], ordenes = [] }) {
  const [periodo, setPeriodo] = useState("mes");

  const getFechaOrden = (orden) =>
    orden.fechaCompletada ||
    orden.horaCierre ||
    orden.fechaCreacion ||
    orden.fecha ||
    "";

  const estaEnPeriodo = (orden) => {
    const raw = getFechaOrden(orden);
    const fecha = new Date(raw);
    if (Number.isNaN(fecha.getTime())) return false;

    if (periodo === "personalizado") {
      const desde = fechaDesde ? new Date(fechaDesde + "T00:00:00") : null;
      const hasta = fechaHasta ? new Date(fechaHasta + "T23:59:59") : null;

      if (desde && fecha < desde) return false;
      if (hasta && fecha > hasta) return false;
      return true;
    }

    if (periodo === "todo") return true;

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
    ["hoy", t("today")],
    ["semana", t("week")],
    ["mes", t("month")],
    ["ano", t("year")],
    ["todo", t("all")],
  ];

  const hoyNomina = new Date();
  const inicioSemanaNomina = new Date(hoyNomina);
  inicioSemanaNomina.setDate(hoyNomina.getDate() - hoyNomina.getDay());

  const finSemanaNomina = new Date(inicioSemanaNomina);
  finSemanaNomina.setDate(inicioSemanaNomina.getDate() + 6);

  const formatoNomina = (fecha) =>
    fecha.toLocaleDateString(lang === "en" ? "en-US" : "es-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const periodoNominaLabel =
    periodo === "semana"
      ? `${t("consultedWeek")} · ${formatoNomina(inicioSemanaNomina)} - ${formatoNomina(finSemanaNomina)}`
      : periodo === "hoy"
        ? `${t("consultedDay")} · ${formatoNomina(hoyNomina)}`
        : periodo === "mes"
          ? `${t("consultedMonth")} · ${hoyNomina.toLocaleDateString(lang === "en" ? "en-US" : "es-US", { month: "long", year: "numeric" })}`
          : periodo === "ano"
            ? `${t("consultedYear")} · ${hoyNomina.getFullYear()}`
            : t("allHistory");

  return (
    <section className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/50">
        <div className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-white px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-600">
            {t("payrollOperational")}
          </p>

          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                {t("technicianHoursPay")}
              </h2>
              <p className="mt-2 inline-flex rounded-full bg-blue-700 px-4 py-1.5 text-sm font-black text-white shadow-sm">
                {periodoNominaLabel}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-blue-900/60">
                {t("realWorkOnly")}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 text-[11px] font-black">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 ring-1 ring-blue-100">
                {t("work")} {totalHoras.toFixed(2)} h
              </span>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700 ring-1 ring-indigo-100">
                {t("travel")} {totalTraslado.toFixed(2)} h
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-100">
                {t("pay")} ${totalPagado.toFixed(2)}
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
                    {row.ordenes} {t("completedOrdersPeriod")}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-wide text-blue-100">
                    {t("earned")}
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
                    {t("work")}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-950">
                    {row.horasTrabajo.toFixed(2)} h
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 p-1.5 text-indigo-700">
                  <p className="text-[10px] uppercase tracking-wide text-indigo-500">
                    {t("travel")}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-950">
                    {row.horasTraslado.toFixed(2)} h
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-1.5 text-slate-700">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    {t("hourlyPayShort")}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-950">
                    ${row.pagoHora.toFixed(2)} / h
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-1.5 text-emerald-700">
                  <p className="text-[10px] uppercase tracking-wide text-emerald-600">
                    {t("totalPay")}
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


function TecnicoHistorialProfesional({ ordenes = [], obtenerCliente, ordenProps, t }) {
  const [filtro, setFiltro] = useState("todas");
  const [periodo, setPeriodo] = useState("todo");
  const [busqueda, setBusqueda] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const getFechaOrden = (orden) => orden.fechaCompletada || orden.fechaCancelacion || orden.fechaCreacion || orden.fecha || "";

  const estaEnPeriodo = (orden) => {
    const raw = getFechaOrden(orden);
    const fecha = new Date(raw);
    if (Number.isNaN(fecha.getTime())) return false;

    if (periodo === "personalizado") {
      const desde = fechaDesde ? new Date(fechaDesde + "T00:00:00") : null;
      const hasta = fechaHasta ? new Date(fechaHasta + "T23:59:59") : null;

      if (desde && fecha < desde) return false;
      if (hasta && fecha > hasta) return false;
      return true;
    }

    if (periodo === "todo") return true;

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

  const exportarHistorialCsv = () => {
    if (ordenesFiltradas.length === 0) return;

    const filas = ordenesFiltradas.map((orden) => {
      const cliente = obtenerCliente(orden.clienteId);
      const fecha = orden.fechaCompletada || orden.fechaCancelacion || orden.fechaCreacion || orden.fecha || "";

      return {
        id: orden.id,
        date: fecha ? formatReportDate(fecha) : "",
        status: orden.estado || "",
        customer: cliente?.nombre || "",
        phone: cliente?.telefono || "",
        address: cliente?.direccion || "",
        problem: orden.problema || "",
        hours: orden.duracionHoras || "0.00",
        cancelReason: orden.cancelReason || "",
        notes: orden.notasTecnico || "",
      };
    });

    const headers = ["ID", "Date", "Status", "Customer", "Phone", "Address", "Problem", "Hours", "Cancel reason", "Notes"];
    const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [
      headers.join(","),
      ...filas.map((fila) => [
        fila.id,
        fila.date,
        fila.status,
        fila.customer,
        fila.phone,
        fila.address,
        fila.problem,
        fila.hours,
        fila.cancelReason,
        fila.notes,
      ].map(escapeCsv).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `technician-history-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "todas", label: t("all"), count: ordenesPorPeriodo.length },
    { id: "completadas", label: t("completedPlural"), count: completadas.length },
    { id: "canceladas", label: t("cancelledPlural"), count: canceladas.length },
  ];

  return (
    <section className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/50">
        <div className="bg-slate-950 px-5 py-3 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">
            {t("technicianHistoryTitle")}
          </p>
          <h2 className="mt-1 flex items-center justify-center gap-2 text-lg font-black">
            <History size={22} />
            {t("history")}
          </h2>
          <p className="mt-1 text-xs font-semibold text-slate-300">
            {t("technicianHistoryDescription")}
          </p>
        </div>

        <div className="space-y-3 bg-slate-50 p-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={t("searchTechnicianHistoryPlaceholder")}
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-semibold outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {[
              ["hoy", t("today")],
              ["semana", t("week")],
              ["mes", t("month")],
              ["ano", t("year")],
              ["todo", t("all")],
              ["personalizado", t("customRange")],
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

          {periodo === "personalizado" && (
            <div className="rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
                  {t("activeRange")}
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={exportarHistorialCsv}
                    disabled={ordenesFiltradas.length === 0}
                    className="rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {t("exportCsv")}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFechaDesde("");
                      setFechaHasta("");
                    }}
                    className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600 transition hover:bg-slate-200"
                  >
                    {t("clearRange")}
                  </button>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="text-xs font-black uppercase tracking-wide text-slate-500">
                  {t("fromDate")}
                  <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-sm font-bold text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>

                <label className="text-xs font-black uppercase tracking-wide text-slate-500">
                  {t("toDate")}
                  <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-sm font-bold text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
              </div>
            </div>
          )}

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
          {t("noOrdersInFilter")}
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
                    {fecha ? formatReportDate(fecha) : t("noDate")}
                  </div>

                  <div className="relative hidden justify-center sm:flex sm:pt-5">
                    <span className={`relative z-10 h-3.5 w-3.5 rounded-full ring-4 ${dotClass}`} />
                  </div>

                  <div className={`rounded-2xl border p-3 ${cardClass}`}>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="pointer-events-none relative z-10 min-w-0">
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${badgeClass}`}>
                            {completada ? t("completed") : t("cancelled")}
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
                          {cliente?.nombre || t("deletedCustomer")}
                        </h3>

                        <p className="mt-2 line-clamp-2 rounded-2xl bg-white/80 px-3 py-2 text-sm font-black leading-relaxed text-slate-800 shadow-sm">
                          {orden.problema || t("noReportedProblem")}
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
                            {t("reasonLabel")}: {orden.cancelReason || t("noReasonRegistered")}
                          </div>
                        )}

                        {orden.notasTecnico && (
                          <div className="mt-2 rounded-xl border border-blue-200 bg-white/70 p-2 text-xs font-bold text-blue-900">
                            {t("noteLabel")}: {orden.notasTecnico}
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
                            {t("call")}
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
                            {t("map")}
                          </a>
                        )}

                        {ordenProps?.compartirOrden && (
                          <button
                            onClick={() => ordenProps.compartirOrden(orden, "imprimir")}
                            className="flex items-center justify-center gap-1.5 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 px-4 py-3 text-sm font-black text-white"
                          >
                            <Printer size={14} />
                            {t("print")}
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
