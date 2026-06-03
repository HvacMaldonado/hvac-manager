import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CalendarDays,
  Camera,
  ClipboardList,
  Download,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Plus,
  Printer,
  Save,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Trash2,
  UserCog,
  Wrench,
} from "lucide-react";
import {
  IconText,
  iconProps,
  formatPhoneDisplay,
  formatReportDate,
  escapeHtml,
} from "../../lib/shared.jsx";
import { PriorityChips } from "../common/UI.jsx";

export function OrdenesAdminPage({ t, ordenes, obtenerCliente, ordenProps, crearOrden, ordenForm, setOrdenForm, busquedaClienteOrden, setBusquedaClienteOrden, clientesFiltradosOrden, tecnicos }) {
  const [mostrarClientes, setMostrarClientes] = useState(false);

  const seleccionarCliente = (c) => {
    setOrdenForm({ ...ordenForm, clienteId: String(c.id) });
    setBusquedaClienteOrden(`${c.nombre} - ${c.telefono || ""}`);
    setMostrarClientes(false);
  };

  const ordenesAsignadas = ordenes.filter((o) => o.tecnicoId);
  const ordenesSinAsignar = ordenes.filter((o) => !o.tecnicoId);

  return (
    <section className="grid w-full min-w-0 grid-cols-1 gap-3 2xl:gap-5 2xl:grid-cols-[minmax(380px,420px)_minmax(0,1fr)]">
      <section className="h-fit rounded-2xl 2xl:rounded-[2rem] border border-white/70 bg-gradient-to-br from-white via-slate-50 to-cyan-50/50 p-3 2xl:p-5 shadow-lg 2xl:shadow-xl shadow-blue-100/70 backdrop-blur">
        <div className="mb-3">
          <p className="text-[10px] 2xl:text-xs font-black uppercase tracking-[0.25em] text-blue-700">Despacho</p>
          <h2 className="flex items-center gap-2 text-xl 2xl:text-2xl font-black text-slate-950">
            <ClipboardList size={18} className="2xl:hidden" />
            <ClipboardList size={24} className="hidden 2xl:block" />
            {t("createOrder")}
          </h2>
          <p className="mt-1 text-xs 2xl:text-sm text-slate-500">
            El administrador crea y asigna. El técnico ejecuta la orden desde su perfil.
          </p>
        </div>

        <div className="space-y-3 2xl:space-y-4">
          <div className="relative">
            <label className="flex items-center gap-2 text-xs 2xl:text-sm font-black">
              <Search size={15} />
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
              <div className="absolute left-0 right-0 z-20 mt-2 max-h-64 overflow-auto rounded-2xl 2xl:rounded-3xl border bg-white shadow-xl">
                {clientesFiltradosOrden.map((c) => (
                  <button key={c.id} onClick={() => seleccionarCliente(c)} className="block w-full px-3 2xl:px-4 py-2.5 2xl:py-3 text-left hover:bg-blue-50">
                    <p className="text-sm 2xl:text-base font-black">{c.nombre}</p>
                    <p className="text-[10px] 2xl:text-xs text-slate-500">{formatPhoneDisplay(c.telefono)} · {c.direccion}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <textarea
            value={ordenForm.problema}
            onChange={(e) => setOrdenForm({ ...ordenForm, problema: e.target.value })}
            placeholder={t("reportedProblem")}
            className="w-full min-h-24 2xl:min-h-32 rounded-xl 2xl:rounded-2xl border bg-white p-2 2xl:p-3 text-sm 2xl:text-base outline-none focus:ring-4 focus:ring-blue-100"
          />

          <div>
            <p className="mb-2 flex items-center gap-2 text-xs 2xl:text-sm font-black">
              <Wrench size={15} />
              {t("assignTech")}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {tecnicos.map((tec) => (
                <button
                  key={tec.id}
                  disabled={!ordenForm.clienteId}
                  onClick={() => setOrdenForm({ ...ordenForm, tecnicoId: tec.id })}
                  className={`rounded-xl 2xl:rounded-2xl border px-2 2xl:px-3 py-2 2xl:py-3 text-left text-xs 2xl:text-sm font-bold disabled:opacity-40 ${
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
            <Send size={16} />
            Asignar orden al técnico
          </button>
        </div>
      </section>

      <section className="min-w-0 rounded-2xl 2xl:rounded-[2rem] border border-white/70 bg-gradient-to-br from-white via-slate-50 to-cyan-50/50 p-3 2xl:p-5 shadow-lg 2xl:shadow-xl shadow-blue-100/70 backdrop-blur">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-1 flex items-center gap-2 text-xl 2xl:text-2xl font-black text-slate-950">
              <ShieldCheck size={18} className="2xl:hidden" />
              <ShieldCheck size={24} className="hidden 2xl:block" />
              Órdenes asignadas
            </h2>
            <p className="text-xs 2xl:text-sm text-slate-500">
              Vista de seguimiento para el administrador. La ejecución aparece solo en el panel del técnico.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl border bg-blue-50 px-3 py-2">
              <p className="text-lg 2xl:text-2xl font-black text-blue-800">{ordenesAsignadas.length}</p>
              <p className="text-[9px] 2xl:text-xs font-black uppercase text-blue-700">Asignadas</p>
            </div>
            <div className="rounded-xl border bg-slate-50 px-3 py-2">
              <p className="text-lg 2xl:text-2xl font-black text-slate-800">{ordenesSinAsignar.length}</p>
              <p className="text-[9px] 2xl:text-xs font-black uppercase text-slate-600">Sin técnico</p>
            </div>
          </div>
        </div>

        <AdminOrdenesGrid ordenes={ordenes} obtenerCliente={obtenerCliente} ordenProps={ordenProps} />
      </section>
    </section>
  );
}

export function AdminOrdenesGrid({ ordenes, obtenerCliente, ordenProps }) {
  if (ordenes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-slate-500">
        No hay órdenes asignadas todavía.
      </div>
    );
  }

  return (
    <div className="grid gap-2 2xl:gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
      {ordenes.map((orden) => (
        <AdminOrdenCard
          key={orden.id}
          orden={orden}
          cliente={obtenerCliente(orden.clienteId)}
          ordenProps={ordenProps}
        />
      ))}
    </div>
  );
}

export function AdminOrdenCard({ orden, cliente, ordenProps }) {
  const tecnico = ordenProps.obtenerTecnico(orden.tecnicoId);
  const direccion = cliente?.direccion || "";
  const telefono = cliente?.telefono || "";

  return (
    <article className="relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-100/70 blur-2xl" />

      <div className="relative">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm 2xl:text-base font-black text-slate-950">{cliente?.nombre || "Cliente eliminado"}</p>
            <p className="text-[10px] 2xl:text-xs text-slate-500">Orden #{orden.id}</p>
          </div>

          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] 2xl:text-[10px] font-black ${ordenProps.colorEstado(orden.estado)}`}>
            {orden.estado}
          </span>
        </div>

        <p className="mb-2 line-clamp-2 text-xs 2xl:text-sm text-slate-700">{orden.problema}</p>

        <div className="space-y-1 text-xs 2xl:text-sm text-slate-600">
          <p className="flex items-center gap-1.5 truncate">
            <UserCog size={13} />
            Técnico: <span className="font-black">{tecnico?.nombre || "Sin asignar"}</span>
          </p>
          <p className="flex items-center gap-1.5 truncate">
            <Phone size={13} />
            {formatPhoneDisplay(telefono)}
          </p>
          <p className="flex items-center gap-1.5 line-clamp-2">
            <MapPin size={13} />
            {direccion || "Sin dirección"}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <div className={`rounded-xl border px-2 py-1.5 text-center text-[10px] 2xl:text-xs font-black ${ordenProps.colorPrioridad(orden.prioridad)}`}>
            {orden.prioridad}
          </div>
          <div className="rounded-xl border bg-slate-50 px-2 py-1.5 text-center text-[10px] 2xl:text-xs font-black text-slate-600">
            {orden.fecha || formatReportDate(orden.fechaCreacion)}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {direccion && (
            <a href={ordenProps.urlAppleMaps(direccion)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl bg-slate-950 px-2 py-1.5 text-[11px] font-bold text-white">
              <Navigation size={12} />
              Mapa
            </a>
          )}

          {telefono && (
            <a href={ordenProps.urlTelefono(telefono)} className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-2 py-1.5 text-[11px] font-bold text-white">
              <Phone size={12} />
              Llamar
            </a>
          )}

          <span className="inline-flex items-center gap-1 rounded-xl border bg-blue-50 px-2 py-1.5 text-[11px] font-bold text-blue-700">
            <Send size={12} />
            Enviada al técnico
          </span>
        </div>
      </div>
    </article>
  );
}

export function OrdenesGrid({ ordenes, obtenerCliente, ordenProps }) { return <div className="grid w-full min-w-0 gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">{ordenes.length === 0 && <p className="text-slate-500 py-6">No hay órdenes activas.</p>}{ordenes.map((o) => <OrdenCard key={o.id} orden={o} cliente={obtenerCliente(o.clienteId)} compacta={false} {...ordenProps} />)}</div>; }

export function OrdenCard({ orden, cliente, inventario, obtenerMaterial, obtenerTecnico, colorEstado, colorPrioridad, iniciarTrabajo, completarOrden, subirFoto, guardarNotaTecnico, urlGoogleMaps, urlAppleMaps, urlTelefono, compacta = false, agregarMaterialAOrden, actualizarMaterialOrden, eliminarMaterialOrden, calcularCostoOrden, materialesTexto, compartirOrden, t }) {
  const direccion = cliente?.direccion || ""; const telefono = cliente?.telefono || ""; const tecnico = obtenerTecnico(orden.tecnicoId);
  if (compacta) return <div className="rounded-2xl 2xl:rounded-3xl border border-slate-200 bg-white p-3 2xl:p-4 shadow-sm"><div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-2 2xl:gap-3"><div><p className="font-black text-slate-950">{cliente?.nombre || "Cliente eliminado"}</p><p className="text-sm text-slate-600">{orden.problema}</p><p className="text-xs 2xl:text-sm text-slate-500">Técnico: {tecnico?.nombre || ""}</p><p className="mt-1 text-sm font-bold text-emerald-700">Completada: {orden.fechaCompletada ? new Date(orden.fechaCompletada).toLocaleDateString() : ""}</p><p className="text-xs text-slate-500">Horas: {orden.duracionHoras || "0.00"} | Materiales: {materialesTexto(orden) || "Sin materiales"}</p></div><ShareButtons orden={orden} compartirOrden={compartirOrden} t={t} /></div></div>;
  return <div className="w-full max-w-full min-w-0 rounded-2xl 2xl:rounded-3xl border border-white/70 bg-white p-2.5 2xl:p-5 shadow-lg shadow-slate-200/70"><div className="mb-2 2xl:mb-3 flex justify-between gap-2 2xl:gap-4"><div><p className="text-base 2xl:text-lg font-black">{cliente?.nombre || "Cliente eliminado"}</p><p className="text-sm 2xl:text-base text-slate-600">{orden.problema}</p><p className="text-xs 2xl:text-sm text-slate-500">Técnico: {tecnico?.nombre || "Sin asignar"}</p><p className="text-xs 2xl:text-sm text-slate-500">{telefono}</p><p className="text-xs 2xl:text-sm text-slate-500">{direccion}</p></div><span className={`h-fit rounded-full border px-2 2xl:px-3 py-0.5 2xl:py-1 text-xs 2xl:text-sm font-bold ${colorEstado(orden.estado)}`}>{orden.estado}</span></div><div className="mb-4 flex flex-wrap gap-2"><a href={urlAppleMaps(direccion)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-2 2xl:px-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm font-bold text-white shadow-md shadow-cyan-100"><Navigation {...iconProps} />Apple Maps</a><a href={urlTelefono(telefono)} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-emerald-600 px-2 2xl:px-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm font-bold text-white"><Phone {...iconProps} />{t("call")}</a></div><div className="mb-3 2xl:mb-4 grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-5 gap-1.5 2xl:gap-2 text-xs 2xl:text-sm"><Info icon={AlertTriangle} titulo="Prioridad" valor={orden.prioridad} extra={colorPrioridad(orden.prioridad)} /><Info icon={Calendar} titulo="Fecha" valor={orden.fecha} /><Info icon={Clock3} titulo="Inicio" valor={orden.horaInicio ? new Date(orden.horaInicio).toLocaleTimeString() : "Sin iniciar"} /><Info icon={Clock4} titulo="Cierre" valor={orden.horaCierre ? new Date(orden.horaCierre).toLocaleTimeString() : "Sin cerrar"} /><Info icon={Timer} titulo="Horas" valor={orden.duracionHoras || "0.00"} /></div><Materiales orden={orden} inventario={inventario} agregarMaterialAOrden={agregarMaterialAOrden} actualizarMaterialOrden={actualizarMaterialOrden} eliminarMaterialOrden={eliminarMaterialOrden} /><div className="mb-4 rounded-2xl 2xl:rounded-3xl border bg-slate-50 p-3 2xl:p-4"><p className="mb-3 flex items-center gap-2 font-black"><Camera {...iconProps} />{t("photos")}</p><div className="grid grid-cols-1 2xl:grid-cols-3 gap-2 2xl:gap-3"><FotoUploader titulo="Antes" imagen={orden.fotos?.antes} onChange={(archivo) => subirFoto(orden.id, "antes", archivo)} /><FotoUploader titulo="Durante" imagen={orden.fotos?.durante} onChange={(archivo) => subirFoto(orden.id, "durante", archivo)} /><FotoUploader titulo="Después" imagen={orden.fotos?.despues} onChange={(archivo) => subirFoto(orden.id, "despues", archivo)} /></div></div><label className="mb-2 flex items-center gap-2 text-sm font-black"><FileText {...iconProps} />{t("notes")}</label><textarea value={orden.notasTecnico || ""} onChange={(e) => guardarNotaTecnico(orden.id, e.target.value)} placeholder="Detalles del trabajo realizado..." className="mb-4 min-h-24 w-full rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base outline-none focus:ring-4 focus:ring-blue-100" /><div className="flex flex-wrap gap-2"><button onClick={() => iniciarTrabajo(orden.id)} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-blue-600 px-2 2xl:px-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm font-bold text-white"><LoaderCircle {...iconProps} />{t("start")}</button><button onClick={() => completarOrden(orden.id)} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-emerald-600 px-2 2xl:px-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm font-bold text-white"><CheckCircle2 {...iconProps} />{t("complete")}</button></div></div>;
}

export function Info({ titulo, valor, extra = "bg-white", icon: Icon = FileText }) { return <div className={`rounded-xl 2xl:rounded-2xl border p-2 2xl:p-3 text-sm 2xl:text-base ${extra}`}><p className="flex items-center gap-2 text-slate-400"><Icon {...iconProps} />{titulo}</p><p className="truncate font-bold">{valor}</p></div>; }

export function Materiales({ orden, inventario, agregarMaterialAOrden, actualizarMaterialOrden, eliminarMaterialOrden }) { return <div className="mb-4 rounded-2xl 2xl:rounded-3xl border bg-slate-50 p-3 2xl:p-4"><div className="mb-3 flex items-center justify-between"><p className="flex items-center gap-2 font-black"><PackageOpen {...iconProps} />Material usado</p><button onClick={() => agregarMaterialAOrden(orden.id)} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-purple-600 px-2 2xl:px-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm font-bold text-white"><Plus {...iconProps} />Agregar material</button></div>{(orden.materialesUsados || []).length === 0 && <p className="text-xs 2xl:text-sm text-slate-500">No se ha agregado material.</p>}<div className="space-y-2">{(orden.materialesUsados || []).map((m) => <div key={m.id} className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_80px_auto] 2xl:grid-cols-[minmax(0,1fr)_120px_auto] gap-2 items-center"><select value={m.inventarioId} onChange={(e) => actualizarMaterialOrden(orden.id, m.id, "inventarioId", e.target.value)} className="rounded-xl 2xl:rounded-2xl border p-1.5 2xl:p-2 text-sm 2xl:text-base"><option value="">Seleccionar material</option>{inventario.map((i) => <option key={i.id} value={i.id}>{i.nombre} ({i.cantidad} {i.unidad})</option>)}</select><input type="number" value={m.cantidad} onChange={(e) => actualizarMaterialOrden(orden.id, m.id, "cantidad", e.target.value)} placeholder="Cantidad" className="rounded-xl 2xl:rounded-2xl border p-1.5 2xl:p-2 text-sm 2xl:text-base" /><button onClick={() => eliminarMaterialOrden(orden.id, m.id)} className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold text-red-600"><Trash2 {...iconProps} />Quitar</button></div>)}</div></div>; }

export function FotoUploader({ titulo, imagen, onChange }) { return <div className="rounded-xl 2xl:rounded-2xl border bg-white p-2 2xl:p-3 text-sm 2xl:text-base"><p className="mb-2 text-sm font-bold">{titulo}</p>{imagen ? <img src={imagen} alt={titulo} className="mb-2 h-24 2xl:h-32 w-full rounded-xl border object-cover" /> : <div className="mb-2 flex h-24 2xl:h-32 w-full items-center justify-center rounded-xl border border-dashed bg-slate-50 text-sm text-slate-400">Sin foto</div>}<input type="file" accept="image/*" onChange={(e) => onChange(e.target.files[0])} className="w-full text-xs" /></div>; }

export function ShareButtons({ orden, compartirOrden, t }) { return <div className="flex max-w-full flex-wrap gap-1.5 2xl:gap-2 h-fit"><button onClick={() => compartirOrden(orden, "imprimir")} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-gradient-to-r from-slate-950 to-blue-900 px-2 2xl:px-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm font-bold text-white shadow-md shadow-slate-300"><Printer {...iconProps} />{t("print")}</button><button onClick={() => compartirOrden(orden, "mensaje")} className="inline-flex items-center gap-2 rounded-2xl bg-blue-800 px-3 py-2 text-sm font-bold text-white"><Share2 {...iconProps} />{t("message")}</button><button onClick={() => compartirOrden(orden, "email")} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-slate-100 px-2 2xl:px-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm font-bold"><Mail {...iconProps} />{t("email")}</button><button onClick={() => compartirOrden(orden, "whatsapp")} className="inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-emerald-800 px-2.5 2xl:px-3 py-1.5 2xl:py-2 text-sm font-bold text-white"><MessageCircle {...iconProps} />{t("whatsapp")}</button><button onClick={() => compartirOrden(orden, "messenger")} className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-3 py-2 text-sm font-bold text-white"><Send {...iconProps} />{t("messenger")}</button></div>; }
