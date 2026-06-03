const fs = require("fs");
const path = require("path");

const appPath = path.join(process.cwd(), "src", "App.jsx");

if (!fs.existsSync(appPath)) {
  console.error("No encontré src/App.jsx");
  process.exit(1);
}

const original = fs.readFileSync(appPath, "utf8");
const backupPath = path.join(process.cwd(), "src", `App.backup_antes_agenda_hoy_${Date.now()}.jsx`);
fs.writeFileSync(backupPath, original, "utf8");

let code = original;

const panelFunction = `
function TecnicoAssignedTodayPanel({ ordenes = [], citas = [], obtenerCliente }) {
  const today = todayDateKey();

  const todayOrders = (ordenes || [])
    .filter((orden) => {
      const key = getOrderDateKey(orden);
      return key === today && !["Completado", "Cancelada"].includes(orden.estado);
    })
    .map((orden) => {
      const cliente = obtenerCliente(orden.clienteId);
      return {
        id: "orden-" + orden.id,
        tipo: "Orden",
        time: orden.horaProgramada || "Sin hora",
        sortTime: orden.horaProgramada || "99:99",
        customer: cliente?.nombre || "Cliente eliminado",
        title: orden.problema || "Orden HVAC",
        status: orden.estado || "Asignada",
        tone: orden.estado === "En sitio" || orden.estado === "En proceso" ? "blue" : "slate",
      };
    });

  const todayAppointments = (citas || [])
    .filter((cita) => {
      const key = getCitaDateKey(cita);
      return key === today && cita.estado !== "Convertida en orden";
    })
    .map((cita) => {
      const cliente = obtenerCliente(cita.clienteId);
      return {
        id: "cita-" + cita.id,
        tipo: "Cita",
        time: cita.hora || "Sin hora",
        sortTime: cita.hora || "99:99",
        customer: cliente?.nombre || "Cliente eliminado",
        title: cita.motivo || "Cita programada",
        status: cita.estado || "Programada",
        tone: "amber",
      };
    });

  const items = [...todayOrders, ...todayAppointments].sort((a, b) =>
    String(a.sortTime).localeCompare(String(b.sortTime))
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/50">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">
            Agenda de hoy
          </p>
          <h3 className="mt-1 flex items-center gap-2 text-xl font-black text-slate-950">
            <CalendarDays size={22} />
            Assigned Today
          </h3>
        </div>

        <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
          {items.length} tarea{items.length === 1 ? "" : "s"}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-6 text-sm font-semibold text-slate-500">
          No tienes órdenes ni citas programadas para hoy.
        </div>
      ) : (
        <div className="max-h-[360px] overflow-y-auto p-4">
          <div className="relative space-y-4">
            <div className="absolute bottom-4 left-[76px] top-4 hidden w-px bg-slate-200 sm:block" />

            {items.map((item, index) => (
              <div key={item.id} className="grid gap-3 sm:grid-cols-[64px_24px_minmax(0,1fr)] sm:items-start">
                <div className="text-sm font-black text-slate-700 sm:pt-4">
                  {formatTechTime(item.time)}
                </div>

                <div className="relative hidden justify-center sm:flex sm:pt-5">
                  <span className={
                    "relative z-10 h-3.5 w-3.5 rounded-full ring-4 " +
                    (item.tone === "amber"
                      ? "bg-amber-500 ring-amber-100"
                      : item.tone === "blue"
                        ? "bg-cyan-500 ring-cyan-100"
                        : "bg-slate-400 ring-slate-100")
                  } />
                </div>

                <div className={
                  "rounded-2xl border p-4 shadow-sm " +
                  (index === 0 ? "border-cyan-200 bg-cyan-50" : "border-slate-200 bg-slate-50")
                }>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-950">
                        {item.customer} - {item.title}
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-600">
                        Status: {item.status}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-white px-3 py-1 text-[11px] font-black text-slate-700 shadow-sm">
                      {item.tipo}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

`;

if (!code.includes("function TecnicoOrdenesPanel({ ordenes, citas = [], obtenerCliente, ordenProps })")) {
  console.error("No encontré TecnicoOrdenesPanel. No hice cambios.");
  console.error("Backup creado en:", backupPath);
  process.exit(1);
}

if (!code.includes("function TecnicoAssignedTodayPanel(")) {
  code = code.replace(
    "function TecnicoOrdenesPanel({ ordenes, citas = [], obtenerCliente, ordenProps })",
    panelFunction + "\nfunction TecnicoOrdenesPanel({ ordenes, citas = [], obtenerCliente, ordenProps })"
  );
}

const marker = `      {ordenes.length === 0 && citas.length === 0 && (`;

const insertion = `      <TecnicoAssignedTodayPanel
        ordenes={ordenes}
        citas={citas}
        obtenerCliente={obtenerCliente}
      />

      {ordenes.length === 0 && citas.length === 0 && (`;

if (!code.includes("<TecnicoAssignedTodayPanel")) {
  if (!code.includes(marker)) {
    console.error("No encontré el lugar para insertar la agenda. No hice cambios.");
    console.error("Backup creado en:", backupPath);
    process.exit(1);
  }

  code = code.replace(marker, insertion);
}

fs.writeFileSync(appPath, code, "utf8");

console.log("Agenda de hoy agregada correctamente.");
console.log("Backup creado en:", backupPath);
