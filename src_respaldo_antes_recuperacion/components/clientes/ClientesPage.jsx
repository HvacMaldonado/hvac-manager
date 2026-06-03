import { useMemo, useState } from "react";
import {
  CalendarDays,
  CircleDot,
  ClipboardList,
  Clock3,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { AddressInput } from "../common/UI.jsx";
import {
  formatPhoneUS,
  formatPhoneDisplay,
  formatReportDate,
} from "../../lib/shared.jsx";

export function ClientesPage({
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
  const [filtro, setFiltro] = useState("todos");
  const [orden, setOrden] = useState("recientes");

  const limpiar = (v) => String(v || "").toLowerCase().trim();
  const ordenesPorCliente = (clienteId) => ordenes.filter((o) => String(o.clienteId) === String(clienteId));
  const citasPorCliente = (clienteId) => citas.filter((c) => String(c.clienteId) === String(clienteId));

  const clienteTieneOrdenActiva = (clienteId) => ordenesPorCliente(clienteId).some((o) => o.estado !== "Completado");
  const clienteTieneCita = (clienteId) => citasPorCliente(clienteId).length > 0;
  const ultimoServicioCliente = (clienteId) => {
    const completadas = ordenesPorCliente(clienteId)
      .filter((o) => o.estado === "Completado")
      .sort((a, b) => String(b.fechaCompletada || b.horaCierre || b.fechaCreacion || "").localeCompare(String(a.fechaCompletada || a.horaCierre || a.fechaCreacion || "")));

    return completadas[0];
  };

  const clientesVisibles = useMemo(() => {
    const q = limpiar(busqueda);
    let lista = clientes.filter((c) => {
      const matchTexto =
        !q ||
        [c.nombre, c.telefono, c.email, c.direccion, c.apartamento, c.edificio, c.calle, c.codigoAcceso]
          .some((v) => limpiar(v).includes(q));

      if (!matchTexto) return false;

      if (filtro === "activos") return clienteTieneOrdenActiva(c.id);
      if (filtro === "sinOrden") return !clienteTieneOrdenActiva(c.id);
      if (filtro === "conCitas") return clienteTieneCita(c.id);
      if (filtro === "recientes") return true;

      return true;
    });

    lista = [...lista].sort((a, b) => {
      if (orden === "az") return String(a.nombre || "").localeCompare(String(b.nombre || ""));
      if (orden === "za") return String(b.nombre || "").localeCompare(String(a.nombre || ""));
      if (orden === "servicio") {
        const aLast = ultimoServicioCliente(a.id)?.fechaCompletada || ultimoServicioCliente(a.id)?.horaCierre || "";
        const bLast = ultimoServicioCliente(b.id)?.fechaCompletada || ultimoServicioCliente(b.id)?.horaCierre || "";
        return String(bLast).localeCompare(String(aLast));
      }

      return Number(b.id || 0) - Number(a.id || 0);
    });

    return lista;
  }, [clientes, ordenes, citas, busqueda, filtro, orden]);

  const filtros = [
    { id: "todos", label: "Todos", icon: Users, count: clientes.length },
    { id: "recientes", label: "Recientes", icon: Clock3, count: clientes.length },
    { id: "activos", label: "Con orden activa", icon: ClipboardList, count: clientes.filter((c) => clienteTieneOrdenActiva(c.id)).length },
    { id: "conCitas", label: "Con citas", icon: CalendarDays, count: clientes.filter((c) => clienteTieneCita(c.id)).length },
    { id: "sinOrden", label: "Sin orden", icon: CircleDot, count: clientes.filter((c) => !clienteTieneOrdenActiva(c.id)).length },
  ];

  return (
    <section className="rounded-2xl 2xl:rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/60 p-3 2xl:p-5 shadow-lg 2xl:shadow-xl shadow-slate-300/70 backdrop-blur">
      <div className="mb-3 2xl:mb-5 flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div>
          <p className="text-[10px] 2xl:text-xs font-black uppercase tracking-[0.25em] text-blue-700">CRM clientes</p>
          <h2 className="flex items-center gap-2 text-xl 2xl:text-2xl font-black text-slate-950">
            <Users size={18} className="2xl:hidden" />
            <Users size={24} className="hidden 2xl:block" />
            {t("customers")}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border bg-slate-50 p-2">
            <p className="text-lg 2xl:text-2xl font-black text-slate-950">{clientes.length}</p>
            <p className="text-[9px] 2xl:text-xs font-black uppercase text-slate-500">Clientes</p>
          </div>
          <div className="rounded-xl border bg-blue-50 p-2">
            <p className="text-lg 2xl:text-2xl font-black text-blue-800">{clientes.filter((c) => clienteTieneOrdenActiva(c.id)).length}</p>
            <p className="text-[9px] 2xl:text-xs font-black uppercase text-blue-700">Activos</p>
          </div>
          <div className="rounded-xl border bg-cyan-50 p-2">
            <p className="text-lg 2xl:text-2xl font-black text-cyan-800">{clientes.filter((c) => clienteTieneCita(c.id)).length}</p>
            <p className="text-[9px] 2xl:text-xs font-black uppercase text-cyan-700">Citas</p>
          </div>
        </div>
      </div>

      <div className="mb-3 2xl:mb-5 rounded-2xl 2xl:rounded-3xl border border-slate-300 bg-gradient-to-br from-white via-slate-50 to-cyan-50/40 p-3 2xl:p-5 shadow-sm">
        <p className="mb-3 2xl:mb-4 flex items-center gap-2 text-base 2xl:text-lg font-black text-slate-900">
          <Plus size={16} />
          Nuevo cliente
        </p>

        <div className="grid grid-cols-1 gap-2.5 2xl:gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <label className="mb-1 block text-[10px] 2xl:text-xs font-black uppercase tracking-wide text-slate-500">Nombre</label>
            <input value={clienteForm.nombre} onChange={(e) => setClienteForm({ ...clienteForm, nombre: e.target.value })} placeholder="Nombre del cliente" className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 p-2 2xl:p-3 text-sm 2xl:text-base outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
          </div>

          <div className="lg:col-span-4">
            <label className="mb-1 block text-[10px] 2xl:text-xs font-black uppercase tracking-wide text-slate-500">Teléfono</label>
            <input type="tel" inputMode="numeric" maxLength={10} pattern="[0-9]{10}" value={clienteForm.telefono} onChange={(e) => setClienteForm({ ...clienteForm, telefono: formatPhoneUS(e.target.value) })} placeholder="___-___-____" className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 p-2 2xl:p-3 text-sm 2xl:text-base outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
          </div>

          <div className="lg:col-span-4">
            <label className="mb-1 block text-[10px] 2xl:text-xs font-black uppercase tracking-wide text-slate-500">Email</label>
            <input type="email" value={clienteForm.email} onChange={(e) => setClienteForm({ ...clienteForm, email: e.target.value })} placeholder="correo@cliente.com" className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 p-2 2xl:p-3 text-sm 2xl:text-base outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
          </div>

          <div className="lg:col-span-12">
            <label className="mb-1 block text-[10px] 2xl:text-xs font-black uppercase tracking-wide text-slate-500">Dirección completa</label>
            <AddressInput value={clienteForm.direccion} onChange={(v) => setClienteForm({ ...clienteForm, direccion: v })} />
          </div>

          <div className="lg:col-span-3">
            <label className="mb-1 block text-[10px] 2xl:text-xs font-black uppercase tracking-wide text-slate-500">Apt</label>
            <input value={clienteForm.apartamento} onChange={(e) => setClienteForm({ ...clienteForm, apartamento: e.target.value })} placeholder="Apt" className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 p-2 2xl:p-3 text-sm 2xl:text-base outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
          </div>

          <div className="lg:col-span-3">
            <label className="mb-1 block text-[10px] 2xl:text-xs font-black uppercase tracking-wide text-slate-500">Edificio</label>
            <input value={clienteForm.edificio} onChange={(e) => setClienteForm({ ...clienteForm, edificio: e.target.value })} placeholder="Edificio" className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 p-2 2xl:p-3 text-sm 2xl:text-base outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
          </div>

          <div className="lg:col-span-3">
            <label className="mb-1 block text-[10px] 2xl:text-xs font-black uppercase tracking-wide text-slate-500">Calle</label>
            <input value={clienteForm.calle} onChange={(e) => setClienteForm({ ...clienteForm, calle: e.target.value })} placeholder="Calle" className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 p-2 2xl:p-3 text-sm 2xl:text-base outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
          </div>

          <div className="lg:col-span-3">
            <label className="mb-1 block text-[10px] 2xl:text-xs font-black uppercase tracking-wide text-slate-500">Access Code</label>
            <input value={clienteForm.codigoAcceso} onChange={(e) => setClienteForm({ ...clienteForm, codigoAcceso: e.target.value })} placeholder="Código" className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 p-2 2xl:p-3 text-sm 2xl:text-base outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100" />
          </div>
        </div>

        <button onClick={agregarCliente} className="mt-3 2xl:mt-5 inline-flex items-center gap-2 rounded-xl 2xl:rounded-2xl bg-gradient-to-r from-slate-950 to-blue-900 px-4 2xl:px-5 py-2.5 2xl:py-3 text-sm 2xl:text-base font-black text-white shadow-lg shadow-slate-300">
          <Plus size={16} />
          Agregar cliente
        </button>
      </div>

      <div className="mb-3 grid grid-cols-1 gap-2 2xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, teléfono, email o dirección..."
            className="w-full rounded-xl 2xl:rounded-2xl border border-slate-300 bg-white py-2 2xl:py-3 pl-9 2xl:pl-10 pr-3 text-sm 2xl:text-base outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="rounded-xl 2xl:rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm 2xl:text-base font-bold text-slate-700 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
        >
          <option value="recientes">Más recientes</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
          <option value="servicio">Último servicio</option>
        </select>
      </div>

      <div className="mb-3 flex gap-1.5 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-1.5 [-webkit-overflow-scrolling:touch]">
        {filtros.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setFiltro(id)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[10px] 2xl:text-xs font-black transition ${
              filtro === id ? "bg-slate-950 text-white shadow-md" : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            <Icon size={12} />
            {label}
            <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-[9px]">{count}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
        {clientesVisibles.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-slate-500">
            No se encontraron clientes con esos filtros.
          </div>
        )}

        {clientesVisibles.map((c) => {
          const activas = ordenesPorCliente(c.id).filter((o) => o.estado !== "Completado");
          const completadas = ordenesPorCliente(c.id).filter((o) => o.estado === "Completado");
          const citasCliente = citasPorCliente(c.id);
          const ultimoServicio = ultimoServicioCliente(c.id);

          return (
            <article key={c.id} className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-cyan-100/70 blur-2xl" />

              <div className="relative">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm 2xl:text-base font-black text-slate-950">{c.nombre}</p>
                    <p className="text-[10px] 2xl:text-xs text-slate-500">ID: {c.id}</p>
                  </div>

                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] 2xl:text-[10px] font-black ${
                    activas.length > 0
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : citasCliente.length > 0
                        ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}>
                    {activas.length > 0 ? "Orden activa" : citasCliente.length > 0 ? "Con cita" : "Sin orden"}
                  </span>
                </div>

                <div className="space-y-1 text-xs 2xl:text-sm text-slate-600">
                  <p className="flex items-center gap-1.5 truncate">
                    <Phone size={13} />
                    {formatPhoneDisplay(c.telefono)}
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <Mail size={13} />
                    {c.email || "Sin email"}
                  </p>
                  <p className="flex items-center gap-1.5 line-clamp-2">
                    <MapPin size={13} />
                    {c.direccion}
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                  <div className="rounded-xl bg-slate-50 p-1.5">
                    <p className="font-black text-slate-950">{activas.length}</p>
                    <p className="text-[9px] uppercase text-slate-500">Activas</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-1.5">
                    <p className="font-black text-slate-950">{completadas.length}</p>
                    <p className="text-[9px] uppercase text-slate-500">Hechas</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-1.5">
                    <p className="font-black text-slate-950">{citasCliente.length}</p>
                    <p className="text-[9px] uppercase text-slate-500">Citas</p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border bg-slate-50 p-2 text-[10px] 2xl:text-xs text-slate-600">
                  <span className="font-black text-slate-700">Último servicio:</span>{" "}
                  {ultimoServicio
                    ? formatReportDate(ultimoServicio.fechaCompletada || ultimoServicio.horaCierre || ultimoServicio.fecha)
                    : "Sin historial"}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <button onClick={() => abrirCrearOrdenConCliente(c)} className="inline-flex items-center gap-1 rounded-xl bg-slate-950 px-2 py-1.5 text-[11px] font-bold text-white">
                    <ClipboardList size={12} />
                    Orden
                  </button>

                  <button onClick={() => abrirProgramarCitaConCliente(c)} className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-2 py-1.5 text-[11px] font-bold text-white">
                    <CalendarDays size={12} />
                    Cita
                  </button>

                  {c.telefono && (
                    <a href={urlTelefono(c.telefono)} className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-2 py-1.5 text-[11px] font-bold text-white">
                      <Phone size={12} />
                      Llamar
                    </a>
                  )}

                  {c.direccion && (
                    <a href={urlAppleMaps(c.direccion)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl bg-white px-2 py-1.5 text-[11px] font-bold text-slate-700 border">
                      <Navigation size={12} />
                      Mapa
                    </a>
                  )}

                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar a ${c.nombre}?`)) {
                        setClientes(clientes.filter((x) => String(x.id) !== String(c.id)));
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-xl bg-red-50 px-2 py-1.5 text-[11px] font-bold text-red-700"
                  >
                    <Trash2 size={12} />
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
