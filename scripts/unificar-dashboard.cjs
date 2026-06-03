const fs = require("fs");
const path = require("path");

const appPath = path.join(process.cwd(), "src", "App.jsx");

if (!fs.existsSync(appPath)) {
  console.error("No encontré src/App.jsx. Ejecuta este script desde la carpeta hvac-manager.");
  process.exit(1);
}

const original = fs.readFileSync(appPath, "utf8");
const backupPath = path.join(
  process.cwd(),
  "src",
  `App.backup_antes_dashboard_unificado_${Date.now()}.jsx`
);

fs.writeFileSync(backupPath, original, "utf8");

let code = original;

const oldNav = `  const adminNav = [
    ["clientes", t("customers"), Users], ["tecnicos", t("technicians"), UserCog], ["citas", t("appointments"), CalendarDays], ["calendario", "Calendario", CalendarCheck2], ["ordenes", t("orders"), ClipboardList], ["historial", t("completedHistory"), History], ["inventario", t("inventory"), Package], ["herramientas", t("tools"), Wrench], ["dashboardReportes", "Dashboard reportes", TrendingUp], ["reportesClientes", t("reportsCustomers"), BarChart3], ["reportesInventario", t("reportsInventory"), FileSpreadsheet],
  ];`;

const newNav = `  const adminNav = [
    ["clientes", t("customers"), Users],
    ["tecnicos", t("technicians"), UserCog],
    ["citas", t("appointments"), CalendarDays],
    ["calendario", "Calendario", CalendarCheck2],
    ["ordenes", t("orders"), ClipboardList],
    ["historial", "Historial", History],
    ["inventario", t("inventory"), Package],
    ["herramientas", t("tools"), Wrench],
    ["dashboardReportes", "Dashboard", TrendingUp],
  ];`;

if (!code.includes(oldNav)) {
  console.error("No encontré el bloque exacto del menú admin. No hice cambios.");
  console.error("Backup creado en:", backupPath);
  process.exit(1);
}

code = code.replace(oldNav, newNav);

const oldDashboardLine = `{adminPage === "dashboardReportes" && <ReportesDashboardPage t={t} clientes={clientes} ordenes={ordenes} inventario={inventario} herramientas={herramientas} tecnicos={tecnicos} obtenerCliente={obtenerCliente} obtenerTecnico={obtenerTecnico} exportarCSV={exportarCSV} />}`;

const newDashboardLine = `{adminPage === "dashboardReportes" && (
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
            )}`;

if (!code.includes(oldDashboardLine)) {
  console.error("No encontré la línea del Dashboard reportes. No hice cambios.");
  fs.writeFileSync(appPath, original, "utf8");
  console.error("Backup creado en:", backupPath);
  process.exit(1);
}

code = code.replace(oldDashboardLine, newDashboardLine);

const dashboardFunction = `
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
    { id: "general", label: "General", icon: TrendingUp },
    { id: "clientes", label: "Clientes", icon: Users },
    { id: "inventario", label: "Inventario", icon: Package },
  ];

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-xl shadow-slate-300/60 backdrop-blur">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
            Centro de reportes
          </p>
          <h2 className="mt-1 flex items-center gap-2 text-2xl font-black">
            <TrendingUp size={24} />
            Dashboard
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-300">
            Reportes generales, clientes e inventario en un solo lugar.
          </p>
        </div>

        <div className="grid gap-2 border-b border-slate-200 bg-white p-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-950 p-4 text-white">
            <p className="text-xs font-black uppercase tracking-wide text-slate-300">Activas</p>
            <p className="mt-1 text-3xl font-black">{activas}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-800 ring-1 ring-emerald-100">
            <p className="text-xs font-black uppercase tracking-wide text-emerald-600">Completadas</p>
            <p className="mt-1 text-3xl font-black">{completadas}</p>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4 text-rose-800 ring-1 ring-rose-100">
            <p className="text-xs font-black uppercase tracking-wide text-rose-600">Canceladas</p>
            <p className="mt-1 text-3xl font-black">{canceladas}</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto bg-slate-50 p-3 [-webkit-overflow-scrolling:touch]">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={
                  "inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition " +
                  (active
                    ? "bg-slate-950 text-white shadow-lg"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100")
                }
              >
                <Icon size={18} />
                {item.label}
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
    </section>
  );
}

`;

if (!code.includes("function DashboardUnificadoPage(")) {
  const marker = "function ConfiguracionPage({ t, adminPassword, setAdminPassword, setMensaje })";
  if (!code.includes(marker)) {
    console.error("No encontré dónde insertar DashboardUnificadoPage. No hice cambios.");
    fs.writeFileSync(appPath, original, "utf8");
    console.error("Backup creado en:", backupPath);
    process.exit(1);
  }

  code = code.replace(marker, dashboardFunction + "\n" + marker);
}

fs.writeFileSync(appPath, code, "utf8");

console.log("✅ Dashboard unificado aplicado correctamente.");
console.log("✅ Backup creado en:", backupPath);
console.log("Ahora ejecuta: npm run dev");
