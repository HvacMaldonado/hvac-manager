import { useMemo, useState } from "react";
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
    : "3Edjk4Otx0ItTI31iJAnklTi2Ie_3W4Ubu663aSSeyqRZTeAq";

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
      setDireccionError("Geoapify no está activo. Revisa VITE_GEOAPIFY_API_KEY en .env.");
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

    setClientes(clientes.map((c) =>
      String(c.id) === String(clienteEdit.id)
        ? { ...clienteEdit, telefono: formatPhoneUS(clienteEdit.telefono) }
        : c
    ));

    setEditandoId(null);
    setClienteEdit(null);
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
                Clientes
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
                    Nuevo
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

                  <FormSection icon={MapPinned} title={t("serviceLocation")} subtitle={t("serviceLocationDescription")} tone="cyan">
                    <label className="block">
                      <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-500">{t("fullAddress")}</span>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={clienteForm.direccion}
                          onFocus={() => setDireccionActiva(true)}
                          onBlur={() => setTimeout(() => setDireccionActiva(false), 180)}
                          onChange={(e) => buscarDireccionesGeoapify(e.target.value)}
                          placeholder={t("addressPlaceholder")}
                          autoComplete="off"
                          className="w-full rounded-2xl border border-slate-300 bg-white p-3 pl-10 text-sm outline-none shadow-sm transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
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
                      </div>

                      {direccionCargando && (
                        <p className="mt-2 text-xs font-semibold text-slate-500">
                          Buscando direcciones...
                        </p>
                      )}

                      {direccionError && (
                        <p className="mt-2 text-xs font-bold text-amber-700">
                          {direccionError}
                        </p>
                      )}

                      {!direccionError && (
                        <p className="mt-2 text-xs font-semibold text-slate-500">
                          {t("geoapifyHelp")}
                        </p>
                      )}
                    </label>
                  </FormSection>

                  <FormSection icon={KeyRound} title={t("accessDetails")} subtitle={t("accessDetailsDescription")} tone="slate">
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
                      <ModernInput
                        label="Apt"
                        icon={Home}
                        value={clienteForm.apartamento}
                        onChange={(v) => setClienteForm({ ...clienteForm, apartamento: v })}
                        placeholder="Apt"
                      />

                      <ModernInput
                        label={t("building")}
                        icon={Building2}
                        value={clienteForm.edificio}
                        onChange={(v) => setClienteForm({ ...clienteForm, edificio: v })}
                        placeholder={t("building")}
                      />

                      <ModernInput
                        label={t("street")}
                        icon={MapPinned}
                        value={clienteForm.calle}
                        onChange={(v) => setClienteForm({ ...clienteForm, calle: v })}
                        placeholder={t("street")}
                      />

                      <ModernInput
                        label={t("accessCode")}
                        icon={Hash}
                        value={clienteForm.codigoAcceso}
                        onChange={(v) => setClienteForm({ ...clienteForm, codigoAcceso: v })}
                        placeholder={t("accessCode")}
                      />
                    </div>
                  </FormSection>
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
            <div className="grid grid-cols-[1.1fr_0.75fr_1.25fr_0.65fr_0.8fr_560px] gap-3 bg-slate-950 px-4 py-3 text-[11px] font-black uppercase tracking-wide text-white">
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
                  <article key={c.id} className="grid grid-cols-[1.1fr_0.75fr_1.25fr_0.65fr_0.8fr_560px] gap-3 px-4 py-3 text-sm transition hover:bg-blue-50/50">
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
                            {c.direccion || t("noAddress")}
                          </p>
                          <p className="text-xs text-slate-500">
                            {t("apt")} {c.apartamento || "—"} · {t("building")} {c.edificio || "—"} · {t("accessCode")} {c.codigoAcceso || "—"}
                          </p>
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

                      {c.direccion ? (
                        <a href={urlAppleMaps(c.direccion)} target="_blank" rel="noreferrer" className="inline-flex min-w-[44px] items-center justify-center gap-1 rounded-xl border bg-white px-3 py-2 text-xs font-black text-slate-700">
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
