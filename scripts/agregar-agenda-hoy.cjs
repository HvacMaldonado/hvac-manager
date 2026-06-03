#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const appPath = path.join(process.cwd(), "src", "App.jsx");
const componentPath = path.join(process.cwd(), "src", "components", "TecnicoAssignedToday.jsx");

if (!fs.existsSync(appPath)) {
  console.error("No encontré src/App.jsx. Ejecuta esto desde la raíz de hvac-manager.");
  process.exit(1);
}

if (!fs.existsSync(componentPath)) {
  console.error("No encontré src/components/TecnicoAssignedToday.jsx. Copia primero el componente.");
  process.exit(1);
}

const backup = appPath.replace(/\.jsx$/, `.backup_antes_agenda_hoy_${Date.now()}.jsx`);
let code = fs.readFileSync(appPath, "utf8");
fs.writeFileSync(backup, code, "utf8");

if (!code.includes('TecnicoAssignedToday')) {
  code = code.replace(
    'import SignatureModal from "./components/SignatureModal.jsx";',
    'import SignatureModal from "./components/SignatureModal.jsx";\nimport TecnicoAssignedToday from "./components/TecnicoAssignedToday.jsx";'
  );
}

const marker = '<section className="mb-6 space-y-4">';
const insertion = `<section className="mb-6 space-y-4">\n      <TecnicoAssignedToday\n        ordenes={ordenes}\n        citas={citas}\n        obtenerCliente={obtenerCliente}\n      />`;

if (!code.includes('<TecnicoAssignedToday')) {
  if (!code.includes(marker)) {
    console.error("No encontré la sección del panel técnico donde insertar la agenda. No cambié App.jsx.");
    console.error("Backup creado en:", backup);
    process.exit(1);
  }
  code = code.replace(marker, insertion);
}

fs.writeFileSync(appPath, code, "utf8");
console.log("Agenda de hoy agregada correctamente.");
console.log("Backup creado en:", backup);
console.log("Ejecuta: npm run dev");
