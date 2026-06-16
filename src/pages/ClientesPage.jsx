import { useMemo, useState } from "react";
import { crearDireccionClienteSupabase } from "../services/clientesService";

import {
  Building2,
  CalendarDays,
  ClipboardList,
  Hash,
  Home,
  KeyRound,
  Mail,
  MapPin,
  MapPinned,
  Navigation,
  Pencil,
  Phone,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";

function formatPhoneUS(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 10);
}

function formatPhoneDisplay(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length !== 10) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatReportDate(value, t = (key) => key) {
  if (!value) return t("noHistory");
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

function StatMini({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-center backdrop-blur">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-[9px] font-black uppercase tracking-wide text-cyan-200">{label}</p>
    </div>
  );
}

function ClientStatus({ activeOrders, appointments, t = (key) => key }) {
  if (activeOrders > 0) {
    return (
      <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-700">
        {t("activeOrder")}
      </span>
    );
  }

  if (appointments > 0) {
    return (
      <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-black text-cyan-700">
        {t("appointmentsLabel")}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-black text-slate-600">
      {t("noOrder")}
    </span>
  );
}

function EditInput({ value, onChange, placeholder = "" }) {
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-300 bg-white p-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    />
  );
}

function ModernInput({ label, icon: Icon, value, onChange, placeholder = "", type = "text", inputMode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type={type}
          inputMode={inputMode}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-300 bg-white p-3 pl-10 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
        />
      </div>
    </label>
  );
}

function FormSection({ icon: Icon, title, subtitle, tone = "blue", children }) {
  const styles = {
    blue: "from-white to-blue-50/70 text-blue-700 bg-blue-100",
    cyan: "from-white to-cyan-50/80 text-cyan-700 bg-cyan-100",
    slate: "from-white to-slate-50 text-slate-700 bg-slate-100",
  };

  const [gradient, iconText, iconBg] = styles[tone].split(" ");

  return (
    <section className={`rounded-3xl border border-slate-200 bg-gradient-to-br ${gradient} p-4`}>
      <div className="mb-3 flex items-center gap-2">
        <div className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ${iconBg} ${iconText}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-black text-slate-950">{title}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}


const COMMON_EMAIL_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "yahoo.com",
  "live.com",
  "aol.com",
  "msn.com",
];

const EMAIL_DOMAIN_FIXES = {
  "gnail.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.co": "gmail.com",
  "hotmsil.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "homail.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com",
  "outlook.con": "outlook.com",
  "iclod.com": "icloud.com",
  "icloud.con": "icloud.com",
  "yaho.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
};

function getEmailSuggestion(email) {
  const clean = String(email || "").trim().toLowerCase();
  if (!clean || !clean.includes("@")) return "";

  const [local, domain] = clean.split("@");
  if (!local || !domain) return "";

  if (EMAIL_DOMAIN_FIXES[domain]) {
    return `${local}@${EMAIL_DOMAIN_FIXES[domain]}`;
  }

  const exact = COMMON_EMAIL_DOMAINS.includes(domain);
  if (exact) return "";

  const close = COMMON_EMAIL_DOMAINS.find((known) => {
    if (Math.abs(known.length - domain.length) > 3) return false;
    let diff = 0;
    const max = Math.max(known.length, domain.length);
    for (let i = 0; i < max; i += 1) {
      if (known[i] !== domain[i]) diff += 1;
    }
    return diff <= 3;
  });

  return close ? `${local}@${close}` : "";
}

function isValidEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
}




function normalizeGeoapifyAddress(feature) {
  const p = feature?.properties || {};

  return {
    full: p.formatted || [
      p.address_line1,
      p.address_line2,
      p.city,
      p.state,
      p.postcode,
    ].filter(Boolean).join(", "),
    street: p.street || p.address_line1 || "",
    city: p.city || "",
    state: p.state || "",
    zip: p.postcode || "",
  };
}

async function searchGeoapifyAddresses(query) {
  const geoapifyEnvKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
  const apiKey = geoapifyEnvKey && !String(geoapifyEnvKey).startsWith("http")
    ? geoapifyEnvKey
    : "7dc45d6efb344f928a1fdacb7e510509";

  if (!apiKey) {
    throw new Error("Falta VITE_GEOAPIFY_API_KEY en .env");
  }

  if (!query || query.trim().length < 3) return [];

  const params = new URLSearchParams({
    text: query,
    apiKey,
    limit: "6",
    filter: "countrycode:us",
    lang: "en",
    format: "json",
  });

  const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Geoapify no respondió correctamente");
  }

  const data = await response.json();
  return (data.results || []).map((item) => ({
    properties: item,
  }));
}

export default function ClientesPage({
  t,
  clientes,
  setClientes,
  ordenes = [],
  citas = [],
  clienteForm,
  setClienteForm,
  agregarCliente,
  abrirCrearOrdenConCliente,
  abrirProgramarCitaConCliente,
  urlAppleMaps,
  urlTelefono,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [clienteEdit, setClienteEdit] = useState(null);
  const [ordenVista, setOrdenVista] = useState("recientes");
  const [direccionActiva, setDireccionActiva] = useState(false);
  const [direccionSugerencias, setDireccionSugerencias] = useState([]);
  const [direccionCargando, setDireccionCargando] = useState(false);
  const [direccionError, setDireccionError] = useState("");
  const [ubicacionClienteId, setUbicacionClienteId] = useState(null);
  const [ubicacionForm, setUbicacionForm] = useState({
    etiqueta: "",
    direccion: "",
    apartamento: "",
    edificio: "",
    codigoAcceso: "",
    notas: "",
  });
  const [guardandoUbicacion, setGuardandoUbicacion] = useState(false);
  const [ubicacionDireccionActiva, setUbicacionDireccionActiva] = useState(false);
  const [ubicacionDireccionSugerencias, setUbicacionDireccionSugerencias] = useState([]);
  const [ubicacionDireccionCargando, setUbicacionDireccionCargando] = useState(false);
  const [ubicacionDireccionError, setUbicacionDireccionError] = useState("");

  const emailSuggestion = getEmailSuggestion(clienteForm.email);
  const emailInvalid = Boolean(clienteForm.email) && !isValidEmail(clienteForm.email);

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
    const ultimaOrden = [...ordenesCliente(cliente.id)].sort((a, b) =>
      String(b.fechaCreacion || b.fecha || "").localeCompare(String(a.fechaCreacion || a.fecha || ""))
    )[0];

    return ultimaOrden?.tecnicoId || "";
  };
  const buscarDireccionesGeoapify = async (value) => {
    setClienteForm({ ...clienteForm, direccion: value });
    setDireccionActiva(true);
    setDireccionError("");

    if (!value || value.trim().length < 3) {
      setDireccionSugerencias([]);
      return;
    }

    setDireccionCargando(true);

    try {
      const results = await searchGeoapifyAddresses(value);
      setDireccionSugerencias(results);
    } catch (error) {
      console.warn("Geoapify error:", error);
      setDireccionSugerencias([]);
      setDireccionError("No se pudo buscar la dirección. Revisa la conexión o la API Key de Geoapify.");
    } finally {
      setDireccionCargando(false);
    }
  };

  const seleccionarDireccionGeoapify = (feature) => {
    const parts = normalizeGeoapifyAddress(feature);

    if (!parts.full) return;

    setClienteForm({
      ...clienteForm,
      direccion: parts.full,
      calle: clienteForm.calle || parts.street || "",
    });

    setDireccionSugerencias([]);
    setDireccionActiva(false);
    setDireccionError("");
  };

  const buscarDireccionUbicacionGeoapify = async (value) => {
    setUbicacionForm({ ...ubicacionForm, direccion: value });
    setUbicacionDireccionActiva(true);
    setUbicacionDireccionError("");

    if (!value || value.trim().length < 3) {
      setUbicacionDireccionSugerencias([]);
      return;
    }

    setUbicacionDireccionCargando(true);

    try {
      const results = await searchGeoapifyAddresses(value);
      setUbicacionDireccionSugerencias(results);
    } catch (error) {
      console.warn("Geoapify ubicación error:", error);
      setUbicacionDireccionSugerencias([]);
      setUbicacionDireccionError("No se pudo buscar la dirección. Revisa Geoapify.");
    } finally {
      setUbicacionDireccionCargando(false);
    }
  };

  const seleccionarDireccionUbicacionGeoapify = (feature) => {
    const parts = normalizeGeoapifyAddress(feature);

    if (!parts.full) return;

    setUbicacionForm({
      ...ubicacionForm,
      direccion: parts.full,
    });

    setUbicacionDireccionSugerencias([]);
    setUbicacionDireccionActiva(false);
    setUbicacionDireccionError("");
  };

  const visibles = useMemo(() => {
    const q = String(busqueda || "").toLowerCase().trim();

    let lista = clientes.filter((c) => {
      if (!q) return true;
      const ubicacionesTexto = (c.cliente_direcciones || [])
        .map((d) => [d.etiqueta, d.direccion, d.apartamento, d.edificio, d.codigo_acceso, d.notas].join(" "))
        .join(" ");

      return [c.nombre, c.telefono, c.email, ubicacionesTexto]
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

    setClientes(clientes.map((c) =>
      String(c.id) === String(clienteEdit.id)
        ? { ...clienteEdit, telefono: formatPhoneUS(clienteEdit.telefono) }
        : c
    ));

    setEditandoId(null);
    setClienteEdit(null);
  };

  const guardarUbicacionCliente = async (clienteId) => {
    if (!clienteId) return;

    if (!ubicacionForm.etiqueta.trim() || !ubicacionForm.direccion.trim()) {
      return alert("Etiqueta y dirección son obligatorias.");
    }

    try {
      setGuardandoUbicacion(true);

      const clienteActual = clientes.find((cliente) => String(cliente.id) === String(clienteId));
      const direccionesActualesAntes = clienteActual?.cliente_direcciones || [];

      const nuevaUbicacion = await crearDireccionClienteSupabase(clienteId, {
        ...ubicacionForm,
        principal: direccionesActualesAntes.length === 0,
      });

      setClientes(clientes.map((cliente) => {
        if (String(cliente.id) !== String(clienteId)) return cliente;

        const direccionesActuales = cliente.cliente_direcciones || [];

        return {
          ...cliente,
          cliente_direcciones: [...direccionesActuales, nuevaUbicacion],
        };
      }));

      setUbicacionForm({
        etiqueta: "",
        direccion: "",
        apartamento: "",
        edificio: "",
        codigoAcceso: "",
        notas: "",
      });
    } catch (error) {
      console.error("Error guardando ubicación:", error);
      alert("No se pudo guardar la ubicación. Revisa Supabase o permisos.");
    } finally {
      setGuardandoUbicacion(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">{t("customerManagement")}</p>
              <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
                <Users size={24} />
                {t("customers")}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <StatMini label={t("customersLabel")} value={clientes.length} />
              <StatMini label={t("activeCustomersLabel")} value={clientes.filter((c) => ordenesCliente(c.id).some((o) => !["Completado", "Cancelada"].includes(o.estado))).length} />
              <StatMini label={t("appointmentsLabel")} value={clientes.filter((c) => citasCliente(c.id).length > 0).length} />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden border-t border-cyan-200/40 bg-slate-950 p-[1px]">
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_#22d3ee55,_transparent_30%),radial-gradient(circle_at_bottom_left,_#2563eb38,_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#eff6ff_48%,_#e0f7ff_100%)] p-4 2xl:p-5">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-300/40 blur-3xl" />
            <div className="absolute -bottom-20 left-20 h-56 w-56 rounded-full bg-blue-500/25 blur-3xl" />

            <div className="relative grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
              <aside className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white shadow-xl shadow-slate-300/60">
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20">
                    <Sparkles size={24} />
                  </div>
                  <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-cyan-200">
                    {t("newLabel")}
                  </span>
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
                  {t("quickRegistration")}
                </p>

                <h3 className="mt-1 text-2xl font-black leading-tight">
                  {t("createNewCustomer")}
                </h3>

                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-300">
                  
                </p>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                    <Users size={18} className="text-cyan-300" />
                    <div>
                      <p className="text-xs font-black">{t("contact")}</p>
                      <p className="text-[10px] text-slate-300">{t("contactDescription")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                    <MapPinned size={18} className="text-cyan-300" />
                    <div>
                      <p className="text-xs font-black">{t("location")}</p>
                      <p className="text-[10px] text-slate-300">{t("locationDescription")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                    <KeyRound size={18} className="text-cyan-300" />
                    <div>
                      <p className="text-xs font-black">{t("access")}</p>
                      <p className="text-[10px] text-slate-300">{t("accessDescription")}</p>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl shadow-slate-300/50 backdrop-blur">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-700">
                      {t("modernForm")}
                    </p>
                    <h4 className="text-lg font-black text-slate-950">
                      {t("customerData")}
                    </h4>
                  </div>

                  <button
                    onClick={agregarCliente}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-blue-900 to-cyan-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5"
                  >
                    <Plus size={16} />
                    {t("saveCustomer")}
                  </button>
                </div>

                <div className="space-y-4">
                  <FormSection icon={Users} title={t("mainInformation")} subtitle={t("basicContactData")} tone="blue">
                    <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {[
                        { value: "residencial", label: t("customerResidential"), help: t("customerResidentialHelp") },
                        { value: "corporativo", label: t("customerCorporate"), help: t("customerCorporateHelp") },
                      ].map((tipo) => {
                        const activo = clienteForm.tipoCliente === tipo.value;

                        return (
                          <button
                            key={tipo.value}
                            type="button"
                            onClick={() => setClienteForm({ ...clienteForm, tipoCliente: tipo.value })}
                            className={`rounded-2xl border px-4 py-3 text-left transition ${
                              activo
                                ? "border-blue-400 bg-blue-50 text-blue-800 shadow-sm"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <p className="text-sm font-black">{tipo.label}</p>
                            <p className="mt-1 text-xs font-bold opacity-75">{tipo.help}</p>
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                      <div className="lg:col-span-5">
                        <ModernInput
                          label={t("customerName")}
                          icon={Users}
                          value={clienteForm.nombre}
                          onChange={(v) => setClienteForm({ ...clienteForm, nombre: v })}
                          placeholder={t("customerNamePlaceholder")}
                        />
                      </div>

                      <div className="lg:col-span-3">
                        <ModernInput
                          label={t("phone")}
                          icon={Phone}
                          value={clienteForm.telefono}
                          inputMode="numeric"
                          onChange={(v) => setClienteForm({ ...clienteForm, telefono: formatPhoneUS(v) })}
                          placeholder="___-___-____"
                        />
                      </div>

                      <div className="lg:col-span-4">
                        <label className="block">
                          <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">{t("email")}</span>
                          <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="email"
                              value={clienteForm.email}
                              onChange={(e) => setClienteForm({ ...clienteForm, email: e.target.value })}
                              placeholder={t("emailPlaceholder")}
                              className={`w-full rounded-2xl border bg-white p-3 pl-10 text-sm outline-none shadow-sm transition focus:ring-4 ${
                                emailInvalid
                                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                                  : "border-slate-300 focus:border-blue-700 focus:ring-blue-100"
                              }`}
                            />
                          </div>

                          {emailInvalid && (
                            <p className="mt-1 text-xs font-bold text-rose-600">
                              Revisa el formato del correo.
                            </p>
                          )}

                          {emailSuggestion && (
                            <button
                              type="button"
                              onClick={() => setClienteForm({ ...clienteForm, email: emailSuggestion })}
                              className="mt-2 inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 hover:bg-blue-100"
                            >
                              ¿Quisiste decir {emailSuggestion}?
                            </button>
                          )}
                        </label>
                      </div>
                    </div>
                  </FormSection>

                  {clienteForm.tipoCliente === "residencial" ? (
                    <FormSection icon={MapPinned} title={t("residentialAddress")} subtitle={t("residentialAddressDescription")} tone="cyan">
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        <div className="relative md:col-span-2 xl:col-span-3">
                          <input
                            value={clienteForm.direccion}
                            onFocus={() => setDireccionActiva(true)}
                            onBlur={() => setTimeout(() => setDireccionActiva(false), 180)}
                            onChange={(e) => buscarDireccionesGeoapify(e.target.value)}
                            placeholder={t("homeAddress")}
                            autoComplete="new-password"
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-cyan-400"
                          />

                          {direccionActiva && direccionSugerencias.length > 0 && (
                            <div className="absolute left-0 right-0 z-50 mt-2 max-h-72 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
                              {direccionSugerencias.map((feature, index) => {
                                const parts = normalizeGeoapifyAddress(feature);
                                return (
                                  <button
                                    key={`${parts.full}-${index}`}
                                    type="button"
                                    onMouseDown={() => seleccionarDireccionGeoapify(feature)}
                                    className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-blue-50"
                                  >
                                    <MapPin size={15} className="mt-0.5 shrink-0 text-blue-700" />
                                    <span>{parts.full}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {direccionCargando && (
                            <p className="mt-2 text-xs font-semibold text-slate-500">{t("searchingAddresses")}</p>
                          )}

                          {direccionError && (
                            <p className="mt-2 text-xs font-bold text-amber-700">{direccionError}</p>
                          )}
                        </div>

                        <input
                          value={clienteForm.apartamento}
                          onChange={(e) => setClienteForm({ ...clienteForm, apartamento: e.target.value })}
                          placeholder="Apartamento / unidad"
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-cyan-400"
                        />

                        <input
                          value={clienteForm.edificio}
                          onChange={(e) => setClienteForm({ ...clienteForm, edificio: e.target.value })}
                          placeholder="Edificio"
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-cyan-400"
                        />

                        <input
                          value={clienteForm.codigoAcceso}
                          onChange={(e) => setClienteForm({ ...clienteForm, codigoAcceso: e.target.value })}
                          placeholder="Código de acceso"
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-cyan-400"
                        />
                      </div>
                    </FormSection>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-cyan-200 bg-cyan-50/70 p-4">
                      <div className="flex items-start gap-3">
                        <MapPinned size={20} className="mt-0.5 text-cyan-700" />
                        <div>
                          <p className="text-sm font-black text-slate-950">{t("separateLocations")}</p>
                          <p className="mt-1 text-xs font-bold leading-relaxed text-slate-600">
                            {t("corporateLocationsDescription")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-700">{t("compactTable")}</p>
            <h3 className="flex items-center gap-2 text-xl font-black text-slate-950">
              <Users size={20} />
              {t("registeredCustomers")}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-[320px_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={t("searchCustomerPlaceholder")}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <select
              value={ordenVista}
              onChange={(e) => setOrdenVista(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            >
              <option value="recientes">{t("mostRecent")}</option>
              <option value="nombre">{t("nameAZ")}</option>
              <option value="fecha">{t("dateLastMovement")}</option>
              <option value="tecnico">{t("technician")}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <div className="min-w-[1500px]">
            <div className="grid grid-cols-[1.1fr_0.75fr_1.25fr_0.65fr_0.8fr_700px] gap-3 bg-slate-950 px-4 py-3 text-[11px] font-black uppercase tracking-wide text-white">
              <span>{t("customer")}</span>
              <span>{t("phone")}</span>
              <span>{t("address")}</span>
              <span>{t("status")}</span>
              <span>{t("last")}</span>
              <span className="text-right">{t("actions")}</span>
            </div>

            <div className="divide-y divide-slate-200">
              {visibles.length === 0 && (
                <div className="p-6 text-center text-sm font-semibold text-slate-500">
                  {t("noCustomersFound")}
                </div>
              )}

              {visibles.map((c) => {
                const isEdit = String(editandoId) === String(c.id);
                const data = isEdit ? clienteEdit : c;
                const hist = ordenesCliente(c.id);
                const citasC = citasCliente(c.id);
                const activas = hist.filter((o) => !["Completado", "Cancelada"].includes(o.estado));
                const ultimaOrden = hist[hist.length - 1];

                return (
                  <>
                  <article key={c.id} className="grid grid-cols-[1.1fr_0.75fr_1.25fr_0.65fr_0.8fr_700px] gap-3 px-4 py-3 text-sm transition hover:bg-blue-50/50">
                    <div className="min-w-0">
                      {isEdit ? (
                        <EditInput value={data.nombre} onChange={(v) => setClienteEdit({ ...clienteEdit, nombre: v })} />
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                            <Users size={19} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-black text-slate-950">{c.nombre}</p>
                            <p className="truncate text-xs text-slate-500">{c.email || t("noEmail")}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center">
                      {isEdit ? (
                        <EditInput value={data.telefono} onChange={(v) => setClienteEdit({ ...clienteEdit, telefono: formatPhoneUS(v) })} />
                      ) : (
                        <p className="flex items-center gap-1.5 font-bold text-slate-700">
                          <Phone size={14} className="text-emerald-700" />
                          {formatPhoneDisplay(c.telefono)}
                        </p>
                      )}
                    </div>

                    <div className="min-w-0">
                      {isEdit ? (
                        <EditInput value={data.direccion} onChange={(v) => setClienteEdit({ ...clienteEdit, direccion: v })} />
                      ) : (
                        <>
                          <p className="line-clamp-1 font-semibold text-slate-700">
                            <MapPin size={14} className="mr-1 inline text-blue-700" />
                            {(c.cliente_direcciones || []).length > 0
                              ? `${(c.cliente_direcciones || []).length} ${(c.cliente_direcciones || []).length === 1 ? t("locationSingular") : t("locationPlural")}`
                              : t("noLocations")}
                          </p>
                          {(c.apartamento || c.edificio || c.codigoAcceso) && (
                            <p className="text-xs text-slate-500">
                              {[
                                c.apartamento ? `${t("apt")} ${c.apartamento}` : "",
                                c.edificio ? `${t("building")} ${c.edificio}` : "",
                                c.codigoAcceso ? `${t("accessCode")} ${c.codigoAcceso}` : "",
                              ].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex items-center">
                      <ClientStatus activeOrders={activas.length} appointments={citasC.length} t={t} />
                    </div>

                    <div>
                      <p className="font-bold text-slate-700">
                        {ultimaOrden ? formatReportDate(ultimaOrden.fechaCompletada || ultimaOrden.fechaCreacion || ultimaOrden.fecha, t) : t("noHistory")}
                      </p>
                      <p className="text-xs text-slate-500">{t("ordersCountLabel")} {hist.length} · {t("appointmentsCountLabel")} {citasC.length}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                      {isEdit ? (
                        <>
                          <button onClick={guardarEdicion} className="inline-flex min-w-[78px] items-center justify-center gap-1 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-black text-white">
                            <Save size={13} />
                            {t("save")}
                          </button>
                          <button onClick={() => { setEditandoId(null); setClienteEdit(null); }} className="min-w-[76px] rounded-xl border bg-white px-3 py-2 text-xs font-black text-slate-700">
                            {t("cancel")}
                          </button>
                        </>
                      ) : (
                        <button onClick={() => iniciarEdicion(c)} className="inline-flex min-w-[120px] items-center justify-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 hover:bg-blue-100">
                          <Pencil size={13} />
                          {t("edit")}
                        </button>
                      )}

                      <button
                        onClick={() => setUbicacionClienteId(ubicacionClienteId === c.id ? null : c.id)}
                        className="inline-flex min-w-[125px] items-center justify-center gap-1 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-700 hover:bg-indigo-100"
                      >
                        <MapPinned size={13} />
                        Ubicaciones
                      </button>

                      <button onClick={() => abrirCrearOrdenConCliente(c)} className="inline-flex min-w-[120px] items-center justify-center gap-1 rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white">
                        <ClipboardList size={13} />
                        {t("orderAction")}
                      </button>

                      <button onClick={() => abrirProgramarCitaConCliente(c)} className="inline-flex min-w-[140px] items-center justify-center gap-1 rounded-xl bg-cyan-700 px-3 py-2 text-xs font-black text-white">
                        <CalendarDays size={13} />
                        {t("appointmentAction")}
                      </button>

                      {c.telefono ? (
                        <a href={urlTelefono(c.telefono)} className="inline-flex min-w-[44px] items-center justify-center gap-1 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-black text-white">
                          <Phone size={13} />
                        </a>
                      ) : (
                        <span className="inline-flex min-w-[44px] items-center justify-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-300">
                          <Phone size={13} />
                        </span>
                      )}

                      {(c.cliente_direcciones || []).find((d) => d.principal)?.direccion || (c.cliente_direcciones || [])[0]?.direccion ? (
                        <a
                          href={urlAppleMaps((c.cliente_direcciones || []).find((d) => d.principal)?.direccion || (c.cliente_direcciones || [])[0]?.direccion)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-w-[44px] items-center justify-center gap-1 rounded-xl border bg-white px-3 py-2 text-xs font-black text-slate-700"
                        >
                          <Navigation size={13} />
                        </a>
                      ) : (
                        <span className="inline-flex min-w-[44px] items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-black text-slate-300">
                          <Navigation size={13} />
                        </span>
                      )}

                      <button
                        onClick={() => {
                          if (window.confirm(`¿Eliminar a ${c.nombre}?`)) {
                            setClientes(clientes.filter((x) => String(x.id) !== String(c.id)));
                          }
                        }}
                        className="inline-flex min-w-[44px] items-center justify-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </article>
                  {ubicacionClienteId === c.id && (
                    <div className="col-span-full border-t border-blue-100 bg-indigo-50/60 px-6 py-4">
                      <div className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-md shadow-indigo-100/60">
                        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-500">
                              Ubicaciones
                            </p>
                            <h4 className="text-lg font-black text-slate-950">
                              {c.nombre}
                            </h4>
                          </div>

                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
                            {(c.cliente_direcciones || []).length} Ubicaciones
                          </span>
                        </div>

                        {(c.cliente_direcciones || []).length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50 p-4 text-sm font-bold text-indigo-700">
                            {t("noAddress")}
                          </div>
                        ) : (
                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {(c.cliente_direcciones || []).map((d) => (
                              <div key={d.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                                <div className="mb-2 flex items-center justify-between gap-2">
                                  <p className="font-black text-slate-950">
                                    {d.etiqueta || t("address")}
                                  </p>
                                  {d.principal && (
                                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black text-emerald-700">
                                      Principal
                                    </span>
                                  )}
                                </div>

                                <p className="line-clamp-2 text-sm font-bold text-slate-700">
                                  <MapPin size={14} className="mr-1 inline text-blue-700" />
                                  {d.direccion || t("noAddress")}
                                </p>

                                {(d.apartamento || d.edificio || d.codigo_acceso) && (
                                  <p className="mt-2 text-xs font-semibold text-slate-500">
                                    {[
                                      d.apartamento ? `${t("apt")} ${d.apartamento}` : "",
                                      d.edificio ? `${t("building")} ${d.edificio}` : "",
                                      d.codigo_acceso ? `${t("accessCode")} ${d.codigo_acceso}` : "",
                                    ].filter(Boolean).join(" · ")}
                                  </p>
                                )}

                                {d.notas && (
                                  <p className="mt-2 rounded-xl bg-white p-2 text-xs font-bold text-slate-600">
                                    {d.notas}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                                {t("newLocation")}
                              </p>
                              <h5 className="text-sm font-black text-slate-950">
                                Agregar dirección para este cliente
                              </h5>
                            </div>
                            <Plus size={18} className="text-indigo-700" />
                          </div>

                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            <input
                              value={ubicacionForm.etiqueta}
                              onChange={(e) => setUbicacionForm({ ...ubicacionForm, etiqueta: e.target.value })}
                              placeholder="Etiqueta: Edificio A - Apt 101"
                              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-indigo-400"
                            />

                            <div className="relative md:col-span-2">
                              <input
                                value={ubicacionForm.direccion}
                                onFocus={() => setUbicacionDireccionActiva(true)}
                                onBlur={() => setTimeout(() => setUbicacionDireccionActiva(false), 180)}
                                onChange={(e) => buscarDireccionUbicacionGeoapify(e.target.value)}
                                placeholder="Dirección"
                                autoComplete="new-password"
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-indigo-400"
                              />

                              {ubicacionDireccionActiva && ubicacionDireccionSugerencias.length > 0 && (
                                <div className="absolute left-0 right-0 z-50 mt-2 max-h-72 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
                                  {ubicacionDireccionSugerencias.map((feature, index) => {
                                    const parts = normalizeGeoapifyAddress(feature);
                                    return (
                                      <button
                                        key={`${parts.full}-${index}`}
                                        type="button"
                                        onMouseDown={() => seleccionarDireccionUbicacionGeoapify(feature)}
                                        className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-blue-50"
                                      >
                                        <MapPin size={15} className="mt-0.5 shrink-0 text-blue-700" />
                                        <span>{parts.full}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {ubicacionDireccionCargando && (
                                <p className="mt-2 text-xs font-semibold text-slate-500">
                                  {t("searchingAddresses")}
                                </p>
                              )}

                              {ubicacionDireccionError && (
                                <p className="mt-2 text-xs font-bold text-amber-700">
                                  {ubicacionDireccionError}
                                </p>
                              )}
                            </div>

                            <input
                              value={ubicacionForm.apartamento}
                              onChange={(e) => setUbicacionForm({ ...ubicacionForm, apartamento: e.target.value })}
                              placeholder="Apartamento"
                              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-indigo-400"
                            />

                            <input
                              value={ubicacionForm.edificio}
                              onChange={(e) => setUbicacionForm({ ...ubicacionForm, edificio: e.target.value })}
                              placeholder="Edificio"
                              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-indigo-400"
                            />

                            <input
                              value={ubicacionForm.codigoAcceso}
                              onChange={(e) => setUbicacionForm({ ...ubicacionForm, codigoAcceso: e.target.value })}
                              placeholder="Código de acceso"
                              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-indigo-400"
                            />

                            <textarea
                              value={ubicacionForm.notas}
                              onChange={(e) => setUbicacionForm({ ...ubicacionForm, notas: e.target.value })}
                              placeholder="Notas de esta ubicación"
                              rows={3}
                              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-indigo-400 md:col-span-2 xl:col-span-3"
                            />
                          </div>

                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={() => guardarUbicacionCliente(c.id)}
                              disabled={guardandoUbicacion}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Save size={16} />
                              {guardandoUbicacion ? "Guardando..." : "Guardar ubicación"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
