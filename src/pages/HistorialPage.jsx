import { useMemo, useState } from "react";
import PhotoEvidenceModal from "../components/PhotoEvidenceModal.jsx";
import OrderDetailModal from "../components/OrderDetailModal.jsx";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Camera,
  CheckCircle2,
  ClipboardList,
  Clock3,
  DollarSign,
  FileText,
  MapPin,
  Navigation,
  Phone,
  Printer,
  Search,
  Share2,
  Trash2,
  UserCog,
  Users,
  XCircle,

  UserRoundCheck,
  BadgeCheck,
  Images,
  MapPinned,
  PhoneCall,
  ReceiptText,
  Eye,
  Pencil,
} from "lucide-react";

function formatPhoneDisplay(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length !== 10) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatReportDate(value, t = (key) => key) {
  if (!value) return t("noDate");
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

function statusClass(estado) {
  if (estado === "Completado") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (estado === "Cancelada") return "border-rose-200 bg-rose-50 text-rose-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function priorityClass(prioridad) {
  if (prioridad === "Urgente") return "border-rose-200 bg-rose-50 text-rose-700";
  if (prioridad === "Alta") return "border-sky-200 bg-sky-50 text-sky-700";
  if (prioridad === "Media") return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function getFinancialOrderDate(orden) {
  const raw =
    orden?.fechaCompletada ||
    orden?.horaCierre ||
    orden?.fechaCreacion ||
    orden?.fecha ||
    "";

  const fecha = new Date(raw);

  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

function getFinancialWeekRange(offset = 0) {
  const ahora = new Date();

  const inicio = new Date(ahora);
  inicio.setHours(0, 0, 0, 0);

  const diaSemana = inicio.getDay();
  const diferenciaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;

  inicio.setDate(inicio.getDate() + diferenciaLunes + (offset * 7));

  const fin = new Date(inicio);
  fin.setDate(inicio.getDate() + 7);

  return {
    inicio,
    fin,
  };
}

function getValidatedWorkHours(orden, maxHours = 16) {
  if (!orden?.horaInicio || !orden?.horaCierre) {
    return {
      horas: 0,
      revision: true,
    };
  }

  const inicio = new Date(orden.horaInicio);
  const cierre = new Date(orden.horaCierre);

  if (
    Number.isNaN(inicio.getTime()) ||
    Number.isNaN(cierre.getTime()) ||
    cierre <= inicio
  ) {
    return {
      horas: 0,
      revision: true,
    };
  }

  const calculadas = (cierre - inicio) / 3600000;
  const guardadas = Number(orden.duracionHoras || 0);

  const horas =
    Number.isFinite(guardadas) && guardadas > 0
      ? guardadas
      : calculadas;

  if (
    !Number.isFinite(horas) ||
    horas <= 0 ||
    horas > maxHours ||
    calculadas > maxHours
  ) {
    return {
      horas: 0,
      revision: true,
    };
  }

  const horasRedondeadas =
    Math.round((horas + Number.EPSILON) * 100) / 100;

  return {
    horas: horasRedondeadas,
    revision: false,
  };
}

function toDateTimeLocalValue(value) {
  if (!value) return "";

  const fecha = new Date(value);

  if (Number.isNaN(fecha.getTime())) return "";

  const pad = (numero) => String(numero).padStart(2, "0");

  return (
    `${fecha.getFullYear()}-` +
    `${pad(fecha.getMonth() + 1)}-` +
    `${pad(fecha.getDate())}T` +
    `${pad(fecha.getHours())}:` +
    `${pad(fecha.getMinutes())}`
  );
}

function formatAdminDateTime(value, lang = "es") {
  if (!value) return "—";

  const fecha = new Date(value);

  if (Number.isNaN(fecha.getTime())) return "—";

  return fecha.toLocaleString(
    lang === "en" ? "en-US" : "es-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );
}

function MiniMetric({ icon: Icon, label, value, tone = "from-slate-950 to-blue-900" }) {
  return (
    <div className={`flex min-w-[118px] items-center gap-2 rounded-2xl bg-gradient-to-br ${tone} px-3 py-2 text-white shadow-sm`}>
      <Icon size={15} />
      <div>
        <p className="text-sm font-black leading-none">{value}</p>
        <p className="mt-0.5 text-[9px] font-black uppercase tracking-wide text-white/75">{label}</p>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, href, className = "" }) {
  const base = `inline-flex min-w-[42px] items-center justify-center gap-1 rounded-xl px-2.5 py-2 text-xs font-black transition ${className}`;

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className={base}>
        <Icon size={13} />
        {label && <span>{label}</span>}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={base}>
      <Icon size={13} />
      {label && <span>{label}</span>}
    </button>
  );
}

export default function HistorialPage({ t = (key) => key, lang = "es", ordenes, obtenerCliente, ordenProps }) {
  const [busqueda, setBusqueda] = useState("");
  const [evidenciaOrden, setEvidenciaOrden] = useState(null);
  const [detalleOrden, setDetalleOrden] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [ordenFecha, setOrdenFecha] = useState("recientes");
  const [vistaHistorial, setVistaHistorial] = useState("compacta");
  const [semanaFinanzasOffset, setSemanaFinanzasOffset] = useState(0);
  const [precioDrafts, setPrecioDrafts] = useState({});
  const [guardandoPrecioId, setGuardandoPrecioId] = useState(null);
  const [horasModalOrden, setHorasModalOrden] = useState(null);
  const [horasForm, setHorasForm] = useState({
    inicio: "",
    cierre: "",
    motivo: "",
  });
  const [guardandoHoras, setGuardandoHoras] = useState(false);
  const [soloRevisionHoras, setSoloRevisionHoras] = useState(false);

  const {
    obtenerTecnico,
    urlAppleMaps,
    urlTelefono,
    compartirOrden,
    calcularCostoOrden,
    materialesTexto,
    corregirOrdenAdmin,
    guardarPrecioCobradoAdmin,
    session,
  } = ordenProps;

  const historialFiltrado = useMemo(() => {
    const q = busqueda.toLowerCase().trim();

    let lista = ordenes.filter((orden) => {
      const cliente = obtenerCliente(orden.clienteId);
      const tecnico = obtenerTecnico?.(orden.tecnicoId);

      const matchTexto = !q || [
        cliente?.nombre,
        cliente?.telefono,
        orden.direccionTrabajo,
        cliente?.direccion,
        tecnico?.nombre,
        orden.problema,
        orden.estado,
        orden.prioridad,
        orden.cancelReason,
        orden.notasTecnico,
      ].some((v) => String(v || "").toLowerCase().includes(q));

      const matchEstado = estadoFiltro === "todos" || orden.estado === estadoFiltro;

      return matchTexto && matchEstado;
    });

    lista = [...lista].sort((a, b) => {
      const aDate = new Date(a.fechaCompletada || a.fechaCreacion || a.fecha || 0).getTime();
      const bDate = new Date(b.fechaCompletada || b.fechaCreacion || b.fecha || 0).getTime();

      if (ordenFecha === "antiguos") return aDate - bDate;
      return bDate - aDate;
    });

    return lista;
  }, [ordenes, busqueda, estadoFiltro, ordenFecha, obtenerCliente, obtenerTecnico]);

  const completadas = ordenes.filter((o) => o.estado === "Completado").length;
  const canceladas = ordenes.filter((o) => o.estado === "Cancelada").length;
  const totalMateriales = ordenes.reduce((sum, orden) => sum + Number(calcularCostoOrden?.(orden) || orden.costoMateriales || 0), 0);

  const rangoSemanaFinanzas = useMemo(
    () => getFinancialWeekRange(semanaFinanzasOffset),
    [semanaFinanzasOffset]
  );

  const ordenesFinanzasSemana = useMemo(() => {
    return ordenes
      .filter((orden) => {
        if (orden.estado !== "Completado") return false;

        const fecha = getFinancialOrderDate(orden);
        if (!fecha) return false;

        return (
          fecha >= rangoSemanaFinanzas.inicio &&
          fecha < rangoSemanaFinanzas.fin
        );
      })
      .sort((a, b) => {
        const fechaA = getFinancialOrderDate(a)?.getTime() || 0;
        const fechaB = getFinancialOrderDate(b)?.getTime() || 0;
        return fechaB - fechaA;
      });
  }, [ordenes, rangoSemanaFinanzas]);

  const resumenFinanzasSemana = useMemo(() => {
    return ordenesFinanzasSemana.reduce(
      (acc, orden) => {
        const tecnico = obtenerTecnico?.(orden.tecnicoId);
        const validacionHoras = getValidatedWorkHours(orden);

        const horas = validacionHoras.horas;

        const pagoHora = Number(
          tecnico?.pagoHora ||
          tecnico?.pagoPorHora ||
          0
        );

        const manoObra = horas * pagoHora;

        const materiales = Number(
          calcularCostoOrden?.(orden) ||
          orden.costoMateriales ||
          0
        );

        const cobrado = Number(orden.precioCobrado || 0);

        acc.cobrado += cobrado;
        acc.materiales += materiales;
        acc.manoObra += manoObra;

        if (validacionHoras.revision) {
          acc.revisionHoras += 1;
        }

        return acc;
      },
      {
        cobrado: 0,
        materiales: 0,
        manoObra: 0,
        revisionHoras: 0,
      }
    );
  }, [
    ordenesFinanzasSemana,
    obtenerTecnico,
    calcularCostoOrden,
  ]);

  const resultadoFinanzasSemana =
    resumenFinanzasSemana.cobrado -
    resumenFinanzasSemana.materiales -
    resumenFinanzasSemana.manoObra;

  const financeCopy = lang === "en"
    ? {
        eyebrow: "Admin finances",
        title: "Weekly financial control",
        description: "Private administrative information. Technicians do not see these amounts.",
        previous: "Previous week",
        next: "Next week",
        current: "Current week",
        orders: "Jobs",
        billed: "Billed",
        materials: "Materials",
        labor: "Technician labor",
        result: "Estimated result",
        customer: "Customer",
        technician: "Technician",
        date: "Date",
        hours: "Work hours",
        charged: "Charged",
        save: "Save",
        saving: "Saving...",
        review: "Review hours",
        noOrders: "There are no completed jobs in this week.",
      }
    : {
        eyebrow: "Finanzas Admin",
        title: "Control financiero semanal",
        description: "Información privada del administrador. Los técnicos no ven estos montos.",
        previous: "Semana anterior",
        next: "Semana siguiente",
        current: "Semana actual",
        orders: "Trabajos",
        billed: "Cobrado",
        materials: "Materiales",
        labor: "Mano de obra",
        result: "Resultado estimado",
        customer: "Cliente",
        technician: "Técnico",
        date: "Fecha",
        hours: "Horas trabajo",
        charged: "Cobrado",
        save: "Guardar",
        saving: "Guardando...",
        review: "Revisar horas",
        noOrders: "No hay trabajos completados en esta semana.",
      };

  const formatoFechaFinanzas = (fecha) =>
    fecha.toLocaleDateString(
      lang === "en" ? "en-US" : "es-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

  const finVisibleSemana = new Date(rangoSemanaFinanzas.fin);
  finVisibleSemana.setDate(finVisibleSemana.getDate() - 1);

  const guardarCobroOrden = async (orden) => {
    if (!guardarPrecioCobradoAdmin) return;

    const key = String(orden.id);

    const valor =
      key in precioDrafts
        ? precioDrafts[key]
        : orden.precioCobrado || 0;

    setGuardandoPrecioId(key);

    try {
      const ok = await guardarPrecioCobradoAdmin(
        orden.id,
        valor
      );

      if (ok !== false) {
        setPrecioDrafts((actual) => {
          const siguiente = { ...actual };
          delete siguiente[key];
          return siguiente;
        });
      }
    } finally {
      setGuardandoPrecioId(null);
    }
  };

  const abrirRevisionHoras = (orden) => {
    setHorasModalOrden(orden);

    setHorasForm({
      inicio: toDateTimeLocalValue(orden?.horaInicio),
      cierre: toDateTimeLocalValue(orden?.horaCierre),
      motivo: "",
    });
  };

  const cerrarRevisionHoras = () => {
    if (guardandoHoras) return;

    setHorasModalOrden(null);

    setHorasForm({
      inicio: "",
      cierre: "",
      motivo: "",
    });
  };

  const horasPreview = (() => {
    if (!horasForm.inicio || !horasForm.cierre) {
      return null;
    }

    const inicio = new Date(horasForm.inicio);
    const cierre = new Date(horasForm.cierre);

    if (
      Number.isNaN(inicio.getTime()) ||
      Number.isNaN(cierre.getTime()) ||
      cierre <= inicio
    ) {
      return null;
    }

    return (cierre - inicio) / 3600000;
  })();

  const guardarRevisionHoras = async () => {
    if (!horasModalOrden || !corregirOrdenAdmin) return;

    if (!horasForm.inicio || !horasForm.cierre) {
      window.alert(
        lang === "en"
          ? "Start and end date/time are required."
          : "La fecha y hora de inicio y cierre son obligatorias."
      );
      return;
    }

    const inicio = new Date(horasForm.inicio);
    const cierre = new Date(horasForm.cierre);

    if (
      Number.isNaN(inicio.getTime()) ||
      Number.isNaN(cierre.getTime())
    ) {
      window.alert(
        lang === "en"
          ? "Invalid date or time."
          : "La fecha u hora no es válida."
      );
      return;
    }

    if (cierre <= inicio) {
      window.alert(
        lang === "en"
          ? "End time must be after start time."
          : "La hora de cierre debe ser posterior a la hora de inicio."
      );
      return;
    }

    const horas = (cierre - inicio) / 3600000;

    if (horas > 16) {
      window.alert(
        lang === "en"
          ? "The automatic payroll limit is 16 continuous work hours per order. Review the dates before saving."
          : "El límite automático de nómina es 16 horas continuas por orden. Revisa las fechas antes de guardar."
      );
      return;
    }

    if (!String(horasForm.motivo || "").trim()) {
      window.alert(
        lang === "en"
          ? "A correction reason is required."
          : "Debes escribir el motivo de la corrección."
      );
      return;
    }

    setGuardandoHoras(true);

    try {
      const ok = await corregirOrdenAdmin(
        horasModalOrden.id,
        {
          horaInicio: inicio.toISOString(),
          horaCierre: cierre.toISOString(),
          motivo: horasForm.motivo.trim(),
        }
      );

      if (ok !== false) {
        cerrarRevisionHoras();
      }
    } finally {
      setGuardandoHoras(false);
    }
  };

  const statusLabel = (estado) => {
    const map = {
      Completado: t("completed"),
      Cancelada: t("cancelled"),
      "Necesita seguimiento": t("needsFollowUp"),
    };
    return map[estado] || estado;
  };

  const priorityLabel = (prioridad) => {
    const map = {
      Baja: t("low"),
      Media: t("medium"),
      Alta: t("high"),
      Urgente: t("urgent"),
    };
    return map[prioridad] || prioridad;
  };

  return (
    <section className="space-y-4">
      {horasModalOrden && (() => {
        const clienteHoras =
          obtenerCliente(horasModalOrden.clienteId);

        const tecnicoHoras =
          obtenerTecnico?.(horasModalOrden.tecnicoId);

        const validacionActual =
          getValidatedWorkHours(horasModalOrden);

        const previewValido =
          Number.isFinite(horasPreview) &&
          horasPreview > 0;

        return (
          <div className="fixed inset-0 z-[1250] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-md">
            <button
              type="button"
              aria-label={lang === "en" ? "Close" : "Cerrar"}
              onClick={cerrarRevisionHoras}
              className="absolute inset-0 cursor-default"
            />

            <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-blue-200/60 bg-white shadow-2xl shadow-slate-950/50">
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 p-5 text-white">
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 shadow-lg">
                      <Clock3 size={24} />
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-200">
                        {lang === "en"
                          ? "Administrative correction"
                          : "Corrección administrativa"}
                      </p>

                      <h2 className="mt-1 text-2xl font-black">
                        {lang === "en"
                          ? "Review work hours"
                          : "Revisar horas trabajadas"}
                      </h2>

                      <p className="mt-1 text-sm font-semibold text-cyan-50/75">
                        {lang === "en"
                          ? "Changes affect payroll and are saved in the audit history."
                          : "Los cambios afectan la nómina y quedan registrados en auditoría."}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={cerrarRevisionHoras}
                    disabled={guardandoHoras}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl font-black ring-1 ring-white/20 hover:bg-white/20 disabled:opacity-50"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="max-h-[75vh] overflow-y-auto p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {lang === "en" ? "Customer / order" : "Cliente / orden"}
                    </p>

                    <p className="mt-1 font-black text-slate-950">
                      {clienteHoras?.nombre || t("deletedCustomer")}
                    </p>

                    <p className="mt-1 break-all text-[11px] font-bold text-slate-500">
                      #{horasModalOrden.id}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {lang === "en" ? "Technician" : "Técnico"}
                    </p>

                    <p className="mt-1 font-black text-slate-950">
                      {tecnicoHoras?.nombre || t("noTechnician")}
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {lang === "en" ? "Status" : "Estado"}:{" "}
                      {horasModalOrden.estado || "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                    {lang === "en"
                      ? "Currently registered"
                      : "Registrado actualmente"}
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">
                        {lang === "en" ? "Start" : "Inicio"}
                      </p>

                      <p className="mt-1 text-sm font-black text-slate-800">
                        {formatAdminDateTime(
                          horasModalOrden.horaInicio,
                          lang
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">
                        {lang === "en" ? "End" : "Final"}
                      </p>

                      <p className="mt-1 text-sm font-black text-slate-800">
                        {formatAdminDateTime(
                          horasModalOrden.horaCierre,
                          lang
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">
                        {lang === "en" ? "Work hours" : "Horas trabajo"}
                      </p>

                      <p className={`mt-1 text-lg font-black ${
                        validacionActual.revision
                          ? "text-amber-700"
                          : "text-blue-700"
                      }`}>
                        {validacionActual.revision
                          ? (lang === "en" ? "Needs review" : "Requiere revisión")
                          : `${validacionActual.horas.toFixed(2)} h`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-blue-100 pt-3">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      {lang === "en" ? "Travel time" : "Tiempo de traslado"}
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-700">
                      {Number(horasModalOrden.duracionTraslado || 0).toFixed(2)} h
                    </p>

                    <p className="mt-1 text-[11px] font-semibold text-slate-500">
                      {lang === "en"
                        ? "Travel time is shown separately and is not included in work-hour payroll."
                        : "El traslado se muestra por separado y no se suma a las horas de trabajo para nómina."}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-600">
                      {lang === "en"
                        ? "Correct start"
                        : "Inicio correcto"}
                    </span>

                    <input
                      type="datetime-local"
                      value={horasForm.inicio}
                      onChange={(e) =>
                        setHorasForm((actual) => ({
                          ...actual,
                          inicio: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 font-bold text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-600">
                      {lang === "en"
                        ? "Correct end"
                        : "Final correcto"}
                    </span>

                    <input
                      type="datetime-local"
                      value={horasForm.cierre}
                      onChange={(e) =>
                        setHorasForm((actual) => ({
                          ...actual,
                          cierre: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-3 font-bold text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                </div>

                <div className={`mt-4 rounded-2xl border p-4 ${
                  previewValido && horasPreview <= 16
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50"
                }`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        {lang === "en"
                          ? "New calculated duration"
                          : "Nueva duración calculada"}
                      </p>

                      <p className={`mt-1 text-2xl font-black ${
                        previewValido && horasPreview <= 16
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}>
                        {previewValido
                          ? `${horasPreview.toFixed(2)} h`
                          : "—"}
                      </p>
                    </div>

                    {previewValido && horasPreview > 16 && (
                      <span className="rounded-full bg-amber-600 px-3 py-1.5 text-[10px] font-black text-white">
                        {lang === "en"
                          ? "Over 16 h"
                          : "Más de 16 h"}
                      </span>
                    )}
                  </div>
                </div>

                <label className="mt-4 block">
                  <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-600">
                    {lang === "en"
                      ? "Correction reason *"
                      : "Motivo de la corrección *"}
                  </span>

                  <textarea
                    rows={3}
                    value={horasForm.motivo}
                    onChange={(e) =>
                      setHorasForm((actual) => ({
                        ...actual,
                        motivo: e.target.value,
                      }))
                    }
                    placeholder={
                      lang === "en"
                        ? "Example: Technician forgot to close the job at the correct time."
                        : "Ejemplo: El técnico olvidó cerrar la orden a la hora correcta."
                    }
                    className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </label>

                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={cerrarRevisionHoras}
                    disabled={guardandoHoras}
                    className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    {lang === "en" ? "Cancel" : "Cancelar"}
                  </button>

                  <button
                    type="button"
                    onClick={guardarRevisionHoras}
                    disabled={guardandoHoras}
                    className="rounded-2xl bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {guardandoHoras
                      ? (lang === "en" ? "Saving..." : "Guardando...")
                      : (lang === "en"
                          ? "Save correction"
                          : "Guardar corrección")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/60 backdrop-blur">
        <div className="bg-slate-950 p-5 text-white">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-300">{t("history")}</p>
              <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
                <FileText size={24} />
                {t("historyTitle")}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                {t("historyDescription")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <MiniMetric icon={ClipboardList} label={t("total")} value={ordenes.length} />
              <MiniMetric icon={CheckCircle2} label={t("completed")} value={completadas} tone="from-emerald-800 to-teal-600" />
              <MiniMetric icon={XCircle} label={t("cancelled")} value={canceladas} tone="from-rose-800 to-red-700" />
              <MiniMetric icon={DollarSign} label={t("materials")} value={`$${totalMateriales.toFixed(2)}`} tone="from-slate-800 to-slate-950" />
            </div>
          </div>
        </div>

        <div className="grid gap-3 bg-[radial-gradient(circle_at_top_right,_#22d3ee33,_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-4 lg:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={t("searchHistoryPlaceholder")}
              className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          >
            <option value="todos">{t("all")}</option>
            <option value="Completado">{t("completed")}</option>
            <option value="Cancelada">{t("cancelled")}</option>
          </select>

          <select
            value={ordenFecha}
            onChange={(e) => setOrdenFecha(e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none shadow-sm focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          >
            <option value="recientes">{t("mostRecent")}</option>
            <option value="antiguos">{t("oldest")}</option>
          </select>
        </div>
      </div>

      {session?.role === "admin" && (
        <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-xl shadow-emerald-100/60">
          <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-800 p-5 text-white">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">
                  {financeCopy.eyebrow}
                </p>

                <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
                  <DollarSign size={24} />
                  {financeCopy.title}
                </h2>

                <p className="mt-1 text-sm text-emerald-50/75">
                  {financeCopy.description}
                </p>

                <p className="mt-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black ring-1 ring-white/15">
                  {formatoFechaFinanzas(rangoSemanaFinanzas.inicio)}
                  {" — "}
                  {formatoFechaFinanzas(finVisibleSemana)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSemanaFinanzasOffset((v) => v - 1)}
                  className="rounded-2xl bg-white/10 px-3 py-2 text-xs font-black text-white ring-1 ring-white/15 hover:bg-white/20"
                >
                  ‹ {financeCopy.previous}
                </button>

                <button
                  type="button"
                  onClick={() => setSemanaFinanzasOffset(0)}
                  className="rounded-2xl bg-emerald-300 px-3 py-2 text-xs font-black text-slate-950"
                >
                  {financeCopy.current}
                </button>

                <button
                  type="button"
                  onClick={() => setSemanaFinanzasOffset((v) => v + 1)}
                  className="rounded-2xl bg-white/10 px-3 py-2 text-xs font-black text-white ring-1 ring-white/15 hover:bg-white/20"
                >
                  {financeCopy.next} ›
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-2 bg-emerald-50/50 p-4 sm:grid-cols-2 xl:grid-cols-5">
            <MiniMetric
              icon={ClipboardList}
              label={financeCopy.orders}
              value={ordenesFinanzasSemana.length}
            />

            <MiniMetric
              icon={DollarSign}
              label={financeCopy.billed}
              value={`$${resumenFinanzasSemana.cobrado.toFixed(2)}`}
              tone="from-emerald-800 to-teal-600"
            />

            <MiniMetric
              icon={ReceiptText}
              label={financeCopy.materials}
              value={`$${resumenFinanzasSemana.materiales.toFixed(2)}`}
              tone="from-slate-800 to-slate-950"
            />

            <MiniMetric
              icon={Users}
              label={financeCopy.labor}
              value={`$${resumenFinanzasSemana.manoObra.toFixed(2)}`}
              tone="from-blue-800 to-indigo-700"
            />

            <MiniMetric
              icon={BarChart3}
              label={financeCopy.result}
              value={`$${resultadoFinanzasSemana.toFixed(2)}`}
              tone={
                resultadoFinanzasSemana >= 0
                  ? "from-cyan-800 to-blue-700"
                  : "from-rose-800 to-red-700"
              }
            />
          </div>

          {resumenFinanzasSemana.revisionHoras > 0 && (
            <button
              type="button"
              onClick={() => setSoloRevisionHoras((actual) => !actual)}
              className={`mx-4 mt-1 flex w-[calc(100%-2rem)] items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-xs font-black transition ${
                soloRevisionHoras
                  ? "border-amber-400 bg-amber-100 text-amber-950 shadow-md shadow-amber-100"
                  : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle size={16} />
                {resumenFinanzasSemana.revisionHoras} {financeCopy.review}
              </span>

              <span className="rounded-full bg-white px-3 py-1 text-[10px] ring-1 ring-amber-200">
                {soloRevisionHoras
                  ? (lang === "en" ? "Show all" : "Mostrar todos")
                  : (lang === "en" ? "View records" : "Ver registros")}
              </span>
            </button>
          )}

          <div className="p-4">
            {ordenesFinanzasSemana.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-bold text-slate-500">
                {financeCopy.noOrders}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <div className="min-w-[1100px]">
                  <div className="grid grid-cols-[1.35fr_0.9fr_0.8fr_0.7fr_0.75fr_0.85fr_1.2fr] gap-3 bg-slate-950 px-4 py-3 text-[10px] font-black uppercase tracking-wide text-white">
                    <span>{financeCopy.customer}</span>
                    <span>{financeCopy.technician}</span>
                    <span>{financeCopy.date}</span>
                    <span>{financeCopy.hours}</span>
                    <span>{financeCopy.materials}</span>
                    <span>{financeCopy.labor}</span>
                    <span>{financeCopy.charged}</span>
                  </div>

                  <div className="divide-y divide-slate-200 bg-white">
                    {ordenesFinanzasSemana
                      .filter((orden) =>
                        soloRevisionHoras
                          ? getValidatedWorkHours(orden).revision
                          : true
                      )
                      .map((orden) => {
                      const cliente = obtenerCliente(orden.clienteId);
                      const tecnico = obtenerTecnico?.(orden.tecnicoId);
                      const validacionHoras = getValidatedWorkHours(orden);

                      const materialesOrden = Number(
                        calcularCostoOrden?.(orden) ||
                        orden.costoMateriales ||
                        0
                      );

                      const pagoHora = Number(
                        tecnico?.pagoHora ||
                        tecnico?.pagoPorHora ||
                        0
                      );

                      const manoObraOrden =
                        validacionHoras.horas * pagoHora;

                      const fechaOrden =
                        getFinancialOrderDate(orden);

                      const key = String(orden.id);

                      const precioValor =
                        key in precioDrafts
                          ? precioDrafts[key]
                          : orden.precioCobrado || "";

                      return (
                        <div
                          key={`finance-${orden.id}`}
                          className="grid grid-cols-[1.35fr_0.9fr_0.8fr_0.7fr_0.75fr_0.85fr_1.2fr] items-center gap-3 px-4 py-3 text-sm hover:bg-emerald-50/50"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-black text-slate-950">
                              {cliente?.nombre || t("deletedCustomer")}
                            </p>
                            <p className="truncate text-[11px] font-bold text-slate-400">
                              #{orden.id}
                            </p>
                          </div>

                          <p className="truncate font-bold text-slate-700">
                            {tecnico?.nombre || t("noTechnician")}
                          </p>

                          <p className="font-bold text-slate-600">
                            {fechaOrden
                              ? formatReportDate(fechaOrden, t)
                              : t("noDate")}
                          </p>

                          <div className="flex flex-col items-start gap-1">
                            {validacionHoras.revision ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-black text-amber-800 ring-1 ring-amber-200">
                                <AlertTriangle size={11} />
                                {financeCopy.review}
                              </span>
                            ) : (
                              <span className="font-black text-blue-700">
                                {validacionHoras.horas.toFixed(2)} h
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => abrirRevisionHoras(orden)}
                              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-black transition ${
                                validacionHoras.revision
                                  ? "bg-amber-600 text-white hover:bg-amber-700"
                                  : "bg-blue-50 text-blue-700 ring-1 ring-blue-100 hover:bg-blue-100"
                              }`}
                            >
                              <Pencil size={10} />
                              {validacionHoras.revision
                                ? financeCopy.review
                                : (lang === "en" ? "Edit hours" : "Editar horas")}
                            </button>
                          </div>

                          <p className="font-black text-slate-700">
                            ${materialesOrden.toFixed(2)}
                          </p>

                          <p className="font-black text-indigo-700">
                            ${manoObraOrden.toFixed(2)}
                          </p>

                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <DollarSign
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
                              />

                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={precioValor}
                                onChange={(e) =>
                                  setPrecioDrafts((actual) => ({
                                    ...actual,
                                    [key]: e.target.value,
                                  }))
                                }
                                placeholder="0.00"
                                className="w-full rounded-xl border border-emerald-200 bg-white py-2 pl-8 pr-2 text-sm font-black text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                              />
                            </div>

                            <button
                              type="button"
                              disabled={guardandoPrecioId === key}
                              onClick={() => guardarCobroOrden(orden)}
                              className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-black text-white transition hover:bg-emerald-600 disabled:opacity-50"
                            >
                              {guardandoPrecioId === key
                                ? financeCopy.saving
                                : financeCopy.save}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-md shadow-slate-300/60 backdrop-blur">
        <div className="bg-slate-950 px-4 py-3 text-white">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">{t("orderRecords")}</p>
              <h3 className="text-lg font-black">{t("completedAndCancelled")}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-2xl bg-white/10 p-1 ring-1 ring-white/20">
                <button
                  type="button"
                  onClick={() => setVistaHistorial("compacta")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                    vistaHistorial === "compacta" ? "bg-cyan-300 text-slate-950" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {t("compact") || "Compacta"}
                </button>
                <button
                  type="button"
                  onClick={() => setVistaHistorial("detallada")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition ${
                    vistaHistorial === "detallada" ? "bg-cyan-300 text-slate-950" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {t("detailed") || "Detallada"}
                </button>
              </div>

              <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-black ring-1 ring-white/20">
                {historialFiltrado.length} {t("records")}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-[radial-gradient(circle_at_top_right,_#22d3ee26,_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#eef6ff_45%,_#f8fafc_100%)] p-5">
          {historialFiltrado.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-500">
              {t("noHistoryOrders")}
            </div>
          )}

          {vistaHistorial === "compacta" && historialFiltrado.length > 0 && (
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
              <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
                <div className="min-w-[980px]">
                  <div className="grid grid-cols-[1.25fr_0.75fr_0.9fr_0.75fr_0.65fr_450px] gap-3 bg-slate-950 px-4 py-3 text-[10px] font-black uppercase tracking-wide text-white">
                    <span>{t("customer")}</span>
                    <span>{t("status")}</span>
                    <span>{t("technician")}</span>
                    <span>{t("date")}</span>
                    <span>{t("photos")}</span>
                    <span className="text-right">{t("actions")}</span>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {historialFiltrado.map((orden) => {
                      const cliente = obtenerCliente(orden.clienteId);
                      const tecnico = obtenerTecnico?.(orden.tecnicoId);
                      const fotosCount = ["antes", "durante", "despues"].filter((k) => orden.fotos?.[k]).length;
                      const fecha = formatReportDate(orden.fechaCompletada || orden.fechaCreacion || orden.fecha);

                      return (
                        <article key={`compact-${orden.id}`} className="grid grid-cols-[1.25fr_0.75fr_0.9fr_0.75fr_0.65fr_450px] items-center gap-3 px-4 py-3 text-sm transition hover:bg-blue-50/70">
                          <div className="min-w-0">
                            <p className="truncate font-black text-slate-950">{cliente?.nombre || t("deletedCustomer")}</p>
                            <p className="truncate text-xs font-semibold text-slate-500">{orden.problema || t("workOrderFallback")}</p>
                          </div>

                          <span className={`w-fit rounded-full border px-2.5 py-1 text-[11px] font-black ${statusClass(orden.estado)}`}>
                            {statusLabel(orden.estado)}
                          </span>

                          <p className="truncate font-bold text-slate-700">{tecnico?.nombre || t("noTechnician")}</p>

                          <p className="truncate font-bold text-slate-600">{fecha}</p>

                          <button
                            type="button"
                            onClick={() => setEvidenciaOrden(orden)}
                            className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                          >
                            {fotosCount}/3
                          </button>

                          <div className="flex justify-end items-stretch gap-3">
                            {ordenProps?.obtenerInformeCOPorOrden?.(orden.id) && (
                              <ActionButton
                                icon={Eye}
                                label="CO"
                                onClick={() =>
                                  ordenProps?.abrirInformeCO?.(orden)
                                }
                                className="min-w-[70px] px-3 bg-red-700 text-white hover:bg-red-600"
                              />
                            )}

                            {ordenProps?.obtenerInformeStartupPorOrden?.(orden.id) && (
                              <ActionButton
                                icon={Eye}
                                label="Start-Up"
                                onClick={() =>
                                  ordenProps?.abrirInformeStartup?.(orden)
                                }
                                className="min-w-[92px] px-3 bg-blue-700 text-white hover:bg-blue-600"
                              />
                            )}
                            <ActionButton icon={Eye} label="" onClick={() => setDetalleOrden(orden)} className="min-w-[70px] px-4 bg-slate-950 text-white hover:bg-slate-800" />
                            <ActionButton icon={Printer} label="" onClick={() => compartirOrden?.(orden, "imprimir")} className="min-w-[70px] px-4 bg-cyan-100 text-cyan-800 hover:bg-cyan-200" />
                            <ActionButton icon={Share2} label="" onClick={() => compartirOrden?.(orden, "mensaje")} className="min-w-[70px] px-4 bg-blue-50 text-blue-700 hover:bg-blue-100" />
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {vistaHistorial === "detallada" && historialFiltrado.map((orden) => {
            const cliente = obtenerCliente(orden.clienteId);
            const tecnico = obtenerTecnico?.(orden.tecnicoId);
            const direccionHistorial = orden.direccionTrabajo || cliente?.direccion || "";
            const fotosCount = ["antes", "durante", "despues"].filter((k) => orden.fotos?.[k]).length;
            const materiales = materialesTexto?.(orden);
            const fecha = formatReportDate(orden.fechaCompletada || orden.fechaCreacion || orden.fecha);

            return (
              <article key={orden.id} className="group relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white shadow-xl shadow-slate-300/60 ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className={`absolute left-0 top-0 h-full w-2 ${
                  orden.estado === "Completado" ? "bg-emerald-500" :
                  orden.estado === "Cancelada" ? "bg-rose-500" :
                  orden.estado === "Necesita seguimiento" ? "bg-amber-500" :
                  "bg-blue-500"
                }`} />
                <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-cyan-200/30 blur-3xl transition group-hover:bg-cyan-300/40" />
                <div className="grid gap-5 p-5 pl-7 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
                  <div className="min-w-0">
                    <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/70 p-4 shadow-sm ring-1 ring-white">
                      <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-blue-200/30 blur-3xl" />
                      <div className="relative flex items-start gap-4">
                        <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-700 text-white shadow-lg shadow-blue-200/70">
                          <UserRoundCheck size={25} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="max-w-full truncate text-2xl font-black leading-tight text-slate-950">
                              {cliente?.nombre || t("deletedCustomer")}
                            </p>
                            <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(orden.estado)}`}>
                              {statusLabel(orden.estado)}
                            </span>
                            <span className={`rounded-full border px-3 py-1 text-xs font-black ${priorityClass(orden.prioridad)}`}>
                              {priorityLabel(orden.prioridad || "Media")}
                            </span>
                          </div>

                          <div className="mt-3 grid gap-2 text-sm font-black text-slate-600 md:grid-cols-[180px_minmax(0,1fr)]">
                            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
                              <Phone size={15} className="shrink-0 text-emerald-600" />
                              <span className="truncate">{formatPhoneDisplay(cliente?.telefono || "") || t("noPhone")}</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
                              <MapPin size={15} className="shrink-0 text-blue-700" />
                              <span className="line-clamp-1">{direccionHistorial || t("noAddress")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-[1.35rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">{t("technician")}</p>
                        <p className="mt-1 flex items-center gap-1 truncate text-sm font-black text-slate-900">
                          <BadgeCheck size={13} className="text-blue-700" />
                          {tecnico?.nombre || t("noTechnician")}
                        </p>
                      </div>

                      <div className="rounded-[1.35rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">{t("scheduledDate")}</p>
                        <p className="mt-1 flex items-center gap-1 truncate text-sm font-black text-slate-900">
                          <CalendarDays size={13} className="text-slate-500" />
                          {fecha}
                        </p>
                      </div>

                      <div className="rounded-[1.35rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">{t("materials")}</p>
                        <p className="mt-1 line-clamp-1 text-sm font-black text-slate-900">
                          {materiales || t("noMaterials")}
                        </p>
                      </div>

                      <button
                        onClick={() => setEvidenciaOrden(orden)}
                        className="rounded-[1.35rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-3 text-left text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md"
                      >
                        <p className="text-[10px] font-black uppercase tracking-wide">{t("photos")}</p>
                        <p className="mt-1 flex items-center gap-1 text-sm font-black">
                          <Camera size={13} />
                          Ver {fotosCount}/3
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-4 text-white shadow-xl shadow-slate-300/50">
                    <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-cyan-300/20 blur-3xl" />
                    <p className="relative mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100">{t("quickActions")}</p>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setDetalleOrden(orden)}
                        className="relative inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white/12 px-3 text-sm font-black text-white shadow-sm ring-1 ring-white/15 backdrop-blur transition hover:bg-white/18"
                      >
                        <Eye size={15} />
                        {t("viewOrder")}
                      </button>

                      {cliente?.telefono && (
                        <a href={`tel:${cliente.telefono}`} className="relative inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-400/20 px-3 text-sm font-black text-emerald-100 shadow-sm ring-1 ring-emerald-200/20 backdrop-blur transition hover:bg-emerald-400/30">
                          <PhoneCall size={15} />
                          {t("call")}
                        </a>
                      )}

                      {direccionHistorial && (
                        <a href={urlAppleMaps?.(direccionHistorial)} target="_blank" rel="noreferrer" className="relative inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white/12 px-3 text-sm font-black text-white shadow-sm ring-1 ring-white/15 backdrop-blur transition hover:bg-white/18">
                          <MapPinned size={15} />
                          {t("map")}
                        </a>
                      )}

                      <button
                        onClick={() => compartirOrden?.(orden, "imprimir")}
                        className="relative inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-3 text-sm font-black text-slate-950 shadow-sm transition hover:bg-cyan-200"
                      >
                        <Printer size={15} />
                        {t("print")}
                      </button>

                      {ordenProps?.obtenerInformeCOPorOrden?.(orden.id) && (
                        <button
                          type="button"
                          onClick={() =>
                            ordenProps?.abrirInformeCO?.(orden)
                          }
                          className="relative col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 to-orange-600 px-3 text-sm font-black text-white shadow-sm transition hover:from-red-600 hover:to-orange-500"
                        >
                          <Eye size={15} />
                          CO
                        </button>
                      )}

                      {ordenProps?.obtenerInformeStartupPorOrden?.(orden.id) && (
                        <button
                          type="button"
                          onClick={() =>
                            ordenProps?.abrirInformeStartup?.(orden)
                          }
                          className="relative col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-3 text-sm font-black text-white shadow-sm transition hover:from-blue-500 hover:to-cyan-400"
                        >
                          <Eye size={15} />
                          Start-Up
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => compartirOrden?.(orden, "mensaje")}
                      className="relative mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 text-sm font-black text-white shadow-sm backdrop-blur transition hover:bg-white/15"
                    >
                      <Share2 size={15} />
                      {t("sendReport")}
                    </button>

                    {session?.role === "admin" && ["Completado", "Cancelada", "Necesita seguimiento"].includes(orden.estado) && (
                      <div className="relative mt-3 rounded-2xl border border-cyan-200/20 bg-white/10 p-2 shadow-sm ring-1 ring-white/10 backdrop-blur">
                        <button
                          onClick={() => abrirRevisionHoras(orden)}
                          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-blue-400 px-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-200 hover:to-blue-300"
                        >
                          <Pencil size={15} />
                          {t("adminCorrection")}
                        </button>

                        {(orden.historialAdmin || []).length > 0 && (
                          <p className="mt-2 text-center text-[11px] font-black text-cyan-100">
                            {(orden.historialAdmin || []).length} corrección(es) internas registradas
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <PhotoEvidenceModal
        open={Boolean(evidenciaOrden)}
        onClose={() => setEvidenciaOrden(null)}
        orden={evidenciaOrden}
        cliente={evidenciaOrden ? obtenerCliente(evidenciaOrden.clienteId) : null}
        tecnico={evidenciaOrden ? obtenerTecnico?.(evidenciaOrden.tecnicoId) : null}
      />

      <OrderDetailModal
        open={Boolean(detalleOrden)}
        onClose={() => setDetalleOrden(null)}
        orden={detalleOrden}
        cliente={detalleOrden ? obtenerCliente(detalleOrden.clienteId) : null}
        tecnico={detalleOrden ? obtenerTecnico?.(detalleOrden.tecnicoId) : null}
        ordenProps={ordenProps}
      />
    </section>
  );
}
